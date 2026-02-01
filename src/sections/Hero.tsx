import { ChevronDown, Sparkles, Star } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { mockImages } from '@/data/mockImages';

interface HeroProps {
  totalRatings: number;
  totalImages: number;
}

// Floating 3D Card Component
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
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Each card has unique position and animation
  const positions = [
    { x: -320, y: -60, rotate: -12, scale: 0.9, delay: 0 },
    { x: -180, y: 40, rotate: -6, scale: 1.05, delay: 0.1 },
    { x: 0, y: -20, rotate: 0, scale: 1.15, delay: 0.2 },
    { x: 180, y: 40, rotate: 6, scale: 1.05, delay: 0.3 },
    { x: 320, y: -60, rotate: 12, scale: 0.9, delay: 0.4 },
  ];
  
  const pos = positions[index % 5];
  
  // Spring physics for smooth movement
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  
  // Parallax on scroll
  const y = useTransform(scrollProgress, [0, 1], [0, -150 - index * 30]);
  const opacity = useTransform(scrollProgress, [0, 0.5], [1, 0]);

  return (
    <motion.div
      ref={cardRef}
      className="absolute hidden lg:block"
      initial={{ 
        opacity: 0, 
        y: 100, 
        x: pos.x,
        rotate: pos.rotate,
        scale: 0.5 
      }}
      animate={{ 
        opacity: 1, 
        y: pos.y, 
        x: pos.x,
        rotate: pos.rotate,
        scale: pos.scale 
      }}
      transition={{ 
        duration: 1.2, 
        delay: 0.3 + pos.delay,
        type: "spring",
        stiffness: 100
      }}
      style={{ 
        y,
        opacity,
        perspective: 1000,
      }}
    >
      <motion.div
        className="relative w-32 h-48 rounded-2xl overflow-hidden cursor-pointer group"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ 
          scale: 1.15, 
          zIndex: 50,
          transition: { duration: 0.3 }
        }}
      >
        {/* Glowing border effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-75 blur-lg transition-opacity duration-500" />
        
        {/* Card content */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-2xl">
          <img 
            src={image.src} 
            alt={image.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating preview on hover */}
          <motion.div 
            className="absolute bottom-3 left-3 right-3 flex justify-center gap-1"
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
          </motion.div>
        </div>
        
        {/* 3D shine effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
          style={{
            transform: "translateZ(20px)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// Animated particles/orbs
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 200 + i * 80,
            height: 200 + i * 80,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            background: `radial-gradient(circle, ${
              ['rgba(99,102,241,0.15)', 'rgba(168,85,247,0.12)', 'rgba(236,72,153,0.1)', 'rgba(251,146,60,0.12)', 'rgba(34,197,94,0.1)', 'rgba(59,130,246,0.12)'][i]
            } 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
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

// Animated background grid
function BackgroundGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

export function Hero({ totalRatings, totalImages }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Scroll progress
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Select 5 featured images for floating cards
  const featuredImages = mockImages.slice(0, 5);
  
  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const scrollToGallery = () => {
    const element = document.getElementById('gallery');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background Elements */}
      <motion.div 
        className="absolute inset-0 -z-10"
        style={{ y: backgroundY }}
      >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
        
        {/* Animated mesh gradient */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse at 20% 30%, rgba(99,102,241,0.08) 0%, transparent 50%)',
              'radial-gradient(ellipse at 80% 70%, rgba(168,85,247,0.08) 0%, transparent 50%)',
              'radial-gradient(ellipse at 50% 50%, rgba(236,72,153,0.06) 0%, transparent 50%)',
              'radial-gradient(ellipse at 20% 30%, rgba(99,102,241,0.08) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        <FloatingOrbs />
        <BackgroundGrid />
      </motion.div>

      {/* Floating 3D Cards - Desktop only */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {featuredImages.map((image, index) => (
          <FloatingCard
            key={image.id}
            image={image}
            index={index}
            mouseX={mouseX}
            mouseY={mouseY}
            scrollProgress={scrollProgress}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-20 max-w-5xl mx-auto text-center px-4 sm:px-6 pt-24 sm:pt-32"
        style={{ y: textY, opacity: textOpacity }}
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Live Stats Badge */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-xl shadow-lg shadow-black/[0.03] border border-white/60 mb-8"
        >
          <div className="relative flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-600">LIVE</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <span className="text-sm font-medium text-slate-700">
            <span className="text-slate-900 font-bold">{totalRatings}</span> von {totalImages} bewertet
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="block bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
            Bewerte Luna's
          </span>
          <motion.span 
            className="relative inline-block mt-2"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
            }}
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
              className="absolute -right-8 -top-4 sm:-right-12 sm:-top-6"
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 text-amber-400" />
            </motion.div>
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
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
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 sm:px-10 sm:py-5 rounded-full font-semibold text-white text-base sm:text-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated gradient background */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-violet-600 via-blue-600 to-violet-600"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% 200%' }}
            />
            
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            
            {/* Shine effect */}
            <motion.div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
            </motion.div>
            
            <span className="relative z-10">Jetzt bewerten</span>
            <motion.div
              className="relative z-10"
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-center gap-6 mt-12 text-sm text-slate-500"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 ring-2 ring-white"
                />
              ))}
            </div>
            <span>100+ Teilnehmer</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Anonym & schnell</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
