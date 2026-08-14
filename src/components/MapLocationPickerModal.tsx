import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, X, Check, Search, Crosshair, Navigation, Building2, Compass, Zap } from 'lucide-react';
import { LocationPoint, HuancayoDistrict } from '../types';
import { HUANCAYO_HOTSPOTS, reverseGeocodeHuancayo, searchHuancayoLocations } from '../data/huancayoData';
import { coordsToMapPercent, mapPercentToCoords } from './InteractiveRoutePicker';

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
  const defaultSpot = pointType === 'pickup' ? HUANCAYO_HOTSPOTS[1] : HUANCAYO_HOTSPOTS[0];
  const [selectedPoint, setSelectedPoint] = useState<LocationPoint>(
    initialLocation || defaultSpot
  );
  const [pinPos, setPinPos] = useState<{ x: number; y: number }>(() =>
    coordsToMapPercent(selectedPoint.lat, selectedPoint.lng)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsToast, setGpsToast] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialLocation) {
      setSelectedPoint(initialLocation);
      setPinPos(coordsToMapPercent(initialLocation.lat, initialLocation.lng));
    }
  }, [initialLocation]);

  if (!isOpen) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    const coords = mapPercentToCoords(x, y);
    const resolved = reverseGeocodeHuancayo(coords.lat, coords.lng);
    setPinPos({ x, y });
    setSelectedPoint(resolved);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      setIsDragging(false);
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const clickX = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const clickY = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    const coords = mapPercentToCoords(clickX, clickY);
    const resolved = reverseGeocodeHuancayo(coords.lat, coords.lng);
    setPinPos({ x: clickX, y: clickY });
    setSelectedPoint(resolved);
  };

  const handleSelectHotspot = (spot: LocationPoint) => {
    const pct = coordsToMapPercent(spot.lat, spot.lng);
    setPinPos(pct);
    setSelectedPoint(spot);
  };

  const handleUseCurrentGPS = () => {
    setGpsLoading(true);
    setGpsToast(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const accuracy = Math.round(pos.coords.accuracy || 10);

          const isNearHuancayo = lat > -12.5 && lat < -11.5 && lng > -76.0 && lng < -74.8;
          const targetLat = isNearHuancayo ? lat : -12.0683;
          const targetLng = isNearHuancayo ? lng : -75.2100;

          const resolved = reverseGeocodeHuancayo(targetLat, targetLng);
          resolved.reference = isNearHuancayo ? `GPS Celular (±${accuracy}m)` : 'GPS Huancayo Centro';

          const mapPct = coordsToMapPercent(targetLat, targetLng);
          setPinPos(mapPct);
          setSelectedPoint(resolved);
          setGpsLoading(false);
          setGpsToast(`GPS exacto detectado (±${accuracy}m)`);
          setTimeout(() => setGpsToast(null), 3500);
        },
        () => {
          const fallback = HUANCAYO_HOTSPOTS[1];
          handleSelectHotspot(fallback);
          setGpsLoading(false);
          setGpsToast('GPS centrado en Plaza Constitución');
          setTimeout(() => setGpsToast(null), 3500);
        },
        { enableHighAccuracy: true, timeout: 7000 }
      );
    } else {
      const fallback = HUANCAYO_HOTSPOTS[1];
      handleSelectHotspot(fallback);
      setGpsLoading(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-lg bg-zipp-surface border-2 border-zipp-border rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-zipp-border flex items-center justify-between bg-zipp-surface">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-white shadow-md ${
                pointType === 'pickup' ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-zipp-red shadow-zipp-red/30'
              }`}
            >
              {pointType === 'pickup' ? 'A' : 'B'}
            </div>
            <div>
              <h3 className="font-display font-black text-sm text-zipp-text">
                {pointType === 'pickup' ? '🟢 Fijar Punto de Recojo' : '🔴 Fijar Punto de Entrega'}
              </h3>
              <p className="text-[11px] text-zipp-text-muted">Arrastra el pin o toca en el mapa de Huancayo</p>
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
        <div className="p-3 bg-zipp-surface-2 border-b border-zipp-border space-y-2">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-zipp-text-muted" />
            <input
              type="text"
              placeholder="Buscar calle, avenida o lugar en Huancayo..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) {
                  const results = searchHuancayoLocations(e.target.value);
                  if (results.length > 0) {
                    handleSelectHotspot(results[0]);
                  }
                }
              }}
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

          {/* Quick GPS & District Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-none text-[11px]">
            <button
              onClick={handleUseCurrentGPS}
              disabled={gpsLoading}
              className="shrink-0 flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg font-bold"
            >
              <Crosshair size={12} className={gpsLoading ? "animate-spin" : ""} />
              {gpsLoading ? 'Localizando...' : 'Mi GPS'}
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
          </div>
        </div>

        {/* GPS Toast */}
        {gpsToast && (
          <div className="p-2 bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
            {gpsToast}
          </div>
        )}

        {/* Interactive Map Canvas Container */}
        <div
          ref={mapContainerRef}
          onClick={handleMapClick}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative flex-1 min-h-[300px] bg-[#0A0F0D] overflow-hidden cursor-crosshair group select-none touch-none"
        >
          {/* SVG Roads and City Plan of Huancayo */}
          <svg className="w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="modalGrid" width="35" height="35" patternUnits="userSpaceOnUse">
                <path d="M 35 0 L 0 0 0 35" fill="none" stroke="#2D4032" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#modalGrid)" />

            {/* Major Arteries */}
            <path d="M 5 95 Q 45 55 95 5" fill="none" stroke="#E31E24" strokeWidth="5" strokeOpacity="0.5" />
            <path d="M 15 95 Q 52 50 88 5" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.3" strokeDasharray="5 3" />
            <path d="M 10 50 L 90 55" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.3" />
            <path d="M 20 35 L 85 40" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.25" />
          </svg>

          {/* Landmarks / Labels on map */}
          <div className="absolute top-4 left-6 pointer-events-none text-[10px] font-black text-emerald-400/90 uppercase tracking-wider bg-black/70 px-2 py-0.5 rounded border border-emerald-500/20">
            El Tambo (Norte)
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-[10px] font-black text-amber-400/90 uppercase tracking-wider bg-black/70 px-2 py-0.5 rounded border border-amber-500/20">
            Huancayo Centro
          </div>
          <div className="absolute bottom-4 right-6 pointer-events-none text-[10px] font-black text-rose-400/90 uppercase tracking-wider bg-black/70 px-2 py-0.5 rounded border border-rose-500/20">
            Chilca (Sur)
          </div>

          {/* Interactive Dropped Pin (🟢 Punto A / 🔴 Punto B) */}
          <div
            onPointerDown={handlePointerDown}
            style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
            className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
          >
            <div className="relative group">
              <div
                className={`absolute -inset-2 rounded-full animate-ping pointer-events-none ${
                  pointType === 'pickup' ? 'bg-emerald-500/30' : 'bg-zipp-red/30'
                }`}
              />

              <motion.div
                animate={isDragging ? { scale: 1.25, y: -6 } : { scale: 1, y: 0 }}
                className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-display font-black text-sm shadow-2xl border-2 border-white ${
                  pointType === 'pickup'
                    ? 'bg-emerald-500 shadow-[0_0_25px_rgba(34,197,94,0.9)]'
                    : 'bg-zipp-red shadow-[0_0_25px_rgba(227,30,36,0.9)]'
                }`}
              >
                {pointType === 'pickup' ? 'A' : 'B'}
              </motion.div>

              <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 border border-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg shadow-xl pointer-events-none">
                {pointType === 'pickup' ? '🟢 Punto de Recojo' : '🔴 Punto de Entrega'}
              </div>
            </div>
          </div>

          {/* Bottom Hint */}
          <div className="absolute bottom-3 left-3 bg-black/85 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-[10px] text-gray-300 pointer-events-none flex items-center gap-1.5">
            <Compass size={12} className="text-amber-400" />
            <span>Arrastra el pin con el dedo o toca el mapa</span>
          </div>
        </div>

        {/* Selected Location Bottom Card & Confirmation */}
        <div className="p-4 bg-zipp-surface border-t border-zipp-border space-y-3">
          <div className="bg-zipp-surface-2 border border-zipp-border rounded-2xl p-3.5 flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-white shrink-0 mt-0.5 ${
                pointType === 'pickup' ? 'bg-emerald-500' : 'bg-zipp-red'
              }`}
            >
              <MapPin size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider ${
                    pointType === 'pickup' ? 'text-emerald-500' : 'text-zipp-red'
                  }`}
                >
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
                  ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
                  : 'bg-zipp-red hover:bg-zipp-red-dark shadow-zipp-red/30'
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
