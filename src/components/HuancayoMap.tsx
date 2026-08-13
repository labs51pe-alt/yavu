import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Navigation, MapPin, Shield, Zap, Sparkles } from 'lucide-react';
import { LocationPoint, MotorizadoRider } from '../types';

interface HuancayoMapProps {
  pickup?: LocationPoint;
  destination?: LocationPoint;
  rider?: MotorizadoRider;
  progressPercent?: number; // 0 to 100
  interactive?: boolean;
  onSelectHotspot?: (hotspot: LocationPoint) => void;
  heightClass?: string;
}

export const HuancayoMap: React.FC<HuancayoMapProps> = ({
  pickup,
  destination,
  rider,
  progressPercent = 45,
  interactive = false,
  onSelectHotspot,
  heightClass = 'h-[320px]',
}) => {
  const [riderPos, setRiderPos] = useState({ x: 45, y: 55 });
  const [speed, setSpeed] = useState(34);

  useEffect(() => {
    // Smooth motorbike movement along route curve
    const interval = setInterval(() => {
      setSpeed(Math.floor(28 + Math.random() * 12));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Calculate coordinates on 100x100 virtual grid
  const startX = 22;
  const startY = 72;
  const endX = 78;
  const endY = 24;

  const currentX = startX + (endX - startX) * (progressPercent / 100);
  const currentY = startY + (endY - startY) * (progressPercent / 100);

  return (
    <div className={`w-full ${heightClass} relative overflow-hidden bg-[#0A0D0B] border border-zipp-red/20 rounded-3xl select-none`}>
      {/* City Street Grid & Terrain Pattern for Huancayo */}
      <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#223326" strokeWidth="1" />
          </pattern>
          <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E31E24" />
            <stop offset="50%" stopColor="#FFE234" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Major Huancayo Arteries (Calle Real, Av. Ferrocarril, Av. Mariscal Castilla) */}
        {/* Av. Mariscal Castilla / Calle Real (Diagonal Main Artery) */}
        <path d="M 0 100 Q 40 60 100 0" fill="none" stroke="#E31E24" strokeWidth="4" strokeOpacity="0.25" />
        {/* Av. Ferrocarril */}
        <path d="M 10 100 Q 50 55 90 0" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.15" strokeDasharray="4 4" />
        {/* Av. Giráldez / Av. San Carlos Crossings */}
        <path d="M 0 45 L 100 55" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.15" />
        <path d="M 0 70 L 100 75" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.12" />
        <path d="M 20 0 L 85 100" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.12" />

        {/* Active Route Path */}
        <path
          d={`M ${startX}% ${startY}% Q 48% 62% ${endX}% ${endY}%`}
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="4"
          strokeDasharray="6 4"
          className="animate-[dash_1.5s_linear_infinite]"
        />
      </svg>

      {/* Huancayo District Labels */}
      <div className="absolute top-4 left-5 pointer-events-none z-10 flex flex-col">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-zipp-red animate-ping" />
          <span className="text-[10px] font-black text-white tracking-widest uppercase bg-black/80 px-2.5 py-1 rounded-full border border-zipp-red/40 backdrop-blur-md">
            GPS Radar Huancayo 🇵🇪
          </span>
        </div>
        <span className="text-[11px] font-bold text-gray-300 mt-1">El Tambo ➔ Centro ➔ Chilca</span>
      </div>

      {/* Live Speed & Altitude Badge */}
      <div className="absolute top-4 right-4 z-10 bg-black/90 backdrop-blur-md border border-zipp-red/30 px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-xl">
        <div className="w-7 h-7 rounded-xl bg-zipp-red/20 border border-zipp-red/40 flex items-center justify-center text-zipp-red">
          <Zap size={14} className="animate-pulse" />
        </div>
        <div className="text-right">
          <div className="text-xs font-black text-white leading-none">{speed} km/h</div>
          <div className="text-[8px] font-bold text-gray-400 tracking-wider">3,259 m.s.n.m.</div>
        </div>
      </div>

      {/* Pickup Marker (Punto A) */}
      <div
        className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${startX}%`, top: `${startY}%` }}
      >
        <div className="relative group">
          <div className="w-8 h-8 rounded-full bg-zipp-red flex items-center justify-center text-white shadow-[0_0_20px_rgba(227,30,36,0.8)] border-2 border-white">
            <span className="text-[11px] font-black">A</span>
          </div>
          <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 border border-zipp-red/40 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-lg backdrop-blur-sm">
            {pickup?.district || 'Punto Recojo'}
          </div>
        </div>
      </div>

      {/* Destination Marker (Punto B) */}
      <div
        className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${endX}%`, top: `${endY}%` }}
      >
        <div className="relative group">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-black shadow-[0_0_25px_rgba(34,197,94,0.8)] border-2 border-white"
          >
            <span className="text-[11px] font-black">B</span>
          </motion.div>
          <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 border border-green-500/40 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-lg backdrop-blur-sm">
            {destination?.district || 'Punto Entrega'}
          </div>
        </div>
      </div>

      {/* Live Animated Motorcycle Rider Marker */}
      <motion.div
        className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${currentX}%`, top: `${currentY}%` }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      >
        <div className="relative">
          {/* Headlight beam effect */}
          <div className="absolute -top-3 left-4 w-12 h-6 bg-gradient-to-r from-yellow-300/40 to-transparent rotate-[-35deg] blur-xs pointer-events-none" />

          {/* Motorcycle Icon Avatar */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zipp-red to-zipp-red-dark p-2 border-2 border-white shadow-[0_0_30px_rgba(227,30,36,0.9)] flex items-center justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2830/2830312.png"
              alt="Motorizado YAVU"
              className="w-full h-full object-contain filter drop-shadow"
            />
          </div>

          {/* Rider Name pill */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-zipp-red text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            {rider?.name.split(' ')[0] || 'Motorizado en Ruta'}
          </div>
        </div>
      </motion.div>

      {/* Bottom Map Status Strip */}
      <div className="absolute bottom-3 left-4 right-4 z-10 bg-zipp-black/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Navigation size={14} className="text-zipp-red" />
          <span className="font-bold text-white">Por Av. Ferrocarril / Giráldez</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-zipp-yellow">
          <span>⏱️ En camino</span>
        </div>
      </div>
    </div>
  );
};
