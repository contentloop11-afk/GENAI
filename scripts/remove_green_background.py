"""Remove a green chroma-key background from an image and write a transparent PNG.

The algorithm combines standard chroma-key compositing ideas so that fine
hairs and whiskers survive cleanly without a green fringe:

  1. Estimate the background colour as the mean of clearly-green, highly
     saturated pixels (normally the four corners and the surrounding
     studio plate).

  2. Build a greenness key  k = g - max(r, b)  and weight it by chroma
     saturation so that slightly-greenish but desaturated fur (white fur
     with a little green bounce light) is NOT mistaken for the background.

  3. Restrict "green" pixels to a connected region reachable from the
     image border. Tiny interior gaps between hairs that happen to look
     green are kept opaque.

  4. Map the weighted key through a soft threshold to produce alpha.

  5. Solve the standard compositing equation for the foreground colour:
         fg = (observed - (1 - alpha) * bg) / alpha
     This fully decontaminates soft edge pixels, not just the green
     channel. Hair wisps keep the dog's warm fur colour instead of
     ending up with a green / cyan tint.

  6. A one-pixel erode of the "fully background" region pushes any
     remaining halo out into fully transparent. Fine hairs have
     alpha > ~0.3 and are preserved.

Usage:
  python3 scripts/remove_green_background.py INPUT.jpg OUTPUT.png
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage


def _estimate_bg_color(rgb: np.ndarray) -> np.ndarray:
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    max_rb = np.maximum(r, b)
    max_rgb = np.maximum(np.maximum(r, g), b)
    min_rgb = np.minimum(np.minimum(r, g), b)
    saturation = (max_rgb - min_rgb) / np.maximum(max_rgb, 1.0)
    green_excess = g - max_rb
    strong_bg = (green_excess > 50) & (saturation > 0.7)
    if strong_bg.sum() < 100:
        # Fallback: corner samples.
        h, w = rgb.shape[:2]
        samples = np.concatenate(
            [
                rgb[:20, :20].reshape(-1, 3),
                rgb[:20, -20:].reshape(-1, 3),
                rgb[-20:, :20].reshape(-1, 3),
                rgb[-20:, -20:].reshape(-1, 3),
            ]
        )
        return samples.mean(axis=0)
    return rgb[strong_bg].mean(axis=0)


def remove_green_background(
    image: Image.Image,
    low: float = 6.0,
    high: float = 40.0,
    saturation_floor: float = 0.30,
) -> Image.Image:
    rgb = np.asarray(image.convert("RGB"), dtype=np.float32)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]

    bg = _estimate_bg_color(rgb)

    max_rb = np.maximum(r, b)
    max_rgb = np.maximum(np.maximum(r, g), b)
    min_rgb = np.minimum(np.minimum(r, g), b)
    saturation = (max_rgb - min_rgb) / np.maximum(max_rgb, 1.0)

    green_excess = g - max_rb
    sat_factor = np.clip(
        (saturation - saturation_floor) / (1.0 - saturation_floor), 0.0, 1.0
    )
    green_key = green_excess * sat_factor

    alpha = 1.0 - np.clip((green_key - low) / (high - low), 0.0, 1.0)

    # Connected-component: only count as background those green pixels
    # that are reachable from the image border.
    likely_bg = green_key > low
    labels, _ = ndimage.label(likely_bg)
    border_labels = np.unique(
        np.concatenate(
            [labels[0, :], labels[-1, :], labels[:, 0], labels[:, -1]]
        )
    )
    border_labels = border_labels[border_labels != 0]
    true_bg = np.isin(labels, border_labels)
    alpha = np.where(likely_bg & ~true_bg, 1.0, alpha)

    # Decontaminate: solve fg = (observed - (1-alpha)*bg) / alpha on the
    # edge band where alpha is partial. This removes the entire background
    # colour contribution, not just green channel spill.
    edge = (alpha > 0.02) & (alpha < 0.995)
    a = alpha[edge][..., None]
    obs = rgb[edge]
    fg = (obs - (1.0 - a) * bg) / np.maximum(a, 0.05)
    fg = np.clip(fg, 0.0, 255.0)
    out = rgb.copy()
    out[edge] = fg

    # Final hard despill safety net: anywhere the solved colour still has
    # G > max(R, B), clamp it.
    out[..., 1] = np.minimum(out[..., 1], np.maximum(out[..., 0], out[..., 2]))

    # Edge pixels where the solved colour is "yellowish" (G close to R,
    # both exceeding B) would read as greenish-olive on a light background.
    # Pull G toward B on edge pixels so the colour reads as warm hair
    # (R > G > B) instead. Only touch pixels that still have alpha < ~1.
    edge_mask = alpha < 0.95
    out_r = out[..., 0]
    out_g = out[..., 1]
    out_b = out[..., 2]
    warm_target = np.where(out_r > out_b, out_b + 0.55 * (out_r - out_b), out_g)
    out[..., 1] = np.where(edge_mask, np.minimum(out_g, warm_target), out_g)

    # A pixel that, even after decontamination, has a cool / greenish bias
    # (solved G >= solved R) is almost certainly more background than
    # foreground. Gently pull its alpha down: this removes the last wispy
    # fringe on light compositing backgrounds without eating into real fur
    # where R dominates strongly.
    out_g = out[..., 1]
    cool_bias = np.clip((out_g - out_r + 3.0) / 15.0, 0.0, 1.0)
    alpha = alpha * (1.0 - 0.8 * cool_bias * (alpha < 0.9))

    # Erode the "fully background" region by one pixel into slightly-
    # transparent pixels, pushing any last green tinge out. Does NOT erode
    # fine hairs, because fine hairs have alpha > ~0.3.
    bg_mask = alpha <= 0.02
    dilated = bg_mask.copy()
    dilated[1:, :] |= bg_mask[:-1, :]
    dilated[:-1, :] |= bg_mask[1:, :]
    dilated[:, 1:] |= bg_mask[:, :-1]
    dilated[:, :-1] |= bg_mask[:, 1:]
    low_alpha = alpha < 0.20
    alpha = np.where(dilated & low_alpha, 0.0, alpha)

    rgba = np.concatenate(
        [np.clip(out, 0, 255), np.clip(alpha * 255.0, 0, 255)[..., None]],
        axis=-1,
    ).astype(np.uint8)

    return Image.fromarray(rgba, mode="RGBA")


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print(__doc__)
        return 2
    src, dst = Path(argv[1]), Path(argv[2])
    image = Image.open(src)
    result = remove_green_background(image)
    dst.parent.mkdir(parents=True, exist_ok=True)
    result.save(dst, format="PNG", optimize=True)
    print(f"Wrote {dst} ({dst.stat().st_size} bytes, {result.size[0]}x{result.size[1]})")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
