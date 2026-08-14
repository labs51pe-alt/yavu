import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crosshair, 
  MapPin, 
  Navigation, 
  Zap, 
  ArrowRight, 
  ArrowDownUp, 
  Search, 
  Check, 
  X, 
  Sparkles, 
  Compass, 
  Info,
  ShieldCheck,
  Building2,
  Clock,
  CircleDot
} from 'lucide-react';
import { LocationPoint, HuancayoDistrict, PackageSize } from '../types';
import { 
  HUANCAYO_HOTSPOTS, 
  reverseGeocodeHuancayo, 
  searchHuancayoLocations, 
  guessDistrictFromText,
  calculateDeliveryRate
} from '../data/huancayoData';

// Map Coordinate conversion for Huancayo urban polygon
export function coordsToMapPercent(lat: number, lng: number): { x: number; y: number } {
  const minLat = -12.105;
  const maxLat = -12.020;
  const minLng = -75.265;
  const maxLng = -75.185;

  const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
  const x = ((lng - minLng) / (maxLng - minLng)) * 100;

  return {
    x: Math.max(5, Math.min(95, x)),
    y: Math.max(5, Math.min(95, y)),
  };
}

export function mapPercentToCoords(x: number, y: number): { lat: number; lng: number } {
  const minLat = -12.105;
  const maxLat = -12.020;
  const minLng = -75.265;
  const maxLng = -75.185;

  const lat = maxLat - (y / 100) * (maxLat - minLat);
  const lng = minLng + (x / 100) * (maxLng - minLng);

  return { lat, lng };
}

export function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;
  // Road factor for Huancayo streets & traffic
  const roadKm = Math.max(0.6, straightKm * 1.28);
  return Math.round(roadKm * 10) / 10;
}

export function calculateRoutePrice(distanceKm: number, packageSize: PackageSize = 'small'): {
  baseFee: number;
  kmFee: number;
  totalPrice: number;
  estimatedMinutes: number;
} {
  const baseFee = 4.0; // primeros 1.5 km
  const extraKm = Math.max(0, distanceKm - 1.5);
  let kmFee = extraKm * 1.2;

  if (packageSize === 'envelope') kmFee = Math.max(0, kmFee - 0.5);
  if (packageSize === 'medium') kmFee += 2.0;
  if (packageSize === 'heavy') kmFee += 4.0;

  const totalPrice = Math.round((baseFee + kmFee) * 2) / 2; // redondear a 0.50
  const estimatedMinutes = Math.max(7, Math.round(4 + distanceKm * 2.3));

  return {
    baseFee,
    kmFee: Math.round(kmFee * 10) / 10,
    totalPrice: Math.max(4.5, totalPrice),
    estimatedMinutes,
  };
}

interface InteractiveRoutePickerProps {
  pickupLocation: LocationPoint | null;
  destinationLocation: LocationPoint | null;
  onChangePickup: (loc: LocationPoint) => void;
  onChangeDestination: (loc: LocationPoint) => void;
  packageSize?: PackageSize;
  showPricingCard?: boolean;
  compact?: boolean;
  onPriceChange?: (price: number, distanceKm: number, estMin: number) => void;
}

export const InteractiveRoutePicker: React.FC<InteractiveRoutePickerProps> = ({
  pickupLocation,
  destinationLocation,
  onChangePickup,
  onChangeDestination,
  packageSize = 'small',
  showPricingCard = true,
  compact = false,
  onPriceChange,
}) => {
  // Default fallback points if null
  const defaultPickup = HUANCAYO_HOTSPOTS[1]; // Plaza Constitución
  const defaultDest = HUANCAYO_HOTSPOTS[0]; // Real Plaza

  const currentPickup = pickupLocation || defaultPickup;
  const currentDest = destinationLocation || defaultDest;

  // Pin positions in percentage (0 to 100)
  const [pickupPos, setPickupPos] = useState<{ x: number; y: number }>(() =>
    coordsToMapPercent(currentPickup.lat, currentPickup.lng)
  );
  const [destPos, setDestPos] = useState<{ x: number; y: number }>(() =>
    coordsToMapPercent(currentDest.lat, currentDest.lng)
  );

  // Active pin selected for single click placement
  const [activePin, setActivePin] = useState<'pickup' | 'destination'>('pickup');
  const [isDragging, setIsDragging] = useState<'pickup' | 'destination' | null>(null);

  // Search input queries
  const [pickupQuery, setPickupQuery] = useState(currentPickup.address);
  const [destQuery, setDestQuery] = useState(currentDest.address);

  const [isSearchingPickup, setIsSearchingPickup] = useState(false);
  const [isSearchingDest, setIsSearchingDest] = useState(false);

  // GPS state
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Calculate live distance & price
  const distanceKm = calculateHaversineDistanceKm(
    currentPickup.lat,
    currentPickup.lng,
    currentDest.lat,
    currentDest.lng
  );

  const priceCalc = calculateRoutePrice(distanceKm, packageSize);

  useEffect(() => {
    if (onPriceChange) {
      onPriceChange(priceCalc.totalPrice, distanceKm, priceCalc.estimatedMinutes);
    }
  }, [distanceKm, priceCalc.totalPrice, priceCalc.estimatedMinutes, onPriceChange]);

  // Sync when external locations update
  useEffect(() => {
    if (pickupLocation) {
      setPickupPos(coordsToMapPercent(pickupLocation.lat, pickupLocation.lng));
      setPickupQuery(pickupLocation.address);
    }
  }, [pickupLocation]);

  useEffect(() => {
    if (destinationLocation) {
      setDestPos(coordsToMapPercent(destinationLocation.lat, destinationLocation.lng));
      setDestQuery(destinationLocation.address);
    }
  }, [destinationLocation]);

  // Handle Drag & Pointer interaction on Map Canvas
  const handlePointerDown = (type: 'pickup' | 'destination', e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(type);
    setActivePin(type);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !mapContainerRef.current) return;

    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = Math.max(4, Math.min(96, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(4, Math.min(96, ((e.clientY - rect.top) / rect.height) * 100));

    const coords = mapPercentToCoords(x, y);
    const resolved = reverseGeocodeHuancayo(coords.lat, coords.lng);

    if (isDragging === 'pickup') {
      setPickupPos({ x, y });
      setPickupQuery(resolved.address);
      onChangePickup(resolved);
    } else {
      setDestPos({ x, y });
      setDestQuery(resolved.address);
      onChangeDestination(resolved);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      setIsDragging(null);
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !mapContainerRef.current) return;

    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = Math.max(4, Math.min(96, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(4, Math.min(96, ((e.clientY - rect.top) / rect.height) * 100));

    const coords = mapPercentToCoords(x, y);
    const resolved = reverseGeocodeHuancayo(coords.lat, coords.lng);

    if (activePin === 'pickup') {
      setPickupPos({ x, y });
      setPickupQuery(resolved.address);
      onChangePickup(resolved);
      setActivePin('destination'); // automatically switch to dropoff for faster flow
    } else {
      setDestPos({ x, y });
      setDestQuery(resolved.address);
      onChangeDestination(resolved);
    }
  };

  // 1-Touch GPS Handler
  const handleUseExactGPS = () => {
    setGpsLoading(true);
    setGpsMessage(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const accuracy = Math.round(pos.coords.accuracy || 10);

          // Check if coordinates are in or near Junin / Huancayo, else center in Huancayo
          const isNearHuancayo = lat > -12.5 && lat < -11.5 && lng > -76.0 && lng < -74.8;
          const targetLat = isNearHuancayo ? lat : -12.0683;
          const targetLng = isNearHuancayo ? lng : -75.2100;

          const resolved = reverseGeocodeHuancayo(targetLat, targetLng);
          resolved.reference = isNearHuancayo ? `GPS Celular (±${accuracy}m)` : 'GPS Huancayo Centro';

          const mapPct = coordsToMapPercent(targetLat, targetLng);
          setPickupPos(mapPct);
          setPickupQuery(resolved.address);
          onChangePickup(resolved);

          setGpsLoading(false);
          setGpsMessage(`Ubicación GPS fijada en Punto de Recojo 🟢 (±${accuracy}m)`);
          setTimeout(() => setGpsMessage(null), 4000);
        },
        (err) => {
          // Fallback to Plaza Constitución
          const fallback = HUANCAYO_HOTSPOTS[1];
          const mapPct = coordsToMapPercent(fallback.lat, fallback.lng);
          setPickupPos(mapPct);
          setPickupQuery(fallback.address);
          onChangePickup(fallback);
          setGpsLoading(false);
          setGpsMessage('GPS no disponible. Se centró en Plaza Constitución 🟢');
          setTimeout(() => setGpsMessage(null), 4000);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      const fallback = HUANCAYO_HOTSPOTS[1];
      const mapPct = coordsToMapPercent(fallback.lat, fallback.lng);
      setPickupPos(mapPct);
      setPickupQuery(fallback.address);
      onChangePickup(fallback);
      setGpsLoading(false);
      setGpsMessage('Geolocalización no soportada. Se centró en Huancayo Centro.');
      setTimeout(() => setGpsMessage(null), 4000);
    }
  };

  // Swap Origin and Destination
  const handleSwapLocations = () => {
    const tempLoc = currentPickup;
    const tempPos = pickupPos;
    const tempQuery = pickupQuery;

    setPickupPos(destPos);
    setPickupQuery(destQuery);
    onChangePickup(currentDest);

    setDestPos(tempPos);
    setDestQuery(tempQuery);
    onChangeDestination(tempLoc);
  };

  // Quick Autocomplete search selections
  const handleSelectHotspot = (type: 'pickup' | 'destination', spot: LocationPoint) => {
    const pct = coordsToMapPercent(spot.lat, spot.lng);
    if (type === 'pickup') {
      setPickupPos(pct);
      setPickupQuery(spot.address);
      onChangePickup(spot);
      setIsSearchingPickup(false);
    } else {
      setDestPos(pct);
      setDestQuery(spot.address);
      onChangeDestination(spot);
      setIsSearchingDest(false);
    }
  };

  return (
    <div className="space-y-4 select-none">
      {/* 1. TOP INTERACTIVE ADDRESS BAR & 1-TOUCH GPS */}
      <div className="bg-zipp-surface border-2 border-zipp-border rounded-3xl p-4 shadow-md space-y-3">
        {/* Header & Quick GPS Action */}
        <div className="flex items-center justify-between pb-2 border-b border-zipp-border">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-display font-black text-zipp-text tracking-wide">
              Ruta Interactiva Huancayo
            </span>
          </div>

          {/* GPS 1-Touch Button */}
          <button
            type="button"
            onClick={handleUseExactGPS}
            disabled={gpsLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 hover:from-emerald-500/30 hover:to-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-display font-black text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Crosshair size={14} className={gpsLoading ? "animate-spin text-emerald-500" : "text-emerald-500"} />
            <span>{gpsLoading ? 'Detectando GPS...' : 'Mi GPS en 1 toque'}</span>
          </button>
        </div>

        {/* GPS Success / Notice Feedback Toast */}
        {gpsMessage && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Check size={14} className="shrink-0" />
              <span>{gpsMessage}</span>
            </div>
            <button onClick={() => setGpsMessage(null)} className="text-emerald-400 hover:text-emerald-300">
              <X size={13} />
            </button>
          </motion.div>
        )}

        {/* Dual Input Fields (🟢 Recojo & 🔴 Entrega) with Swap Button */}
        <div className="relative space-y-2.5">
          {/* 🟢 Punto de Recojo Input */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-zipp-surface-2 border-2 border-emerald-500/30 focus-within:border-emerald-500 rounded-2xl px-3 py-2.5 transition-all shadow-inner">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-md shadow-emerald-500/30 shrink-0">
                A
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    🟢 Punto de Recojo
                  </span>
                  <span className="text-[10px] font-bold text-zipp-text-muted">
                    {currentPickup.district}
                  </span>
                </div>
                <input
                  type="text"
                  value={pickupQuery}
                  onFocus={() => setIsSearchingPickup(true)}
                  onChange={(e) => {
                    setPickupQuery(e.target.value);
                    setIsSearchingPickup(true);
                    if (e.target.value.trim()) {
                      const district = guessDistrictFromText(e.target.value);
                      onChangePickup({
                        address: e.target.value,
                        district,
                        reference: 'Ingresado por usuario',
                        lat: currentPickup.lat,
                        lng: currentPickup.lng,
                      });
                    }
                  }}
                  placeholder="Escribe dirección de recojo o arrastra el pin verde..."
                  className="w-full bg-transparent text-xs font-bold text-zipp-text placeholder:text-zipp-text-muted/60 focus:outline-none truncate mt-0.5"
                />
              </div>
              {pickupQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setPickupQuery('');
                    setIsSearchingPickup(true);
                  }}
                  className="text-zipp-text-muted hover:text-zipp-text p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Pickup Suggestions Dropdown */}
            <AnimatePresence>
              {isSearchingPickup && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-zipp-surface border border-zipp-border rounded-2xl shadow-xl p-2 max-h-48 overflow-y-auto space-y-1 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between px-2 py-1 text-[10px] font-black uppercase text-zipp-text-muted border-b border-zipp-border/50">
                    <span>Lugares sugeridos en Huancayo</span>
                    <button
                      type="button"
                      onClick={() => setIsSearchingPickup(false)}
                      className="text-zipp-red hover:underline"
                    >
                      Cerrar
                    </button>
                  </div>
                  {searchHuancayoLocations(pickupQuery).slice(0, 6).map((spot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectHotspot('pickup', spot)}
                      className="w-full text-left p-2 rounded-xl hover:bg-emerald-500/10 text-xs flex items-start gap-2 text-zipp-text transition-colors"
                    >
                      <MapPin size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold truncate text-zipp-text">{spot.address}</div>
                        <div className="text-[10px] text-zipp-text-muted flex items-center gap-1.5">
                          <span className="font-bold text-emerald-500">{spot.district}</span>
                          {spot.reference && <span>· {spot.reference}</span>}
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Middle Swap Button */}
          <div className="absolute right-4 top-[50%] -translate-y-[50%] z-20">
            <button
              type="button"
              onClick={handleSwapLocations}
              title="Invertir Origen y Destino"
              className="w-8 h-8 rounded-full bg-zipp-surface border-2 border-zipp-border hover:border-zipp-red text-zipp-text hover:text-zipp-red flex items-center justify-center shadow-lg transition-transform active:scale-90"
            >
              <ArrowDownUp size={14} />
            </button>
          </div>

          {/* 🔴 Punto de Entrega Input */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-zipp-surface-2 border-2 border-zipp-red/30 focus-within:border-zipp-red rounded-2xl px-3 py-2.5 transition-all shadow-inner">
              <div className="w-6 h-6 rounded-full bg-zipp-red text-white flex items-center justify-center font-black text-xs shadow-md shadow-zipp-red/30 shrink-0">
                B
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zipp-red">
                    🔴 Punto de Entrega
                  </span>
                  <span className="text-[10px] font-bold text-zipp-text-muted">
                    {currentDest.district}
                  </span>
                </div>
                <input
                  type="text"
                  value={destQuery}
                  onFocus={() => setIsSearchingDest(true)}
                  onChange={(e) => {
                    setDestQuery(e.target.value);
                    setIsSearchingDest(true);
                    if (e.target.value.trim()) {
                      const district = guessDistrictFromText(e.target.value);
                      onChangeDestination({
                        address: e.target.value,
                        district,
                        reference: 'Ingresado por usuario',
                        lat: currentDest.lat,
                        lng: currentDest.lng,
                      });
                    }
                  }}
                  placeholder="Escribe dirección de destino o arrastra el pin rojo..."
                  className="w-full bg-transparent text-xs font-bold text-zipp-text placeholder:text-zipp-text-muted/60 focus:outline-none truncate mt-0.5"
                />
              </div>
              {destQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setDestQuery('');
                    setIsSearchingDest(true);
                  }}
                  className="text-zipp-text-muted hover:text-zipp-text p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Destination Suggestions Dropdown */}
            <AnimatePresence>
              {isSearchingDest && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-zipp-surface border border-zipp-border rounded-2xl shadow-xl p-2 max-h-48 overflow-y-auto space-y-1 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between px-2 py-1 text-[10px] font-black uppercase text-zipp-text-muted border-b border-zipp-border/50">
                    <span>Destinos sugeridos en Huancayo</span>
                    <button
                      type="button"
                      onClick={() => setIsSearchingDest(false)}
                      className="text-zipp-red hover:underline"
                    >
                      Cerrar
                    </button>
                  </div>
                  {searchHuancayoLocations(destQuery).slice(0, 6).map((spot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectHotspot('destination', spot)}
                      className="w-full text-left p-2 rounded-xl hover:bg-zipp-red/10 text-xs flex items-start gap-2 text-zipp-text transition-colors"
                    >
                      <MapPin size={14} className="text-zipp-red shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold truncate text-zipp-text">{spot.address}</div>
                        <div className="text-[10px] text-zipp-text-muted flex items-center gap-1.5">
                          <span className="font-bold text-zipp-red">{spot.district}</span>
                          {spot.reference && <span>· {spot.reference}</span>}
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Pin Selectors & Interaction Helper Bar */}
        <div className="flex items-center justify-between pt-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-zipp-text-muted text-[10px] font-bold">Fijar al tocar mapa:</span>
            <button
              type="button"
              onClick={() => setActivePin('pickup')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all border ${
                activePin === 'pickup'
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm'
                  : 'bg-zipp-surface-2 text-zipp-text-muted border-zipp-border hover:text-zipp-text'
              }`}
            >
              🟢 Recojo (A)
            </button>
            <button
              type="button"
              onClick={() => setActivePin('destination')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all border ${
                activePin === 'destination'
                  ? 'bg-zipp-red text-white border-zipp-red shadow-sm'
                  : 'bg-zipp-surface-2 text-zipp-text-muted border-zipp-border hover:text-zipp-text'
              }`}
            >
              🔴 Entrega (B)
            </button>
          </div>

          <span className="text-[10px] text-zipp-text-muted font-bold hidden sm:inline-block">
            👆 Arrastra o toca en el mapa
          </span>
        </div>
      </div>

      {/* 2. MAIN INTERACTIVE MAP CANVAS WITH DUAL DRAGGABLE PINS */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-zipp-border bg-[#090E0B] shadow-2xl">
        <div
          ref={mapContainerRef}
          onClick={handleMapClick}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`w-full ${compact ? 'h-[300px]' : 'h-[380px]'} relative cursor-crosshair touch-none select-none`}
        >
          {/* Huancayo City Street Vector Grid */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="urbanGrid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#16251B" strokeWidth="1" />
              </pattern>
              <linearGradient id="liveRouteGradient" x1={`${pickupPos.x}%`} y1={`${pickupPos.y}%`} x2={`${destPos.x}%`} y2={`${destPos.y}%`}>
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#E31E24" />
              </linearGradient>
            </defs>

            {/* Street Background Pattern */}
            <rect width="100%" height="100%" fill="url(#urbanGrid)" />

            {/* Huancayo Major Highways (Calle Real, Av. Ferrocarril, Av. Mariscal Castilla, Av. Huancavelica) */}
            {/* Av. Mariscal Castilla / Calle Real Diagonal */}
            <path d="M 5 95 Q 48 55 95 8" fill="none" stroke="#E31E24" strokeWidth="4.5" strokeOpacity="0.3" />
            <path d="M 5 95 Q 48 55 95 8" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="3 3" />

            {/* Av. Ferrocarril */}
            <path d="M 12 96 Q 52 50 88 5" fill="none" stroke="#FFE234" strokeWidth="3" strokeOpacity="0.25" strokeDasharray="5 5" />

            {/* Transversals (Giráldez, San Carlos, Evitamiento) */}
            <path d="M 0 45 Q 50 48 100 50" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.18" />
            <path d="M 0 68 Q 50 72 100 75" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.15" />
            <path d="M 0 25 Q 50 28 100 30" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.15" />

            {/* Bridge to Pilcomayo / Chupaca */}
            <path d="M 0 52 L 35 55" fill="none" stroke="#3B82F6" strokeWidth="3" strokeOpacity="0.35" />

            {/* REAL-TIME DYNAMIC ROUTE LINE BETWEEN 🟢 (A) AND 🔴 (B) */}
            <path
              d={`M ${pickupPos.x}% ${pickupPos.y}% Q ${(pickupPos.x + destPos.x) / 2 + 6}% ${(pickupPos.y + destPos.y) / 2 - 6}% ${destPos.x}% ${destPos.y}%`}
              fill="none"
              stroke="url(#liveRouteGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="8 6"
              className="animate-[dash_1.2s_linear_infinite]"
            />

            {/* Route Glow Underlay */}
            <path
              d={`M ${pickupPos.x}% ${pickupPos.y}% Q ${(pickupPos.x + destPos.x) / 2 + 6}% ${(pickupPos.y + destPos.y) / 2 - 6}% ${destPos.x}% ${destPos.y}%`}
              fill="none"
              stroke="#22C55E"
              strokeWidth="10"
              strokeOpacity="0.2"
              strokeLinecap="round"
            />
          </svg>

          {/* District Floating Watermarks */}
          <div className="absolute top-3 left-4 pointer-events-none z-10 flex flex-col gap-0.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-black/80 px-2 py-0.5 rounded-full border border-emerald-500/30 backdrop-blur-sm">
              📍 El Tambo (Norte)
            </span>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none z-10">
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 bg-black/80 px-2 py-0.5 rounded-full border border-amber-500/30 backdrop-blur-sm">
              🏛️ Huancayo Centro
            </span>
          </div>

          <div className="absolute bottom-10 left-4 pointer-events-none z-10">
            <span className="text-[9px] font-black uppercase tracking-widest text-zipp-red bg-black/80 px-2 py-0.5 rounded-full border border-zipp-red/30 backdrop-blur-sm">
              🚩 Chilca (Sur)
            </span>
          </div>

          {/* MIDPOINT ROUTE STATS BADGE */}
          <div
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: `${(pickupPos.x + destPos.x) / 2}%`,
              top: `${(pickupPos.y + destPos.y) / 2}%`,
            }}
          >
            <div className="bg-black/90 border border-zipp-border text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap">
              <Navigation size={11} className="text-amber-400 animate-pulse" />
              <span className="text-amber-400 font-extrabold">{distanceKm} km</span>
              <span className="text-zinc-400">·</span>
              <span className="text-emerald-400 font-extrabold">~{priceCalc.estimatedMinutes} min</span>
            </div>
          </div>

          {/* 🟢 PIN 1: PUNTO DE RECOJO (A) - DRAGGABLE */}
          <div
            className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
            style={{ left: `${pickupPos.x}%`, top: `${pickupPos.y}%` }}
            onPointerDown={(e) => handlePointerDown('pickup', e)}
          >
            <div className="relative group">
              {/* Pulsing Radar Ring */}
              <div className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />

              {/* Pin Icon */}
              <motion.div
                animate={isDragging === 'pickup' ? { scale: 1.25, y: -8 } : { scale: 1, y: 0 }}
                className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white font-display font-black text-sm shadow-[0_0_25px_rgba(34,197,94,0.9)]"
              >
                A
              </motion.div>

              {/* Tooltip with Address Label */}
              <div className="absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 border border-emerald-500/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-xl backdrop-blur-md pointer-events-none flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="max-w-[140px] truncate">{currentPickup.address.split(',')[0]}</span>
              </div>
            </div>
          </div>

          {/* 🔴 PIN 2: PUNTO DE ENTREGA (B) - DRAGGABLE */}
          <div
            className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
            style={{ left: `${destPos.x}%`, top: `${destPos.y}%` }}
            onPointerDown={(e) => handlePointerDown('destination', e)}
          >
            <div className="relative group">
              {/* Pulsing Radar Ring */}
              <div className="absolute -inset-2 rounded-full bg-zipp-red/30 animate-ping pointer-events-none" />

              {/* Pin Icon */}
              <motion.div
                animate={isDragging === 'destination' ? { scale: 1.25, y: -8 } : { scale: 1, y: 0 }}
                className="w-10 h-10 rounded-full bg-zipp-red border-2 border-white flex items-center justify-center text-white font-display font-black text-sm shadow-[0_0_25px_rgba(227,30,36,0.9)]"
              >
                B
              </motion.div>

              {/* Tooltip with Address Label */}
              <div className="absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 border border-zipp-red/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-xl backdrop-blur-md pointer-events-none flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-zipp-red" />
                <span className="max-w-[140px] truncate">{currentDest.address.split(',')[0]}</span>
              </div>
            </div>
          </div>

          {/* Bottom Live Drag Indicator Strip */}
          <div className="absolute bottom-3 left-4 right-4 z-20 bg-black/85 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-2xl flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-2">
              <span className="text-xs">🛵</span>
              <span className="font-bold text-[11px]">
                {isDragging ? `Moviendo ${isDragging === 'pickup' ? '🟢 Recojo' : '🔴 Entrega'}...` : 'Arrastra los pines 🟢 🔴 libremente'}
              </span>
            </div>
            <div className="text-[10px] font-bold text-amber-400">
              Tarifa Plana Wanka 🇵🇪
            </div>
          </div>
        </div>
      </div>

      {/* 3. LIVE AUTOMATIC PRICE & ROUTE BREAKDOWN CARD */}
      {showPricingCard && (
        <motion.div
          layout
          className="bg-gradient-to-br from-zipp-surface via-zipp-surface-2 to-zipp-surface border-2 border-zipp-red/30 rounded-3xl p-4 sm:p-5 shadow-lg space-y-3"
        >
          <div className="flex items-center justify-between pb-2 border-b border-zipp-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-zipp-red text-white flex items-center justify-center font-black shadow-md shadow-zipp-red/30">
                <Zap size={16} />
              </div>
              <div>
                <span className="font-display font-black text-sm text-zipp-text block leading-tight">
                  Cálculo Automático en Tiempo Real
                </span>
                <span className="text-[10px] text-zipp-text-muted">
                  {distanceKm} kilómetros calculados con GPS
                </span>
              </div>
            </div>

            {/* Total Price Display */}
            <div className="text-right">
              <div className="text-[9px] font-black uppercase tracking-wider text-zipp-text-muted">
                Total Delivery
              </div>
              <div className="font-display font-black text-2xl text-amber-500 dark:text-zipp-yellow leading-none">
                S/ {priceCalc.totalPrice.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Pricing Formula Breakdown Grid */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-zipp-surface p-2.5 rounded-2xl border border-zipp-border">
              <span className="text-[10px] font-bold text-zipp-text-muted block">Distancia</span>
              <span className="font-display font-black text-zipp-text text-sm">{distanceKm} km</span>
              <span className="text-[9px] text-emerald-500 block font-bold">Ruta exacta</span>
            </div>

            <div className="bg-zipp-surface p-2.5 rounded-2xl border border-zipp-border">
              <span className="text-[10px] font-bold text-zipp-text-muted block">Tiempo en Moto</span>
              <span className="font-display font-black text-amber-500 text-sm">~{priceCalc.estimatedMinutes} min</span>
              <span className="text-[9px] text-zipp-text-muted block font-medium">Tráfico fluido</span>
            </div>

            <div className="bg-zipp-surface p-2.5 rounded-2xl border border-zipp-border">
              <span className="text-[10px] font-bold text-zipp-text-muted block">Fórmula Tarifa</span>
              <span className="font-display font-black text-zipp-red text-xs leading-tight block mt-0.5">
                Base + S/ 1.20/km
              </span>
              <span className="text-[9px] text-emerald-500 block font-bold">Sin sorpresas</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
