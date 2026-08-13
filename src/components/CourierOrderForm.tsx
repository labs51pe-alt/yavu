import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  FileText, 
  Box, 
  Layers, 
  MapPin, 
  Phone, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  QrCode, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  Navigation,
  Clock,
  Map
} from 'lucide-react';
import { LocationPoint, PackageSize, DeliveryOrder, HuancayoDistrict } from '../types';
import { calculateDeliveryRate, MOCK_RIDERS, guessDistrictFromText } from '../data/huancayoData';
import { LocationSearchInput } from './LocationSearchInput';

interface CourierOrderFormProps {
  onOrderCreated: (order: DeliveryOrder) => void;
  onCancel: () => void;
}

export const CourierOrderForm: React.FC<CourierOrderFormProps> = ({ onOrderCreated, onCancel }) => {
  // Empty initial location states so user can search or pick on map directly
  const [pickupLocation, setPickupLocation] = useState<LocationPoint | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<LocationPoint | null>(null);
  
  const [packageSize, setPackageSize] = useState<PackageSize>('small');
  const [isFragile, setIsFragile] = useState(false);
  const [packageDescription, setPackageDescription] = useState('');
  
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'plin' | 'cash'>('yape');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const pickupDistrict = pickupLocation?.district || 'Huancayo Centro';
  const destDistrict = destinationLocation?.district || 'Huancayo Centro';

  const rateInfo = calculateDeliveryRate(
    pickupDistrict,
    destDistrict,
    packageSize
  );

  const packageSizes: { id: PackageSize; label: string; icon: any; maxKg: string; desc: string }[] = [
    { id: 'envelope', label: 'Sobre / Documento', icon: FileText, maxKg: 'Hasta 500g', desc: 'Contratos, trámites, llaves' },
    { id: 'small', label: 'Paquete Pequeño', icon: Package, maxKg: 'Hasta 3 kg', desc: 'Bolsa, medicina, ropa, regalos' },
    { id: 'medium', label: 'Caja Mediana', icon: Box, maxKg: 'Hasta 8 kg', desc: 'Zapatillas, tortas, encomienda' },
    { id: 'heavy', label: 'Bulto con Parrilla', icon: Layers, maxKg: 'Hasta 15 kg', desc: 'Cajas pesadas aseguradas en moto' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!pickupLocation || !pickupLocation.address.trim()) {
      setFormError('Por favor ingresa o busca el punto de recojo (Punto A) en Huancayo.');
      return;
    }

    if (!destinationLocation || !destinationLocation.address.trim()) {
      setFormError('Por favor ingresa o busca el punto de entrega (Punto B) en Huancayo.');
      return;
    }

    setIsSubmitting(true);

    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
    const orderId = `YAVU-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: DeliveryOrder = {
      id: orderId,
      serviceType: 'courier',
      title: `Envío Express: ${packageDescription || 'Paquete'}`.trim(),
      pickup: pickupLocation,
      destination: destinationLocation,
      packageSize,
      isFragile,
      packageDescription: packageDescription || 'Paquete / Encomienda express',
      senderName: senderName || 'Remitente',
      senderPhone: senderPhone || '964000000',
      receiverName: receiverName || 'Destinatario',
      receiverPhone: receiverPhone || '954000000',
      distanceKm: rateInfo.distanceKm,
      estimatedMinutes: rateInfo.estMin,
      basePrice: 4.00,
      serviceFee: 1.00,
      deliveryPrice: rateInfo.price,
      totalPrice: rateInfo.price,
      paymentMethod,
      securityPin: generatedPin,
      status: 'searching_rider',
      createdAt: 'Ahora mismo',
      rider: MOCK_RIDERS[Math.floor(Math.random() * MOCK_RIDERS.length)],
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderCreated(newOrder);
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {/* Header Badge */}
      <div className="bg-gradient-to-r from-zipp-red/20 via-zipp-red/5 to-transparent border border-zipp-red/30 p-4 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-zipp-red flex items-center justify-center text-white shadow-lg shadow-zipp-red/30">
            <Package size={24} />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg text-zipp-text">YAVU Encomiendas Express</h3>
            <p className="text-xs text-zipp-text-muted">Envíos directos punto a punto en moto en Huancayo</p>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider bg-zipp-red/20 text-zipp-red px-2.5 py-1 rounded-full border border-zipp-red/30">
          En 15-25 min
        </span>
      </div>

      {/* Origin & Destination Search Section */}
      <div className="bg-zipp-surface border border-zipp-border rounded-3xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-zipp-text-muted">Ruta en Huancayo</span>
          {pickupLocation && destinationLocation ? (
            <span className="text-xs font-bold text-amber-500 dark:text-zipp-yellow flex items-center gap-1">
              <Navigation size={12} /> {rateInfo.distanceKm} km · ~{rateInfo.estMin} min en moto
            </span>
          ) : (
            <span className="text-[11px] text-zipp-text-muted">Busca en mapa o escribe</span>
          )}
        </div>

        {/* Punto A: Recojo con buscador y mapa */}
        <LocationSearchInput
          label="¿Dónde recogemos el paquete?"
          placeholder="Escribe calle, avenida o busca en el mapa..."
          pointType="pickup"
          selectedLocation={pickupLocation}
          onLocationChange={(loc) => {
            setPickupLocation(loc);
            if (formError) setFormError(null);
          }}
          required
        />

        <div className="border-t border-dashed border-zipp-border my-2" />

        {/* Punto B: Entrega con buscador y mapa */}
        <LocationSearchInput
          label="¿A dónde lo llevamos en Huancayo?"
          placeholder="Escribe destino, barrio o busca en el mapa..."
          pointType="destination"
          selectedLocation={destinationLocation}
          onLocationChange={(loc) => {
            setDestinationLocation(loc);
            if (formError) setFormError(null);
          }}
          required
        />
      </div>

      {formError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-2 text-xs font-bold text-red-500">
          <AlertCircle size={16} className="shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Package Size Selection */}
      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-widest text-zipp-text-muted">
          Tamaño y Tipo de Encomienda
        </label>
        <div className="grid grid-cols-2 gap-3">
          {packageSizes.map((pkg) => {
            const Icon = pkg.icon;
            const isSelected = packageSize === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => setPackageSize(pkg.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zipp-red/10 border-zipp-red shadow-md shadow-zipp-red/20 text-zipp-text'
                    : 'bg-zipp-surface border-zipp-border text-zipp-text-muted hover:border-zipp-red/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-zipp-red text-white' : 'bg-zipp-surface-2 text-zipp-text-muted'}`}>
                    <Icon size={16} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-zipp-red text-white' : 'bg-zipp-surface-2 text-zipp-text-muted border border-zipp-border'}`}>
                    {pkg.maxKg}
                  </span>
                </div>
                <div>
                  <div className={`text-xs font-extrabold ${isSelected ? 'text-zipp-red' : 'text-zipp-text'}`}>
                    {pkg.label}
                  </div>
                  <div className="text-[10px] text-zipp-text-muted line-clamp-1">{pkg.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Package description & Fragile flag */}
      <div className="bg-zipp-surface border border-zipp-border rounded-3xl p-5 space-y-4 shadow-sm">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zipp-text">¿Qué contiene el paquete?</label>
          <input
            type="text"
            required
            value={packageDescription}
            onChange={(e) => setPackageDescription(e.target.value)}
            placeholder="Ej. Torta de cumpleaños, documentos notariales, llaves, ropa..."
            className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl px-4 py-3 text-xs text-zipp-text placeholder:text-zipp-text-muted focus:outline-none focus:border-zipp-red"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zipp-border">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className={isFragile ? "text-amber-500" : "text-zipp-text-muted"} />
            <div>
              <div className="text-xs font-bold text-zipp-text">¿Es contenido frágil o delicado?</div>
              <div className="text-[10px] text-zipp-text-muted">El motorizado lo transportará con cuidado especial en maletín</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsFragile(!isFragile)}
            className={`w-12 h-7 rounded-full p-1 transition-all ${isFragile ? 'bg-zipp-red' : 'bg-zipp-surface-3'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${isFragile ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Sender & Receiver Info */}
      <div className="bg-zipp-surface border border-zipp-border rounded-3xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zipp-text-muted">
          <User size={14} className="text-zipp-red" />
          Datos del Destinatario (Quien recibe en Huancayo)
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-zipp-text-muted block mb-1">Nombre de quien recibe</label>
            <input
              type="text"
              required
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              placeholder="Ej. Carlos Rojas"
              className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl px-3 py-2.5 text-xs text-zipp-text placeholder:text-zipp-text-muted focus:outline-none focus:border-zipp-red"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-zipp-text-muted block mb-1">Celular (WhatsApp)</label>
            <input
              type="tel"
              required
              value={receiverPhone}
              onChange={(e) => setReceiverPhone(e.target.value)}
              placeholder="9XX XXX XXX"
              className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl px-3 py-2.5 text-xs text-zipp-text placeholder:text-zipp-text-muted focus:outline-none focus:border-zipp-red"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-zipp-border">
          <div className="text-[10px] font-bold text-zipp-text-muted uppercase tracking-wider mb-2">Tus datos (Remitente)</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Tu nombre (ej. Juan Huamán)"
                className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl px-3 py-2.5 text-xs text-zipp-text placeholder:text-zipp-text-muted focus:outline-none focus:border-zipp-red"
              />
            </div>
            <div>
              <input
                type="tel"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="Tu celular (ej. 964 112 233)"
                className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl px-3 py-2.5 text-xs text-zipp-text placeholder:text-zipp-text-muted focus:outline-none focus:border-zipp-red"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Selection & Price Summary */}
      <div className="bg-zipp-surface border border-zipp-red/20 rounded-3xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-zipp-text-muted">Método de Pago</span>
          <div className="flex gap-2">
            {(['yape', 'plin', 'cash'] as const).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${
                  paymentMethod === method
                    ? 'bg-zipp-red text-white border-zipp-red shadow-md shadow-zipp-red/30'
                    : 'bg-zipp-surface-2 text-zipp-text-muted border-zipp-border hover:text-zipp-text'
                }`}
              >
                {method === 'cash' ? '💵 Efectivo' : method === 'yape' ? '🟣 Yape' : '🔵 Plin'}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-zipp-border pt-3 space-y-2 text-xs">
          <div className="flex justify-between text-zipp-text-muted">
            <span>
              Tarifa de envío ({pickupDistrict} ➔ {destDistrict})
            </span>
            <span className="text-zipp-text font-bold">
              {pickupLocation && destinationLocation ? `S/ ${rateInfo.price.toFixed(2)}` : 'S/ --'}
            </span>
          </div>
          <div className="flex justify-between text-zipp-text-muted">
            <span>Seguro de envío y PIN de entrega protegido</span>
            <span className="text-green-500 font-bold">Incluido 🛡️</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-zipp-border">
            <span className="font-extrabold text-sm text-zipp-text">Total estimado:</span>
            <div className="text-right">
              <span className="font-display font-black text-2xl text-amber-500 dark:text-zipp-yellow">
                S/ {(pickupLocation && destinationLocation ? rateInfo.price : 4.50).toFixed(2)}
              </span>
              <span className="text-[10px] text-zipp-text-muted block">Precio transparente sin sorpresas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 rounded-2xl bg-zipp-surface-2 text-zipp-text-muted font-bold text-xs border border-zipp-border hover:bg-zipp-surface-3 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-zipp-red to-zipp-red-dark text-white font-display font-black text-sm shadow-xl shadow-zipp-red/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Solicitar Motorizado YAVU</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

