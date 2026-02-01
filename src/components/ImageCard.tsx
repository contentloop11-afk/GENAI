import type { ImageItem } from '@/types';
import { RatingControl } from './RatingControl';
import { CommentSection } from './CommentSection';
import { styleConfig } from '@/data/mockImages';
import { Flame } from 'lucide-react';
import type { Comment } from '@/hooks/useComments';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface ImageCardProps {
  image: ImageItem;
  isRated: boolean;
  currentRating?: number;
  onRate: (imageId: string, value: number) => void;
  index: number;
  comments: Comment[];
  onAddComment: (imageId: string, text: string, author: string, outfitLink?: string) => void;
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
  
  // 3D Tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 300, damping: 30 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleRate = (value: number) => {
    onRate(image.id, value);
  };

  const config = styleConfig[image.style];

  return (
    <motion.article 
      ref={cardRef}
      className="group relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
      }}
      whileHover={{ z: 50 }}
    >
      <motion.div
        className="relative bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 ring-1 ring-slate-100"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ 
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Glow effect on hover */}
        <motion.div 
          className="absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
          style={{
            background: `linear-gradient(135deg, ${config.color}40, transparent, ${config.color}40)`,
            filter: 'blur(8px)',
          }}
        />

        {/* Image Container - 9:16 Portrait */}
        <div className="relative aspect-[9/16] overflow-hidden">
          {/* Image with parallax effect */}
          <motion.img
            src={image.src}
            alt={image.title}
            loading="lazy"
            className="w-full h-full object-cover"
            style={{
              scale: 1.05,
            }}
            whileHover={{ scale: 1.12 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Style Badge */}
          <motion.div 
            className="absolute top-3 left-3 z-10"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold text-white backdrop-blur-md shadow-lg"
              style={{ backgroundColor: `${config.color}cc` }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
              {config.labelDE}
            </span>
          </motion.div>
          
          {/* Hotness Flames Badge */}
          <motion.div 
            className="absolute top-3 right-3 z-10"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md">
              {[...Array(5)].map((_, i) => (
                <Flame 
                  key={i} 
                  className={`w-3 h-3 transition-all duration-300 ${
                    i < image.hotness 
                      ? 'text-orange-400 fill-orange-400 drop-shadow-[0_0_3px_rgba(251,146,60,0.5)]' 
                      : 'text-white/20'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Rated Badge */}
          {isRated && (
            <motion.div 
              className="absolute bottom-3 right-3 z-10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center">
                <span className="text-lg">⭐</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-sm text-slate-900 mb-2 line-clamp-1 group-hover:text-slate-700 transition-colors">
            {image.title}
          </h3>

          {/* Tags */}
          <div className="flex gap-1.5 mb-4 overflow-x-auto no-scrollbar">
            {image.tags.slice(0, 3).map((tag) => (
              <motion.span 
                key={tag} 
                className="px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-medium text-slate-600 whitespace-nowrap"
                whileHover={{ scale: 1.05, backgroundColor: '#e2e8f0' }}
              >
                {tag}
              </motion.span>
            ))}
            {image.tags.length > 3 && (
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-medium text-slate-400">
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
