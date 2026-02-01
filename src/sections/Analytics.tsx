import { ResultsChart } from '@/components/ResultsChart';
import type { ChartDataPoint } from '@/types';
import { Lock, Star, Trophy, TrendingUp, BarChart3, Sparkles } from 'lucide-react';
import { mockImages, styleConfig } from '@/data/mockImages';
import { useMemo, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

interface AnalyticsProps {
  chartData: ChartDataPoint[];
  totalRatings: number;
  ratings: { [key: string]: number };
}

export function Analytics({ chartData, totalRatings, ratings }: AnalyticsProps) {
  const isUnlocked = totalRatings > 0;
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Get top rated images
  const topRatedImages = useMemo(() => {
    const ratedImages = mockImages
      .filter(img => ratings[img.id] !== undefined)
      .map(img => ({
        ...img,
        rating: ratings[img.id]
      }))
      .sort((a, b) => b.rating - a.rating);
    
    return ratedImages.slice(0, 3);
  }, [ratings]);

  // Calculate style breakdown
  const styleBreakdown = useMemo(() => {
    const breakdown: { style: string; highRatings: number; totalRated: number; color: string }[] = [];
    
    Object.entries(styleConfig).forEach(([style, config]) => {
      const imagesOfStyle = mockImages.filter(img => img.style === style);
      const ratedOfStyle = imagesOfStyle.filter(img => ratings[img.id] !== undefined);
      const highRated = ratedOfStyle.filter(img => ratings[img.id] >= 4).length;
      
      if (ratedOfStyle.length > 0) {
        breakdown.push({
          style: config.labelDE,
          highRatings: highRated,
          totalRated: ratedOfStyle.length,
          color: config.color
        });
      }
    });
    
    return breakdown.sort((a, b) => b.highRatings - a.highRatings);
  }, [ratings]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-20 sm:py-28 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-violet-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        className="max-w-5xl mx-auto px-4 sm:px-6"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-xs font-bold mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <BarChart3 className="w-4 h-4" />
            <span>LIVE ANALYTICS</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Bewertungs
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
              ergebnisse
            </span>
          </h2>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            Entdecke welche Styles am besten ankommen
          </p>
        </motion.div>

        {/* Main Chart */}
        <motion.div 
          className="relative mb-12"
          variants={itemVariants}
        >
          <AnimatePresence mode="wait">
            {!isUnlocked ? (
              <motion.div 
                key="locked"
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md rounded-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <motion.div 
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4 shadow-inner"
                  animate={{ 
                    rotate: [0, -5, 5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Lock className="w-8 h-8 text-slate-400" />
                </motion.div>
                <p className="text-lg font-semibold text-slate-700 mb-2">
                  Ergebnisse gesperrt
                </p>
                <p className="text-sm text-slate-500">
                  Bewerte ein Outfit um die Ergebnisse freizuschalten
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="unlocked"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 right-4 z-10"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Live</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 p-6 sm:p-8">
            <ResultsChart 
              data={chartData} 
              totalRatings={totalRatings} 
            />
          </div>
        </motion.div>

        {/* Additional Insights */}
        <AnimatePresence>
          {totalRatings >= 3 && (
            <motion.div 
              className="grid sm:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Top Rated Outfits */}
              <motion.div 
                className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 p-6 overflow-hidden relative"
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.3 }}
              >
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-100/50 to-transparent rounded-bl-full" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Top bewertet</h3>
                      <p className="text-xs text-slate-500">Deine Favoriten</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {topRatedImages.length > 0 ? (
                      topRatedImages.map((img, index) => (
                        <motion.div 
                          key={img.id} 
                          className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          <div className="relative">
                            <img 
                              src={img.src} 
                              alt={img.title}
                              className="w-14 h-20 rounded-xl object-cover shadow-md"
                            />
                            {index === 0 && (
                              <motion.div 
                                className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <span className="text-[10px] font-bold text-white">👑</span>
                              </motion.div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{img.title}</p>
                            <p className="text-xs text-slate-500">{styleConfig[img.style].labelDE}</p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`w-4 h-4 ${
                                  i < img.rating 
                                    ? 'text-amber-400 fill-amber-400' 
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 text-center py-8">
                        Noch keine Top-Bewertungen
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Style Insights */}
              <motion.div 
                className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 p-6 overflow-hidden relative"
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.3 }}
              >
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-bl-full" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Beliebte Styles</h3>
                      <p className="text-xs text-slate-500">Nach Beliebtheit</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {styleBreakdown.length > 0 ? (
                      styleBreakdown.map((item, index) => (
                        <motion.div 
                          key={item.style}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm font-semibold text-slate-900">
                                {item.style}
                              </span>
                            </div>
                            <span className="text-xs font-medium text-slate-500">
                              {item.highRatings}/{item.totalRated} ⭐
                            </span>
                          </div>
                          {/* Animated Progress Bar */}
                          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full rounded-full"
                              style={{ backgroundColor: item.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.highRatings / item.totalRated) * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                            />
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 text-center py-8">
                        Bewerte mehr Outfits für Style-Insights
                      </p>
                    )}
                  </div>
                  
                  <p className="text-[10px] text-slate-400 mt-6 pt-4 border-t border-slate-100">
                    ⭐ = 4 oder 5 Sterne Bewertung
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <AnimatePresence>
          {totalRatings > 0 && totalRatings < 3 && (
            <motion.div 
              className="text-center mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-violet-500 to-blue-500 rounded-2xl text-white shadow-lg shadow-violet-500/30"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">
                  Noch {3 - totalRatings} Bewertung{3 - totalRatings !== 1 ? 'en' : ''} für Detail-Insights!
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
