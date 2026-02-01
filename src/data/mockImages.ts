import type { ImageItem, StyleCategory, HotnessLevel } from '@/types';

export const mockImages: ImageItem[] = [
  // === LUXURY INTERIOR (Bild 1-2) ===
  { 
    id: "bild-1", 
    title: "Silk Blouse + Pencil Skirt", 
    src: "/images/Bild-1.jpg", 
    setting: "luxury-interior", 
    hotness: 3,
    style: "business",
    tags: ["silk blouse", "pencil skirt", "tablet", "golden hour", "city view"] 
  },
  { 
    id: "bild-2", 
    title: "Cream Blouse + Midi Skirt", 
    src: "/images/Bild-2.jpg", 
    setting: "luxury-interior", 
    hotness: 3,
    style: "business",
    tags: ["cream blouse", "midi skirt", "tablet", "penthouse", "skyline"] 
  },
  
  // === STUDIO GREY (Bild 3-16) ===
  { 
    id: "bild-3", 
    title: "White Shirt + Grey Skirt", 
    src: "/images/Bild-3.jpg", 
    setting: "studio-grey", 
    hotness: 2,
    style: "clean",
    tags: ["white shirt", "grey pencil skirt", "phone", "loafers", "office look"] 
  },
  { 
    id: "bild-4", 
    title: "White Shirt + Wool Skirt", 
    src: "/images/Bild-4.jpg", 
    setting: "studio-grey", 
    hotness: 2,
    style: "clean",
    tags: ["white shirt", "wool skirt", "phone", "brown loafers", "work vibe"] 
  },
  { 
    id: "bild-5", 
    title: "White Sleeveless Dress", 
    src: "/images/Bild-5.jpg", 
    setting: "studio-grey", 
    hotness: 4,
    style: "elegant",
    tags: ["white dress", "sleeveless", "v-neck", "phone", "sheer tights", "pumps"] 
  },
  { 
    id: "bild-6", 
    title: "Black Corset Mini Dress", 
    src: "/images/Bild-6.jpg", 
    setting: "studio-grey", 
    hotness: 5,
    style: "hot",
    tags: ["corset dress", "mini", "sheer sleeves", "strappy heels", "sheer tights"] 
  },
  { 
    id: "bild-7", 
    title: "Black Knit Dress + Belt", 
    src: "/images/Bild-7.jpg", 
    setting: "studio-grey", 
    hotness: 3,
    style: "business",
    tags: ["knit dress", "midi length", "belt", "sheer tights", "pumps"] 
  },
  { 
    id: "bild-8", 
    title: "Black Blazer + Skinny Jeans", 
    src: "/images/Bild-8.jpg", 
    setting: "studio-grey", 
    hotness: 3,
    style: "business",
    tags: ["black blazer", "white top", "skinny jeans", "pumps", "casual chic"] 
  },
  { 
    id: "bild-9", 
    title: "Black Top + Leather Skirt", 
    src: "/images/Bild-9.jpg", 
    setting: "studio-grey", 
    hotness: 3,
    style: "business",
    tags: ["black top", "leather pencil skirt", "ankle boots", "sheer tights"] 
  },
  { 
    id: "bild-10", 
    title: "Burgundy Cardigan + Skirt", 
    src: "/images/Bild-10.jpg", 
    setting: "studio-grey", 
    hotness: 2,
    style: "clean",
    tags: ["burgundy cardigan", "black skirt", "sheer tights", "pumps", "cozy"] 
  },
  { 
    id: "bild-11", 
    title: "White Sheath Dress", 
    src: "/images/Bild-11.jpg", 
    setting: "studio-grey", 
    hotness: 4,
    style: "elegant",
    tags: ["white sheath dress", "sleeveless", "sheer tights", "pumps", "necklace"] 
  },
  { 
    id: "bild-12", 
    title: "Black Sheath Dress + Belt", 
    src: "/images/Bild-12.jpg", 
    setting: "studio-grey", 
    hotness: 3,
    style: "business",
    tags: ["black dress", "half sleeve", "belt", "sheer tights", "pumps", "classic"] 
  },
  { 
    id: "bild-13", 
    title: "Turtleneck + Leather Skirt", 
    src: "/images/Bild-13.jpg", 
    setting: "studio-grey", 
    hotness: 3,
    style: "business",
    tags: ["black turtleneck", "leather skirt", "ankle boots", "sheer tights"] 
  },
  { 
    id: "bild-14", 
    title: "Beige Turtleneck + Trousers", 
    src: "/images/Bild-14.jpg", 
    setting: "studio-grey", 
    hotness: 1,
    style: "conservative",
    tags: ["beige turtleneck", "navy trousers", "minimal", "covered", "professional"] 
  },
  { 
    id: "bild-15", 
    title: "Camel Blazer + Black Jeans", 
    src: "/images/Bild-15.jpg", 
    setting: "studio-grey", 
    hotness: 2,
    style: "clean",
    tags: ["camel blazer", "white top", "black jeans", "pumps", "smart casual"] 
  },
  { 
    id: "bild-16", 
    title: "Black Blazer Dress", 
    src: "/images/Bild-16.jpg", 
    setting: "studio-grey", 
    hotness: 4,
    style: "elegant",
    tags: ["blazer dress", "deep v-neck", "belt", "sheer tights", "stilettos"] 
  },
];

export const STORAGE_KEY = 'luna-ratings-v2';

// Style category configuration
export const styleConfig: Record<StyleCategory, { 
  label: string; 
  labelDE: string;
  hotness: HotnessLevel; 
  color: string;
  description: string;
}> = {
  'conservative': { 
    label: 'Conservative', 
    labelDE: 'Konservativ',
    hotness: 1, 
    color: '#64748B',  // Slate
    description: 'Vollständig bedeckt, sehr professionell'
  },
  'clean': { 
    label: 'Clean', 
    labelDE: 'Clean',
    hotness: 2, 
    color: '#3B82F6',  // Blue
    description: 'Klassisch, dezent, sauber'
  },
  'business': { 
    label: 'Business', 
    labelDE: 'Business',
    hotness: 3, 
    color: '#8B5CF6',  // Violet
    description: 'Elegant business, leicht figurbetont'
  },
  'elegant': { 
    label: 'Elegant', 
    labelDE: 'Elegant',
    hotness: 4, 
    color: '#EC4899',  // Pink
    description: 'Figurbetont, feminin, ärmellos'
  },
  'hot': { 
    label: 'Hot', 
    labelDE: 'Hot',
    hotness: 5, 
    color: '#EF4444',  // Red
    description: 'Kurz, eng, offener Ausschnitt'
  },
};

// Get style from hotness level
export const getStyleFromHotness = (hotness: HotnessLevel): StyleCategory => {
  const map: Record<HotnessLevel, StyleCategory> = {
    1: 'conservative',
    2: 'clean', 
    3: 'business',
    4: 'elegant',
    5: 'hot'
  };
  return map[hotness];
};

// Count images per hotness level
export const getHotnessDistribution = () => {
  const distribution: Record<HotnessLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  mockImages.forEach(img => {
    distribution[img.hotness]++;
  });
  return distribution;
};
