import type { ImageItem } from '@/types';
import { RatingControl } from './RatingControl';
import { CommentSection } from './CommentSection';
import { styleConfig } from '@/data/mockImages';
import { Flame } from 'lucide-react';
import type { Comment } from '@/hooks/useComments';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface ImageCardProps {
  image: ImageItem;
  isRated: boolean;
  currentRating?: number;
  onRate: (imageId: string, value: number) => void;
  index: number;
  comments: Comment[];
  onAddComment: (imageId: string, text: string, author: string, outfitLink?: string) => void;
}

// Hook for device orientation (gyroscope tilt)
function useDeviceOrientation() {
  const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 });
  const [hasPermission, setHasPermission] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(checkMobile);

    if (!checkMobile) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        // Normalize values (-1 to 1 range, clamped)
        const beta = Math.max(-30, Math.min(30, e.beta)) / 30;
        const gamma = Math.max(-30, Math.min(30, e.gamma)) / 30;
        setOrientation({ beta, gamma });
        setHasPermission(true);
      }
    };

    // Request permission for iOS 13+
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      // Will be triggered on first user interaction
      const requestPermission = async () => {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch (e) {
          console.log('Gyroscope permission denied');
        }
      };
      
      // Add listener for first touch to request permission
      const handleFirstTouch = () => {
        requestPermission();
        window.removeEventListener('touchstart', handleFirstTouch);
      };
      window.addEventListener('touchstart', handleFirstTouch, { once: true });
    } else {
      // Non-iOS devices
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return { orientation, hasPermission, isMobile };
}

export function ImageCard({ 
  image, 
  isRated, 
  currentRating, 
  onRate, 
  comments,
  onAddComment,
}: ImageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { orientation, isMobile } = useDeviceOrientation();
  
  // Mouse-based tilt for desktop
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Gyroscope-based tilt for mobile
  const gyroX = useMotionValue(0);
  const gyroY = useMotionValue(0);
  
  // Update gyro values when orientation changes
  useEffect(() => {
    if (isMobile) {
      gyroX.set(orientation.gamma * 0.5);
      gyroY.set(orientation.beta * 0.5);
    }
  }, [orientation, isMobile, gyroX, gyroY]);
  
  const springConfig = { stiffness: 300, damping: 30 };
  
  // Use gyro on mobile, mouse on desktop
  const rotateX = useSpring(
    useTransform(isMobile ? gyroY : mouseY, [-0.5, 0.5], [6, -6]), 
    springConfig
  );
  const rotateY = useSpring(
    useTransform(isMobile ? gyroX : mouseX, [-0.5, 0.5], [-6, 6]), 
    springConfig
  );
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  
  const handleMouseLeave = () => {
    if (!isMobile) {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const handleRate = (value: number) => {
    onRate(image.id, value);
  };

  const config = styleConfig[image.style];

  return (
    <motion.article 
      ref={cardRef}
      className="group relative touch-manipulation"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
      }}
    >
      <motion.div
        className="relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 ring-1 ring-slate-100"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ 
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {/* Glow effect */}
        <motion.div 
          className="absolute -inset-[1px] rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 sm:transition-opacity sm:duration-500 -z-10 hidden sm:block"
          style={{
            background: `linear-gradient(135deg, ${config.color}40, transparent, ${config.color}40)`,
            filter: 'blur(8px)',
          }}
        />

        {/* Image Container - 9:16 Portrait */}
        <div className="relative aspect-[9/16] overflow-hidden">
          <motion.img
            src={image.src}
            alt={image.title}
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ scale: 1.02 }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          
          {/* Gradient overlay - subtle on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:from-black/50 sm:via-black/10 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Style Badge - smaller on mobile */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
            <span 
              className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold text-white backdrop-blur-md shadow-lg"
              style={{ backgroundColor: `${config.color}dd` }}
            >
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/80" />
              {config.labelDE}
            </span>
          </div>
          
          {/* Hotness Flames Badge - compact on mobile */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
            <div className="flex items-center gap-0.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full bg-black/50 backdrop-blur-md">
              {[...Array(5)].map((_, i) => (
                <Flame 
                  key={i} 
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                    i < image.hotness 
                      ? 'text-orange-400 fill-orange-400' 
                      : 'text-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Rated Badge */}
          {isRated && (
            <motion.div 
              className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center">
                <span className="text-base sm:text-lg">⭐</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Content - compact on mobile */}
        <div className="p-3 sm:p-4">
          {/* Title */}
          <h3 className="font-semibold text-xs sm:text-sm text-slate-900 mb-1.5 sm:mb-2 line-clamp-1">
            {image.title}
          </h3>

          {/* Tags - scrollable on mobile */}
          <div className="flex gap-1 sm:gap-1.5 mb-3 sm:mb-4 overflow-x-auto no-scrollbar pb-0.5">
            {image.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-slate-100 text-[9px] sm:text-[10px] font-medium text-slate-600 whitespace-nowrap flex-shrink-0"
              >
                {tag}
              </span>
            ))}
            {image.tags.length > 3 && (
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-slate-100 text-[9px] sm:text-[10px] font-medium text-slate-400 flex-shrink-0">
                +{image.tags.length - 3}
              </span>
            )}
          </div>

          {/* Rating Control */}
          <RatingControl
            currentRating={currentRating}
            isRated={isRated}
            onRate={handleRate}
          />

          {/* Comment Section */}
          <CommentSection
            imageId={image.id}
            comments={comments}
            onAddComment={onAddComment}
          />
        </div>
      </motion.div>
    </motion.article>
  );
}
