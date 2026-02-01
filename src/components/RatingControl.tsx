import { Star, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RatingControlProps {
  currentRating?: number;
  isRated: boolean;
  onRate: (value: number) => void;
}

export function RatingControl({ currentRating, isRated, onRate }: RatingControlProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRate = (value: number) => {
    if (!isRated && !isAnimating) {
      setIsAnimating(true);
      onRate(value);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  // If already rated, show the rating result with celebration
  if (isRated && currentRating) {
    return (
      <motion.div 
        className="relative flex items-center justify-between py-3 px-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100/50 overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Shimmer effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        
        <motion.div 
          className="flex items-center gap-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div 
            className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/30"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.15 }}
          >
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </motion.div>
          <span className="text-xs font-bold text-emerald-700">
            Bewertet!
          </span>
        </motion.div>

        {/* Animated stars */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star, index) => (
            <motion.div
              key={star}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                delay: 0.2 + index * 0.08 
              }}
            >
              <Star
                className={`w-4 h-4 ${
                  star <= currentRating
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_3px_rgba(251,191,36,0.5)]'
                    : 'fill-slate-200 text-slate-200'
                }`}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Interactive rating control
  return (
    <div 
      className="flex items-center justify-center py-2"
      role="radiogroup"
      aria-label="Bewertung auswählen"
    >
      <motion.div 
        className="relative inline-flex items-center h-12 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl px-2 shadow-inner"
        whileHover={{ scale: 1.02 }}
      >
        {/* Hover glow effect */}
        <AnimatePresence>
          {hoverRating && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: `radial-gradient(circle at ${hoverRating * 20}% 50%, rgba(251,191,36,0.15), transparent 70%)`,
              }}
            />
          )}
        </AnimatePresence>

        {[1, 2, 3, 4, 5].map((value) => {
          const isHovered = hoverRating !== null && value <= hoverRating;
          const isActive = currentRating !== undefined && value <= currentRating;
          
          return (
            <motion.button
              key={value}
              type="button"
              role="radio"
              aria-checked={currentRating === value}
              aria-label={`${value} von 5 Sternen`}
              className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-1 touch-manipulation"
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(null)}
              onTouchStart={() => setHoverRating(value)}
              onTouchEnd={() => {
                handleRate(value);
                setHoverRating(null);
              }}
              onClick={() => handleRate(value)}
              disabled={isRated || isAnimating}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Sparkle effect on hover */}
              <AnimatePresence>
                {isHovered && value === hoverRating && (
                  <motion.div
                    className="absolute -top-1 -right-1"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? [0, -10, 10, 0] : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <Star
                  className={`w-6 h-6 transition-colors duration-150 ${
                    isHovered || isActive
                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                      : 'fill-transparent text-slate-300 hover:text-slate-400'
                  }`}
                />
              </motion.div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
