import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  ShoppingBag, 
  Utensils, 
  Bike, 
  Navigation, 
  MapPin, 
  Shield, 
  History, 
  User, 
  Sun, 
  Moon, 
  Phone, 
  Share2, 
  Sparkles, 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Receipt,
  Search,
  Plus,
  LogOut
} from 'lucide-react';
import { 
  Role, 
  Screen, 
  ServiceType, 
  DeliveryOrder, 
  MotorizadoRider, 
  OrderStatus,
  UserProfile 
} from './types';
import { 
  HUANCAYO_HOTSPOTS, 
  INITIAL_ORDERS, 
  MOCK_RIDERS 
} from './data/huancayoData';
import { HuancayoMap } from './components/HuancayoMap';
import { CourierOrderForm } from './components/CourierOrderForm';
import { PersonalShopperForm } from './components/PersonalShopperForm';
import { FoodDeliverySection } from './components/FoodDeliverySection';
import { LiveOrderTracking } from './components/LiveOrderTracking';
import { RiderDashboard } from './components/RiderDashboard';
import { PriceCalculatorModal } from './components/PriceCalculatorModal';
import { SecurityHubModal } from './components/SecurityHubModal';
import { AuthPortalModal } from './components/AuthPortalModal';
import { SplashScreen } from './components/SplashScreen';
import { WelcomeEntryScreen } from './components/WelcomeEntryScreen';
import { cn } from './utils';

const DEFAULT_USER: UserProfile = {
  id: 'usr_gaor_01',
  name: 'Carlos Alanya',
  phone: '+51 964 123 456',
  email: 'gaor.labs@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'client',
  district: 'Huancayo Centro',
  dni: '48920192',
  isVerified: true,
  loginMethod: 'google',
};

export default function App() {
  // Theme & Role State
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('yavu_theme') !== 'light';
    } catch {
      return true;
    }
  });
  const [role, setRole] = useState<Role>(() => {
    try {
      return (localStorage.getItem('yavu_role') as Role) || 'client';
    } catch {
      return 'client';
    }
  });
  const [currentScreen, setCurrentScreen] = useState<Screen>('client-home');

  // User Profile & Auth Portal State
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('yavu_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.id) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_USER;
  });
  const [isAuthPortalOpen, setIsAuthPortalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [hasEnteredApp, setHasEnteredApp] = useState(() => {
    try {
      return localStorage.getItem('yavu_session_active') === 'true';
    } catch {
      return false;
    }
  });

  // Orders State
  const [orders, setOrders] = useState<DeliveryOrder[]>(() => {
    try {
      const saved = localStorage.getItem('yavu_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });
  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    return INITIAL_ORDERS[1]?.id || INITIAL_ORDERS[0]?.id || null;
  });

  // Modals
  const [isPriceCalcOpen, setIsPriceCalcOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);

  // Sync Theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('yavu_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Persist User
  useEffect(() => {
    localStorage.setItem('yavu_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Persist Orders
  useEffect(() => {
    localStorage.setItem('yavu_orders', JSON.stringify(orders));
  }, [orders]);

  // Persist Role
  useEffect(() => {
    localStorage.setItem('yavu_role', role);
  }, [role]);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setRole(user.role);
    setHasEnteredApp(true);
    localStorage.setItem('yavu_session_active', 'true');
    if (user.role === 'rider') {
      setCurrentScreen('rider-dashboard');
    } else {
      setCurrentScreen('client-home');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('yavu_session_active');
    const guestUser: UserProfile = {
      id: 'guest_' + Date.now().toString().slice(-4),
      name: 'Invitado Huancayo',
      phone: '+51 964 000 000',
      email: 'invitado@yavu.pe',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'client',
      district: 'Huancayo Centro',
      isVerified: false,
      loginMethod: 'guest',
    };
    setCurrentUser(guestUser);
    setRole('client');
    setIsAuthPortalOpen(false);
    setIsSecurityOpen(false);
    setIsPriceCalcOpen(false);
    setHasEnteredApp(false);
  };

  const activeOrder = orders.find((o) => o.id === activeOrderId) || null;

  const handleCreateOrder = (newOrder: DeliveryOrder) => {
    setOrders([newOrder, ...orders]);
    setActiveOrderId(newOrder.id);
    setCurrentScreen('order-tracking');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            deliveryProofPhoto:
              newStatus === 'delivered'
                ? 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80'
                : o.deliveryProofPhoto,
          };
        }
        return o;
      })
    );
  };

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen bg-zipp-bg text-zipp-text font-sans antialiased flex justify-center selection:bg-zipp-red selection:text-white">
      {/* Dark Animated Splash Screen with Racing Motorcycle */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            onFinish={() => setShowSplash(false)}
            durationMs={2600}
          />
        )}
      </AnimatePresence>

      {/* If not logged in / entered yet, render the Start Screen for YAVU Delivery */}
      {!hasEnteredApp ? (
        <WelcomeEntryScreen
          onEnterApp={(user) => {
            handleLoginSuccess(user);
          }}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      ) : (
        /* Mobile-first Container Frame for Main Delivery Dashboard */
        <div className="w-full max-w-md min-h-screen bg-zipp-bg flex flex-col relative border-x border-zipp-border shadow-2xl overflow-x-hidden animate-in fade-in duration-300">
        
        {/* Top App Header */}
        <header className="sticky top-0 z-50 bg-zipp-surface/90 backdrop-blur-xl border-b border-zipp-border px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentScreen(role === 'rider' ? 'rider-dashboard' : 'client-home')}>
            {/* Red YAVU Motorbike Logo Badge */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zipp-red to-zipp-red-dark flex items-center justify-center text-white shadow-lg shadow-zipp-red/30 border border-white/20">
              <Bike size={20} className="transform -rotate-12" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-display font-black text-xl tracking-tight text-zipp-text">YAVU</span>
                <span className="text-[10px] font-black text-zipp-red uppercase tracking-wider bg-zipp-red/15 px-1.5 py-0.5 rounded border border-zipp-red/30">
                  EXPRESS
                </span>
              </div>
              <span className="text-[9px] font-bold text-zipp-text-muted tracking-wide">
                Delivery & Envíos en Moto
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* User Login / Profile Pill */}
            <button
              onClick={() => setIsAuthPortalOpen(true)}
              className="flex items-center gap-1.5 bg-zipp-surface-2 hover:bg-zipp-surface border border-zipp-border hover:border-zipp-red/40 px-2.5 py-1.5 rounded-xl text-xs font-bold text-zipp-text transition-all"
              title="Portal de Ingreso / Mi Cuenta"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover border border-zipp-red"
              />
              <span className="max-w-[70px] truncate hidden sm:inline">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            </button>

            {/* SOS Emergency button */}
            <button
              onClick={() => setIsSecurityOpen(true)}
              className="p-2 rounded-xl bg-zipp-red/15 border border-zipp-red/30 text-zipp-red hover:bg-zipp-red hover:text-white transition-colors"
              title="SOS Emergencias Huancayo"
            >
              <Shield size={16} />
            </button>

            {/* Price calculator */}
            <button
              onClick={() => setIsPriceCalcOpen(true)}
              className="p-2 rounded-xl bg-zipp-surface-2 border border-zipp-border text-zipp-yellow hover:border-zipp-yellow/40 transition-colors"
              title="Tarifario Huancayo"
            >
              <Calculator size={16} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-zipp-surface-2 border border-zipp-border text-zipp-text-muted hover:text-zipp-text transition-colors"
              title="Cambiar modo claro/oscuro"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Direct Quick Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 border border-red-500/30 hover:border-red-500 text-red-500 hover:text-white transition-all shadow-sm group"
              title="Cerrar sesión y volver al inicio"
            >
              <LogOut size={16} className="transition-transform group-hover:-translate-x-0.5" />
            </button>
          </div>
        </header>

        {/* Main Content View Switcher */}
        <main className="flex-1 px-5 pt-4">
          
          {/* CLIENT HOME SCREEN */}
          {currentScreen === 'client-home' && (
            <div className="space-y-6 pb-28">
              
              {/* Ongoing Active Order Alert Card (If any) */}
              {activeOrder && activeOrder.status !== 'delivered' && (
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  onClick={() => setCurrentScreen('order-tracking')}
                  className="bg-gradient-to-r from-zipp-red/15 via-zipp-surface to-zipp-surface border-2 border-zipp-red/40 rounded-3xl p-4 shadow-xl cursor-pointer hover:border-zipp-red transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-zipp-red flex items-center justify-center text-white font-black shadow-lg shadow-zipp-red/40 animate-pulse">
                      <Bike size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-zipp-red">
                          ● Envío Activo en Moto
                        </span>
                        <span className="text-[10px] font-mono text-zipp-text-muted">
                          {activeOrder.id}
                        </span>
                      </div>
                      <h4 className="font-display font-extrabold text-sm text-zipp-text line-clamp-1">
                        {activeOrder.title}
                      </h4>
                      <p className="text-[11px] text-zipp-yellow font-bold">
                        PIN de entrega: <span className="font-mono underline">{activeOrder.securityPin}</span>
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-zipp-text-muted shrink-0" />
                </motion.div>
              )}

              {/* Hero Banner with Motos in Huancayo */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-zipp-surface via-zipp-surface-2 to-zipp-surface border border-zipp-red/25 p-5 shadow-xl">
                <div className="relative z-10 space-y-2 max-w-[260px]">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 bg-zipp-red/15 text-zipp-red border border-zipp-red/30 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                      ⚡ Express 15-25 min
                    </span>
                    <button
                      onClick={() => setIsAuthPortalOpen(true)}
                      className="text-[10px] font-bold text-zipp-text-muted hover:text-zipp-red underline flex items-center gap-0.5"
                    >
                      {currentUser.name.split(' ')[0]} 👤
                    </button>
                  </div>
                  <h2 className="font-display font-black text-2xl text-zipp-text leading-tight">
                    ¿Qué necesitas mover hoy en <span className="text-zipp-red">Huancayo</span>?
                  </h2>
                  <p className="text-xs text-zipp-text-muted font-medium">
                    El Tambo, Centro, Chilca, San Carlos y Pilcomayo con motorizados 100% verificados.
                  </p>
                </div>

                <div className="absolute right-2 -bottom-2 w-36 h-36 pointer-events-none opacity-90">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2830/2830312.png"
                    alt="Motorizado Huancayo"
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(227,30,36,0.3)] transform -scale-x-100"
                  />
                </div>
              </div>

              {/* 3 Core Hero Services Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-zipp-text-muted">
                    Nuestros Servicios en Moto
                  </span>
                  <button
                    onClick={() => setIsPriceCalcOpen(true)}
                    className="text-[11px] font-bold text-zipp-yellow hover:underline flex items-center gap-1"
                  >
                    Ver Tarifario S/
                  </button>
                </div>

                {/* Service 1: Enviar Paquete / Courier */}
                <div
                  onClick={() => setCurrentScreen('courier-new')}
                  className="bg-zipp-surface border border-zipp-border hover:border-zipp-red/50 rounded-3xl p-5 cursor-pointer transition-all duration-300 group shadow-md flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zipp-red to-zipp-red-dark flex items-center justify-center text-white shadow-lg shadow-zipp-red/30 group-hover:scale-105 transition-transform">
                      <Package size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-black text-base text-zipp-text group-hover:text-zipp-red transition-colors">
                          Enviar Encomienda Express
                        </h3>
                        <span className="text-[9px] font-black bg-zipp-red/15 text-zipp-red px-2 py-0.5 rounded-full border border-zipp-red/20">
                          Desde S/ 4.00
                        </span>
                      </div>
                      <p className="text-xs text-zipp-text-muted mt-0.5">
                        Documentos, llaves, ropa, paquetes y cajas punto a punto
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-zipp-text-muted group-hover:translate-x-1 transition-transform shrink-0" />
                </div>

                {/* Service 2: Compras / Personal Shopper */}
                <div
                  onClick={() => setCurrentScreen('shopper-new')}
                  className="bg-zipp-surface border border-zipp-border hover:border-zipp-yellow/50 rounded-3xl p-5 cursor-pointer transition-all duration-300 group shadow-md flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-black shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
                      <ShoppingBag size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-black text-base text-zipp-text group-hover:text-zipp-yellow transition-colors">
                          Cómprame Algo / Mandadito
                        </h3>
                        <span className="text-[9px] font-black bg-amber-500/15 text-zipp-yellow px-2 py-0.5 rounded-full border border-amber-500/20">
                          Personal
                        </span>
                      </div>
                      <p className="text-xs text-zipp-text-muted mt-0.5">
                        Farmacias, Plaza Vea, ferretería o mercado con boleta
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-zipp-text-muted group-hover:translate-x-1 transition-transform shrink-0" />
                </div>

                {/* Service 3: Food & Restaurants */}
                <div
                  onClick={() => setCurrentScreen('food-catalog')}
                  className="bg-zipp-surface border border-zipp-border hover:border-red-500/50 rounded-3xl p-5 cursor-pointer transition-all duration-300 group shadow-md flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
                      <Utensils size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-black text-base text-zipp-text group-hover:text-red-500 transition-colors">
                          Restaurantes de Huancayo
                        </h3>
                        <span className="text-[9px] font-black bg-red-600/15 text-red-600 px-2 py-0.5 rounded-full border border-red-600/20">
                          Comida Wanka
                        </span>
                      </div>
                      <p className="text-xs text-zipp-text-muted mt-0.5">
                        Pollos a la brasa, Pachamanca, Chifa, Pizzas y más
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-zipp-text-muted group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
              </div>

              {/* Live Huancayo Radar Map Snapshot */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-zipp-text-muted flex items-center gap-1.5">
                    <Navigation size={14} className="text-zipp-red" />
                    Radar de Motos en Tiempo Real (Huancayo)
                  </span>
                  <span className="text-[10px] font-bold text-green-500">
                    ● 8 Motorizados activos
                  </span>
                </div>

                <HuancayoMap heightClass="h-[220px]" progressPercent={65} />
              </div>

              {/* Quick District Rates Quick Sheet */}
              <div className="bg-zipp-surface border border-zipp-border rounded-3xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zipp-text">
                    Tarifas Referenciales en Moto
                  </h4>
                  <button
                    onClick={() => setIsPriceCalcOpen(true)}
                    className="text-[10px] font-bold text-zipp-yellow hover:underline"
                  >
                    Cotizar ruta exacta →
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-zipp-surface-2 p-2.5 rounded-xl border border-zipp-border flex justify-between items-center">
                    <span className="text-zipp-text-muted">Centro ➔ El Tambo</span>
                    <span className="font-bold text-zipp-text">S/ 6.50</span>
                  </div>
                  <div className="bg-zipp-surface-2 p-2.5 rounded-xl border border-zipp-border flex justify-between items-center">
                    <span className="text-zipp-text-muted">Centro ➔ Chilca</span>
                    <span className="font-bold text-zipp-text">S/ 6.00</span>
                  </div>
                  <div className="bg-zipp-surface-2 p-2.5 rounded-xl border border-zipp-border flex justify-between items-center">
                    <span className="text-zipp-text-muted">El Tambo ➔ UNCP</span>
                    <span className="font-bold text-zipp-text">S/ 4.50</span>
                  </div>
                  <div className="bg-zipp-surface-2 p-2.5 rounded-xl border border-zipp-border flex justify-between items-center">
                    <span className="text-zipp-text-muted">Centro ➔ San Carlos</span>
                    <span className="font-bold text-zipp-text">S/ 5.00</span>
                  </div>
                </div>
              </div>

              {/* Switch Role Card (Join as Driver / Motorizado) */}
              <div className="bg-gradient-to-r from-zipp-red/15 via-zipp-surface to-zipp-surface border border-zipp-red/30 rounded-3xl p-5 flex items-center justify-between shadow-md">
                <div>
                  <h4 className="font-display font-black text-sm text-zipp-text">¿Tienes moto en Huancayo?</h4>
                  <p className="text-xs text-zipp-text-muted font-medium">Genera ingresos diarios como motorizado YAVU</p>
                </div>
                <button
                  onClick={() => {
                    setRole('rider');
                    setCurrentScreen('rider-dashboard');
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-zipp-red text-white font-display font-black text-xs shadow-lg shadow-zipp-red/30 hover:brightness-110 shrink-0"
                >
                  Modo Motorizado 🛵
                </button>
              </div>

            </div>
          )}

          {/* COURIER NEW SCREEN */}
          {currentScreen === 'courier-new' && (
            <CourierOrderForm
              onOrderCreated={handleCreateOrder}
              onCancel={() => setCurrentScreen('client-home')}
            />
          )}

          {/* PERSONAL SHOPPER NEW SCREEN */}
          {currentScreen === 'shopper-new' && (
            <PersonalShopperForm
              onOrderCreated={handleCreateOrder}
              onCancel={() => setCurrentScreen('client-home')}
            />
          )}

          {/* FOOD CATALOG SCREEN */}
          {currentScreen === 'food-catalog' && (
            <FoodDeliverySection
              onOrderCreated={handleCreateOrder}
              onBack={() => setCurrentScreen('client-home')}
            />
          )}

          {/* LIVE ORDER TRACKING SCREEN */}
          {currentScreen === 'order-tracking' && (
            activeOrder ? (
              <LiveOrderTracking
                order={activeOrder}
                onBack={() => setCurrentScreen('client-home')}
                onUpdateStatus={handleUpdateOrderStatus}
              />
            ) : (
              <div className="text-center py-20 space-y-3">
                <Package size={48} className="mx-auto text-zipp-text-muted" />
                <h3 className="text-lg font-bold text-zipp-text">No tienes envíos activos en este momento</h3>
                <button
                  onClick={() => setCurrentScreen('client-home')}
                  className="px-5 py-2.5 rounded-xl bg-zipp-red text-white text-xs font-bold"
                >
                  Crear un envío en Huancayo
                </button>
              </div>
            )
          )}

          {/* ORDER HISTORY SCREEN */}
          {currentScreen === 'order-history' && (
            <div className="space-y-4 pb-28">
              <h3 className="font-display font-black text-xl text-zipp-text">Historial de Envíos en Huancayo</h3>
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => {
                    setActiveOrderId(ord.id);
                    setCurrentScreen('order-tracking');
                  }}
                  className="bg-zipp-surface border border-zipp-border rounded-2xl p-4 space-y-3 cursor-pointer hover:border-zipp-red/40 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-zipp-red/15 text-zipp-red flex items-center justify-center font-black text-xs">
                        {ord.serviceType === 'courier' ? <Package size={16} /> : ord.serviceType === 'shopper' ? <ShoppingBag size={16} /> : <Utensils size={16} />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zipp-text">{ord.title}</div>
                        <div className="text-[10px] text-zipp-text-muted">{ord.createdAt} · {ord.id}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-display font-black text-sm text-zipp-yellow">
                        S/ {ord.totalPrice.toFixed(2)}
                      </span>
                      <span className={`text-[9px] font-bold block uppercase ${ord.status === 'delivered' ? 'text-green-500' : 'text-zipp-red'}`}>
                        {ord.status === 'delivered' ? '✓ Entregado' : '⏱️ En Ruta'}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-zipp-text-muted bg-zipp-surface-2 p-2 rounded-xl flex items-center justify-between border border-zipp-border">
                    <span>📍 {ord.destination.district}</span>
                    <span className="font-bold text-zipp-text">🔑 PIN: {ord.securityPin}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* RIDER DASHBOARD SCREEN */}
          {currentScreen === 'rider-dashboard' && (
            <RiderDashboard
              rider={MOCK_RIDERS[0]}
              activeOrder={activeOrder}
              onAcceptOrder={(order) => {
                setOrders([order, ...orders]);
                setActiveOrderId(order.id);
              }}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onSwitchToClient={() => {
                setRole('client');
                setCurrentScreen('client-home');
              }}
              onLogout={handleLogout}
            />
          )}

          {/* PROFILE SCREEN */}
          {currentScreen === 'profile' && (
            <div className="space-y-5 pb-28">
              {/* User Main Card */}
              <div className="bg-zipp-surface border border-zipp-red/20 rounded-3xl p-6 text-center space-y-3 shadow-md relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-green-500/15 text-green-500 border border-green-500/30 px-2 py-0.5 rounded-full">
                    {currentUser.isVerified ? '✓ Verificado' : 'Invitado'}
                  </span>
                </div>

                <div className="w-20 h-20 rounded-3xl bg-zipp-surface-2 border-2 border-zipp-red mx-auto overflow-hidden p-1 shadow-lg shadow-zipp-red/20">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl text-zipp-text flex items-center justify-center gap-1.5">
                    {currentUser.name}
                  </h3>
                  <p className="text-xs text-zipp-text-muted mt-0.5">{currentUser.email} · {currentUser.phone}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-zipp-yellow bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    📍 {currentUser.district || 'Huancayo Centro'}
                  </span>
                </div>
              </div>

              {/* Login Portal Access & Switch Account */}
              <div className="bg-gradient-to-r from-zipp-red/10 via-zipp-surface to-zipp-surface border border-zipp-red/30 rounded-3xl p-4 flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="font-display font-black text-xs text-zipp-text">Portal de Ingreso YAVU</h4>
                  <p className="text-[11px] text-zipp-text-muted">Ingresa con otro celular, Google o modo Motorizado</p>
                </div>
                <button
                  onClick={() => setIsAuthPortalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-zipp-red hover:bg-zipp-red-dark text-white text-xs font-black shadow-md shadow-zipp-red/30 transition-all shrink-0"
                >
                  Abrir Portal 🔑
                </button>
              </div>

              {/* Rider Specific Details if Rider */}
              {role === 'rider' && (
                <div className="bg-zipp-surface border border-zipp-border rounded-3xl p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-zipp-border pb-2">
                    <span className="font-display font-black text-xs text-zipp-text uppercase tracking-wider flex items-center gap-1.5">
                      <Bike size={16} className="text-zipp-red" /> Mi Motocicleta & Documentos
                    </span>
                    <span className="text-[10px] font-bold text-green-500">SOAT Vigente ✓</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-zipp-surface-2 p-2.5 rounded-xl border border-zipp-border">
                      <span className="text-zipp-text-muted block text-[10px]">Placa de Rodaje</span>
                      <span className="font-mono font-bold text-zipp-text">{currentUser.plate || '4892-3W'}</span>
                    </div>
                    <div className="bg-zipp-surface-2 p-2.5 rounded-xl border border-zipp-border">
                      <span className="text-zipp-text-muted block text-[10px]">Modelo</span>
                      <span className="font-bold text-zipp-text">{currentUser.motorcycleModel || 'Honda CB125F'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Role Switcher */}
              <div className="bg-zipp-surface border border-zipp-border rounded-3xl p-4 flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-xs font-bold text-zipp-text">Cambiar Modo de Aplicación</div>
                  <div className="text-[10px] text-zipp-text-muted">Actualmente en modo: <span className="font-bold text-zipp-red">{role === 'client' ? 'Cliente' : 'Motorizado'}</span></div>
                </div>
                <button
                  onClick={() => {
                    const newRole = role === 'client' ? 'rider' : 'client';
                    setRole(newRole);
                    setCurrentScreen(newRole === 'rider' ? 'rider-dashboard' : 'client-home');
                  }}
                  className="px-4 py-2 rounded-xl bg-zipp-surface-2 hover:bg-zipp-surface border border-zipp-border text-zipp-text text-xs font-black shadow-sm"
                >
                  {role === 'client' ? '🛵 Pasar a Motorizado' : '👤 Pasar a Cliente'}
                </button>
              </div>

              {/* Security & Verification status */}
              <div className="bg-zipp-surface border border-zipp-border rounded-3xl p-4 space-y-3 text-xs shadow-sm">
                <div className="font-bold text-zipp-text uppercase tracking-wider text-[10px]">Seguridad de la Cuenta</div>
                <div className="flex justify-between text-zipp-text-muted">
                  <span>DNI Verificado</span>
                  <span className="text-green-500 font-bold">✓ {currentUser.dni ? `${currentUser.dni.slice(0, 2)}XXXX${currentUser.dni.slice(-2)}` : '48XXXX92'}</span>
                </div>
                <div className="flex justify-between text-zipp-text-muted">
                  <span>Método de Ingreso</span>
                  <span className="text-zipp-text font-bold uppercase">{currentUser.loginMethod}</span>
                </div>
                <div className="flex justify-between text-zipp-text-muted">
                  <span>Teléfono Vinculado a Yape/Plin</span>
                  <span className="text-green-500 font-bold">✓ {currentUser.phone}</span>
                </div>
              </div>

              {/* App Extras & Splash preview */}
              <div className="bg-zipp-surface border border-zipp-border rounded-3xl p-4 flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-xs font-bold text-zipp-text">Animación de Bienvenida</div>
                  <div className="text-[10px] text-zipp-text-muted">Revivir la pantalla de carga con moto en ruta</div>
                </div>
                <button
                  onClick={() => setShowSplash(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-zipp-surface-2 hover:bg-zipp-surface border border-zipp-border text-zipp-text text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Bike size={14} className="text-zipp-red" />
                  Ver Splash ⚡
                </button>
              </div>

              {/* Logout & Return to Welcome Screen Button */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-2xl bg-zipp-surface-2 hover:bg-red-500/10 border border-zipp-border hover:border-red-500/40 text-red-500 font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <User size={15} />
                  <span>Cerrar Sesión y Volver a Pantalla de Inicio</span>
                </button>
              </div>
            </div>
          )}

        </main>

        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-zipp-surface/95 backdrop-blur-2xl border-t border-zipp-border px-4 py-2.5 z-40 flex items-center justify-around shadow-lg">
          {role === 'client' ? (
            <>
              <button
                onClick={() => setCurrentScreen('client-home')}
                className={`flex flex-col items-center gap-1 py-1 transition-all ${
                  currentScreen === 'client-home' ? 'text-zipp-red font-black' : 'text-zipp-text-muted hover:text-zipp-text'
                }`}
              >
                <Bike size={20} className={currentScreen === 'client-home' ? 'scale-110' : ''} />
                <span className="text-[10px] uppercase font-bold tracking-wider">Inicio</span>
              </button>

              <button
                onClick={() => setCurrentScreen('courier-new')}
                className={`flex flex-col items-center gap-1 py-1 transition-all ${
                  currentScreen === 'courier-new' ? 'text-zipp-red font-black' : 'text-zipp-text-muted hover:text-zipp-text'
                }`}
              >
                <Package size={20} className={currentScreen === 'courier-new' ? 'scale-110' : ''} />
                <span className="text-[10px] uppercase font-bold tracking-wider">Enviar</span>
              </button>

              <button
                onClick={() => setCurrentScreen('order-tracking')}
                className={`flex flex-col items-center gap-1 py-1 transition-all ${
                  currentScreen === 'order-tracking' ? 'text-zipp-red font-black' : 'text-zipp-text-muted hover:text-zipp-text'
                }`}
              >
                <Navigation size={20} className={currentScreen === 'order-tracking' ? 'scale-110' : ''} />
                <span className="text-[10px] uppercase font-bold tracking-wider">Rastreo</span>
              </button>

              <button
                onClick={() => setCurrentScreen('order-history')}
                className={`flex flex-col items-center gap-1 py-1 transition-all ${
                  currentScreen === 'order-history' ? 'text-zipp-red font-black' : 'text-zipp-text-muted hover:text-zipp-text'
                }`}
              >
                <History size={20} className={currentScreen === 'order-history' ? 'scale-110' : ''} />
                <span className="text-[10px] uppercase font-bold tracking-wider">Historial</span>
              </button>

              <button
                onClick={() => setCurrentScreen('profile')}
                className={`flex flex-col items-center gap-1 py-1 transition-all ${
                  currentScreen === 'profile' ? 'text-zipp-red font-black' : 'text-zipp-text-muted hover:text-zipp-text'
                }`}
              >
                <User size={20} className={currentScreen === 'profile' ? 'scale-110' : ''} />
                <span className="text-[10px] uppercase font-bold tracking-wider">Perfil</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCurrentScreen('rider-dashboard')}
                className={`flex flex-col items-center gap-1 py-1 transition-all ${
                  currentScreen === 'rider-dashboard' ? 'text-zipp-red font-black' : 'text-zipp-text-muted hover:text-zipp-text'
                }`}
              >
                <Bike size={20} className={currentScreen === 'rider-dashboard' ? 'scale-110' : ''} />
                <span className="text-[10px] uppercase font-bold tracking-wider">Radar</span>
              </button>

              <button
                onClick={() => setCurrentScreen('order-history')}
                className={`flex flex-col items-center gap-1 py-1 transition-all ${
                  currentScreen === 'order-history' ? 'text-zipp-red font-black' : 'text-zipp-text-muted hover:text-zipp-text'
                }`}
              >
                <TrendingUp size={20} className={currentScreen === 'order-history' ? 'scale-110' : ''} />
                <span className="text-[10px] uppercase font-bold tracking-wider">Ganancias</span>
              </button>

              <button
                onClick={() => setCurrentScreen('profile')}
                className={`flex flex-col items-center gap-1 py-1 transition-all ${
                  currentScreen === 'profile' ? 'text-zipp-red font-black' : 'text-zipp-text-muted hover:text-zipp-text'
                }`}
              >
                <User size={20} className={currentScreen === 'profile' ? 'scale-110' : ''} />
                <span className="text-[10px] uppercase font-bold tracking-wider">Mi Moto</span>
              </button>
            </>
          )}
        </nav>

        {/* Auth & Onboarding Portal Modal */}
        <AuthPortalModal
          isOpen={isAuthPortalOpen}
          onClose={() => setIsAuthPortalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          initialRole={role}
          allowDismiss={true}
        />

        {/* Price Calculator Modal */}
        <PriceCalculatorModal
          isOpen={isPriceCalcOpen}
          onClose={() => setIsPriceCalcOpen(false)}
        />

        {/* Security & SOS Modal */}
        <SecurityHubModal
          isOpen={isSecurityOpen}
          onClose={() => setIsSecurityOpen(false)}
        />

      </div>
      )}
    </div>
  );
}
