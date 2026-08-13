import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, X, MapPin, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { HuancayoDistrict, PackageSize } from '../types';
import { calculateDeliveryRate } from '../data/huancayoData';

interface PriceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PriceCalculatorModal: React.FC<PriceCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [fromDistrict, setFromDistrict] = useState<HuancayoDistrict>('Huancayo Centro');
  const [toDistrict, setToDistrict] = useState<HuancayoDistrict>('El Tambo');
  const [packageSize, setPackageSize] = useState<PackageSize>('small');

  const districts: HuancayoDistrict[] = [
    'Huancayo Centro',
    'El Tambo',
    'Chilca',
    'San Carlos',
    'Pilcomayo',
    'Huancán',
    'Sapallanga',
    'San Jerónimo',
    'Cajas',
  ];

  const rate = calculateDeliveryRate(fromDistrict, toDistrict, packageSize);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-zipp-surface border-2 border-zipp-red/40 rounded-3xl p-6 shadow-2xl space-y-5 relative"
      >
        <div className="flex items-center justify-between pb-3 border-b border-zipp-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-zipp-red text-white flex items-center justify-center font-black shadow-md shadow-zipp-red/30">
              <Calculator size={20} />
            </div>
            <div>
              <h3 className="font-display font-black text-base text-zipp-text">Tarifario Huancayo en Moto</h3>
              <p className="text-[11px] text-zipp-text-muted">Precios transparentes y sin tarifas dinámicas abusivas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zipp-surface-2 flex items-center justify-center text-zipp-text-muted hover:text-zipp-text"
          >
            <X size={16} />
          </button>
        </div>

        {/* From & To Selectors */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-zipp-text-muted block mb-1">
              📍 Origen (Distrito en Huancayo)
            </label>
            <select
              value={fromDistrict}
              onChange={(e) => setFromDistrict(e.target.value as HuancayoDistrict)}
              className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl p-3 text-zipp-text font-medium focus:outline-none focus:border-zipp-red"
            >
              {districts.map((d) => (
                <option key={d} value={d} className="bg-zipp-surface text-zipp-text">
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-zipp-text-muted block mb-1">
              🏁 Destino (Distrito en Huancayo)
            </label>
            <select
              value={toDistrict}
              onChange={(e) => setToDistrict(e.target.value as HuancayoDistrict)}
              className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl p-3 text-zipp-text font-medium focus:outline-none focus:border-zipp-red"
            >
              {districts.map((d) => (
                <option key={d} value={d} className="bg-zipp-surface text-zipp-text">
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Package size */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-zipp-text-muted block">
            Tipo de Carga en Moto
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: 'envelope', label: '📄 Sobre / Llaves' },
                { id: 'small', label: '📦 Paquete Chico (3kg)' },
                { id: 'medium', label: '🎒 Mediano (8kg)' },
                { id: 'heavy', label: '🧰 Bulto con Parrilla' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPackageSize(p.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  packageSize === p.id
                    ? 'bg-zipp-red text-white border-zipp-red shadow-sm'
                    : 'bg-zipp-surface-2 text-zipp-text-muted border-zipp-border hover:text-zipp-text'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calculated Result Card */}
        <div className="bg-gradient-to-r from-zipp-red/15 via-amber-500/10 to-transparent border border-zipp-red/30 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[10px] font-bold text-zipp-text-muted uppercase">Precio Estimado</div>
            <div className="font-display font-black text-3xl text-amber-500 dark:text-zipp-yellow">
              S/ {rate.price.toFixed(2)}
            </div>
            <div className="text-[10px] text-green-600 dark:text-green-400 font-bold">Sin sorpresas al pagar</div>
          </div>

          <div className="text-right text-xs space-y-1">
            <div className="text-zipp-text font-bold">{rate.distanceKm} km aprox.</div>
            <div className="text-zipp-text-muted flex items-center gap-1 justify-end">
              <Zap size={12} className="text-amber-500" /> ~{rate.estMin} min en moto
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-zipp-red text-white font-display font-black text-xs hover:brightness-110 shadow-lg shadow-zipp-red/30"
        >
          Entendido
        </button>
      </motion.div>
    </div>
  );
};
