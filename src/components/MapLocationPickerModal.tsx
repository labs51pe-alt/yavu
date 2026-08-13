import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, X, Check, Search, Crosshair, Navigation, Building2, Compass } from 'lucide-react';
import { LocationPoint, HuancayoDistrict } from '../types';
import { HUANCAYO_HOTSPOTS, reverseGeocodeHuancayo } from '../data/huancayoData';

interface MapLocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: LocationPoint) => void;
  title?: string;
  pointType?: 'pickup' | 'destination';
  initialLocation?: LocationPoint | null;
}

export const MapLocationPickerModal: React.FC<MapLocationPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  title = 'Seleccionar ubicación en el mapa',
  pointType = 'pickup',
  initialLocation,
}) => {
  const [pinPos, setPinPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<LocationPoint>(
    initialLocation || HUANCAYO_HOTSPOTS[0]
  );

  if (!isOpen) return null;

  // Map boundary in Huancayo:
  // North: UNCP / El Tambo (-12.025, -75.240) -> x: 75%, y: 15%
  // South: Chilca / Huancán (-12.095, -75.195) -> x: 25%, y: 85%
  // West: Pilcomayo (-12.050, -75.260) -> x: 10%, y: 45%
  // East: San Carlos / Torre Torre (-12.055, -75.185) -> x: 90%, y: 45%

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setPinPos({ x: clickX, y: clickY });

    // Map percentage to Huancayo Lat/Lng
    // y (0 to 100) -> lat (-12.025 to -12.095)
    // x (0 to 100) -> lng (-75.260 to -75.185)
    const lat = -12.025 - (clickY / 100) * 0.070;
    const lng = -75.260 + (clickX / 100) * 0.075;

    const resolved = reverseGeocodeHuancayo(lat, lng);
    setSelectedPoint(resolved);
  };

  const handleSelectHotspot = (spot: LocationPoint) => {
    // Approximate percentages for hotspots
    const latPercent = ((-spot.lat - 12.025) / 0.070) * 100;
    const lngPercent = ((spot.lng - (-75.260)) / 0.075) * 100;

    setPinPos({
      x: Math.max(10, Math.min(90, lngPercent)),
      y: Math.max(10, Math.min(90, latPercent)),
    });
    setSelectedPoint(spot);
  };

  const handleUseCurrentGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const resolved = reverseGeocodeHuancayo(lat, lng);
          setSelectedPoint(resolved);
          setPinPos({ x: 50, y: 55 });
        },
        () => {
          // Fallback to Huancayo center
          handleSelectHotspot(HUANCAYO_HOTSPOTS[1]);
        }
      );
    } else {
      handleSelectHotspot(HUANCAYO_HOTSPOTS[1]);
    }
  };

  const filteredHotspots = HUANCAYO_HOTSPOTS.filter(
    (h) =>
      !searchQuery ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.reference && h.reference.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-lg bg-zipp-surface border border-zipp-border rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-zipp-border flex items-center justify-between bg-zipp-surface">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-white shadow-md ${
                pointType === 'pickup' ? 'bg-zipp-red shadow-zipp-red/30' : 'bg-green-500 shadow-green-500/30'
              }`}
            >
              {pointType === 'pickup' ? 'A' : 'B'}
            </div>
            <div>
              <h3 className="font-display font-black text-sm text-zipp-text">{title}</h3>
              <p className="text-[11px] text-zipp-text-muted">Toca en el mapa para fijar el punto exacto</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zipp-surface-2 flex items-center justify-center text-zipp-text-muted hover:text-zipp-text transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search Bar inside map */}
        <div className="p-3 bg-zipp-surface-2 border-b border-zipp-border">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-zipp-text-muted" />
            <input
              type="text"
              placeholder="Buscar calle, avenida o lugar en Huancayo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zipp-surface border border-zipp-border rounded-xl pl-9 pr-8 py-2 text-xs text-zipp-text placeholder:text-zipp-text-muted focus:outline-none focus:border-zipp-red"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-zipp-text-muted hover:text-zipp-text"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick District Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none text-[11px]">
            <button
              onClick={handleUseCurrentGPS}
              className="shrink-0 flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg font-bold"
            >
              <Crosshair size={12} /> Mi GPS
            </button>
            <button
              onClick={() => handleSelectHotspot(HUANCAYO_HOTSPOTS[1])}
              className="shrink-0 bg-zipp-surface border border-zipp-border hover:border-zipp-red text-zipp-text px-2.5 py-1 rounded-lg font-medium"
            >
              🏛️ Huancayo Centro
            </button>
            <button
              onClick={() => handleSelectHotspot(HUANCAYO_HOTSPOTS[3])}
              className="shrink-0 bg-zipp-surface border border-zipp-border hover:border-zipp-red text-zipp-text px-2.5 py-1 rounded-lg font-medium"
            >
              🎓 El Tambo / UNCP
            </button>
            <button
              onClick={() => handleSelectHotspot(HUANCAYO_HOTSPOTS[11])}
              className="shrink-0 bg-zipp-surface border border-zipp-border hover:border-zipp-red text-zipp-text px-2.5 py-1 rounded-lg font-medium"
            >
              🏘️ Chilca
            </button>
            <button
              onClick={() => handleSelectHotspot(HUANCAYO_HOTSPOTS[4])}
              className="shrink-0 bg-zipp-surface border border-zipp-border hover:border-zipp-red text-zipp-text px-2.5 py-1 rounded-lg font-medium"
            >
              🌲 San Carlos
            </button>
            <button
              onClick={() => handleSelectHotspot(HUANCAYO_HOTSPOTS[0])}
              className="shrink-0 bg-zipp-surface border border-zipp-border hover:border-zipp-red text-zipp-text px-2.5 py-1 rounded-lg font-medium"
            >
              🛍️ Real Plaza
            </button>
          </div>
        </div>

        {/* Interactive Map Canvas Container */}
        <div className="relative flex-1 min-h-[260px] bg-[#0E1310] overflow-hidden cursor-crosshair group select-none">
          {/* Clickable Map Stage */}
          <div className="absolute inset-0" onClick={handleMapClick}>
            {/* SVG Roads and City Plan of Huancayo */}
            <svg className="w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="modalGrid" width="35" height="35" patternUnits="userSpaceOnUse">
                  <path d="M 35 0 L 0 0 0 35" fill="none" stroke="#2D4032" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#modalGrid)" />

              {/* Río Mantaro (West River Boundary) */}
              <path
                d="M 5 0 Q 15 50 10 100"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="7"
                strokeOpacity="0.4"
              />

              {/* Major Arteries */}
              {/* Av. Mariscal Castilla / Calle Real */}
              <path d="M 5 95 Q 45 55 95 5" fill="none" stroke="#E31E24" strokeWidth="5" strokeOpacity="0.5" />
              {/* Av. Ferrocarril */}
              <path d="M 15 95 Q 52 50 88 5" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.3" strokeDasharray="5 3" />
              {/* Av. Giráldez */}
              <path d="M 10 50 L 90 55" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.3" />
              {/* Av. San Carlos */}
              <path d="M 20 35 L 85 40" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.25" />
              {/* Av. Huancavelica */}
              <path d="M 25 90 L 75 10" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.2" />
            </svg>

            {/* District Area Landmarks / Labels on map */}
            <div className="absolute top-4 left-6 pointer-events-none text-[10px] font-black text-emerald-400/80 uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded border border-emerald-500/20">
              Distrito El Tambo (Norte)
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-[10px] font-black text-amber-400/80 uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded border border-amber-500/20">
              Huancayo Centro (Calle Real)
            </div>
            <div className="absolute bottom-4 right-6 pointer-events-none text-[10px] font-black text-rose-400/80 uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded border border-rose-500/20">
              Distrito Chilca (Sur)
            </div>
            <div className="absolute top-1/3 right-4 pointer-events-none text-[9px] font-bold text-sky-400/70 uppercase bg-black/60 px-1.5 py-0.5 rounded">
              San Carlos / Univ. Continental
            </div>

            {/* Clickable Preset Spots on Map */}
            {filteredHotspots.slice(0, 8).map((spot, idx) => {
              const latPercent = ((-spot.lat - 12.025) / 0.070) * 100;
              const lngPercent = ((spot.lng - (-75.260)) / 0.075) * 100;
              const isSelected = selectedPoint.address === spot.address;

              return (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectHotspot(spot);
                  }}
                  style={{
                    left: `${Math.max(8, Math.min(92, lngPercent))}%`,
                    top: `${Math.max(8, Math.min(92, latPercent))}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-1 rounded-full transition-transform hover:scale-125 z-10 ${
                    isSelected ? 'ring-2 ring-white scale-110' : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-black flex items-center justify-center text-[8px] font-black text-black shadow-lg">
                    •
                  </div>
                </button>
              );
            })}

            {/* Interactive Dropped Pin (Punto A / B) */}
            <motion.div
              animate={{ x: '-50%', y: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
              className="absolute z-30 pointer-events-none flex flex-col items-center"
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-2xl border-2 border-white ${
                  pointType === 'pickup'
                    ? 'bg-zipp-red shadow-[0_0_25px_rgba(227,30,36,0.9)]'
                    : 'bg-green-500 shadow-[0_0_25px_rgba(34,197,94,0.9)]'
                }`}
              >
                {pointType === 'pickup' ? 'A' : 'B'}
              </div>
              <div className="w-2 h-2 rounded-full bg-white shadow-md -mt-1" />
              <div className="w-1 h-3 bg-white/70" />
            </motion.div>
          </div>

          {/* Hint Overlay */}
          <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-[10px] text-gray-300 pointer-events-none flex items-center gap-1.5">
            <Compass size={12} className="text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            Toca cualquier punto para mover el pin
          </div>
        </div>

        {/* Selected Location Bottom Card & Confirmation */}
        <div className="p-4 bg-zipp-surface border-t border-zipp-border space-y-3">
          <div className="bg-zipp-surface-2 border border-zipp-border rounded-2xl p-3.5 flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-white shrink-0 mt-0.5 ${
                pointType === 'pickup' ? 'bg-zipp-red' : 'bg-green-500'
              }`}
            >
              <MapPin size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-zipp-red">
                  {selectedPoint.district}
                </span>
                <span className="text-[10px] text-zipp-text-muted">• Huancayo</span>
              </div>
              <div className="font-bold text-xs text-zipp-text truncate">{selectedPoint.address}</div>
              {selectedPoint.reference && (
                <div className="text-[11px] text-zipp-text-muted truncate">{selectedPoint.reference}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onClose}
              className="py-3 rounded-2xl bg-zipp-surface-2 border border-zipp-border text-zipp-text-muted hover:text-zipp-text font-bold text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onSelectLocation(selectedPoint);
                onClose();
              }}
              className={`py-3 rounded-2xl text-white font-display font-black text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all ${
                pointType === 'pickup'
                  ? 'bg-zipp-red hover:bg-zipp-red-dark shadow-zipp-red/30'
                  : 'bg-green-500 hover:bg-green-600 shadow-green-500/30'
              }`}
            >
              <Check size={16} /> Confirmar Ubicación
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
