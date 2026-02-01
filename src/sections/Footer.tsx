import { Heart, Shield, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="relative py-16 sm:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-slate-50 to-white" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-100/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/images/logo.svg" 
                alt="Luna Homes" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <span className="block font-bold text-lg text-slate-900">Luna Homes</span>
              <span className="text-xs text-slate-500 font-medium tracking-wider uppercase">Style Check</span>
            </div>
          </motion.div>

          {/* Privacy Info */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm ring-1 ring-slate-100">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-slate-600">Anonyme Bewertung</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm ring-1 ring-slate-100">
              <Lock className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-slate-600">Lokale Speicherung</span>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-8" />

          {/* Bottom */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span>© {new Date().getFullYear()} Luna Homes</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              Made with <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> in Germany
            </span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
