import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bike, 
  Package, 
  ShoppingBag, 
  Utensils, 
  ShieldCheck, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Lock, 
  ArrowRight, 
  ChevronRight, 
  X, 
  Sparkles, 
  MapPin, 
  User, 
  FileText, 
  AlertCircle,
  RefreshCw,
  Zap,
  Star,
  Clock,
  MessageSquare,
  Copy,
  Volume2
} from 'lucide-react';
import { UserProfile, Role, HuancayoDistrict } from '../types';
import { HUANCAYO_DISTRICTS } from '../data/huancayoData';

interface AuthPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialRole?: Role;
  allowDismiss?: boolean;
  defaultStep?: 'welcome' | 'phone-input' | 'otp-verify';
}

type AuthStep = 'welcome' | 'phone-input' | 'otp-verify' | 'user-info' | 'rider-register' | 'success';

// Play modern subtle notification chime
function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // Audio might be blocked by browser policy before interaction; benign
  }
}

export const AuthPortalModal: React.FC<AuthPortalModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'client',
  allowDismiss = true,
  defaultStep = 'phone-input',
}) => {
  const [step, setStep] = useState<AuthStep>(defaultStep);
  const [role, setRole] = useState<Role>(initialRole);
  const [activeSlide, setActiveSlide] = useState(0);

  // Phone & OTP state
  const [phone, setPhone] = useState('964123456');
  const [generatedOtp, setGeneratedOtp] = useState('8492');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [showSmsBanner, setShowSmsBanner] = useState(false);
  const [carrierName, setCarrierName] = useState('Entel / Claro');

  // User details state
  const [fullName, setFullName] = useState('Carlos Alanya');
  const [district, setDistrict] = useState<HuancayoDistrict>('Huancayo Centro');
  const [email, setEmail] = useState('gaor.labs@gmail.com');
  const [dni, setDni] = useState('');

  // Rider details state
  const [riderPlate, setRiderPlate] = useState('4892-3W');
  const [riderMotoModel, setRiderMotoModel] = useState('Honda CB125F 2024');
  const [riderLicense, setRiderLicense] = useState('Q48192011');
  const [riderSoatValid, setRiderSoatValid] = useState('Diciembre 2026');

  // Loading indicator
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Update initial step if changed from props
  useEffect(() => {
    if (isOpen) {
      setStep(defaultStep);
      setOtpError(false);
    }
  }, [isOpen, defaultStep]);

  // Auto carousel rotation on welcome screen
  useEffect(() => {
    if (step !== 'welcome') return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [step]);

  // Resend OTP countdown
  useEffect(() => {
    if (step !== 'otp-verify' || resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((r) => r - 1), 1000);
    return () => clearInterval(t);
  }, [step, resendTimer]);

  const slides = [
    {
      icon: <Bike size={32} className="text-white" />,
      tag: 'Express Wanka ⚡',
      title: 'Envíos en moto en 15-25 min',
      desc: 'Courier express de documentos, llaves, encomiendas y paquetes en todo Huancayo.',
      badgeBg: 'from-zipp-red to-zipp-red-dark',
      stat: '🛵 8 Motos en ruta'
    },
    {
      icon: <ShoppingBag size={32} className="text-white" />,
      tag: 'Personal Shopper 🛒',
      title: 'Mandaditos y compras al instante',
      desc: 'Compramos en Inkafarma, Plaza Vea, ferreterías o el Mercado Mayorista con boleta.',
      badgeBg: 'from-amber-500 to-amber-600',
      stat: '🧾 Boleta garantizada'
    },
    {
      icon: <Utensils size={32} className="text-white" />,
      tag: 'Sabor de Huancayo 🍗',
      title: 'Tus restaurantes favoritos',
      desc: 'Pollos a la brasa, Chifa, Pizzerías y comida huancaína calientita hasta tu puerta.',
      badgeBg: 'from-red-600 to-rose-700',
      stat: '⭐ 4.9 de satisfacción'
    },
    {
      icon: <ShieldCheck size={32} className="text-white" />,
      tag: '100% Seguro 🛡️',
      title: 'Entrega con PIN anti-fraude',
      desc: 'Motorizados verificados con DNI, SOAT vigente y código de confirmación en cada entrega.',
      badgeBg: 'from-emerald-600 to-teal-700',
      stat: '🔒 Código PIN único'
    }
  ];

  // Detect Peruvian carrier based on 3-digit prefix
  const getCarrier = (num: string) => {
    if (num.startsWith('964') || num.startsWith('954') || num.startsWith('948')) return 'Entel Perú';
    if (num.startsWith('997') || num.startsWith('998') || num.startsWith('980')) return 'Claro Perú';
    if (num.startsWith('999') || num.startsWith('988') || num.startsWith('975')) return 'Movistar';
    return 'Bitel / Claro';
  };

  // Send OTP
  const handleSendOtp = () => {
    const rawPhone = phone.replace(/\D/g, '');
    if (rawPhone.length < 9) return;
    setIsSendingCode(true);
    
    // Generate fresh 4-digit code (e.g. 5831, 8492)
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newCode);
    setCarrierName(getCarrier(rawPhone));

    setTimeout(() => {
      setIsSendingCode(false);
      setStep('otp-verify');
      setResendTimer(28);
      setShowSmsBanner(true);
      playNotificationChime();
      setTimeout(() => {
        otpInputRefs[0].current?.focus();
      }, 250);
    }, 750);
  };

  // Auto fill OTP from banner
  const handleAutoFillOtp = () => {
    const digits = generatedOtp.split('');
    setOtpDigits(digits);
    setOtpError(false);
    setShowSmsBanner(false);
    
    setTimeout(() => {
      if (role === 'rider') {
        setStep('rider-register');
      } else {
        setStep('user-info');
      }
    }, 350);
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);
    setOtpError(false);

    if (cleanVal && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }

    // Check if fully entered
    if (newDigits.every((d) => d !== '') && index === 3) {
      const entered = newDigits.join('');
      if (entered === generatedOtp || entered === '1234' || entered === '8492' || entered === '7291') {
        // Success
        setShowSmsBanner(false);
        setTimeout(() => {
          if (role === 'rider') {
            setStep('rider-register');
          } else {
            setStep('user-info');
          }
        }, 250);
      } else {
        setOtpError(true);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  // Quick Google Sign-in simulation
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setStatusMessage('Autenticando con Google...');

    setTimeout(() => {
      setIsLoading(false);
      const user: UserProfile = {
        id: 'usr_' + Date.now().toString().slice(-6),
        name: 'Carlos Alanya (Google)',
        phone: '+51 964 123 456',
        email: 'gaor.labs@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: role,
        district: 'Huancayo Centro',
        isVerified: true,
        loginMethod: 'google',
        dni: '48920192',
      };
      finishAuth(user);
    }, 1000);
  };

  // Guest quick login
  const handleGuestLogin = () => {
    const user: UserProfile = {
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
    finishAuth(user);
  };

  // Complete client registration
  const handleCompleteClient = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage('Iniciando sesión segura en Huancayo...');

    setTimeout(() => {
      setIsLoading(false);
      const user: UserProfile = {
        id: 'usr_' + Date.now().toString().slice(-6),
        name: fullName.trim() || 'Carlos Alanya',
        phone: '+51 ' + (phone.trim() || '964 123 456'),
        email: email.trim() || 'gaor.labs@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'client',
        district: district,
        dni: dni || '48920192',
        isVerified: true,
        loginMethod: 'phone',
      };
      finishAuth(user);
    }, 800);
  };

  // Complete rider registration
  const handleCompleteRider = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage('Verificando datos de moto y SOAT...');

    setTimeout(() => {
      setIsLoading(false);
      const user: UserProfile = {
        id: 'rider_' + Date.now().toString().slice(-6),
        name: fullName.trim() || 'Motorizado YAVU',
        phone: '+51 ' + (phone.trim() || '964 555 777'),
        email: email.trim() || 'motorizado@yavu.pe',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        role: 'rider',
        district: district,
        dni: dni || '48991234',
        isVerified: true,
        loginMethod: 'rider_dni',
        motorcycleModel: riderMotoModel,
        plate: riderPlate.toUpperCase(),
        soatValidUntil: riderSoatValid,
      };
      finishAuth(user);
    }, 1000);
  };

  const finishAuth = (user: UserProfile) => {
    setStep('success');
    setTimeout(() => {
      onLoginSuccess(user);
      onClose();
    }, 1100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* SIMULATED PUSH NOTIFICATION / SMS TOAST (Drops from top with vibrate/sound glow) */}
      <AnimatePresence>
        {showSmsBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.95 }}
            animate={{ y: 20, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-0 z-[70] max-w-sm w-[92%] bg-zinc-950/95 text-white border-2 border-zipp-yellow/60 rounded-3xl p-4 shadow-2xl backdrop-blur-xl ring-4 ring-zipp-yellow/10"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-zipp-red to-rose-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-zipp-red/40 border border-white/20">
                <MessageSquare size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-zipp-yellow">
                      SMS • {carrierName}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">Ahora</span>
                </div>
                <p className="text-xs text-zinc-200 mt-1 leading-snug">
                  Tu código de verificación <strong className="text-white">YAVU Huancayo</strong> es:
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="bg-zinc-900 border border-zinc-700 px-3 py-1 rounded-xl font-mono font-black text-base text-zipp-yellow tracking-widest">
                    {generatedOtp}
                  </div>
                  <button
                    onClick={handleAutoFillOtp}
                    className="flex-1 py-1.5 px-3 bg-zipp-red hover:bg-zipp-red-dark text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md shadow-zipp-red/30 active:scale-95"
                  >
                    <Zap size={13} className="text-zipp-yellow" />
                    <span>Autocompletar</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Modal Card */}
      <div 
        id="auth-portal-card"
        className="w-full max-w-md bg-zipp-surface border border-zipp-border rounded-[32px] overflow-hidden shadow-2xl flex flex-col relative max-h-[92vh]"
      >
        
        {/* Dismiss Button (Only if allowed) */}
        {allowDismiss && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-zipp-surface-2/80 hover:bg-zipp-surface-2 border border-zipp-border text-zipp-text-muted hover:text-zipp-text flex items-center justify-center transition-all"
            title="Cerrar"
          >
            <X size={18} />
          </button>
        )}

        {/* STEP 1: PHONE NUMBER INPUT (Primary Direct Screen) */}
        {step === 'phone-input' && (
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            
            {/* Header / Brand */}
            <div className="text-center space-y-2 pt-1">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-zipp-red to-zipp-red-dark text-white px-3.5 py-1.5 rounded-2xl shadow-lg shadow-zipp-red/30 border border-white/20">
                <Bike size={18} className="transform -rotate-12" />
                <span className="font-display font-black text-lg tracking-tight">YAVU</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded">
                  Huancayo 🇵🇪
                </span>
              </div>

              <h2 className="font-display font-black text-2xl text-zipp-text tracking-tight">
                Ingreso con Celular
              </h2>
              <p className="text-xs text-zipp-text-muted max-w-xs mx-auto">
                Coloca tu número móvil para recibir tu código SMS instantáneo de acceso seguro.
              </p>
            </div>

            {/* Role Tab Selector (Cliente vs Motorizado) */}
            <div className="bg-zipp-surface-2 p-1.5 rounded-2xl border border-zipp-border flex">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  role === 'client'
                    ? 'bg-zipp-surface text-zipp-text shadow-sm border border-zipp-border'
                    : 'text-zipp-text-muted hover:text-zipp-text'
                }`}
              >
                <User size={14} className={role === 'client' ? 'text-zipp-red' : ''} />
                <span>Modo Cliente</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('rider')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  role === 'rider'
                    ? 'bg-zipp-surface text-zipp-text shadow-sm border border-zipp-border'
                    : 'text-zipp-text-muted hover:text-zipp-text'
                }`}
              >
                <Bike size={14} className={role === 'rider' ? 'text-zipp-red' : ''} />
                <span>Modo Motorizado 🛵</span>
              </button>
            </div>

            {/* Phone Input Box */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-zipp-text-muted block mb-2 flex items-center justify-between">
                  <span>Número Móvil (Perú)</span>
                  <span className="text-[10px] text-green-500 font-bold">✓ Válido con SMS</span>
                </label>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-zipp-surface-2 border border-zipp-border px-3.5 py-3.5 rounded-2xl text-sm font-bold text-zipp-text shrink-0 shadow-inner">
                    <span className="text-lg">🇵🇪</span>
                    <span className="font-mono text-zipp-text font-black">+51</span>
                  </div>
                  <input
                    type="tel"
                    autoFocus
                    maxLength={9}
                    placeholder="964 123 456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && phone.length >= 9) {
                        handleSendOtp();
                      }
                    }}
                    className="flex-1 bg-zipp-surface-2 border-2 border-zipp-border focus:border-zipp-red rounded-2xl px-4 py-3.5 text-lg font-mono font-black text-zipp-text tracking-widest placeholder:text-zipp-text-muted/60 focus:outline-none transition-all shadow-inner"
                  />
                </div>
                
                {/* Quick Phone Helper Buttons */}
                <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
                  <span className="text-[10px] text-zipp-text-muted shrink-0">Sugeridos:</span>
                  <button
                    type="button"
                    onClick={() => setPhone('964123456')}
                    className="text-[11px] font-mono font-bold bg-zipp-surface-2 hover:bg-zipp-surface border border-zipp-border px-2 py-0.5 rounded-lg text-zipp-text shrink-0"
                  >
                    964 123 456 (Entel)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhone('997845210')}
                    className="text-[11px] font-mono font-bold bg-zipp-surface-2 hover:bg-zipp-surface border border-zipp-border px-2 py-0.5 rounded-lg text-zipp-text shrink-0"
                  >
                    997 845 210 (Claro)
                  </button>
                </div>
              </div>

              {/* Main Submit Button */}
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={phone.length < 9 || isSendingCode}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-zipp-red to-zipp-red-dark text-white font-display font-black text-sm shadow-xl shadow-zipp-red/35 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
              >
                {isSendingCode ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Generando código SMS...</span>
                  </>
                ) : (
                  <>
                    <Phone size={18} />
                    <span>Recibir Código SMS de Acceso</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

            {/* Other Quick Access Methods */}
            <div className="pt-2 border-t border-zipp-border/60 space-y-2">
              <div className="text-center">
                <span className="text-[11px] font-bold text-zipp-text-muted uppercase tracking-wider">
                  Otras opciones rápidas
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="py-2.5 px-3 rounded-xl bg-zipp-surface-2 hover:bg-zipp-surface border border-zipp-border text-zipp-text font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google One-Tap</span>
                </button>

                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="py-2.5 px-3 rounded-xl bg-zipp-surface-2 hover:bg-zipp-surface border border-zipp-border text-zipp-text font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} className="text-zipp-yellow" />
                  <span>Modo Invitado</span>
                </button>
              </div>

              {/* View App Features Slide link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setStep('welcome')}
                  className="text-xs font-bold text-zipp-red hover:underline"
                >
                  Ver beneficios y servicios de YAVU →
                </button>
              </div>
            </div>

            {/* Footer Trust Guarantee */}
            <div className="pt-2 border-t border-zipp-border/50 flex items-center justify-around text-[10px] font-bold text-zipp-text-muted">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-emerald-500" /> DNI Verificado
              </span>
              <span className="flex items-center gap-1">
                <Zap size={13} className="text-zipp-yellow" /> Yape & Plin
              </span>
              <span className="flex items-center gap-1">
                <Bike size={13} className="text-zipp-red" /> 15-25 min
              </span>
            </div>

          </div>
        )}

        {/* STEP 2: OTP VERIFICATION (4-digit code entry) */}
        {step === 'otp-verify' && (
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setStep('phone-input');
                  setShowSmsBanner(false);
                }}
                className="text-xs font-bold text-zipp-text-muted hover:text-zipp-text flex items-center gap-1"
              >
                ← Cambiar número
              </button>
              <span className="text-[10px] font-black uppercase tracking-wider text-zipp-yellow bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                Verificación SMS
              </span>
            </div>

            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-zipp-yellow border border-amber-500/30 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
                <Lock size={26} />
              </div>
              <h3 className="font-display font-black text-2xl text-zipp-text">
                Ingresa el Código SMS
              </h3>
              <p className="text-xs text-zipp-text-muted">
                Hemos enviado un código de 4 dígitos a:
              </p>
              <p className="text-sm font-mono font-black text-zipp-text bg-zipp-surface-2 py-1 px-3 rounded-xl inline-block border border-zipp-border">
                🇵🇪 +51 {phone}
              </p>
            </div>

            {/* 4-digit code input boxes */}
            <div className="space-y-4">
              <div className="flex justify-center gap-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpInputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className={`w-14 h-16 rounded-2xl bg-zipp-surface-2 border-2 text-center text-2xl font-mono font-black text-zipp-text focus:outline-none transition-all shadow-inner ${
                      otpError
                        ? 'border-red-500 bg-red-500/10 text-red-500 animate-shake'
                        : digit
                        ? 'border-zipp-red bg-zipp-red/10 text-zipp-red'
                        : 'border-zipp-border focus:border-zipp-red focus:ring-4 focus:ring-zipp-red/10'
                    }`}
                  />
                ))}
              </div>

              {otpError && (
                <motion.p 
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-bold text-red-500 text-center flex items-center justify-center gap-1"
                >
                  <AlertCircle size={14} /> Código incorrecto. Prueba con: {generatedOtp}
                </motion.p>
              )}

              {/* Quick helper chip */}
              <div className="p-3.5 bg-gradient-to-r from-zipp-surface-2 via-zipp-surface to-zipp-surface-2 border border-zipp-border rounded-2xl text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs text-zipp-text-muted">
                  <MessageSquare size={13} className="text-zipp-yellow" />
                  <span>Código de prueba simulado:</span>
                  <strong className="text-zipp-yellow font-mono text-sm tracking-wider">{generatedOtp}</strong>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="w-full py-2 bg-zipp-red/15 hover:bg-zipp-red text-zipp-red hover:text-white rounded-xl text-xs font-display font-black transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap size={14} className="text-zipp-yellow" />
                  <span>Tocar para autocompletar e ingresar</span>
                </button>
              </div>

              {/* Resend timer */}
              <div className="text-center pt-1">
                {resendTimer > 0 ? (
                  <span className="text-xs text-zipp-text-muted flex items-center justify-center gap-1 font-medium">
                    <Clock size={14} /> Reenviar nuevo SMS en <strong className="font-mono text-zipp-text">{resendTimer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-xs font-bold text-zipp-red hover:underline flex items-center justify-center gap-1 mx-auto"
                  >
                    <RefreshCw size={12} /> Reenviar código SMS ahora
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: WELCOME & ONBOARDING CAROUSEL */}
        {step === 'welcome' && (
          <div className="overflow-y-auto p-6 space-y-5 flex-1">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('phone-input')}
                className="text-xs font-bold text-zipp-text-muted hover:text-zipp-text flex items-center gap-1"
              >
                ← Volver al login
              </button>
              <span className="text-[10px] font-black uppercase tracking-wider text-zipp-red bg-zipp-red/10 px-2 py-0.5 rounded">
                YAVU Huancayo
              </span>
            </div>

            {/* Feature Carousel Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zipp-surface-2 to-zipp-surface border border-zipp-border p-5 shadow-inner">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${slides[activeSlide].badgeBg} flex items-center justify-center shadow-lg`}>
                      {slides[activeSlide].icon}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-zipp-text-muted bg-zipp-surface px-2.5 py-1 rounded-full border border-zipp-border">
                      {slides[activeSlide].stat}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-zipp-red block">
                      {slides[activeSlide].tag}
                    </span>
                    <h3 className="font-display font-black text-lg text-zipp-text">
                      {slides[activeSlide].title}
                    </h3>
                    <p className="text-xs text-zipp-text-muted mt-1 leading-relaxed">
                      {slides[activeSlide].desc}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Dots */}
              <div className="flex justify-center gap-1.5 pt-3 mt-2 border-t border-zipp-border/50">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeSlide === idx ? 'w-6 bg-zipp-red' : 'w-2 bg-zipp-border'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep('phone-input')}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-zipp-red to-zipp-red-dark text-white font-display font-black text-sm shadow-xl shadow-zipp-red/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
            >
              <Phone size={18} />
              <span>Continuar con mi Número de Celular</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 4: CLIENT USER INFO */}
        {step === 'user-info' && (
          <form onSubmit={handleCompleteClient} className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                ✓ Teléfono Verificado (+51 {phone})
              </span>
              <h3 className="font-display font-black text-2xl text-zipp-text">
                Completa tu perfil en Huancayo
              </h3>
              <p className="text-xs text-zipp-text-muted">
                Tu cuenta está lista para pedir tus envíos en moto en todo Huancayo.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-zipp-text block mb-1">
                  Nombre y Apellidos *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Carlos Alanya"
                  className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl px-3.5 py-2.5 text-xs text-zipp-text focus:outline-none focus:border-zipp-red"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zipp-text block mb-1">
                  Distrito Principal en Huancayo *
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value as HuancayoDistrict)}
                  className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl px-3.5 py-2.5 text-xs text-zipp-text focus:outline-none focus:border-zipp-red"
                >
                  {HUANCAYO_DISTRICTS.map((d) => (
                    <option key={d} value={d} className="bg-zipp-surface text-zipp-text">
                      📍 {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zipp-text block mb-1">
                  Correo Electrónico (Para boletas)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tuemail@gmail.com"
                  className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl px-3.5 py-2.5 text-xs text-zipp-text focus:outline-none focus:border-zipp-red"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zipp-text block mb-1">
                  DNI (Opcional)
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                  placeholder="8 dígitos"
                  className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl px-3.5 py-2.5 text-xs text-zipp-text focus:outline-none focus:border-zipp-red"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-zipp-red to-zipp-red-dark text-white font-display font-black text-sm shadow-xl shadow-zipp-red/30 hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>{statusMessage}</span>
                </>
              ) : (
                <>
                  <span>Ingresar a YAVU Huancayo</span>
                  <CheckCircle2 size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 5: RIDER REGISTRATION FORM */}
        {step === 'rider-register' && (
          <form onSubmit={handleCompleteRider} className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-zipp-yellow bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                🛵 Registro de Motorizado Wanka
              </span>
              <h3 className="font-display font-black text-xl text-zipp-text">
                Datos de tu Moto y Brevete
              </h3>
              <p className="text-xs text-zipp-text-muted">
                Validamos que todos los conductores tengan SOAT activo para seguridad en Huancayo.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-zipp-text block mb-1">
                  Nombre Completo del Conductor *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Jhony Quispe Canchanya"
                  className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl px-3 py-2 text-xs text-zipp-text focus:outline-none focus:border-zipp-red"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-zipp-text block mb-1">
                    Placa de Moto *
                  </label>
                  <input
                    type="text"
                    required
                    value={riderPlate}
                    onChange={(e) => setRiderPlate(e.target.value.toUpperCase())}
                    placeholder="Ej. 4892-3W"
                    className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl px-3 py-2 text-xs font-mono font-bold text-zipp-text focus:outline-none focus:border-zipp-red uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zipp-text block mb-1">
                    DNI Conductor *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={dni}
                    onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                    placeholder="48920192"
                    className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl px-3 py-2 text-xs text-zipp-text focus:outline-none focus:border-zipp-red"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zipp-text block mb-1">
                  Modelo de Motocicleta
                </label>
                <input
                  type="text"
                  value={riderMotoModel}
                  onChange={(e) => setRiderMotoModel(e.target.value)}
                  placeholder="Ej. Honda CB125F / Bajaj Pulsar 150"
                  className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl px-3 py-2 text-xs text-zipp-text focus:outline-none focus:border-zipp-red"
                />
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  <ShieldCheck size={15} /> SOAT e Inspección
                </div>
                <p className="text-[11px] text-zipp-text-muted">
                  Vigencia confirmada: La Positiva / Rímac Seguros (Huancayo).
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-zipp-red to-zipp-red-dark text-white font-display font-black text-sm shadow-xl shadow-zipp-red/30 hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>{statusMessage}</span>
                </>
              ) : (
                <>
                  <span>Activar Cuenta de Motorizado</span>
                  <Bike size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 6: SUCCESS ANIMATION */}
        {step === 'success' && (
          <div className="p-10 text-center space-y-4 my-auto flex-1 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40"
            >
              <CheckCircle2 size={44} />
            </motion.div>

            <div className="space-y-1">
              <h3 className="font-display font-black text-2xl text-zipp-text">
                ¡Bienvenido a YAVU!
              </h3>
              <p className="text-xs text-zipp-text-muted max-w-xs">
                Acceso verificado por SMS. Conectándote con los motorizados en Huancayo...
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

