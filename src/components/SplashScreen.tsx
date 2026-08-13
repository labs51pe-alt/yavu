import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bike, Shield, Zap, Sparkles, MapPin } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 2600,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Iniciando radar satelital en Huancayo...');

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentPct = Math.min(Math.round((elapsed / durationMs) * 100), 100);
      setProgress(currentPct);

      if (currentPct < 30) {
        setStatusText('Iniciando radar satelital en Huancayo...');
      } else if (currentPct < 65) {
        setStatusText('Sincronizando 8 motorizados activos en ruta...');
      } else if (currentPct < 90) {
        setStatusText('Optimizando rutas El Tambo • Centro • Chilca...');
      } else {
        setStatusText('¡Listo! Abriendo YAVU Express...');
      }

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setTimeout(onFinish, 300);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [durationMs, onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] bg-[#070908] text-white flex flex-col items-center justify-between p-6 overflow-hidden select-none"
    >
      {/* Background Ambient Glow & Huancayo Mountain Contour */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top radial neon glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[480px] h-[320px] bg-gradient-to-b from-zipp-red/25 via-zipp-yellow/10 to-transparent rounded-full blur-3xl opacity-60" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Mountain skyline silhouette (Huaytapallana tribute) */}
        <svg
          viewBox="0 0 1200 240"
          className="absolute bottom-36 left-0 right-0 w-full h-24 text-white/[0.03] fill-current preserve-3d"
        >
          <path d="M0,240 L0,160 L120,90 L240,170 L380,60 L490,130 L620,40 L760,140 L890,70 L1020,150 L1140,100 L1200,160 L1200,240 Z" />
        </svg>
      </div>

      {/* TOP HEADER: Brand & Huancayo Badge */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full max-w-md flex items-center justify-between pt-4 relative z-10"
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-zipp-red to-zipp-red-dark flex items-center justify-center text-white shadow-lg shadow-zipp-red/40 border border-white/20">
            <Bike size={20} className="transform -rotate-12" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-xl tracking-tight text-white">YAVU</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-zipp-yellow bg-zipp-yellow/10 border border-zipp-yellow/30 px-1.5 py-0.2 rounded">
                PRO
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[11px] font-bold text-zinc-300">
          <MapPin size={12} className="text-zipp-red animate-pulse" />
          <span>Huancayo, Perú</span>
        </div>
      </motion.div>

      {/* CENTER: HERO ANIMATION (Motorcycle Racing on Road) */}
      <div className="w-full max-w-md my-auto flex flex-col items-center justify-center relative z-10 py-6">
        
        {/* Slogan */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center space-y-1 mb-8"
        >
          <span className="text-[11px] font-black uppercase tracking-widest text-zipp-red flex items-center justify-center gap-1.5">
            <Zap size={13} className="text-zipp-yellow animate-bounce" />
            Delivery Express en Moto
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Envíos en <span className="text-transparent bg-clip-text bg-gradient-to-r from-zipp-red via-rose-400 to-zipp-yellow">15 minutos</span>
          </h1>
          <p className="text-xs text-zinc-400 font-medium">
            Por todo el Valle del Mantaro
          </p>
        </motion.div>

        {/* Dynamic Road & Motorcycle Stage */}
        <div className="w-full h-40 relative flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/60 to-black/90 border border-white/10 shadow-2xl">
          
          {/* Speed blur lines across stage */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <motion.div
              animate={{ x: [0, -400] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              className="w-[800px] h-full flex flex-col justify-around py-4"
            >
              <div className="h-[1px] w-24 bg-zipp-red/80 ml-12" />
              <div className="h-[1px] w-36 bg-zipp-yellow/60 ml-40" />
              <div className="h-[1px] w-20 bg-white/60 ml-80" />
              <div className="h-[1px] w-32 bg-zipp-red/70 ml-24" />
            </motion.div>
          </div>

          {/* Road Asphalt Layer with moving dashed line */}
          <div className="absolute bottom-4 left-0 right-0 h-10 bg-zinc-950 border-t border-zinc-800 flex items-center overflow-hidden">
            {/* Road center dashed line flowing left */}
            <motion.div
              animate={{ x: [0, -96] }}
              transition={{ repeat: Infinity, duration: 0.35, ease: 'linear' }}
              className="flex items-center gap-6 w-[800px] shrink-0"
            >
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-8 h-1 bg-zipp-yellow/90 rounded-full shrink-0 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
              ))}
            </motion.div>
          </div>

          {/* MOTORCYCLE ACTOR (Moves from Left to Right across screen) */}
          <motion.div
            initial={{ x: -180, opacity: 0 }}
            animate={{ 
              x: [-180, -30, 20, 240], 
              opacity: [0, 1, 1, 0] 
            }}
            transition={{
              duration: 2.3,
              times: [0, 0.25, 0.75, 1],
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 0.2
            }}
            className="absolute bottom-5 z-20 flex items-center"
          >
            {/* Speed Particle Exhaust Trail */}
            <div className="relative -mr-3 flex items-center">
              <motion.div
                animate={{ scale: [0.5, 1.2, 0], opacity: [0.9, 0.4, 0], x: [-5, -28] }}
                transition={{ repeat: Infinity, duration: 0.3, ease: 'easeOut' }}
                className="w-4 h-4 rounded-full bg-gradient-to-l from-zipp-yellow to-zipp-red blur-xs"
              />
              <motion.div
                animate={{ scale: [0.3, 1, 0], opacity: [0.8, 0.2, 0], x: [-2, -20] }}
                transition={{ repeat: Infinity, duration: 0.25, ease: 'easeOut', delay: 0.08 }}
                className="w-3 h-3 rounded-full bg-zipp-red blur-xs"
              />
            </div>

            {/* Custom High-Detail Motorbike Vector with Delivery Backpack & Headlight */}
            <motion.div
              animate={{ y: [0, -2, 0, -1, 0], rotate: [0, -1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.22, ease: 'easeInOut' }}
              className="relative"
            >
              {/* Headlight beam shining forward */}
              <div 
                className="absolute top-3 left-14 w-28 h-10 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.7) 0%, rgba(234,179,8,0.4) 40%, transparent 100%)',
                  clipPath: 'polygon(0 40%, 100% 0%, 100% 100%, 0 60%)',
                }}
              />

              <svg width="68" height="48" viewBox="0 0 68 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_4px_12px_rgba(225,29,72,0.5)]">
                {/* Back Delivery Box (YAVU Backpack in bright Red) */}
                <rect x="8" y="10" width="16" height="15" rx="3" fill="#E11D48" stroke="#FFF" strokeWidth="1" />
                <path d="M12 14H20M12 18H18" stroke="#FFF" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="16" cy="12" r="1.5" fill="#EAB308" />

                {/* Rider Torso & Helmet */}
                <circle cx="27" cy="8" r="5" fill="#18181B" stroke="#E11D48" strokeWidth="1.2" /> {/* Helmet */}
                <path d="M28 7L31 8.5L28 9.5" stroke="#EAB308" strokeWidth="1.2" strokeLinecap="round" /> {/* Visor */}
                <path d="M22 17C23 13 26 12 30 13L36 18L32 23L22 22Z" fill="#27272A" /> {/* Rider Body */}
                
                {/* Rider Arms holding handlebars */}
                <path d="M30 16L39 19" stroke="#E4E4E7" strokeWidth="2.5" strokeLinecap="round" />

                {/* Motorcycle Body Frame */}
                <path d="M18 31L28 23H40L46 27L42 32H20Z" fill="#E11D48" />
                <path d="M38 18L44 26" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" /> {/* Fork */}
                <circle cx="45" cy="26" r="2.5" fill="#FFF" /> {/* Headlight Bulb */}

                {/* Wheels with motion spoke spin */}
                <g className="animate-spin" style={{ transformOrigin: '15px 33px', animationDuration: '0.2s' }}>
                  <circle cx="15" cy="33" r="8" fill="#18181B" stroke="#71717A" strokeWidth="2.5" />
                  <circle cx="15" cy="33" r="3" fill="#EAB308" />
                  <line x1="15" y1="25" x2="15" y2="41" stroke="#52525B" strokeWidth="1" />
                  <line x1="7" y1="33" x2="23" y2="33" stroke="#52525B" strokeWidth="1" />
                </g>

                <g className="animate-spin" style={{ transformOrigin: '49px 33px', animationDuration: '0.2s' }}>
                  <circle cx="49" cy="33" r="8" fill="#18181B" stroke="#71717A" strokeWidth="2.5" />
                  <circle cx="49" cy="33" r="3" fill="#EAB308" />
                  <line x1="49" y1="25" x2="49" y2="41" stroke="#52525B" strokeWidth="1" />
                  <line x1="41" y1="33" x2="57" y2="33" stroke="#52525B" strokeWidth="1" />
                </g>
              </svg>
            </motion.div>
          </motion.div>

          {/* Passing landmark badges in background */}
          <div className="absolute top-3 left-4 flex items-center gap-2">
            <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
              📍 Calle Real · El Tambo · Chilca
            </span>
          </div>
        </div>

        {/* Interactive progress bar */}
        <div className="w-full mt-6 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zipp-red animate-ping" />
              {statusText}
            </span>
            <span className="font-mono font-black text-zipp-yellow">{progress}%</span>
          </div>

          <div className="h-2 w-full bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-zipp-red via-rose-500 to-zipp-yellow rounded-full shadow-[0_0_12px_rgba(225,29,72,0.8)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* FOOTER: Quality & Security Guarantee */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-md flex items-center justify-around py-3 border-t border-white/10 text-[11px] font-bold text-zinc-400 relative z-10"
      >
        <div className="flex items-center gap-1.5">
          <Shield size={14} className="text-emerald-400" />
          <span>Entrega con PIN</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-zinc-700" />
        <div className="flex items-center gap-1.5">
          <Bike size={14} className="text-zipp-red" />
          <span>Motos Verificadas</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-zinc-700" />
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-zipp-yellow" />
          <span>Yape & Plin</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
