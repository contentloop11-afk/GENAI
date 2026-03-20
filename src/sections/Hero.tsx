import { ChevronDown, Sparkles, Star, ArrowRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { mockImages } from '@/data/mockImages';

interface HeroProps {
  totalRatings: number;
  totalImages: number;
}

// Spectacular Card Animation Component
function AnimatedCard({ 
  image, 
  index, 
  total,
  isVisible
}: { 
  image: typeof mockImages[0]; 
  index: number;
  total: number;
  isVisible: boolean;
}) {
  // Fan out cards from center
  const angle = ((index - (total - 1) / 2) * 12);
  const xOffset = (index - (total - 1) / 2) * 85;
  const yOffset = Math.abs(index - (total - 1) / 2) * 15;
  
  return (
    <motion.div
      className="absolute"
      initial={{ 
        opacity: 0, 
        y: 300, 
        x: 0,
        rotate: 0,
        scale: 0.3
      }}
      animate={isVisible ? { 
        opacity: 1, 
        y: yOffset,
        x: xOffset,
        rotate: angle,
        scale: 1
      } : {}}
      transition={{ 
        duration: 0.8,
        delay: 0.8 + index * 0.12,
        type: "spring",
        stiffness: 80,
        damping: 15
      }}
      whileHover={{ 
        y: yOffset - 20,
        scale: 1.08,
        rotate: angle * 0.5,
        zIndex: 50,
        transition: { duration: 0.3 }
      }}
      style={{ zIndex: total - Math.abs(index - (total - 1) / 2) }}
    >
      <motion.div 
        className="relative w-28 h-44 sm:w-36 sm:h-56 md:w-40 md:h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-2xl"
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-violet-500/30 via-pink-500/30 to-amber-500/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Card */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden ring-2 ring-white/50 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)]">
          <img 
            src={image.src} 
            alt={image.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Rating Stars */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex justify-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400 drop-shadow-lg" 
                />
              ))}
            </div>
          </div>
          
          {/* Shine effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
            initial={{ x: '-100%', y: '-100%' }}
            whileHover={{ x: '100%', y: '100%' }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// Animated Background Shapes
function BackgroundShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251,146,60,0.08) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function Hero({ totalRatings, totalImages }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const cardsOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Get 5 featured images for the card fan
  const featuredImages = mockImages.filter(img => img.setting === 'studio-grey').slice(0, 5);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToGallery = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={heroRef} 
      className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100"
    >
      <BackgroundShapes />
      
      {/* Main Content - Top Section */}
      <div className="relative z-10 flex-1 flex flex-col justify-center pt-20 sm:pt-24 pb-8">
        <motion.div 
          className="max-w-4xl mx-auto text-center px-4 sm:px-6"
          style={{ y: textY }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg shadow-slate-200/50 ring-1 ring-slate-100 mb-6 sm:mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-600">
              <span className="font-bold text-slate-900">{totalRatings}</span> / {totalImages} bewertet
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6"
          >
            <span className="text-slate-900">Bewerte Luna's</span>
            <br />
            <span className="relative inline-block">
              <motion.span
                className="bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: '200% auto' }}
              >
                Outfits
              </motion.span>
              <motion.span
                className="absolute -right-8 -top-4 sm:-right-12 sm:-top-6"
                animate={{ 
                  rotate: [0, 15, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 text-amber-400" />
              </motion.span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 max-w-xl mx-auto mb-8 sm:mb-10"
          >
            Welcher Look passt am besten zu unserer{' '}
            <span className="font-semibold text-violet-600">Immobilien-Beraterin</span>?
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.button
              onClick={scrollToGallery}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white bg-slate-900 shadow-xl shadow-slate-900/20"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Jetzt abstimmen</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
              
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Card Fan Section - Below Content */}
      <motion.div 
        className="relative z-20 h-72 sm:h-80 md:h-96 flex items-center justify-center mb-8"
        style={{ y: cardsY, opacity: cardsOpacity }}
      >
        <div className="relative">
          {featuredImages.map((image, index) => (
            <AnimatedCard
              key={image.id}
              image={image}
              index={index}
              total={featuredImages.length}
              isVisible={isVisible}
            />
          ))}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.button
          onClick={scrollToGallery}
          className="flex flex-col items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs font-medium">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </section>
  );
}
