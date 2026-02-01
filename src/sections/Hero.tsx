import { ChevronDown, Sparkles, Star } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { mockImages } from '@/data/mockImages';

interface HeroProps {
  totalRatings: number;
  totalImages: number;
}

// Hook for device orientation (gyroscope)
function useDeviceOrientation() {
  const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(checkMobile);

    if (!checkMobile) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        const beta = Math.max(-20, Math.min(20, e.beta)) / 20;
        const gamma = Math.max(-20, Math.min(20, e.gamma)) / 20;
        setOrientation({ beta, gamma });
      }
    };

    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      const handleFirstTouch = async () => {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch (e) {
          console.log('Gyroscope permission denied');
        }
      };
      window.addEventListener('touchstart', handleFirstTouch, { once: true });
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return { orientation, isMobile };
}

// Floating 3D Card Component - Desktop only
function FloatingCard({ 
  image, 
  index, 
  mouseX, 
  mouseY,
  scrollProgress 
}: { 
  image: typeof mockImages[0]; 
  index: number;
  mouseX: ReturnType<typeof useMotionValue>;
  mouseY: ReturnType<typeof useMotionValue>;
  scrollProgress: ReturnType<typeof useTransform>;
}) {
  const positions = [
    { x: -320, y: -60, rotate: -12, scale: 0.9, delay: 0 },
    { x: -180, y: 40, rotate: -6, scale: 1.05, delay: 0.1 },
    { x: 0, y: -20, rotate: 0, scale: 1.15, delay: 0.2 },
    { x: 180, y: 40, rotate: 6, scale: 1.05, delay: 0.3 },
    { x: 320, y: -60, rotate: 12, scale: 0.9, delay: 0.4 },
  ];
  
  const pos = positions[index % 5];
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const y = useTransform(scrollProgress, [0, 1], [0, -150 - index * 30]);
  const opacity = useTransform(scrollProgress, [0, 0.5], [1, 0]);

  return (
    <motion.div
      className="absolute hidden lg:block"
      initial={{ opacity: 0, y: 100, x: pos.x, rotate: pos.rotate, scale: 0.5 }}
      animate={{ opacity: 1, y: pos.y, x: pos.x, rotate: pos.rotate, scale: pos.scale }}
      transition={{ duration: 1.2, delay: 0.3 + pos.delay, type: "spring", stiffness: 100 }}
      style={{ y, opacity, perspective: 1000 }}
    >
      <motion.div
        className="relative w-32 h-48 rounded-2xl overflow-hidden cursor-pointer group"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.15, zIndex: 50, transition: { duration: 0.3 } }}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-75 blur-lg transition-opacity duration-500" />
        <div className="relative w-full h-full rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-2xl">
          <img src={image.src} alt={image.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <motion.div className="absolute bottom-3 left-3 right-3 flex justify-center gap-1" initial={{ opacity: 0, y: 10 }} whileHover={{ opacity: 1, y: 0 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Floating Orbs
function FloatingOrbs({ gyroX, gyroY, isMobile }: { gyroX: number; gyroY: number; isMobile: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(isMobile ? 3 : 6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: isMobile ? 150 + i * 50 : 200 + i * 80,
            height: isMobile ? 150 + i * 50 : 200 + i * 80,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            background: `radial-gradient(circle, ${
              ['rgba(99,102,241,0.12)', 'rgba(168,85,247,0.1)', 'rgba(236,72,153,0.08)', 'rgba(251,146,60,0.1)', 'rgba(34,197,94,0.08)', 'rgba(59,130,246,0.1)'][i]
            } 0%, transparent 70%)`,
            filter: 'blur(40px)',
            transform: isMobile ? `translate(${gyroX * 20}px, ${gyroY * 20}px)` : undefined,
          }}
          animate={!isMobile ? {
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          } : undefined}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
    </div>
  );
}

// Mobile Marquee Gallery
function MobileMarquee({ images }: { images: typeof mockImages }) {
  return (
    <div className="lg:hidden relative py-6 overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10" />
      
      {/* Row 1 */}
      <div className="flex gap-3 mb-3 animate-marquee-left">
        {[...images, ...images].map((image, i) => (
          <div key={`r1-${i}`} className="w-20 h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5">
            <img src={image.src} alt={image.title} className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
      
      {/* Row 2 - reverse */}
      <div className="flex gap-3 animate-marquee-right">
        {[...images, ...images].reverse().map((image, i) => (
          <div key={`r2-${i}`} className="w-20 h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5">
            <img src={image.src} alt={image.title} className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero({ totalRatings, totalImages }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { orientation, isMobile } = useDeviceOrientation();
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '80%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const featuredImages = mockImages.slice(0, 5);
  
  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current && !isMobile) {
        const rect = heroRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, isMobile]);

  const scrollToGallery = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
  };

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background */}
      <motion.div className="absolute inset-0 -z-10" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse at 20% 30%, rgba(99,102,241,0.06) 0%, transparent 50%)',
              'radial-gradient(ellipse at 80% 70%, rgba(168,85,247,0.06) 0%, transparent 50%)',
              'radial-gradient(ellipse at 50% 50%, rgba(236,72,153,0.04) 0%, transparent 50%)',
              'radial-gradient(ellipse at 20% 30%, rgba(99,102,241,0.06) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <FloatingOrbs gyroX={orientation.gamma} gyroY={orientation.beta} isMobile={isMobile} />
      </motion.div>

      {/* Desktop Floating Cards */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {featuredImages.map((image, index) => (
          <FloatingCard key={image.id} image={image} index={index} mouseX={mouseX} mouseY={mouseY} scrollProgress={scrollProgress} />
        ))}
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-20 max-w-5xl mx-auto text-center px-4 sm:px-6 pt-20 sm:pt-28 lg:pt-32"
        style={{ y: textY, opacity: textOpacity }}
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Live Stats Badge */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white/80 backdrop-blur-xl shadow-lg shadow-black/[0.03] border border-white/60 mb-6 sm:mb-8"
        >
          <div className="relative flex items-center gap-1.5 sm:gap-2">
            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500" />
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-600">LIVE</span>
          </div>
          <div className="h-3 sm:h-4 w-px bg-slate-200" />
          <span className="text-xs sm:text-sm font-medium text-slate-700">
            <span className="text-slate-900 font-bold">{totalRatings}</span> von {totalImages} bewertet
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6">
          <span className="block bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
            Bewerte Luna's
          </span>
          <motion.span 
            className="relative inline-block mt-1 sm:mt-2"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: 'linear-gradient(90deg, #f59e0b, #ea580c, #dc2626, #ea580c, #f59e0b)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Style.
            <motion.div
              className="absolute -right-6 -top-2 sm:-right-10 sm:-top-4"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-amber-400" />
            </motion.div>
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-xl text-slate-600 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
          Hilf uns, den perfekten Look für unsere{' '}
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
            Immobilien-Beraterin
          </span>{' '}
          zu finden.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <motion.button 
            onClick={scrollToGallery}
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-white text-sm sm:text-base overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-violet-600 via-blue-600 to-violet-600"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% 200%' }}
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
            <span className="relative z-10">Jetzt bewerten</span>
            <motion.div className="relative z-10" animate={{ y: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Trust indicators - mobile optimized */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-8 sm:mt-12 text-xs sm:text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 ring-2 ring-white" />
              ))}
            </div>
            <span>100+ Teilnehmer</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
            <span>Anonym & schnell</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile Marquee */}
      <MobileMarquee images={mockImages.filter(img => img.setting === 'studio-grey').slice(0, 8)} />

      {/* Scroll indicator - hidden on mobile */}
      <motion.div 
        className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-slate-300 flex items-start justify-center p-1.5"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-slate-400"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
