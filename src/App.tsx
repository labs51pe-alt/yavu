import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Search, History, User, Home as HomeIcon, Shield, MessageSquare, Star, ChevronRight, Navigation, PhoneCall, Check } from 'lucide-react';
import { cn } from './utils';
import { Screen, Trip, Driver, Role } from './types';

// --- Mock Data ---
const MOCK_DRIVER: Driver = {
  id: '1',
  name: 'José Mamani',
  avatar: '👨',
  rating: 4.9,
  trips: 412,
  plate: 'XYZ-123',
  vehicle: 'Honda Wave',
};

const MOCK_TRIPS: Trip[] = [
  {
    id: '1',
    origin: { address: 'Jr. Los Rosales 245', lat: -12.09, lng: -77.03 },
    destination: { address: 'Mercado Central', lat: -12.10, lng: -77.04 },
    price: 8,
    date: 'Hoy · 09:55 AM',
    status: 'completed',
    paymentMethod: 'yape',
    driver: MOCK_DRIVER,
  },
  {
    id: '2',
    origin: { address: 'Jr. Los Rosales 245', lat: -12.09, lng: -77.03 },
    destination: { address: 'Hospital MINSA', lat: -12.11, lng: -77.05 },
    price: 10,
    date: 'Ayer · 08:20 AM',
    status: 'completed',
    paymentMethod: 'cash',
    driver: MOCK_DRIVER,
  },
];

// --- Components ---

const ThemeToggle = ({ isDark, toggle }: { isDark: boolean; toggle: () => void }) => (
  <button
    onClick={toggle}
    className={cn(
      "w-12 h-7 rounded-full border-1.5 transition-all duration-300 flex items-center p-1 cursor-pointer",
      isDark ? "bg-zipp-black-4 border-zipp-lime/20" : "bg-zipp-black-4 border-zipp-green-md/30"
    )}
  >
    <motion.div
      animate={{ x: isDark ? 0 : 20 }}
      className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-lg",
        isDark ? "bg-zipp-lime text-zipp-black" : "bg-zipp-green-md text-white"
      )}
    >
      {isDark ? <Moon size={12} /> : <Sun size={12} />}
    </motion.div>
  </button>
);

const StatusBar = ({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-12 px-6 flex items-center justify-between shrink-0 z-50">
      <span className="text-sm font-bold text-zipp-text">{time}</span>
      <div className="flex items-center gap-3">
        <ThemeToggle isDark={isDark} toggle={onToggleTheme} />
        <div className="flex gap-1 text-xs text-zipp-text">
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>
    </div>
  );
};

const BottomNav = ({ current, onNav, role }: { current: Screen; onNav: (s: Screen) => void; role: Role | null }) => {
  const passengerItems = [
    { id: 'home', icon: HomeIcon, label: 'Inicio' },
    { id: 'destination', icon: Navigation, label: 'Pedir' },
    { id: 'history', icon: History, label: 'Viajes' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  const driverItems = [
    { id: 'driver-home', icon: HomeIcon, label: 'Inicio' },
    { id: 'driver-earnings', icon: Star, label: 'Ganancias' },
    { id: 'history', icon: History, label: 'Historial' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  const items = role === 'driver' ? driverItems : passengerItems;

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-zipp-black/95 backdrop-blur-xl border-t border-zipp-lime/10 flex pt-2 pb-8 z-[100]">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onNav(item.id as Screen)}
          className={cn(
            "flex-1 flex flex-col items-center gap-1 transition-all",
            current === item.id ? "text-zipp-lime" : "text-zipp-black-5"
          )}
        >
          <item.icon size={22} className={cn("transition-transform", current === item.id && "scale-110")} />
          <span className="text-[13px] font-bold uppercase tracking-widest">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

const DriverProfileModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 bg-zipp-black/80 backdrop-blur-sm">
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="w-full max-w-md bg-zipp-black-2 border border-zipp-lime/20 rounded-t-[40px] p-8 pb-12 shadow-2xl"
        >
          <div className="w-12 h-1.5 bg-zipp-black-4 rounded-full mx-auto mb-8" />
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-zipp-lime to-zipp-green-md flex items-center justify-center text-6xl mb-4 shadow-xl shadow-zipp-lime/20">
              👨‍✈️
            </div>
            <h3 className="font-display text-3xl mb-1">José Mamani</h3>
            <div className="flex items-center gap-2 bg-zipp-lime/10 px-3 py-1 rounded-full text-zipp-lime text-[10px] font-bold uppercase tracking-widest mb-4 border border-zipp-lime/20">
              <Shield size={12} fill="currentColor" /> Conductor Verificado YAVU
            </div>
            <p className="text-sm text-zipp-black-5 max-w-[240px]">"Comprometido con tu seguridad y rapidez en Tarapoto."</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-zipp-black-3 rounded-2xl p-5 border border-zipp-lime/5">
              <div className="text-[10px] text-zipp-black-5 uppercase font-bold tracking-widest mb-3">Documentación 🇵🇪</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zipp-black-5">DNI</span>
                  <span className="font-bold">45XXX892</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zipp-black-5">Antecedentes Penales</span>
                  <span className="text-green-400 font-bold">✓ Verificados</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zipp-black-5">Licencia de Conducir</span>
                  <span className="text-green-400 font-bold">✓ Vigente</span>
                </div>
              </div>
            </div>

            <div className="bg-zipp-black-3 rounded-2xl p-5 border border-zipp-lime/5">
              <div className="text-[10px] text-zipp-black-5 uppercase font-bold tracking-widest mb-3">Vehículo</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zipp-black-5">Placa</span>
                  <span className="font-bold bg-zipp-lime text-zipp-black px-2 py-0.5 rounded">XYZ-123</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zipp-black-5">Modelo</span>
                  <span className="font-bold">Honda Wave 110</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zipp-black-5">Color</span>
                  <span className="font-bold">Azul / Negro</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-zipp-lime text-zipp-black font-display py-4 rounded-2xl shadow-lg"
          >
            Cerrar Perfil
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [role, setRole] = useState<Role | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState('Jr. Los Rosales 245');

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }, (error) => {
        console.error("Error getting location:", error);
      });
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };
  const [selectedDest, setSelectedDest] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [showDriverProfile, setShowDriverProfile] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (screen === 'splash') {
      const timer = setTimeout(() => setScreen('onboarding'), 2500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  useEffect(() => {
    if (screen === 'searching') {
      const timer = setTimeout(() => setScreen('riding'), 4000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const shareRoute = useCallback(() => {
    const message = `¡Hola! Estoy siguiendo mi viaje en YAVU 🛺.\nConductor: José Mamani (Verificado ✅)\nPlaca: XYZ-123\nDestino: ${selectedDest || 'Mercado Central'}\nSigue mi ruta en tiempo real aquí: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    setHasShared(true);
  }, [selectedDest]);

  const toggleTheme = useCallback(() => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.setAttribute('data-theme', nextDark ? 'dark' : 'light');
  }, [isDark]);

  const go = (s: Screen) => setScreen(s);

  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return (
          <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-zipp-black">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(42,122,72,0.5)_0%,transparent_55%)]" />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-display font-extrabold text-[100px] leading-none tracking-tighter text-zipp-lime z-10"
            >
              YAVU
            </motion.div>
            <div className="text-xs text-zipp-black-5 uppercase tracking-[0.4em] mt-2 z-10">🇵🇪 seguridad · confianza · perú</div>
            <div className="flex gap-2 mt-10 z-10">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ scale: [0.6, 1.3, 0.6], opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.2 }}
                  className={cn("w-2 h-2 rounded-full", i === 0 ? "bg-zipp-lime" : i === 1 ? "bg-zipp-yellow" : "bg-zipp-green-lt")}
                />
              ))}
            </div>
          </div>
        );

      case 'onboarding':
        return (
          <div className="h-[100dvh] flex flex-col overflow-hidden bg-zipp-bg">
            <StatusBar isDark={isDark} onToggleTheme={toggleTheme} />
            <div className="flex-1 flex flex-col justify-center px-7 pb-8">
              <div className="flex flex-col items-center justify-center relative mb-4">
                <div className="absolute w-20 h-20 bg-zipp-lime/10 blur-3xl rounded-full" />
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, y: [0, -4, 0] }}
                  transition={{ 
                    scale: { duration: 0.5 },
                    opacity: { duration: 0.5 },
                    y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                  }}
                  className="text-[64px] relative z-10 drop-shadow-[0_10px_20px_rgba(198,241,53,0.15)]"
                >
                  🛺
                </motion.div>
                
                <div className="mt-1 flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                      className="w-1 h-1 rounded-full bg-zipp-lime"
                    />
                  ))}
                </div>
              </div>
              
              <div className="w-full text-left">
                <div className="inline-flex items-center gap-2 bg-zipp-lime/10 border border-zipp-lime/20 text-zipp-lime px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider mb-3">
                  🛡️ Seguridad 100% Peruana
                </div>
                <h1 className="font-display font-black text-[46px] leading-[0.9] tracking-tighter mb-6">
                  Viaja con<br />
                  <span className="text-zipp-lime italic block mt-1">Seguridad</span>
                  <span className="text-zipp-text">y Confianza</span>
                </h1>
                <p className="text-base text-zipp-black-5 leading-snug mb-6 max-w-[300px]">
                  <span className="text-zipp-lime font-bold">Seguridad Certificada</span> y <span className="text-zipp-text font-bold">Garantía Total</span>.<br />
                  Paga lo justo con <span className="text-zipp-lime font-bold">Tarifas Transparentes</span>.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {['Costa', 'Sierra', 'Selva'].map(region => (
                    <div key={region} className="bg-zipp-black-3 border border-zipp-lime/10 px-3 py-1.5 rounded-full text-xs font-bold text-zipp-black-5">
                      🇵🇪 {region}
                    </div>
                  ))}
                  <div className="bg-zipp-lime/10 border border-zipp-lime/20 px-3 py-1.5 rounded-full text-xs font-bold text-zipp-lime">
                    📍 En todo el Perú
                  </div>
                </div>

                <div className="space-y-3">
                  <button onClick={() => go('role-selection')} className="w-full bg-zipp-lime text-zipp-black font-display font-bold py-4.5 rounded-2xl shadow-lg shadow-zipp-lime/20 hover:scale-[1.01] active:scale-[0.99] transition-all text-base">
                    Empezar ahora →
                  </button>
                  <button onClick={() => go('register-phone')} className="w-full bg-zipp-black-3 border border-zipp-lime/10 font-display font-bold py-4.5 rounded-2xl hover:bg-zipp-black-4 transition-all text-base">
                    Ya tengo cuenta
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'role-selection':
        return (
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
            <StatusBar isDark={isDark} onToggleTheme={toggleTheme} />
            <div className="px-6 pt-4 flex items-center gap-4">
              <button onClick={() => go('onboarding')} className="back">←</button>
              <span className="font-display text-xl text-zipp-lime">YAVU</span>
            </div>
            <div className="flex-1 px-6 pt-12 flex flex-col gap-6">
              <h2 className="font-display font-extrabold text-5xl leading-none tracking-tight mb-4">Elige tu<br /><span className="text-zipp-lime italic">experiencia</span></h2>
              <p className="text-base text-zipp-black-5 mb-6">Una sola cuenta, dos formas de moverte.</p>

              <button 
                onClick={() => { setRole('passenger'); go('register-phone'); }}
                className="group relative bg-zipp-black-2 border-2 border-zipp-lime/10 rounded-3xl p-8 text-left overflow-hidden hover:border-zipp-lime transition-all"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Navigation size={120} />
                </div>
                <div className="w-16 h-16 bg-zipp-lime/10 rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:bg-zipp-lime/20 transition-colors">🛺</div>
                <h3 className="font-display text-2xl mb-1">Pedir Mototaxi</h3>
                <p className="text-xs text-zipp-black-5">Viaja con seguridad y tarifas establecidas.</p>
              </button>

              <button 
                onClick={() => { setRole('driver'); go('register-phone'); }}
                className="group relative bg-zipp-black-2 border-2 border-zipp-lime/10 rounded-3xl p-8 text-left overflow-hidden hover:border-zipp-lime transition-all"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Shield size={120} />
                </div>
                <div className="w-16 h-16 bg-zipp-lime/10 rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:bg-zipp-lime/20 transition-colors">🛺</div>
                <h3 className="font-display text-2xl mb-1">Ser Conductor</h3>
                <p className="text-xs text-zipp-black-5">Gana dinero manejando en tu propia ciudad.</p>
              </button>
            </div>
          </div>
        );

      case 'register-phone':
        return (
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
            <StatusBar isDark={isDark} onToggleTheme={toggleTheme} />
            <div className="px-6 pt-4 flex items-center gap-4">
              <button onClick={() => go('onboarding')} className="back">←</button>
              <span className="font-display text-xl text-zipp-lime">YAVU</span>
            </div>
            <div className="flex-1 px-6 pt-8">
              <div className="flex gap-1 mb-6">
                <div className="h-[3px] bg-zipp-lime flex-[2] rounded-full" />
                <div className="h-[3px] bg-zipp-black-5 flex-1 rounded-full" />
              </div>
              <h2 className="font-display font-extrabold text-4xl leading-none tracking-tight mb-4">Tu número<br />de celular</h2>
              <p className="text-base text-zipp-black-5 mb-10">Te mandamos un código OTP por WhatsApp. Sin contraseñas.</p>
              
              <label className="lbl">Celular</label>
              <div className="flex gap-3 mb-4">
                <div className="bg-zipp-black-3 border border-zipp-lime/10 rounded-xl px-4 flex items-center gap-2 font-bold">
                  🇵🇪 +51
                </div>
                <input 
                  type="tel" 
                  placeholder="9XX XXX XXX" 
                  className="field flex-1"
                  autoFocus
                />
              </div>
              
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex gap-3 items-center mb-8">
                <MessageSquare className="text-green-400" size={20} />
                <span className="text-xs text-green-400/80 leading-tight">Recibirás tu <strong>código OTP por WhatsApp</strong> — sin costo</span>
              </div>

              <button onClick={() => go('register-otp')} className="w-full bg-zipp-lime text-zipp-black font-display py-4 rounded-2xl shadow-lg shadow-zipp-lime/20">
                Enviar código →
              </button>
            </div>
          </div>
        );

      case 'register-otp':
        return (
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
            <StatusBar isDark={isDark} onToggleTheme={toggleTheme} />
            <div className="px-6 pt-4 flex items-center gap-4">
              <button onClick={() => go('register-phone')} className="back">←</button>
              <span className="font-display text-xl text-zipp-lime">YAVU</span>
            </div>
            <div className="flex-1 px-6 pt-8">
              <div className="flex gap-1 mb-6">
                <div className="h-[3px] bg-zipp-lime/30 flex-1 rounded-full" />
                <div className="h-[3px] bg-zipp-lime flex-[2] rounded-full" />
              </div>
              <h2 className="font-display font-extrabold text-4xl leading-none tracking-tight mb-4">Código<br />WhatsApp</h2>
              <p className="text-base text-zipp-black-5 mb-10">Ingresa los 4 dígitos que te enviamos</p>
              
              <div className="text-center mb-4 text-sm text-zipp-black-5">
                Enviado a <strong className="text-zipp-lime">+51 987 654 321</strong>
              </div>
              
              <div className="flex gap-3 mb-8">
                {[1, 2, 3, 4].map(i => (
                  <input 
                    key={i}
                    type="number" 
                    maxLength={1}
                    placeholder="·"
                    className="flex-1 bg-zipp-black-3 border border-zipp-lime/10 rounded-xl py-4 text-center text-2xl font-black outline-none focus:border-zipp-lime transition-colors"
                  />
                ))}
              </div>

              <button onClick={() => go(role === 'driver' ? 'driver-home' : 'home')} className="w-full bg-zipp-lime text-zipp-black font-display py-4 rounded-2xl shadow-lg shadow-zipp-lime/20 mb-3">
                ¡Entrar a YAVU! ⚡
              </button>
              <button className="w-full bg-zipp-black-3 border border-zipp-lime/10 font-display py-4 rounded-2xl">Reenviar código</button>
            </div>
          </div>
        );

      case 'home':
        return (
          <div className="flex-1 flex flex-col relative overflow-hidden">
            <StatusBar isDark={isDark} onToggleTheme={toggleTheme} />
            <div className="flex-1 relative">
              {/* Real Map Integration */}
              <div className="absolute inset-0 bg-[#0A1408] overflow-hidden">
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  style={{ border: 0, filter: isDark ? 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' : 'none' }}
                  src={userLocation 
                    ? `https://maps.google.com/maps?q=${userLocation.lat},${userLocation.lng}&z=16&output=embed`
                    : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15836.4382894371!2d-76.375489!3d-6.483667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91ba093f1857973d%3A0x8898989898989898!2sTarapoto!5e0!3m2!1sen!2spe!4v1710170000000!5m2!1sen!2spe"
                  }
                  allowFullScreen
                ></iframe>
                
                {/* User Pin Overlay */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 pointer-events-none"
                >
                  <div className="w-11 h-11 rounded-full rounded-br-none -rotate-45 bg-gradient-to-br from-zipp-lime to-zipp-green-lt flex items-center justify-center shadow-[0_6px_22px_rgba(198,241,53,0.5)]">
                    <div className="rotate-45 text-lg">👤</div>
                  </div>
                  <div className="w-3 h-1 bg-black/40 rounded-full mt-1 blur-[1px]" />
                </motion.div>
              </div>

              {/* Install PWA Banner */}
              <AnimatePresence>
                {showInstallBanner && (
                  <motion.div 
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="absolute top-20 left-4 right-4 z-50 bg-zipp-black/90 backdrop-blur-xl border border-zipp-lime/30 p-4 rounded-2xl flex items-center gap-4 shadow-2xl"
                  >
                    <div className="w-12 h-12 rounded-xl bg-zipp-lime flex items-center justify-center text-2xl shadow-lg">
                      <img src="https://img.icons8.com/color/512/rickshaw.png" className="w-10 h-10 object-contain" alt="YAVU" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold">Instalar YAVU</div>
                      <div className="text-[10px] text-zipp-black-5">Accede rápido desde tu pantalla de inicio</div>
                    </div>
                    <button 
                      onClick={handleInstallClick}
                      className="bg-zipp-lime text-zipp-black px-4 py-2 rounded-xl text-xs font-black"
                    >
                      INSTALAR
                    </button>
                    <button onClick={() => setShowInstallBanner(false)} className="text-zipp-black-5">✕</button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* UI Overlay */}
              <div className="flex-1 flex flex-col pointer-events-none z-30 h-full">
                <div className="safe-top" />
              <div className="px-5 pt-12 flex items-center gap-3 pointer-events-auto">
                <div className="font-display text-2xl text-zipp-lime bg-zipp-black/80 backdrop-blur-md border border-zipp-lime/20 px-4 py-2 rounded-full leading-none">YAVU</div>
                <div className="flex-1 bg-zipp-black/80 backdrop-blur-md border border-zipp-lime/10 px-4 py-2.5 rounded-full overflow-hidden">
                  <div className="text-base font-bold truncate">{userLocation ? "Ubicación detectada" : "Jr. Los Rosales 245"}</div>
                  <div className="text-sm text-zipp-black-5">{userLocation ? "Cerca de tu posición" : "San Isidro, Lima"}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zipp-green-md to-zipp-lime flex items-center justify-center text-sm font-black text-zipp-black shadow-lg overflow-hidden">
                  <img src="https://img.icons8.com/color/96/rickshaw.png" className="w-8 h-8 object-contain" alt="M" />
                </div>
              </div>

                <div className="mt-4 ml-5 self-start bg-zipp-black/85 backdrop-blur-md border border-zipp-lime/20 px-4 py-2 rounded-full text-[11px] font-bold text-zipp-lime flex items-center gap-2 pointer-events-auto">
                  <div className="w-1.5 h-1.5 bg-zipp-lime rounded-full animate-pulse" />
                  3 mototaxis cerca
                </div>

                <div className="mt-auto bg-zipp-black/95 backdrop-blur-2xl rounded-t-[32px] border-t border-zipp-lime/20 px-6 pt-5 pb-32 pointer-events-auto">
                  <div className="w-10 h-1 bg-zipp-black-5 rounded-full mx-auto mb-5" />
                  
                  {/* School Service Feature */}
                  <div 
                    onClick={() => {
                      setSelectedDest('Colegio Santa Rosa');
                      setSelectedPrice(5);
                      go('searching');
                    }}
                    className="mb-5 bg-gradient-to-r from-zipp-lime/20 to-zipp-green-md/10 border border-zipp-lime/30 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-zipp-lime transition-all group pointer-events-auto"
                  >
                    <div className="w-12 h-12 rounded-xl bg-zipp-lime flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">🎒</div>
                    <div className="flex-1">
                      <div className="text-sm font-black text-zipp-lime">SERVICIO ESCOLAR</div>
                      <div className="text-[10px] text-zipp-black-5">Traslado seguro para tus hijos</div>
                    </div>
                    <div className="bg-zipp-lime text-zipp-black px-3 py-1 rounded-full text-[10px] font-black">PEDIR</div>
                  </div>

                  <div 
                    onClick={() => go('destination')}
                    className="flex items-center gap-4 bg-zipp-black-3 border border-zipp-lime/20 rounded-2xl p-4 cursor-pointer hover:border-zipp-lime transition-all"
                  >
                    <Search className="text-zipp-lime" size={20} />
                    <div className="flex-1">
                      <div className="text-base font-bold">¿A dónde vas?</div>
                      <div className="text-xs text-zipp-black-5">Toca para buscar tu destino</div>
                    </div>
                    <ChevronRight className="text-zipp-black-5" size={20} />
                  </div>

                  <div className="flex gap-3 overflow-x-auto mt-5 pb-2 no-scrollbar">
                    {[
                      { id: '1', icon: '🏠', label: 'Casa' },
                      { id: '2', icon: '💼', label: 'Trabajo' },
                      { id: '3', icon: '🛒', label: 'Mercado' },
                      { id: '4', icon: '🎓', label: 'U/Cole' },
                    ].map(fav => (
                      <button key={fav.id} className="flex items-center gap-2 bg-zipp-black-3 border border-zipp-lime/10 px-4 py-2.5 rounded-full whitespace-nowrap hover:border-zipp-lime transition-all">
                        <span className="text-base">{fav.icon}</span>
                        <span className="text-xs font-bold">{fav.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <BottomNav current={screen} onNav={go} role={role} />
          </div>
        );

      case 'destination':
        return (
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
            <StatusBar isDark={isDark} onToggleTheme={toggleTheme} />
            <div className="px-6 pt-4 flex items-center gap-4">
              <button onClick={() => go('home')} className="back">←</button>
              <h2 className="font-display font-bold text-3xl tracking-tighter">¿A dónde?</h2>
            </div>
            <div className="flex-1 px-6 pt-6">
              <div className="bg-zipp-black-2 border border-zipp-lime/20 rounded-2xl p-4 mb-6 shadow-xl">
                <div className="flex items-center gap-4 py-2">
                  <div className="w-2.5 h-2.5 bg-zipp-lime rounded-full shrink-0" />
                  <div className="flex-1 flex items-center justify-between">
                    <input className="flex-1 bg-transparent border-none outline-none font-medium text-sm" value={userLocation ? "Mi ubicación actual" : "Jr. Los Rosales 245, San Isidro"} readOnly />
                    {userLocation && <span className="text-[10px] bg-zipp-lime/20 text-zipp-lime px-2 py-0.5 rounded-full font-bold">GPS Activo</span>}
                  </div>
                </div>
                <div className="h-px bg-zipp-lime/10 my-2 border-dashed border-t" />
                <div className="flex items-center gap-4 py-2">
                  <div className="w-2.5 h-2.5 bg-zipp-yellow rounded-full shrink-0" />
                  <input 
                    className="flex-1 bg-transparent border-none outline-none font-medium text-sm" 
                    placeholder="Escribe tu destino..." 
                    autoFocus
                    onChange={(e) => setSelectedDest(e.target.value)}
                  />
                </div>
              </div>

              <div className="text-[11px] font-bold text-zipp-black-5 uppercase tracking-widest mb-4">Lugares frecuentes</div>
              
              <div className="space-y-1">
                {[
                  { name: 'Mercado Central', sub: 'Tarapoto · 1.8 km', price: 6, icon: '🛒' },
                  { name: 'Hospital MINSA', sub: 'Tarapoto · 2.4 km', price: 8, icon: '🏥' },
                  { name: 'Universidad Nacional', sub: 'Tarapoto · 3.1 km', price: 10, icon: '🎓' },
                  { name: 'Plaza Mayor', sub: 'Centro · 1.2 km', price: 5, icon: '🏛️' },
                  { name: 'Terminal Terrestre', sub: 'Tarapoto · 4.2 km', price: 12, icon: '🚌' },
                ].map((loc, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      setSelectedDest(loc.name);
                      setSelectedPrice(loc.price);
                      go('searching');
                    }}
                    className="w-full flex items-center gap-4 py-4 border-b border-zipp-lime/5 hover:bg-zipp-lime/5 transition-all group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-zipp-black-3 border border-zipp-lime/10 flex items-center justify-center text-xl group-hover:bg-zipp-lime/20 group-hover:border-zipp-lime transition-all">
                      {loc.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-bold">{loc.name}</div>
                      <div className="text-xs text-zipp-black-5">{loc.sub}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg text-zipp-lime leading-none">S/{loc.price}</div>
                      <div className="text-[8px] text-zipp-black-5 uppercase font-bold tracking-tighter mt-1">Precio Fijo</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'searching':
        return (
          <div className="flex-1 flex flex-col bg-[radial-gradient(ellipse_at_50%_40%,rgba(26,77,46,0.5)_0%,transparent_60%)]">
            <StatusBar isDark={isDark} onToggleTheme={toggleTheme} />
            <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
              <div className="w-[210px] h-[210px] relative flex items-center justify-center">
                {[0, 1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.7, 0], scale: [1, 1.1] }}
                    transition={{ repeat: Infinity, duration: 2.4, delay: i * 0.5 }}
                    className="absolute inset-0 rounded-full border-1.5 border-zipp-lime/20"
                    style={{ width: 55 + i * 45, height: 55 + i * 45, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                  />
                ))}
                <motion.div 
                  animate={{ boxShadow: ['0 0 30px rgba(198,241,53,0.45)', '0 0 60px rgba(198,241,53,0.75)', '0 0 30px rgba(198,241,53,0.45)'] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-zipp-green-md to-zipp-lime flex items-center justify-center text-3xl z-10"
                >
                  🛺
                </motion.div>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-full h-full relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl drop-shadow-lg">🛺</div>
                  </div>
                </motion.div>
              </div>

              <h2 className="font-display font-extrabold text-[42px] leading-tight text-center mb-2">Buscando<br /><span className="text-zipp-lime italic">tu YAVU...</span></h2>
              <p className="text-sm text-zipp-black-5 text-center leading-relaxed">3 conductores disponibles cerca.<br />Asignando el más rápido para ti.</p>

              <div className="w-full bg-zipp-black-2 border border-zipp-lime/20 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-zipp-lime shrink-0" />
                  <div className="text-xs font-medium truncate">Jr. Los Rosales 245, San Isidro</div>
                </div>
                <div className="h-px border-t border-dashed border-zipp-lime/10" />
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-zipp-yellow shrink-0" />
                  <div className="text-xs font-medium truncate">{selectedDest || 'Mercado Central'}</div>
                </div>
              </div>

              <div className="w-full flex justify-between items-center bg-zipp-black-2 border border-zipp-lime/20 rounded-2xl p-4">
                <div>
                  <span className="text-[10px] text-zipp-black-5 uppercase font-bold tracking-widest block">Precio fijo</span>
                  <strong className="font-display text-4xl text-zipp-lime leading-none">S/{selectedPrice || 6}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zipp-black-5 block">Tiempo est.</span>
                  <strong className="text-xl font-black text-zipp-yellow">~10 min</strong>
                </div>
              </div>

              <button onClick={() => go('home')} className="text-sm font-bold text-zipp-black-5 hover:text-red-400 transition-colors">
                Cancelar búsqueda
              </button>
            </div>
          </div>
        );

      case 'riding':
        return (
          <div className="flex-1 flex flex-col">
            <div className="h-[52vh] bg-[#0A1408] relative overflow-hidden shrink-0">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0, filter: isDark ? 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' : 'none' }}
                src={userLocation 
                  ? `https://maps.google.com/maps?q=${userLocation.lat},${userLocation.lng}&z=16&output=embed`
                  : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15836.4382894371!2d-76.375489!3d-6.483667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91ba093f1857973d%3A0x8898989898989898!2sTarapoto!5e0!3m2!1sen!2spe!4v1710170000000!5m2!1sen!2spe"
                }
                allowFullScreen
              ></iframe>
              
              {/* Destination Pin */}
              <div className="absolute top-[16%] right-[20%] flex flex-col items-center pointer-events-none">
                <div className="w-9 h-9 rounded-full rounded-br-none -rotate-45 bg-zipp-yellow flex items-center justify-center text-sm shadow-xl">
                  <span className="rotate-45">🏁</span>
                </div>
                <div className="w-3 h-1 bg-black/40 rounded-full mt-1 blur-[1px]" />
              </div>

              {/* Rider */}
              <motion.div 
                animate={{ 
                  x: [0, 50, 100],
                  y: [0, -20, 0],
                  rotate: [-4, 2, -4] 
                }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                className="absolute bottom-[36%] left-[27%] text-4xl z-10 drop-shadow-2xl pointer-events-none"
              >
                🛺
              </motion.div>
              
              <div className="absolute top-4 left-4 right-4 flex gap-2 pointer-events-none">
                <div className="bg-zipp-black/90 backdrop-blur-md border border-zipp-lime/20 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-zipp-lime rounded-full animate-pulse" />
                  En camino
                </div>
                <div className="bg-zipp-black/90 backdrop-blur-md border border-zipp-lime/20 px-4 py-2 rounded-full text-xs font-bold">⏱️ 4 min</div>
                <div className="bg-zipp-black/90 backdrop-blur-md border border-zipp-lime/20 px-4 py-2 rounded-full text-xs font-bold">📍 0.9 km</div>
              </div>
            </div>

            <div className="flex-1 bg-zipp-black rounded-t-[22px] -mt-4 px-6 pt-5 pb-8 flex flex-col gap-3 overflow-y-auto no-scrollbar relative z-40 border-t border-zipp-lime/20">
              <div className="w-10 h-1 bg-zipp-black-5 rounded-full mx-auto mb-2" />
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-5xl text-zipp-lime leading-none">4 min</div>
                  <div className="text-xs text-zipp-black-5 mt-1">tu conductor llega</div>
                </div>
                <div className="bg-zipp-lime/10 border border-zipp-lime/20 text-zipp-lime px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-zipp-lime rounded-full animate-pulse" />
                  En ruta
                </div>
              </div>

              <div className="bg-zipp-black-2 border border-zipp-lime/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zipp-orange to-zipp-yellow flex items-center justify-center text-2xl shrink-0">👨</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold">José Mamani</div>
                    <div className="bg-zipp-lime/10 text-zipp-lime px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
                      <Shield size={10} /> Verificado
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-zipp-yellow text-xs">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <span className="text-zipp-black-5 ml-1">4.9 · 412 viajes</span>
                  </div>
                  <div className="inline-block bg-zipp-black-4 text-zipp-black-5 px-2 py-0.5 rounded text-[10px] font-bold mt-1 tracking-widest">XYZ-123</div>
                </div>
                <button 
                  onClick={() => setShowDriverProfile(true)}
                  className="bg-zipp-black-3 border border-zipp-lime/10 px-3 py-2 rounded-xl text-[10px] font-bold text-zipp-lime hover:bg-zipp-lime/10 transition-all"
                >
                  Ver Perfil
                </button>
              </div>

              <div className="bg-zipp-black-2 border border-zipp-lime/10 rounded-xl p-3.5 flex justify-between items-center">
                <div className="text-xs text-zipp-black-5">Destino · <span className="text-zipp-text font-bold">{selectedDest || 'Mercado Central'}</span></div>
                <div className="font-display text-2xl text-zipp-lime leading-none">S/{selectedPrice || 8}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl py-4 font-bold text-sm">
                  <PhoneCall size={18} /> Llamar
                </button>
                <button className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl py-4 font-bold text-sm">
                  <Shield size={18} /> SOS
                </button>
              </div>

              <button 
                onClick={shareRoute}
                className={`w-full ${hasShared ? 'bg-zipp-lime text-zipp-black shadow-lg shadow-zipp-lime/20' : 'bg-green-600/20 border border-green-500/30 text-green-400'} font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all`}
              >
                {hasShared ? <Check size={18} /> : <MessageSquare size={18} />}
                {hasShared ? 'Ruta Compartida con Éxito' : 'Compartir Ruta por WhatsApp'}
              </button>

              <button onClick={() => go('payment')} className="w-full bg-zipp-lime text-zipp-black font-display py-4 rounded-2xl shadow-lg shadow-zipp-lime/20 mt-2">
                ✓ Llegué — Pagar ahora
              </button>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="flex-1 flex flex-col">
            <StatusBar isDark={isDark} onToggleTheme={toggleTheme} />
            <div className="flex-1 px-6 pt-4 overflow-y-auto no-scrollbar">
              <div className="text-center py-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-7xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="font-display text-3xl leading-none">¡<span className="text-zipp-lime italic">LLEGASTE!</span></h2>
                <p className="text-xs text-zipp-black-5 mt-1">{selectedDest || 'Mercado Central, Tarapoto'}</p>
              </div>

              <div className="bg-gradient-to-br from-zipp-lime/10 to-zipp-green-md/20 border border-zipp-lime/20 rounded-2xl p-6 text-center mb-6 shadow-2xl">
                <div className="text-[10px] text-zipp-black-5 uppercase font-bold tracking-widest mb-2">Total del viaje</div>
                <div className="font-display text-8xl text-zipp-lime leading-none tracking-tighter">S/{selectedPrice || 8}</div>
                <div className="text-xs text-zipp-black-5 mt-2">1.8 km · 11 min · José Mamani</div>
              </div>

              <div className="text-[10px] font-bold text-zipp-black-5 uppercase tracking-widest mb-3">¿Cómo vas a pagar?</div>
              
              <div className="space-y-2 mb-6">
                {[
                  { id: 'cash', emoji: '💵', label: 'Efectivo', sub: 'Paga en mano al conductor' },
                  { id: 'yape', emoji: '💜', label: 'Yape', sub: 'Link de pago por WhatsApp' },
                  { id: 'plin', emoji: '🔵', label: 'Plin', sub: 'Link de pago por WhatsApp' },
                ].map(opt => (
                  <button 
                    key={opt.id}
                    className="w-full bg-zipp-black-2 border-2 border-zipp-lime/10 rounded-xl p-4 flex items-center gap-4 hover:border-zipp-lime hover:bg-zipp-lime/5 transition-all group"
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <div className="flex-1 text-left">
                      <strong className="block text-sm font-bold">{opt.label}</strong>
                      <span className="text-[10px] text-zipp-black-5">{opt.sub}</span>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-zipp-lime/20 flex items-center justify-center group-hover:border-zipp-lime transition-all">
                      <div className="w-2.5 h-2.5 bg-zipp-lime rounded-full opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </button>
                ))}
              </div>

              <button onClick={() => go('rating')} className="w-full bg-zipp-lime text-zipp-black font-display py-4 rounded-2xl shadow-lg shadow-zipp-lime/20">
                Confirmar pago →
              </button>
            </div>
          </div>
        );

      case 'rating':
        return (
          <div className="flex-1 flex flex-col">
            <StatusBar isDark={isDark} onToggleTheme={toggleTheme} />
            <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zipp-orange to-zipp-yellow flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(255,123,28,0.35)]">
                👨
              </div>
              <div className="text-center">
                <h2 className="font-display font-extrabold text-4xl leading-tight">¿Cómo estuvo<br /><span className="text-zipp-lime italic">José?</span></h2>
                <p className="text-sm text-zipp-black-5 mt-1">Tu opinión ayuda a mejorar YAVU 🇵🇪</p>
              </div>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <button key={i} className="text-5xl grayscale hover:grayscale-0 hover:scale-110 transition-all">⭐</button>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {['😊 Amable', '⚡ Rápido', '🪖 Con casco', '🛣️ Buen camino', '🤫 Silencioso'].map(tag => (
                  <button key={tag} className="bg-zipp-black-3 border border-zipp-lime/10 px-4 py-2.5 rounded-full text-xs font-bold hover:border-zipp-lime hover:bg-zipp-lime/10 transition-all">
                    {tag}
                  </button>
                ))}
              </div>

              <div className="w-full space-y-3">
                <button onClick={() => go('home')} className="w-full bg-zipp-lime text-zipp-black font-display py-4 rounded-2xl shadow-lg shadow-zipp-lime/20">Enviar y listo ⚡</button>
                <button onClick={() => go('home')} className="w-full bg-zipp-black-3 border border-zipp-lime/10 font-display py-4 rounded-2xl">Omitir</button>
              </div>
            </div>
          </div>
        );

      case 'driver-home':
        return (
          <div className="flex-1 flex flex-col relative overflow-y-auto no-scrollbar">
            <StatusBar isDark={isDark} onToggleTheme={toggleTheme} />
            <div className="flex-1 flex flex-col px-6 pt-4 pb-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zipp-lime to-zipp-green-md flex items-center justify-center text-2xl shadow-lg shadow-zipp-lime/20">J</div>
                  <div>
                    <div className="text-sm font-bold">José Mamani</div>
                    <div className="text-[10px] text-zipp-black-5 uppercase tracking-widest font-bold">XYZ-123 · Lima</div>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-zipp-black-3 border border-zipp-lime/10 flex items-center justify-center relative">
                  <MessageSquare size={20} className="text-zipp-black-5" />
                  <div className="absolute top-2 right-2 w-2 h-2 bg-zipp-lime rounded-full border-2 border-zipp-black" />
                </button>
              </div>

              <div className="flex flex-col items-center gap-6 mb-10">
                <div className="text-[10px] font-bold text-zipp-black-5 uppercase tracking-[0.2em]">Estado actual</div>
                
                <button 
                  onClick={() => setTimeout(() => go('driver-request'), 3000)}
                  className="group relative w-48 h-48 rounded-full bg-zipp-black-3 border-4 border-zipp-black-4 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(0,0,0,0.3)]"
                >
                  <div className="absolute inset-[-12px] rounded-full border-2 border-zipp-black-5/20 animate-[ping_3s_linear_infinite]" />
                  <div className="text-6xl drop-shadow-lg">🛺</div>
                  <div className="font-display text-xl text-zipp-black-5 tracking-widest">OFFLINE</div>
                </button>

                <div className="text-center">
                  <div className="font-display text-2xl text-zipp-black-5 leading-none">Toca para conectarte</div>
                  <p className="text-[10px] text-zipp-black-5 mt-2">¡Listo para recibir viajes!</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { label: 'Viajes hoy', val: '7', color: 'text-zipp-lime' },
                  { label: 'Ganado hoy', val: 'S/56', color: 'text-zipp-yellow' },
                  { label: 'Rating', val: '4.9', color: 'text-zipp-lime' },
                ].map(stat => (
                  <div key={stat.label} className="bg-zipp-black-2 border border-zipp-lime/10 rounded-2xl p-4 text-center">
                    <div className={cn("font-display text-2xl leading-none mb-1", stat.color)}>{stat.val}</div>
                    <div className="text-[9px] text-zipp-black-5 uppercase font-bold tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl tracking-tight">Últimos viajes</h3>
                <button onClick={() => go('driver-earnings')} className="text-xs font-bold text-zipp-lime">Ver todos →</button>
              </div>

              <div className="space-y-3 overflow-y-auto no-scrollbar pb-32">
                {MOCK_TRIPS.map(trip => (
                  <div key={trip.id} className="bg-zipp-black-2 border border-zipp-lime/10 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-zipp-green-lt" />
                    <div className="flex-1">
                      <div className="text-sm font-bold truncate">{trip.destination.address}</div>
                      <div className="text-[10px] text-zipp-black-5">Hace 20 min · 2.3 km</div>
                    </div>
                    <div className="font-display text-xl text-zipp-lime">S/{trip.price}</div>
                  </div>
                ))}
              </div>
            </div>
            <BottomNav current={screen} onNav={go} role={role} />
          </div>
        );

      case 'driver-request':
        return (
          <div className="flex-1 flex flex-col bg-zipp-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(198,241,53,0.15)_0%,transparent_70%)]" />
            
            <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-24 h-24 rounded-full bg-zipp-lime flex items-center justify-center text-5xl mb-8 shadow-[0_0_60px_rgba(198,241,53,0.4)]"
              >
                🛺
              </motion.div>

              <h2 className="font-display text-4xl text-center leading-tight mb-2">¡Nuevo viaje<br /><span className="text-zipp-lime italic">disponible!</span></h2>
              <p className="text-sm text-zipp-black-5 text-center mb-10">Acepta rápido, el pasajero espera.</p>

              <div className="w-full bg-zipp-black-2 border-2 border-zipp-lime/30 rounded-3xl p-6 mb-10 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-[10px] text-zipp-black-5 uppercase font-bold tracking-widest mb-1">Precio sugerido</div>
                    <div className="font-display text-5xl text-zipp-lime leading-none">S/12.00</div>
                    <div className="inline-block bg-zipp-lime/10 border border-zipp-lime/20 px-2 py-0.5 rounded text-[8px] font-bold text-zipp-lime uppercase mt-2">Precio Fijo</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-zipp-black-5 uppercase font-bold tracking-widest mb-1">Distancia</div>
                    <div className="text-2xl font-black text-zipp-yellow">1.2 km</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-zipp-lime mt-1.5 shrink-0" />
                    <div>
                      <div className="text-[10px] text-zipp-black-5 uppercase font-bold">Recojo</div>
                      <div className="text-sm font-bold">Jr. Los Rosales 245</div>
                    </div>
                  </div>
                  <div className="h-4 w-px bg-zipp-lime/20 ml-1" />
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-zipp-yellow mt-1.5 shrink-0" />
                    <div>
                      <div className="text-[10px] text-zipp-black-5 uppercase font-bold">Destino</div>
                      <div className="text-sm font-bold">Aeropuerto Cadete FAP</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-4">
                <button 
                  onClick={() => go('driver-home')}
                  className="bg-zipp-black-3 border border-zipp-lime/10 py-5 rounded-2xl font-display text-lg hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                >
                  Rechazar
                </button>
                <button 
                  onClick={() => go('driver-riding')}
                  className="bg-zipp-lime text-zipp-black py-5 rounded-2xl font-display text-lg shadow-lg shadow-zipp-lime/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  ACEPTAR
                </button>
              </div>
            </div>

            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 15, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1.5 bg-zipp-lime"
            />
          </div>
        );

      case 'history':
        return (
          <div className="flex-1 flex flex-col relative">
            <StatusBar isDark={isDark} onToggleTheme={toggleTheme} />
            <div className="flex-1 px-6 pt-4 overflow-y-auto no-scrollbar pb-32">
              <h2 className="font-display text-3xl mb-1">Mis viajes</h2>
              <p className="text-xs text-zipp-black-5 mb-6">Historial completo · Tarapoto</p>

              <div className="space-y-3">
                {MOCK_TRIPS.map(trip => (
                  <div key={trip.id} className="bg-zipp-black-2 border border-zipp-lime/10 rounded-xl p-4 hover:border-zipp-lime transition-all cursor-pointer group">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-11 h-11 bg-zipp-lime/10 border border-zipp-lime/20 rounded-xl flex items-center justify-center text-xl shrink-0">🛺</div>
                      <div className="flex-1">
                        <div className="text-sm font-bold">{trip.destination.address}</div>
                        <div className="text-[11px] text-zipp-black-5">{trip.date} · {trip.driver?.name}</div>
                      </div>
                      <div className="font-display text-xl text-zipp-lime">S/{trip.price}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-zipp-yellow text-xs">★★★★★</div>
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                        trip.paymentMethod === 'yape' ? "bg-purple-500/10 text-purple-400" : "bg-zipp-yellow/10 text-zipp-yellow"
                      )}>
                        {trip.paymentMethod}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <BottomNav current={screen} onNav={go} role={role} />
          </div>
        );

      case 'security':
        return (
          <div className="flex-1 flex flex-col relative">
            <StatusBar isDark={isDark} onToggleTheme={toggleTheme} />
            <div className="flex-1 px-6 pt-4 overflow-y-auto no-scrollbar pb-32">
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => go('profile')} className="back">←</button>
                <h2 className="font-display text-3xl">Seguridad</h2>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 mb-8 text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg shadow-red-500/40 animate-pulse">
                  🆘
                </div>
                <h3 className="font-display text-xl text-red-400 mb-2">Botón de Pánico (SOS)</h3>
                <p className="text-xs text-zipp-black-5 leading-relaxed">
                  En caso de emergencia, presiona el botón para alertar a las autoridades y a tus contactos de confianza.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-zipp-black-2 border border-zipp-lime/10 rounded-2xl p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-zipp-lime/10 flex items-center justify-center text-zipp-lime">
                      <Shield size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Garantía de Seguridad YAVU</h4>
                      <p className="text-[10px] text-zipp-black-5">Estándar nacional para mototaxis en todo el Perú 🇵🇪</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-xs text-zipp-black-5">
                      <div className="w-5 h-5 rounded-full bg-zipp-lime/20 flex items-center justify-center text-zipp-lime shrink-0">1</div>
                      <p><strong>Identidad Validada:</strong> Cruce de datos con RENIEC para asegurar que el conductor es quien dice ser.</p>
                    </div>
                    <div className="flex items-start gap-3 text-xs text-zipp-black-5">
                      <div className="w-5 h-5 rounded-full bg-zipp-lime/20 flex items-center justify-center text-zipp-lime shrink-0">2</div>
                      <p><strong>Cero Antecedentes:</strong> Verificación de récord policial y judicial limpio a nivel nacional.</p>
                    </div>
                    <div className="flex items-start gap-3 text-xs text-zipp-black-5">
                      <div className="w-5 h-5 rounded-full bg-zipp-lime/20 flex items-center justify-center text-zipp-lime shrink-0">3</div>
                      <p><strong>Unidades Seguras:</strong> Inspección técnica obligatoria de cada mototaxi antes de entrar a la red.</p>
                    </div>
                  </div>
                </div>

                <button className="w-full flex items-center justify-between p-5 bg-zipp-black-2 border border-zipp-lime/5 rounded-2xl hover:border-zipp-lime transition-all">
                  <div className="flex items-center gap-4">
                    <User size={20} className="text-zipp-lime" />
                    <div className="text-left">
                      <div className="text-sm font-bold">Contactos de Confianza</div>
                      <div className="text-[10px] text-zipp-black-5">Comparte tu ubicación en tiempo real</div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-zipp-black-5" />
                </button>
              </div>
            </div>
            <BottomNav current={screen} onNav={go} role={role} />
          </div>
        );

      case 'profile':
        return (
          <div className="flex-1 flex flex-col relative">
            <StatusBar isDark={isDark} onToggleTheme={toggleTheme} />
            <div className="flex-1 px-6 pt-4 overflow-y-auto no-scrollbar pb-32">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-zipp-lime to-zipp-green-md flex items-center justify-center text-5xl shadow-xl shadow-zipp-lime/20">
                  {role === 'driver' ? '👨‍✈️' : '👤'}
                </div>
                <div>
                  <h2 className="font-display text-3xl leading-none mb-1">
                    {role === 'driver' ? 'José Mamani' : 'Mateo García'}
                  </h2>
                  <p className="text-sm text-zipp-black-5">
                    {role === 'driver' ? 'Conductor Verificado 🇵🇪' : 'Pasajero · Tarapoto, PE'}
                  </p>
                  <div className="flex items-center gap-1 text-zipp-yellow text-xs mt-2">
                    <Star size={12} fill="currentColor" />
                    <span className="font-bold">4.95 Rating</span>
                  </div>
                </div>
              </div>

              {role === 'driver' && (
                <div className="bg-zipp-lime/5 border border-zipp-lime/20 rounded-2xl p-5 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="text-zipp-lime" size={24} />
                    <h3 className="font-display text-lg">Sello de Confianza YAVU</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zipp-black-5">DNI Verificado</span>
                      <span className="text-zipp-lime font-bold">✓ 45XXX892</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zipp-black-5">Antecedentes</span>
                      <span className="text-zipp-lime font-bold">✓ Limpios</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zipp-black-5">Vehículo (Placa)</span>
                      <span className="text-zipp-white font-bold">XYZ-123</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zipp-black-5">Modelo</span>
                      <span className="text-zipp-white font-bold">Honda Wave 2023</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-zipp-black-2 border border-zipp-lime/10 rounded-2xl p-4">
                  <div className="text-2xl mb-1">💳</div>
                  <div className="text-[10px] text-zipp-black-5 uppercase font-bold">Pagos</div>
                  <div className="text-sm font-bold">Yape / Efectivo</div>
                </div>
                <div className="bg-zipp-black-2 border border-zipp-lime/10 rounded-2xl p-4">
                  <div className="text-2xl mb-1">🎁</div>
                  <div className="text-[10px] text-zipp-black-5 uppercase font-bold">Cupones</div>
                  <div className="text-sm font-bold">3 disponibles</div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { icon: Shield, label: 'Seguridad', sub: 'Contactos de confianza, SOS', action: () => go('security') },
                  { icon: MessageSquare, label: 'Ayuda', sub: 'Soporte 24/7, Reportar problema' },
                  { icon: User, label: 'Configuración', sub: 'Privacidad, Notificaciones' },
                ].map((item, i) => (
                  <button 
                    key={i} 
                    onClick={item.action}
                    className="w-full flex items-center gap-4 p-4 bg-zipp-black-2 border border-zipp-lime/5 rounded-2xl hover:border-zipp-lime transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-zipp-black-3 flex items-center justify-center text-zipp-lime group-hover:bg-zipp-lime/10 transition-all">
                      <item.icon size={20} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-bold">{item.label}</div>
                      <div className="text-[10px] text-zipp-black-5">{item.sub}</div>
                    </div>
                    <ChevronRight size={18} className="text-zipp-black-5" />
                  </button>
                ))}
              </div>

              <button 
                onClick={() => go('onboarding')}
                className="w-full mt-8 py-4 text-sm font-bold text-red-400 border border-red-400/20 rounded-2xl hover:bg-red-400/5 transition-all"
              >
                Cerrar sesión
              </button>
            </div>
            <BottomNav current={screen} onNav={go} role={role} />
          </div>
        );

      case 'driver-riding':
        return (
          <div className="flex-1 flex flex-col">
            <div className="h-[45vh] bg-[#0A1408] relative overflow-hidden shrink-0">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#C6F135 1px, transparent 1px), linear-gradient(90deg, #C6F135 1px, transparent 1px)', backgroundSize: '55px 55px' }} />
              <div className="absolute top-[30%] left-0 right-0 h-3 bg-white/10" />
              <div className="absolute left-[40%] top-0 bottom-0 w-3 bg-white/10" />
              
              <motion.div 
                animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
                transition={{ repeat: Infinity, duration: 10 }}
                className="absolute bottom-1/4 left-1/4 text-4xl z-10"
              >
                🛺
              </motion.div>

              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <div className="bg-zipp-black/90 backdrop-blur-md border border-zipp-lime/20 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                  <Navigation size={14} className="text-zipp-lime" />
                  Gira a la derecha en 200m
                </div>
                <button className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                  <Shield size={20} className="text-white" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-zipp-black rounded-t-[22px] -mt-4 px-6 pt-5 pb-8 flex flex-col gap-4 relative z-40 border-t border-zipp-lime/20">
              <div className="w-10 h-1 bg-zipp-black-5 rounded-full mx-auto mb-2" />
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-zipp-black-5 uppercase font-bold tracking-widest mb-1">Pasajero</div>
                  <div className="text-2xl font-bold">María Rodríguez</div>
                </div>
                <button className="w-12 h-12 rounded-full bg-zipp-black-3 border border-zipp-lime/10 flex items-center justify-center">
                  <PhoneCall size={20} className="text-zipp-lime" />
                </button>
              </div>

              <div className="bg-zipp-black-2 border border-zipp-lime/10 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-zipp-yellow mt-1.5 shrink-0" />
                  <div className="text-sm font-medium">Aeropuerto Cadete FAP Guillermo del Castillo Paredes</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-zipp-black-5">Distancia restante: <span className="text-zipp-text font-bold">1.2 km</span></div>
                  <div className="font-display text-2xl text-zipp-lime">S/12.00</div>
                </div>
              </div>

              <button onClick={() => go('driver-home')} className="w-full bg-zipp-lime text-zipp-black font-display py-5 rounded-2xl shadow-lg shadow-zipp-lime/20 mt-auto">
                ✓ Finalizar viaje
              </button>
            </div>
          </div>
        );

      case 'driver-earnings':
        return (
          <div className="flex-1 flex flex-col relative">
            <StatusBar isDark={isDark} onToggleTheme={toggleTheme} />
            <div className="flex-1 px-6 pt-4 overflow-y-auto no-scrollbar">
              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => go('driver-home')} className="back">←</button>
                <h2 className="font-display text-3xl">Ganancias</h2>
              </div>

              <div className="bg-gradient-to-br from-zipp-lime/10 to-zipp-green-md/20 border border-zipp-lime/20 rounded-3xl p-8 text-center mb-8">
                <div className="text-[10px] text-zipp-black-5 uppercase font-bold tracking-widest mb-2">Balance total</div>
                <div className="font-display text-7xl text-zipp-lime leading-none tracking-tighter">S/412.50</div>
                <div className="flex justify-center gap-6 mt-6">
                  <div>
                    <div className="text-lg font-bold">48</div>
                    <div className="text-[9px] text-zipp-black-5 uppercase font-bold">Viajes</div>
                  </div>
                  <div className="w-px h-8 bg-zipp-lime/10" />
                  <div>
                    <div className="text-lg font-bold">4.9</div>
                    <div className="text-[9px] text-zipp-black-5 uppercase font-bold">Rating</div>
                  </div>
                </div>
              </div>

              <h3 className="font-display text-xl mb-4">Historial de pagos</h3>
              <div className="space-y-3 pb-32">
                {[
                  { date: 'Hoy, 10 Mar', amount: 56.00, trips: 7 },
                  { date: 'Ayer, 09 Mar', amount: 84.50, trips: 11 },
                  { date: '08 Mar', amount: 42.00, trips: 5 },
                  { date: '07 Mar', amount: 95.00, trips: 12 },
                  { date: '06 Mar', amount: 68.00, trips: 8 },
                ].map((day, i) => (
                  <div key={i} className="bg-zipp-black-2 border border-zipp-lime/10 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold">{day.date}</div>
                      <div className="text-[10px] text-zipp-black-5">{day.trips} viajes realizados</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-xl text-zipp-lime">S/{day.amount.toFixed(2)}</div>
                      <div className="text-[9px] text-green-400 font-bold uppercase tracking-wider">Pagado</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <BottomNav current={screen} onNav={go} role={role} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div id="app" className="transition-colors duration-500 min-h-[100dvh] flex flex-col">
      <DriverProfileModal isOpen={showDriverProfile} onClose={() => setShowDriverProfile(false)} />
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col h-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
