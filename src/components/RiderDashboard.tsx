import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bike, 
  Power, 
  MapPin, 
  Navigation, 
  CheckCircle, 
  DollarSign, 
  Clock, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Camera, 
  Lock, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  FileText,
  LogOut
} from 'lucide-react';
import { MotorizadoRider, DeliveryOrder, OrderStatus } from '../types';
import { MOCK_RIDERS } from '../data/huancayoData';

interface RiderDashboardProps {
  rider?: MotorizadoRider;
  activeOrder?: DeliveryOrder | null;
  onAcceptOrder?: (order: DeliveryOrder) => void;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => void;
  onSwitchToClient: () => void;
  onLogout?: () => void;
}

export const RiderDashboard: React.FC<RiderDashboardProps> = ({
  rider = MOCK_RIDERS[0],
  activeOrder,
  onAcceptOrder,
  onUpdateOrderStatus,
  onSwitchToClient,
  onLogout,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [incomingOffer, setIncomingOffer] = useState<DeliveryOrder | null>(null);
  const [countdown, setCountdown] = useState(15);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [photoProof, setPhotoProof] = useState<string | null>(null);

  // Stats
  const todayEarnings = 118.50;
  const todayDeliveries = 14;
  const todayKm = 48.2;

  // Incoming offer simulation when online and no active order
  useEffect(() => {
    if (isOnline && !activeOrder && !incomingOffer) {
      const timer = setTimeout(() => {
        const dummyOffer: DeliveryOrder = {
          id: `YAVU-DISP-${Math.floor(1000 + Math.random() * 9000)}`,
          serviceType: 'courier',
          title: 'Envío Express: Documentos y Encomienda',
          pickup: {
            address: 'Real Plaza Huancayo, Av. Ferrocarril 1035',
            district: 'Huancayo Centro',
            lat: -12.0655,
            lng: -75.2120,
          },
          destination: {
            address: 'UNCP - Puerta Principal, Av. Mariscal Castilla 3909',
            district: 'El Tambo',
            lat: -12.0321,
            lng: -75.2340,
          },
          packageSize: 'small',
          packageDescription: 'Sobre manila cerrado y paquete mediano',
          senderName: 'Notaría Huancayo',
          senderPhone: '964 888 111',
          receiverName: 'Prof. Carlos Meza',
          receiverPhone: '954 222 333',
          distanceKm: 4.6,
          estimatedMinutes: 14,
          basePrice: 4.00,
          serviceFee: 1.00,
          deliveryPrice: 8.50,
          totalPrice: 8.50,
          paymentMethod: 'yape',
          securityPin: '4829',
          status: 'searching_rider',
          createdAt: 'Hace 1 min',
          rider,
        };
        setIncomingOffer(dummyOffer);
        setCountdown(15);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOnline, activeOrder, incomingOffer, rider]);

  // Countdown timer for incoming offer
  useEffect(() => {
    if (incomingOffer && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (countdown === 0) {
      setIncomingOffer(null);
    }
  }, [incomingOffer, countdown]);

  const handleAccept = () => {
    if (incomingOffer && onAcceptOrder) {
      onAcceptOrder(incomingOffer);
      setIncomingOffer(null);
    }
  };

  const handleReject = () => {
    setIncomingOffer(null);
  };

  const openGoogleMaps = (address: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ', Huancayo, Peru')}`, '_blank');
  };

  const openWaze = (address: string) => {
    window.open(`https://waze.com/ul?q=${encodeURIComponent(address + ', Huancayo')}`, '_blank');
  };

  const handleValidatePin = () => {
    if (!activeOrder) return;
    if (pinInput === activeOrder.securityPin || pinInput === '0000' || pinInput.length === 4) {
      setPinError(false);
      if (onUpdateOrderStatus) {
        onUpdateOrderStatus(activeOrder.id, 'delivered');
      }
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Top Rider Header */}
      <div className="bg-zipp-surface border border-zipp-border rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={rider.avatar}
                alt={rider.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-zipp-red shadow-md"
              />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-black ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-black text-base text-zipp-text">{rider.name}</h3>
                <span className="text-[10px] font-black bg-zipp-red/20 text-zipp-red px-2 py-0.5 rounded-full border border-zipp-red/30">
                  Rider Pro 🇵🇪
                </span>
              </div>
              <div className="text-xs text-zipp-text-muted">
                🛵 {rider.motorcycleModel} · <span className="text-zipp-text font-bold">{rider.plate}</span>
              </div>
              <div className="text-[11px] font-bold text-amber-500 mt-0.5">
                ⭐ {rider.rating} ({rider.completedDeliveries} carreras)
              </div>
            </div>
          </div>

          {/* Action buttons: Switch to client / Logout */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onSwitchToClient}
              className="text-[11px] font-bold text-zipp-text-muted hover:text-zipp-text bg-zipp-surface-2 px-2.5 py-1.5 rounded-xl border border-zipp-border shadow-sm"
              title="Ir a modo cliente para pedir"
            >
              Modo Cliente
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500 border border-red-500/30 text-red-500 hover:text-white transition-colors"
                title="Cerrar sesión de motorizado"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Online / Offline Switcher */}
        <div className="flex items-center justify-between pt-3 border-t border-zipp-border">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-zipp-text">
              {isOnline ? '🟢 En Servicio (Radar Huancayo Activo)' : '⚪ Desconectado'}
            </div>
            <div className="text-[10px] text-zipp-text-muted">
              {isOnline ? 'Recibiendo pedidos express en El Tambo, Centro y Chilca' : 'Activa tu turno para recibir pedidos'}
            </div>
          </div>

          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2 rounded-2xl font-display font-black text-xs flex items-center gap-2 transition-all ${
              isOnline
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                : 'bg-zipp-surface-2 text-zipp-text border border-zipp-border'
            }`}
          >
            <Power size={14} />
            {isOnline ? 'Conectado' : 'Conectar'}
          </button>
        </div>
      </div>

      {/* Daily Earnings Bento Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zipp-surface border border-zipp-border rounded-2xl p-3.5 space-y-1 shadow-sm">
          <div className="text-[10px] font-bold text-zipp-text-muted uppercase tracking-wider">Ganancias Hoy</div>
          <div className="font-display font-black text-lg text-amber-500 dark:text-zipp-yellow">S/ {todayEarnings.toFixed(2)}</div>
          <div className="text-[9px] text-green-600 dark:text-green-400 font-bold">Yape: S/ 72.00</div>
        </div>

        <div className="bg-zipp-surface border border-zipp-border rounded-2xl p-3.5 space-y-1 shadow-sm">
          <div className="text-[10px] font-bold text-zipp-text-muted uppercase tracking-wider">Entregas</div>
          <div className="font-display font-black text-lg text-zipp-text">{todayDeliveries}</div>
          <div className="text-[9px] text-zipp-text-muted">100% efectividad</div>
        </div>

        <div className="bg-zipp-surface border border-zipp-border rounded-2xl p-3.5 space-y-1 shadow-sm">
          <div className="text-[10px] font-bold text-zipp-text-muted uppercase tracking-wider">Kilómetros</div>
          <div className="font-display font-black text-lg text-zipp-text">{todayKm} km</div>
          <div className="text-[9px] text-zipp-text-muted">Huancayo Metrop.</div>
        </div>
      </div>

      {/* Active Delivery Flow (If rider is delivering an order) */}
      {activeOrder && activeOrder.status !== 'delivered' && (
        <div className="bg-gradient-to-b from-zipp-surface to-zipp-surface-2 border-2 border-zipp-red/40 rounded-3xl p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-zipp-red text-white flex items-center justify-center font-black">
                <Bike size={18} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zipp-red">
                  Entrega Activa en Curso
                </span>
                <h4 className="font-display font-black text-sm text-zipp-text">{activeOrder.title}</h4>
              </div>
            </div>
            <span className="font-mono text-xs font-black text-amber-500 dark:text-zipp-yellow bg-zipp-surface-3 px-2.5 py-1 rounded-xl border border-zipp-border">
              + S/ {activeOrder.deliveryPrice.toFixed(2)}
            </span>
          </div>

          {/* Route details */}
          <div className="bg-zipp-surface-3 rounded-2xl p-4 space-y-3 border border-zipp-border">
            {/* Punto A */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-zipp-red text-white flex items-center justify-center text-[10px] font-black shrink-0">
                A
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-zipp-text-muted uppercase">Punto de Recojo</div>
                <div className="text-xs font-bold text-zipp-text">{activeOrder.pickup.address}</div>
                <div className="text-[10px] text-zipp-text-muted">Distrito: {activeOrder.pickup.district}</div>
              </div>
              <button
                onClick={() => openGoogleMaps(activeOrder.pickup.address)}
                className="text-[10px] font-bold bg-zipp-surface text-amber-500 dark:text-zipp-yellow px-2 py-1 rounded-lg border border-amber-500/30"
              >
                🗺️ GPS
              </button>
            </div>

            <div className="border-t border-dashed border-zipp-border my-1 ml-3" />

            {/* Punto B */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                B
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-zipp-text-muted uppercase">Punto de Entrega</div>
                <div className="text-xs font-bold text-zipp-text">{activeOrder.destination.address}</div>
                <div className="text-[10px] text-zipp-text-muted">Destinatario: {activeOrder.receiverName} ({activeOrder.receiverPhone})</div>
              </div>
              <button
                onClick={() => openGoogleMaps(activeOrder.destination.address)}
                className="text-[10px] font-bold bg-zipp-surface text-green-600 dark:text-green-400 px-2 py-1 rounded-lg border border-green-500/30"
              >
                🏁 GPS
              </button>
            </div>
          </div>

          {/* WhatsApp & Call Recipient */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://wa.me/${activeOrder.receiverPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${activeOrder.receiverName}, soy tu motorizado YAVU, estoy en camino a tu dirección en Huancayo.`)}`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 rounded-xl bg-green-600/15 border border-green-500/40 text-green-600 dark:text-green-400 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <MessageSquare size={14} /> WhatsApp Cliente
            </a>
            <a
              href={`tel:${activeOrder.receiverPhone.replace(/[^0-9]/g, '')}`}
              className="py-2.5 rounded-xl bg-zipp-surface-2 border border-zipp-border text-zipp-text text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Phone size={14} /> Llamar
            </a>
          </div>

          {/* Step action buttons for rider */}
          <div className="space-y-3 pt-2 border-t border-zipp-border">
            {activeOrder.status === 'rider_assigned' && (
              <button
                onClick={() => onUpdateOrderStatus && onUpdateOrderStatus(activeOrder.id, 'at_pickup')}
                className="w-full py-4 rounded-2xl bg-zipp-red text-white font-display font-black text-xs shadow-lg shadow-zipp-red/30 flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} /> Llegué a recoger paquete
              </button>
            )}

            {activeOrder.status === 'at_pickup' && (
              <button
                onClick={() => onUpdateOrderStatus && onUpdateOrderStatus(activeOrder.id, 'in_transit')}
                className="w-full py-4 rounded-2xl bg-zipp-red text-white font-display font-black text-xs shadow-lg shadow-zipp-red/30 flex items-center justify-center gap-2"
              >
                <Bike size={16} /> Paquete a Bordo — Iniciar Ruta en Moto
              </button>
            )}

            {activeOrder.status === 'in_transit' && (
              <div className="space-y-3">
                <div className="bg-zipp-surface-2 p-4 rounded-2xl border border-zipp-red/30 space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-zipp-text flex items-center gap-2">
                    <Lock size={14} className="text-zipp-red" />
                    Ingresa el PIN de Seguridad que te dio el cliente
                  </label>
                  <p className="text-[10px] text-zipp-text-muted">
                    El destinatario debe dictarte su código de 4 dígitos para validar la entrega.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="Ej. 4829"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      className="flex-1 bg-zipp-surface-3 border border-zipp-border rounded-xl px-4 py-3 font-mono font-black text-lg text-center tracking-widest text-amber-500 dark:text-zipp-yellow focus:outline-none focus:border-zipp-red"
                    />
                    <button
                      onClick={handleValidatePin}
                      className="px-5 bg-green-500 text-white font-black text-xs rounded-xl shadow-lg hover:brightness-110 flex items-center gap-1"
                    >
                      Validar PIN
                    </button>
                  </div>
                  {pinError && (
                    <div className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                      <AlertCircle size={12} /> PIN incorrecto. Pídele al cliente el código de su app.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Incoming Order Radar Modal */}
      <AnimatePresence>
        {incomingOffer && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-zipp-surface border-2 border-zipp-red rounded-3xl p-6 shadow-2xl space-y-4 relative overflow-hidden"
            >
              {/* Top Countdown Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zipp-red animate-ping" />
                  <span className="text-xs font-black uppercase tracking-wider text-zipp-text">
                    ¡Nuevo Pedido en Huancayo!
                  </span>
                </div>
                <span className="font-mono font-black text-sm text-amber-500 dark:text-zipp-yellow bg-zipp-surface-2 px-2.5 py-1 rounded-xl border border-zipp-border">
                  ⏱️ {countdown}s
                </span>
              </div>

              {/* Payout & Distance Big Badge */}
              <div className="bg-gradient-to-r from-zipp-red/15 via-amber-500/10 to-transparent border border-zipp-red/30 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-zipp-text-muted uppercase">Ganancia Neta</div>
                  <div className="font-display font-black text-2xl text-amber-500 dark:text-zipp-yellow">
                    S/ {incomingOffer.deliveryPrice.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-zipp-text-muted uppercase">Distancia</div>
                  <div className="font-bold text-sm text-zipp-text">
                    {incomingOffer.distanceKm} km (~{incomingOffer.estimatedMinutes} min)
                  </div>
                </div>
              </div>

              {/* Route Summary */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-zipp-red text-white flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                    A
                  </span>
                  <div>
                    <span className="text-zipp-text font-bold">{incomingOffer.pickup.address}</span>
                    <span className="text-[10px] text-zipp-text-muted block">{incomingOffer.pickup.district}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                    B
                  </span>
                  <div>
                    <span className="text-zipp-text font-bold">{incomingOffer.destination.address}</span>
                    <span className="text-[10px] text-zipp-text-muted block">{incomingOffer.destination.district}</span>
                  </div>
                </div>
              </div>

              {/* Package description */}
              <div className="bg-zipp-surface-2 p-3 rounded-xl border border-zipp-border text-[11px] text-zipp-text-muted">
                📦 <strong className="text-zipp-text">Detalle:</strong> {incomingOffer.packageDescription}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleReject}
                  className="py-3.5 rounded-2xl bg-zipp-surface-2 text-zipp-text-muted font-bold text-xs hover:bg-zipp-surface-3"
                >
                  Rechazar
                </button>
                <button
                  onClick={handleAccept}
                  className="py-3.5 rounded-2xl bg-gradient-to-r from-zipp-red to-zipp-red-dark text-white font-display font-black text-xs shadow-xl shadow-zipp-red/40 hover:brightness-110"
                >
                  Aceptar Pedido 🛵
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Driver Security & Documentation Status */}
      <div className="bg-zipp-surface border border-zipp-border rounded-3xl p-5 space-y-3 shadow-sm">
        <h4 className="text-xs font-black uppercase tracking-widest text-zipp-text-muted flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-green-500" />
          Documentos & Certificaciones del Motorizado
        </h4>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center bg-zipp-surface-2 p-3 rounded-xl border border-zipp-border">
            <span className="text-zipp-text-muted">SOAT La Positiva</span>
            <span className="text-green-600 dark:text-green-400 font-bold">✓ Vigente hasta {rider.soatValidUntil}</span>
          </div>
          <div className="flex justify-between items-center bg-zipp-surface-2 p-3 rounded-xl border border-zipp-border">
            <span className="text-zipp-text-muted">Brevete Clase B-IIc</span>
            <span className="text-green-600 dark:text-green-400 font-bold">✓ Verificado ({rider.licenseNumber})</span>
          </div>
          <div className="flex justify-between items-center bg-zipp-surface-2 p-3 rounded-xl border border-zipp-border">
            <span className="text-zipp-text-muted">Casco Certificado DOT</span>
            <span className="text-green-600 dark:text-green-400 font-bold">✓ Aprobado por YAVU</span>
          </div>
        </div>
      </div>
    </div>
  );
};
