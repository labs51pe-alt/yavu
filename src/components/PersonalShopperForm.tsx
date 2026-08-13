import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Store, 
  MapPin, 
  FileCheck, 
  Phone, 
  Receipt, 
  DollarSign, 
  ArrowRight, 
  Navigation,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { LocationPoint, DeliveryOrder } from '../types';
import { calculateDeliveryRate, MOCK_RIDERS } from '../data/huancayoData';
import { LocationSearchInput } from './LocationSearchInput';

interface PersonalShopperFormProps {
  onOrderCreated: (order: DeliveryOrder) => void;
  onCancel: () => void;
}

export const PersonalShopperForm: React.FC<PersonalShopperFormProps> = ({ onOrderCreated, onCancel }) => {
  const [storeName, setStoreName] = useState('Inkafarma Calle Real 450');
  const [storeType, setStoreType] = useState('Farmacia');
  const [items, setItems] = useState<string[]>([
    '1 Panadol Antigripal (caja de 10)',
    '1 Jarabe Abrilar para la tos',
    '1 Alcohol en gel pequeño'
  ]);
  const [newItemText, setNewItemText] = useState('');
  
  const [budgetLimit, setBudgetLimit] = useState<number>(60);
  const [notes, setNotes] = useState('Por favor pedir boleta de venta y verificar fecha de vencimiento.');
  
  const [destinationLocation, setDestinationLocation] = useState<LocationPoint | null>(null);
  
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'plin' | 'cash'>('yape');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const destDistrict = destinationLocation?.district || 'Huancayo Centro';
  const rateInfo = calculateDeliveryRate('Huancayo Centro', destDistrict, 'small');

  const popularStores = [
    { name: 'Inkafarma Calle Real', type: 'Farmacia' },
    { name: 'Mifarma El Tambo', type: 'Farmacia' },
    { name: 'Plaza Vea Huancayo', type: 'Supermercado' },
    { name: 'Mercado Modelo (Quesos & Cecina)', type: 'Mercado' },
    { name: 'Panadería Tradición Wanka', type: 'Panadería' },
    { name: 'Ferretería La Huancaína', type: 'Ferretería' },
  ];

  const addItem = () => {
    if (newItemText.trim()) {
      setItems([...items, newItemText.trim()]);
      setNewItemText('');
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (items.length === 0) {
      setFormError('Por favor agrega al menos un producto a la lista de compras.');
      return;
    }

    if (!destinationLocation || !destinationLocation.address.trim()) {
      setFormError('Por favor ingresa o busca la dirección de entrega en Huancayo.');
      return;
    }

    setIsSubmitting(true);
    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
    const orderId = `YAVU-MANDADO-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: DeliveryOrder = {
      id: orderId,
      serviceType: 'shopper',
      title: `Mandadito / Compra en ${storeName}`,
      pickup: {
        address: storeName,
        district: 'Huancayo Centro',
        lat: -12.0680,
        lng: -75.2100,
      },
      destination: destinationLocation,
      shopperStoreName: storeName,
      shopperItemList: items.join('\n• '),
      shopperEstimatedBudget: budgetLimit,
      senderName: storeName,
      senderPhone: 'Central de Compra',
      receiverName: receiverName || 'Destinatario',
      receiverPhone: receiverPhone || '964000000',
      distanceKm: rateInfo.distanceKm,
      estimatedMinutes: rateInfo.estMin + 10, // includes shopping time
      basePrice: 5.00,
      serviceFee: 1.50,
      deliveryPrice: rateInfo.price + 2.00, // shopper fee
      itemsPrice: budgetLimit,
      totalPrice: rateInfo.price + 2.00 + budgetLimit,
      paymentMethod,
      securityPin: generatedPin,
      status: 'searching_rider',
      createdAt: 'Ahora mismo',
      rider: MOCK_RIDERS[1],
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderCreated(newOrder);
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-zipp-red/10 to-transparent border border-amber-500/30 p-4 rounded-3xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-lg shadow-amber-500/30">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg text-zipp-text">Cómprame Algo / Mandadito</h3>
            <p className="text-xs text-zipp-text-muted">Un motorizado va a la tienda, compra por ti y te lo lleva</p>
          </div>
        </div>
      </div>

      {/* Suggested Stores Pill row */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-zipp-text-muted">
          Tiendas Populares en Huancayo
        </label>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {popularStores.map((st, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setStoreName(st.name);
                setStoreType(st.type);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                storeName === st.name
                  ? 'bg-zipp-red text-white border-zipp-red shadow-md shadow-zipp-red/30'
                  : 'bg-zipp-surface border-zipp-border text-zipp-text-muted hover:border-zipp-red/40 hover:text-zipp-text'
              }`}
            >
              🏬 {st.name}
            </button>
          ))}
        </div>
      </div>

      {/* Store Input */}
      <div className="bg-zipp-surface border border-zipp-border rounded-3xl p-5 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zipp-text-muted">
          <Store size={14} className="text-amber-500" />
          Tienda, Farmacia o Comercio en Huancayo
        </div>
        <input
          type="text"
          required
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          placeholder="Nombre del local o dirección (ej. Mifarma Calle Real, Plaza Vea)"
          className="w-full bg-zipp-surface-2 border border-zipp-border rounded-2xl p-3.5 text-sm text-zipp-text font-medium placeholder:text-zipp-text-muted focus:outline-none focus:border-zipp-red"
        />
      </div>

      {/* Shopping List Builder */}
      <div className="bg-zipp-surface border border-zipp-border rounded-3xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black uppercase tracking-widest text-zipp-text flex items-center gap-2">
            <FileCheck size={14} className="text-zipp-red" />
            Lista de Compras / Productos ({items.length})
          </div>
          <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            Foto de boleta incluida
          </span>
        </div>

        {/* Current Items List */}
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-zipp-surface-2 px-3.5 py-2.5 rounded-xl border border-zipp-border">
              <span className="text-xs text-zipp-text font-medium flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-zipp-red/20 text-zipp-red text-[10px] font-black flex items-center justify-center">
                  {idx + 1}
                </span>
                {item}
              </span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-zipp-text-muted hover:text-zipp-red p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Item Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem();
              }
            }}
            placeholder="Agregar otro producto (ej. 2 botellas de agua)"
            className="flex-1 bg-zipp-surface-2 border border-zipp-border rounded-xl px-3.5 py-2.5 text-xs text-zipp-text placeholder:text-zipp-text-muted focus:outline-none focus:border-zipp-red"
          />
          <button
            type="button"
            onClick={addItem}
            className="px-4 bg-zipp-red text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:brightness-110 shadow-md shadow-zipp-red/20"
          >
            <Plus size={14} /> Agregar
          </button>
        </div>

        {/* Budget Limit */}
        <div className="pt-2 border-t border-zipp-border flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-zipp-text">Presupuesto Máximo Estimado</div>
            <div className="text-[10px] text-zipp-text-muted">El motorizado pagará hasta este monto</div>
          </div>
          <div className="flex items-center gap-1 bg-zipp-surface-2 px-3 py-1.5 rounded-xl border border-zipp-border">
            <span className="text-xs font-black text-amber-500">S/</span>
            <input
              type="number"
              min="10"
              max="500"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(Number(e.target.value))}
              className="w-16 bg-transparent text-sm font-black text-zipp-text focus:outline-none text-right"
            />
          </div>
        </div>
      </div>

      {/* Delivery Destination in Huancayo */}
      <div className="bg-zipp-surface border border-zipp-border rounded-3xl p-5 space-y-3 shadow-sm">
        <LocationSearchInput
          label="¿A dónde llevamos tus compras en Huancayo?"
          placeholder="Escribe calle, avenida o busca en el mapa..."
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

      {/* Receiver Details */}
      <div className="bg-zipp-surface border border-zipp-border rounded-3xl p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-zipp-text-muted block mb-1">Nombre quien recibe</label>
            <input
              type="text"
              required
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              placeholder="Ej. Ana Lucía Méndez"
              className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl px-3 py-2.5 text-xs text-zipp-text placeholder:text-zipp-text-muted focus:outline-none focus:border-zipp-red"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-zipp-text-muted block mb-1">Celular / WhatsApp</label>
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
      </div>

      {/* Price Summary */}
      <div className="bg-zipp-surface border border-amber-500/30 rounded-3xl p-5 space-y-3 shadow-sm">
        <div className="flex justify-between text-xs text-zipp-text-muted">
          <span>Servicio de compra & delivery express en moto</span>
          <span className="text-zipp-text font-bold">
            S/ {(destinationLocation ? rateInfo.price + 2.00 : 6.50).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-zipp-text-muted">
          <span>Presupuesto estimado de productos (a liquidar con boleta)</span>
          <span className="text-zipp-text font-bold">S/ {budgetLimit.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-baseline pt-2 border-t border-zipp-border">
          <span className="font-extrabold text-sm text-zipp-text">Total Estimado:</span>
          <div className="text-right">
            <span className="font-display font-black text-2xl text-amber-500 dark:text-zipp-yellow">
              S/ {((destinationLocation ? rateInfo.price + 2.00 : 6.50) + budgetLimit).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
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
              <span>Pedir Mandadito en Moto</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
