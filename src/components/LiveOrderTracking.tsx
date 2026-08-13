import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Share2, 
  AlertTriangle, 
  Lock, 
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Navigation,
  FileText
} from 'lucide-react';
import { DeliveryOrder, OrderStatus } from '../types';
import { HuancayoMap } from './HuancayoMap';

interface LiveOrderTrackingProps {
  order: DeliveryOrder;
  onBack: () => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const LiveOrderTracking: React.FC<LiveOrderTrackingProps> = ({
  order,
  onBack,
  onUpdateStatus,
}) => {
  const [copiedPin, setCopiedPin] = useState(false);
  const [sharedSuccess, setSharedSuccess] = useState(false);

  // Status mapping to progress percentage
  const getProgress = (status: OrderStatus): number => {
    switch (status) {
      case 'created':
      case 'searching_rider':
        return 15;
      case 'rider_assigned':
        return 35;
      case 'at_pickup':
        return 55;
      case 'in_transit':
        return 80;
      case 'at_destination':
        return 95;
      case 'delivered':
        return 100;
      default:
        return 50;
    }
  };

  const currentProgress = getProgress(order.status);

  // Steps definition
  const steps: { key: OrderStatus; label: string; sub: string }[] = [
    { key: 'searching_rider', label: 'Buscando Motorizado', sub: 'Radar activo en Huancayo' },
    { key: 'rider_assigned', label: 'Motorizado Asignado', sub: `${order.rider?.name || 'Rider YAVU'} en camino` },
    { key: 'at_pickup', label: 'Recogiendo Paquete / Compra', sub: order.pickup.address },
    { key: 'in_transit', label: 'En Ruta en Moto Express', sub: 'Por avenidas principales' },
    { key: 'delivered', label: 'Entregado con Éxito', sub: 'Validado con PIN y Foto' },
  ];

  const getStepState = (stepKey: OrderStatus) => {
    const orderHierarchy: OrderStatus[] = [
      'created',
      'searching_rider',
      'rider_assigned',
      'at_pickup',
      'in_transit',
      'at_destination',
      'delivered',
    ];

    const currentIndex = orderHierarchy.indexOf(order.status);
    const stepIndex = orderHierarchy.indexOf(stepKey);

    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'current';
    return 'pending';
  };

  // Next status simulator helper
  const advanceStatus = () => {
    if (order.status === 'searching_rider' || order.status === 'created') {
      onUpdateStatus(order.id, 'rider_assigned');
    } else if (order.status === 'rider_assigned') {
      onUpdateStatus(order.id, 'at_pickup');
    } else if (order.status === 'at_pickup') {
      onUpdateStatus(order.id, 'in_transit');
    } else if (order.status === 'in_transit') {
      onUpdateStatus(order.id, 'delivered');
    }
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `🏍️ *YAVU Huancayo - Rastreo de Envío en Vivo*\n` +
      `📦 Pedido: ${order.title}\n` +
      `📍 Destino: ${order.destination.address} (${order.destination.district})\n` +
      `🛵 Motorizado: ${order.rider?.name} (Placa: ${order.rider?.plate})\n` +
      `🔑 *PIN de Seguridad para recibir: ${order.securityPin}*\n` +
      `⏱️ Estado: ${order.status.toUpperCase()}\n` +
      `Sigue el delivery en tiempo real con YAVU.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setSharedSuccess(true);
    setTimeout(() => setSharedSuccess(false), 3000);
  };

  const contactRiderWhatsApp = () => {
    if (!order.rider) return;
    const text = encodeURIComponent(
      `Hola ${order.rider.name}, te escribo por el pedido ${order.id} de YAVU en Huancayo.`
    );
    const cleanPhone = order.rider.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-zipp-text-muted hover:text-zipp-text bg-zipp-surface px-3 py-1.5 rounded-xl border border-zipp-border shadow-sm"
        >
          <ArrowLeft size={14} /> Volver
        </button>
        <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
          {order.id}
        </span>
      </div>

      {/* Huancayo Dynamic Map */}
      <HuancayoMap
        pickup={order.pickup}
        destination={order.destination}
        rider={order.rider}
        progressPercent={currentProgress}
        heightClass="h-[280px]"
      />

      {/* Security PIN Code Card */}
      <div className="bg-gradient-to-br from-zipp-surface via-zipp-surface-2 to-zipp-surface border-2 border-zipp-red/40 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-zipp-red text-white flex items-center justify-center font-black">
              <Lock size={16} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zipp-red">
                Código de Seguridad Obligatorio
              </div>
              <div className="text-xs font-bold text-zipp-text">PIN de Entrega al Motorizado</div>
            </div>
          </div>
          <span className="text-[9px] font-bold bg-zipp-red/20 text-zipp-red px-2 py-0.5 rounded-full border border-zipp-red/30">
            Seguridad Wanka 🇵🇪
          </span>
        </div>

        <div className="bg-zipp-surface-3 rounded-2xl p-4 my-2 border border-zipp-border flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] text-zipp-text-muted uppercase tracking-wider block font-bold">Código secreto</span>
            <div className="flex gap-2 mt-1 font-mono font-black text-2xl tracking-widest text-zipp-yellow">
              {order.securityPin.split('').map((digit, i) => (
                <span key={i} className="w-8 h-10 bg-zipp-surface rounded-lg flex items-center justify-center border border-amber-500/40 shadow-inner text-amber-500 dark:text-zipp-yellow">
                  {digit}
                </span>
              ))}
            </div>
          </div>

          <div className="text-right max-w-[140px]">
            <p className="text-[10px] text-zipp-text-muted leading-tight">
              Dale este PIN al motorizado al momento de recibir el paquete.
            </p>
          </div>
        </div>
      </div>

      {/* Motorizado Details Card */}
      {order.rider && (
        <div className="bg-zipp-surface border border-zipp-border rounded-3xl p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={order.rider.avatar}
                  alt={order.rider.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-zipp-red shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-black" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-display font-black text-base text-zipp-text">{order.rider.name}</h4>
                  <ShieldCheck size={16} className="text-green-500" />
                </div>
                <div className="text-xs text-zipp-text-muted">
                  🛵 {order.rider.motorcycleModel} · <span className="text-zipp-text font-bold bg-zipp-surface-2 border border-zipp-border px-1.5 py-0.5 rounded text-[11px]">{order.rider.plate}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-amber-500">
                  <span>⭐ {order.rider.rating}</span>
                  <span>•</span>
                  <span>{order.rider.completedDeliveries} entregas en Huancayo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Direct WhatsApp and Call Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={contactRiderWhatsApp}
              className="py-3 px-4 rounded-2xl bg-green-600/15 border border-green-500/40 text-green-600 dark:text-green-400 hover:bg-green-600/25 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare size={16} /> WhatsApp Motorizado
            </button>
            <a
              href={`tel:${order.rider.phone.replace(/[^0-9]/g, '')}`}
              className="py-3 px-4 rounded-2xl bg-zipp-surface-2 border border-zipp-border text-zipp-text hover:bg-zipp-surface-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Phone size={16} /> Llamar
            </a>
          </div>
        </div>
      )}

      {/* Step-by-Step Delivery Timeline */}
      <div className="bg-zipp-surface border border-zipp-border rounded-3xl p-5 space-y-4 shadow-sm">
        <h4 className="text-xs font-black uppercase tracking-widest text-zipp-text-muted">
          Línea de Tiempo del Envío
        </h4>

        <div className="space-y-4">
          {steps.map((step, idx) => {
            const state = getStepState(step.key);
            return (
              <div key={step.key} className="flex items-start gap-3 relative">
                {idx < steps.length - 1 && (
                  <div
                    className={`absolute left-3.5 top-7 bottom-0 w-0.5 ${
                      state === 'completed' ? 'bg-green-500' : 'bg-zipp-border'
                    }`}
                  />
                )}

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                    state === 'completed'
                      ? 'bg-green-500 text-white'
                      : state === 'current'
                      ? 'bg-zipp-red text-white ring-4 ring-zipp-red/20 animate-pulse'
                      : 'bg-zipp-surface-2 text-zipp-text-muted border border-zipp-border'
                  }`}
                >
                  {state === 'completed' ? <CheckCircle2 size={16} /> : idx + 1}
                </div>

                <div className="flex-1 pb-1">
                  <div className={`text-xs font-extrabold ${state === 'current' ? 'text-amber-500 dark:text-zipp-yellow' : state === 'completed' ? 'text-zipp-text' : 'text-zipp-text-muted'}`}>
                    {step.label}
                  </div>
                  <div className="text-[11px] text-zipp-text-muted">{step.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share Route & Actions */}
      <div className="space-y-3">
        <button
          onClick={shareViaWhatsApp}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 text-white font-display font-black text-sm shadow-xl shadow-green-600/20 hover:brightness-110 flex items-center justify-center gap-2"
        >
          <Share2 size={18} />
          {sharedSuccess ? '¡Enlace Copiado al WhatsApp!' : 'Compartir Ruta en Vivo por WhatsApp'}
        </button>

        {/* Demo Advance Status Simulator Button */}
        {order.status !== 'delivered' && (
          <button
            onClick={advanceStatus}
            className="w-full py-2.5 rounded-xl bg-zipp-surface-2 border border-zipp-red/30 text-zipp-red hover:bg-zipp-red hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Simular Siguiente Paso de Entrega ⏩</span>
          </button>
        )}
      </div>
    </div>
  );
};
