import type { ImageItem, Setting, HotnessLevel } from '@/types';
import { ImageCard } from '@/components/ImageCard';
import { CheckCircle, Camera, Building2, LayoutGrid, Flame, Sparkles } from 'lucide-react';
import { useState, useMemo, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { styleConfig } from '@/data/mockImages';
import type { Comment } from '@/hooks/useComments';

interface GalleryProps {
  images: ImageItem[];
  ratings: { [key: string]: number };
  onRate: (imageId: string, value: number) => void;
  totalRatings: number;
  totalImages: number;
  comments: Comment[];
  onAddComment: (imageId: string, text: string, author: string, outfitLink?: string) => void;
}

type SettingFilter = 'all' | Setting;
type HotnessFilter = 'all' | HotnessLevel;

// Animated filter button component
function FilterButton({ 
  active, 
  onClick, 
  children, 
  color,
  disabled = false
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
  color?: string;
  disabled?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-semibold
        transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed
        overflow-hidden
      `}
      style={active ? { 
        backgroundColor: color || '#1e293b',
        color: 'white'
      } : {
        backgroundColor: '#f1f5f9',
        color: color || '#64748b'
      }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {active && (
        <motion.div
          className="absolute inset-0 bg-white/10"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      )}
      {children}
    </motion.button>
  );
}

export function Gallery({ images, ratings, onRate, totalRatings, totalImages, comments, onAddComment }: GalleryProps) {
  const [settingFilter, setSettingFilter] = useState<SettingFilter>('all');
  const [hotnessFilter, setHotnessFilter] = useState<HotnessFilter>('all');
  
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const isGridInView = useInView(gridRef, { once: true, margin: "-50px" });
  
  const filteredImages = useMemo(() => {
    let result = images;
    
    if (settingFilter !== 'all') {
      result = result.filter(img => img.setting === settingFilter);
    }
    
    if (hotnessFilter !== 'all') {
      result = result.filter(img => img.hotness === hotnessFilter);
    }
    
    return result;
  }, [images, settingFilter, hotnessFilter]);

  const allRated = totalRatings === totalImages && totalImages > 0;
  const progress = (totalRatings / totalImages) * 100;

  // Count images per category
  const settingCounts = useMemo(() => ({
    all: images.length,
    'studio-grey': images.filter(img => img.setting === 'studio-grey').length,
    'luxury-interior': images.filter(img => img.setting === 'luxury-interior').length,
  }), [images]);

  const hotnessCounts = useMemo(() => {
    const counts: Record<HotnessLevel | 'all', number> = { 
      all: images.length, 
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0 
    };
    images.forEach(img => counts[img.hotness]++);
    return counts;
  }, [images]);

  const hotnessOptions: { value: HotnessFilter; label: string; color: string }[] = [
    { value: 'all', label: 'Alle', color: '#64748B' },
    { value: 1, label: styleConfig.conservative.labelDE, color: styleConfig.conservative.color },
    { value: 2, label: styleConfig.clean.labelDE, color: styleConfig.clean.color },
    { value: 3, label: styleConfig.business.labelDE, color: styleConfig.business.color },
    { value: 4, label: styleConfig.elegant.labelDE, color: styleConfig.elegant.color },
    { value: 5, label: styleConfig.hot.labelDE, color: styleConfig.hot.color },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <section id="gallery" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-100/30 rounded-full blur-[100px]" />
      </div>

      {/* Section Header */}
      <motion.div 
        ref={headerRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 sm:mb-14"
        initial={{ opacity: 0, y: 40 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Title Row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>OUTFIT GALERIE</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
              Wähle deinen{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">
                Favoriten
              </span>
            </h2>
            <p className="text-slate-600 text-lg max-w-xl">
              {filteredImages.length} Outfits warten auf deine Bewertung
            </p>
          </div>
          
          {/* Progress Indicator - Premium Design */}
          <motion.div 
            className="flex flex-col items-start lg:items-end gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Fortschritt</span>
              <span className="text-2xl font-bold text-slate-900">{Math.round(progress)}%</span>
            </div>
            <div className="w-64 h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </div>
            <span className="text-xs text-slate-400">
              {totalRatings} von {totalImages} bewertet
            </span>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          {/* Setting Filter */}
          <div className="flex flex-wrap gap-3">
            <FilterButton 
              active={settingFilter === 'all'} 
              onClick={() => setSettingFilter('all')}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Alle</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px]">
                {settingCounts.all}
              </span>
            </FilterButton>
            <FilterButton 
              active={settingFilter === 'studio-grey'} 
              onClick={() => setSettingFilter('studio-grey')}
            >
              <Camera className="w-4 h-4" />
              <span>Studio</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px]">
                {settingCounts['studio-grey']}
              </span>
            </FilterButton>
            <FilterButton 
              active={settingFilter === 'luxury-interior'} 
              onClick={() => setSettingFilter('luxury-interior')}
            >
              <Building2 className="w-4 h-4" />
              <span>Luxury Interior</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px]">
                {settingCounts['luxury-interior']}
              </span>
            </FilterButton>
          </div>

          {/* Hotness/Style Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Style Level
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
              {hotnessOptions.map((option) => {
                const count = hotnessCounts[option.value];
                const isActive = hotnessFilter === option.value;
                
                return (
                  <FilterButton
                    key={option.value}
                    active={isActive}
                    onClick={() => setHotnessFilter(option.value)}
                    color={option.color}
                    disabled={count === 0 && option.value !== 'all'}
                  >
                    {option.value !== 'all' && (
                      <div className="flex gap-0.5 mr-1">
                        {[...Array(option.value as number)].map((_, i) => (
                          <Flame 
                            key={i} 
                            className={`w-3 h-3 ${isActive ? 'text-white/90 fill-white/70' : ''}`}
                            style={!isActive ? { color: option.color, fill: option.color } : {}}
                          />
                        ))}
                      </div>
                    )}
                    <span>{option.label}</span>
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px]">
                      {count}
                    </span>
                  </FilterButton>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* All Rated Badge */}
        <AnimatePresence>
          {allRated && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-green-500/25"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Alle Outfits bewertet! 🎉</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Image Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6" ref={gridRef}>
        <AnimatePresence mode="wait">
          {filteredImages.length > 0 ? (
            <motion.div 
              key={`${settingFilter}-${hotnessFilter}`}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
              variants={containerVariants}
              initial="hidden"
              animate={isGridInView ? "visible" : "hidden"}
            >
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  variants={itemVariants}
                  layout
                >
                  <ImageCard
                    image={image}
                    isRated={image.id in ratings}
                    currentRating={ratings[image.id]}
                    onRate={onRate}
                    index={index}
                    comments={comments.filter(c => c.imageId === image.id)}
                    onAddComment={onAddComment}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div 
                className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-slate-100 flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Camera className="w-10 h-10 text-slate-400" />
              </motion.div>
              <p className="text-slate-500 text-lg mb-4">Keine Outfits in dieser Kategorie</p>
              <motion.button 
                onClick={() => { setSettingFilter('all'); setHotnessFilter('all'); }}
                className="px-6 py-3 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Alle Filter zurücksetzen
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
