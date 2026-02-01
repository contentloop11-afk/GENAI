import { HelpCircle, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface TopbarProps {
  onAdminClick?: () => void;
}

export function Topbar({ onAdminClick }: TopbarProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.9, 0.98]);
  const headerBlur = useTransform(scrollY, [0, 100], [12, 20]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Secret admin access: Triple-click on logo
  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    setTimeout(() => setClickCount(0), 2000);
    
    if (newCount >= 3 && onAdminClick) {
      setClickCount(0);
      onAdminClick();
    }
  };

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'border-b border-slate-200/50 shadow-sm shadow-slate-200/20' 
          : 'border-b border-transparent'
      }`}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${isScrolled ? 0.95 : 0.9})`,
        backdropFilter: `blur(${isScrolled ? 20 : 12}px)`,
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo - Luna Homes (Triple-click for admin) */}
          <motion.button 
            onClick={handleLogoClick}
            className="flex items-center gap-3 select-none group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* SVG Logo with glow effect */}
            <motion.div 
              className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center"
              animate={clickCount > 0 ? { 
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <img 
                src="/images/logo.svg" 
                alt="Luna Homes" 
                className="w-full h-full object-contain relative z-10"
                draggable={false}
              />
            </motion.div>
            
            {/* Brand Text */}
            <div className="flex flex-col text-left">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 leading-none group-hover:text-violet-700 transition-colors">
                Luna Homes
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold leading-tight tracking-wider uppercase">
                Style Check
              </span>
            </div>
          </motion.button>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {/* Help Button with Tooltip */}
            <div className="relative">
              <motion.button 
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
                onClick={() => setShowHelp(!showHelp)}
                onBlur={() => setTimeout(() => setShowHelp(false), 200)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Hilfe</span>
              </motion.button>
              
              {/* Help Tooltip */}
              <AnimatePresence>
                {showHelp && (
                  <motion.div 
                    className="absolute top-full right-0 mt-3 w-72 p-5 bg-white rounded-2xl shadow-2xl border border-slate-100 text-left z-50"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-bold text-slate-900">Wie funktioniert's?</h4>
                    </div>
                    <ul className="space-y-3">
                      {[
                        { num: "1", text: "Scrolle durch Luna's Outfits" },
                        { num: "2", text: "Bewerte mit 1-5 Sternen (einmalig!)" },
                        { num: "3", text: "Kommentiere & teile Outfit-Links" },
                      ].map((item, i) => (
                        <motion.li 
                          key={i}
                          className="flex gap-3 items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.1 }}
                        >
                          <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {item.num}
                          </span>
                          <span className="text-sm text-slate-600">{item.text}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Deine Bewertung ist anonym
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
