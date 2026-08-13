import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Map, Crosshair, X, Check, Building2, Navigation } from 'lucide-react';
import { LocationPoint, HuancayoDistrict } from '../types';
import { searchHuancayoLocations, guessDistrictFromText, HUANCAYO_HOTSPOTS } from '../data/huancayoData';
import { MapLocationPickerModal } from './MapLocationPickerModal';

interface LocationSearchInputProps {
  label: string;
  placeholder?: string;
  pointType?: 'pickup' | 'destination';
  selectedLocation: LocationPoint | null;
  onLocationChange: (location: LocationPoint | null) => void;
  required?: boolean;
}

export const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  label,
  placeholder = 'Buscar calle, avenida o lugar en Huancayo...',
  pointType = 'pickup',
  selectedLocation,
  onLocationChange,
  required = false,
}) => {
  const [query, setQuery] = useState<string>(selectedLocation ? selectedLocation.address : '');
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<LocationPoint[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync if external selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      setQuery(selectedLocation.address);
    }
  }, [selectedLocation]);

  // Handle typing & dynamic suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpenDropdown(true);

    if (val.trim()) {
      const results = searchHuancayoLocations(val);
      setSuggestions(results);
      // Also update location object dynamically so free-form typing works immediately
      const guessed = guessDistrictFromText(val);
      onLocationChange({
        address: val,
        district: guessed,
        reference: 'Ingresado manualmente',
        lat: -12.0683,
        lng: -75.2100,
      });
    } else {
      setSuggestions(HUANCAYO_HOTSPOTS.slice(0, 6));
      onLocationChange(null);
    }
  };

  const handleSelectSuggestion = (point: LocationPoint) => {
    setQuery(point.address);
    onLocationChange(point);
    setIsOpenDropdown(false);
  };

  const handleClear = () => {
    setQuery('');
    onLocationChange(null);
    setSuggestions(HUANCAYO_HOTSPOTS.slice(0, 6));
    setIsOpenDropdown(false);
  };

  const handleUseGPS = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: LocationPoint = {
            address: 'Mi ubicación GPS actual (Huancayo)',
            district: 'Huancayo Centro',
            reference: `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setQuery(loc.address);
          onLocationChange(loc);
          setIsOpenDropdown(false);
        },
        () => {
          // Fallback
          const fallback = HUANCAYO_HOTSPOTS[1];
          setQuery(fallback.address);
          onLocationChange(fallback);
          setIsOpenDropdown(false);
        }
      );
    } else {
      const fallback = HUANCAYO_HOTSPOTS[1];
      setQuery(fallback.address);
      onLocationChange(fallback);
      setIsOpenDropdown(false);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpenDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      {/* Label and GPS action */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-zipp-text flex items-center gap-2">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
              pointType === 'pickup' ? 'bg-zipp-red shadow-sm' : 'bg-green-500 shadow-sm'
            }`}
          >
            {pointType === 'pickup' ? 'A' : 'B'}
          </div>
          {label}
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUseGPS}
            className="text-[11px] font-bold text-amber-500 dark:text-amber-400 hover:underline flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20"
          >
            <Crosshair size={12} /> Mi GPS
          </button>
          <button
            type="button"
            onClick={() => setIsMapModalOpen(true)}
            className="text-[11px] font-bold text-zipp-red hover:underline flex items-center gap-1 bg-zipp-red/10 px-2 py-0.5 rounded-lg border border-zipp-red/20"
          >
            <Map size={12} /> En el Mapa
          </button>
        </div>
      </div>

      {/* Main Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 pointer-events-none text-zipp-text-muted">
          <Search size={16} />
        </div>

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (!query) setSuggestions(HUANCAYO_HOTSPOTS.slice(0, 6));
            setIsOpenDropdown(true);
          }}
          placeholder={placeholder}
          required={required}
          className="w-full bg-zipp-surface-2 border border-zipp-border rounded-2xl pl-10 pr-24 py-3.5 text-xs text-zipp-text placeholder:text-zipp-text-muted focus:outline-none focus:border-zipp-red focus:ring-1 focus:ring-zipp-red font-medium transition-all"
        />

        {/* Right action icons (Clear X + Open Map) */}
        <div className="absolute right-2.5 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-xl text-zipp-text-muted hover:text-zipp-text hover:bg-zipp-surface transition-colors"
              title="Limpiar"
            >
              <X size={14} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsMapModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-zipp-surface text-zipp-text-muted hover:text-zipp-text hover:border-zipp-red border border-zipp-border flex items-center gap-1 text-[10px] font-bold shadow-xs transition-colors"
            title="Elegir en el mapa"
          >
            <Map size={12} className="text-zipp-red" />
            <span>Mapa</span>
          </button>
        </div>
      </div>

      {/* Selected Location Pill Confirmation */}
      {selectedLocation && query && (
        <div className="flex items-center justify-between bg-zipp-surface-2/60 border border-zipp-border rounded-xl px-3 py-1.5 text-[11px]">
          <div className="flex items-center gap-1.5 truncate">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                pointType === 'pickup' ? 'bg-zipp-red' : 'bg-green-500'
              }`}
            />
            <span className="font-bold text-zipp-text truncate">{selectedLocation.district}:</span>
            <span className="text-zipp-text-muted truncate">{selectedLocation.address}</span>
          </div>
          <span className="text-[10px] font-mono text-amber-500 shrink-0 ml-2 font-bold">
            {selectedLocation.district}
          </span>
        </div>
      )}

      {/* Autocomplete Suggestions Dropdown */}
      {isOpenDropdown && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-zipp-surface border border-zipp-border rounded-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
          <div className="p-2 border-b border-zipp-border flex items-center justify-between bg-zipp-surface-2/70 text-[10px] font-bold uppercase tracking-wider text-zipp-text-muted">
            <span>{query ? 'Lugares encontrados en Huancayo' : 'Lugares frecuentes en Huancayo'}</span>
            <button
              type="button"
              onClick={() => setIsMapModalOpen(true)}
              className="text-zipp-red hover:underline flex items-center gap-1 lowercase"
            >
              <Map size={10} /> abrir mapa interactivo
            </button>
          </div>

          <div className="divide-y divide-zipp-border">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full text-left p-3 hover:bg-zipp-surface-2 flex items-start gap-3 transition-colors group"
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    pointType === 'pickup'
                      ? 'bg-zipp-red/10 text-zipp-red group-hover:bg-zipp-red group-hover:text-white'
                      : 'bg-green-500/10 text-green-600 group-hover:bg-green-500 group-hover:text-white'
                  } transition-colors`}
                >
                  <MapPin size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold bg-zipp-surface-2 px-1.5 py-0.5 rounded text-zipp-text-muted border border-zipp-border">
                      {item.district}
                    </span>
                    {item.reference && (
                      <span className="text-[10px] text-zipp-text-muted truncate">• {item.reference}</span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-zipp-text group-hover:text-zipp-red transition-colors truncate mt-0.5">
                    {item.address}
                  </div>
                </div>
              </button>
            ))}

            {query.trim() && (
              <button
                type="button"
                onClick={() => {
                  const customPoint: LocationPoint = {
                    address: query,
                    district: guessDistrictFromText(query),
                    reference: 'Dirección personalizada',
                    lat: -12.0683,
                    lng: -75.2100,
                  };
                  handleSelectSuggestion(customPoint);
                }}
                className="w-full text-left p-3 bg-amber-500/5 hover:bg-amber-500/10 flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400"
              >
                <Check size={14} />
                <span>Usar dirección exacta: "{query}"</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Interactive Map Picker Modal */}
      <MapLocationPickerModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        pointType={pointType}
        title={pointType === 'pickup' ? 'Punto de Recojo en Huancayo' : 'Punto de Entrega en Huancayo'}
        initialLocation={selectedLocation}
        onSelectLocation={(loc) => {
          setQuery(loc.address);
          onLocationChange(loc);
          setIsOpenDropdown(false);
        }}
      />
    </div>
  );
};
