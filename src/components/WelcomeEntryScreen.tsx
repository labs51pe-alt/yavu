import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bike,
  Phone,
  ShieldCheck,
  Zap,
  MapPin,
  Sparkles,
  ArrowRight,
  User,
  ShoppingBag,
  Package,
  UtensilsCrossed,
  CheckCircle2,
  Lock,
  MessageSquare,
  Clock,
  RefreshCw,
  Sun,
  Moon,
  ChevronRight,
  Shield
} from 'lucide-react';
import { UserProfile, Role, HuancayoDistrict } from '../types';
import { HUANCAYO_DISTRICTS } from '../data/huancayoData';

interface WelcomeEntryScreenProps {
  onEnterApp: (user: UserProfile) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

type EntryStep = 'phone' | 'otp' | 'profile-setup';

function playNotificationChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
    // Audio block benign
  }
}

export const WelcomeEntryScreen: React.FC<WelcomeEntryScreenProps> = ({
  onEnterApp,
  isDark,
  onToggleTheme,
}) => {
  const [role, setRole] = useState<Role>('client');
  const [step, setStep] = useState<EntryStep>('phone');
  const [phone, setPhone] = useState('964123456');
  const [generatedOtp, setGeneratedOtp] = useState('8492');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const [resendTimer, setResendTimer] = useState(28);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [showSmsBanner, setShowSmsBanner] = useState(false);
  const [carrierName, setCarrierName] = useState('Entel Perú');

  // Profile setup fields
  const [fullName, setFullName] = useState('Carlos Alanya');
  const [email, setEmail] = useState('gaor.labs@gmail.com');
  const [district, setDistrict] = useState<HuancayoDistrict>('Huancayo Centro');
  const [dni, setDni] = useState('48920192');
  const [riderPlate, setRiderPlate] = useState('4892-3W');
  const [riderModel, setRiderModel] = useState('Honda GL 125');

  // Input refs for OTP
  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Detect carrier
  const getCarrier = (num: string) => {
    if (num.startsWith('964') || num.startsWith('954') || num.startsWith('948')) return 'Entel Perú';
    if (num.startsWith('997') || num.startsWith('998') || num.startsWith('980')) return 'Claro Perú';
    if (num.startsWith('999') || num.startsWith('988') || num.startsWith('975')) return 'Movistar';
    return 'Bitel / Claro';
  };

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleSendOtp = () => {
    const rawPhone = phone.replace(/\D/g, '');
    if (rawPhone.length < 9) return;
    setIsSendingCode(true);

    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newCode);
    setCarrierName(getCarrier(rawPhone));

    setTimeout(() => {
      setIsSendingCode(false);
      setStep('otp');
      setResendTimer(28);
      setShowSmsBanner(true);
      playNotificationChime();
      setTimeout(() => {
        otpInputRefs[0].current?.focus();
      }, 250);
    }, 500);
  };

  const handleAutoFillOtp = () => {
    setOtpDigits(generatedOtp.split(''));
    setOtpError(false);
    setShowSmsBanner(false);

    setTimeout(() => {
      setStep('profile-setup');
    }, 300);
  };

  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = clean;
    setOtpDigits(newDigits);
    setOtpError(false);

    if (clean && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }

    if (newDigits.every((d) => d !== '') && index === 3) {
      const entered = newDigits.join('');
      if (entered === generatedOtp || entered === '1234' || entered === '8492' || entered === '7291') {
        setShowSmsBanner(false);
        setTimeout(() => {
          setStep('profile-setup');
        }, 200);
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

  const handleCompleteLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUser: UserProfile = {
      id: 'usr_' + Date.now().toString().slice(-6),
      name: fullName.trim() || 'Carlos Alanya',
      phone: '+51 ' + (phone.trim() || '964 123 456'),
      email: email.trim() || 'gaor.labs@gmail.com',
      avatar:
        role === 'rider'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: role,
      district: district,
      dni: dni || '48920192',
      isVerified: true,
      loginMethod: 'phone',
      plate: role === 'rider' ? riderPlate : undefined,
      motorcycleModel: role === 'rider' ? riderModel : undefined,
      soatValidUntil: role === 'rider' ? '2026-12-31' : undefined,
    };
    onEnterApp(finalUser);
  };

  return (
    <div className="w-full max-w-md min-h-screen bg-zipp-bg text-zipp-text flex flex-col relative border-x border-zipp-border shadow-2xl overflow-y-auto">
      
      {/* SIMULATED PUSH NOTIFICATION / SMS TOAST */}
      <AnimatePresence>
        {showSmsBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.95 }}
            animate={{ y: 16, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-0 z-[80] max-w-sm w-[92%] bg-zinc-950/95 text-white border-2 border-zipp-yellow/70 rounded-3xl p-3.5 shadow-2xl backdrop-blur-xl ring-4 ring-zipp-yellow/10"
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
                  Tu código de acceso <strong className="text-white">YAVU Huancayo</strong> es:
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

      {/* Top Floating App Bar */}
      <div className="sticky top-0 z-40 bg-zipp-surface/90 backdrop-blur-xl border-b border-zipp-border px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-zipp-red to-zipp-red-dark flex items-center justify-center text-white shadow-lg shadow-zipp-red/30 border border-white/20">
            <Bike size={20} className="transform -rotate-12" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-display font-black text-xl tracking-tight text-zipp-text">YAVU</span>
              <span className="text-[10px] font-black text-zipp-red uppercase tracking-wider bg-zipp-red/15 px-1.5 py-0.5 rounded border border-zipp-red/30">
                Huancayo 🇵🇪
              </span>
            </div>
            <span className="text-[10px] font-bold text-zipp-text-muted">
              Delivery Express en Moto
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live active drivers badge */}
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-black text-emerald-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>18 Motos Online</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-xl bg-zipp-surface-2 border border-zipp-border text-zipp-text-muted hover:text-zipp-text transition-colors"
            title="Cambiar tema claro/oscuro"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      {/* Main Content Area: LOGIN CARD IS FIRST (TOP-LEVEL UX LIKE RAPPI/UBER EATS/PEDIDOSYA) */}
      <div className="flex-1 p-4 space-y-4">
        
        {/* PRIMARY AUTH / LOGIN CARD - POSITIONED FIRST AT THE TOP */}
        <div className="bg-zipp-surface border-2 border-zipp-border rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Glow Header Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-zipp-red via-zipp-yellow to-zipp-red" />

          {/* ROLE SELECTOR: CLIENT VS RIDER */}
          <div className="flex bg-zipp-surface-2 p-1 rounded-2xl border border-zipp-border mb-4">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                role === 'client'
                  ? 'bg-zipp-surface text-zipp-text shadow-md border border-zipp-border'
                  : 'text-zipp-text-muted hover:text-zipp-text'
              }`}
            >
              <User size={14} className={role === 'client' ? 'text-zipp-red' : ''} />
              <span>🛍️ Soy Cliente</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('rider')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                role === 'rider'
                  ? 'bg-zipp-surface text-zipp-text shadow-md border border-zipp-border'
                  : 'text-zipp-text-muted hover:text-zipp-text'
              }`}
            >
              <Bike size={14} className={role === 'rider' ? 'text-zipp-red' : ''} />
              <span>🛵 Soy Motorizado</span>
            </button>
          </div>

          {/* STEP 1: PHONE NUMBER INPUT (FIRST ACTION) */}
          {step === 'phone' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-black text-xl text-zipp-text">
                    {role === 'rider' ? 'Ingreso para Motorizados' : 'Ingresa tu número de celular'}
                  </h2>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    SMS Rápido
                  </span>
                </div>
                <p className="text-xs text-zipp-text-muted leading-snug">
                  {role === 'rider'
                    ? 'Recibe pedidos express en El Tambo, Chilca y Huancayo Centro.'
                    : 'Para pedir delivery de comida, compras o enviar paquetes wankas.'}
                </p>
              </div>

              {/* Peruvian Phone Input Box */}
              <div>
                <label className="text-xs font-bold text-zipp-text block mb-1.5">
                  Número Telefónico Móvil
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-zipp-surface-2 border border-zipp-border px-3 py-3 rounded-2xl text-sm font-bold text-zipp-text shrink-0 shadow-inner">
                    <span className="text-lg leading-none">🇵🇪</span>
                    <span className="font-mono text-zipp-text font-black">+51</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="964 123 456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && phone.length >= 9) {
                        handleSendOtp();
                      }
                    }}
                    className="flex-1 bg-zipp-surface-2 border-2 border-zipp-border focus:border-zipp-red rounded-2xl px-4 py-3 text-base font-mono font-black text-zipp-text tracking-widest placeholder:text-zipp-text-muted/40 focus:outline-none transition-all shadow-inner"
                  />
                </div>

                {/* Quick Suggester Chips */}
                <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 text-[11px]">
                  <span className="text-[10px] text-zipp-text-muted shrink-0">Números de prueba:</span>
                  <button
                    type="button"
                    onClick={() => setPhone('964123456')}
                    className="font-mono font-bold bg-zipp-surface-2 hover:bg-zipp-surface border border-zipp-border px-2 py-0.5 rounded-lg text-zipp-text shrink-0"
                  >
                    964 123 456
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhone('997845210')}
                    className="font-mono font-bold bg-zipp-surface-2 hover:bg-zipp-surface border border-zipp-border px-2 py-0.5 rounded-lg text-zipp-text shrink-0"
                  >
                    997 845 210
                  </button>
                </div>
              </div>

              {/* Main Submit Button */}
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={phone.length < 9 || isSendingCode}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-zipp-red to-zipp-red-dark text-white font-display font-black text-sm shadow-xl shadow-zipp-red/35 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {isSendingCode ? (
                  <>
                    <RefreshCw size={16} className="animate-spin text-white" />
                    <span>Enviando código SMS...</span>
                  </>
                ) : (
                  <>
                    <Phone size={17} />
                    <span>Continuar con Celular</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              {/* Direct Instant Browse Option */}
              <div className="pt-2 border-t border-zipp-border/70 text-center">
                <button
                  type="button"
                  onClick={() => {
                    const guestUser: UserProfile = {
                      id: 'usr_' + Date.now().toString().slice(-4),
                      name: 'Cliente Huancayo',
                      phone: '+51 964 123 456',
                      email: 'cliente@yavu.pe',
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                      role: role,
                      district: 'Huancayo Centro',
                      isVerified: true,
                      loginMethod: 'phone',
                    };
                    onEnterApp(guestUser);
                  }}
                  className="text-xs font-bold text-zipp-text-muted hover:text-zipp-text transition-colors flex items-center justify-center gap-1.5 mx-auto py-1"
                >
                  <Sparkles size={13} className="text-zipp-yellow" />
                  <span>Explorar restaurantes y servicios directamente</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: OTP VERIFICATION (4 DIGITS) */}
          {step === 'otp' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setShowSmsBanner(false);
                  }}
                  className="text-xs font-bold text-zipp-text-muted hover:text-zipp-text flex items-center gap-1"
                >
                  ← Cambiar número
                </button>
                <span className="text-[10px] font-black uppercase tracking-wider text-zipp-yellow bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Verificación SMS
                </span>
              </div>

              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-zipp-yellow border border-amber-500/30 mx-auto flex items-center justify-center shadow-md">
                  <Lock size={22} />
                </div>
                <h3 className="font-display font-black text-xl text-zipp-text">
                  Ingresa el Código SMS
                </h3>
                <p className="text-xs text-zipp-text-muted">
                  Enviado al <strong className="font-mono text-zipp-text">+51 {phone}</strong>
                </p>
              </div>

              {/* 4 Digit Boxes */}
              <div className="flex justify-center gap-3 py-1">
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
                    className={`w-13 h-14 rounded-2xl bg-zipp-surface-2 border-2 text-center text-2xl font-mono font-black text-zipp-text focus:outline-none transition-all shadow-inner ${
                      otpError
                        ? 'border-red-500 bg-red-500/10 text-red-500'
                        : digit
                        ? 'border-zipp-red bg-zipp-red/10 text-zipp-red'
                        : 'border-zipp-border focus:border-zipp-red'
                    }`}
                  />
                ))}
              </div>

              {/* Quick Helper Banner */}
              <div className="p-3 bg-zipp-surface-2 border border-zipp-border rounded-2xl text-center space-y-1.5">
                <div className="text-xs text-zipp-text-muted flex items-center justify-center gap-1.5">
                  <MessageSquare size={13} className="text-zipp-yellow" />
                  <span>Código generado:</span>
                  <strong className="text-zipp-yellow font-mono text-sm tracking-wider">{generatedOtp}</strong>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="w-full py-2 bg-zipp-red/15 hover:bg-zipp-red text-zipp-red hover:text-white rounded-xl text-xs font-display font-black transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap size={14} className="text-zipp-yellow" />
                  <span>Autocompletar y Acceder</span>
                </button>
              </div>

              <div className="text-center pt-1">
                {resendTimer > 0 ? (
                  <span className="text-xs text-zipp-text-muted flex items-center justify-center gap-1 font-medium">
                    <Clock size={14} /> Reenviar SMS en <strong className="font-mono text-zipp-text">{resendTimer}s</strong>
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
          )}

          {/* STEP 3: PROFILE SETUP CONFIRMATION */}
          {step === 'profile-setup' && (
            <form onSubmit={handleCompleteLogin} className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  ✓ Celular Verificado (+51 {phone})
                </span>
                <h3 className="font-display font-black text-xl text-zipp-text">
                  {role === 'rider' ? 'Registro de Motorizado Wanka' : 'Confirmar Datos de Usuario'}
                </h3>
                <p className="text-xs text-zipp-text-muted">
                  {role === 'rider' ? 'Configura tu moto para recibir pedidos y ganancias.' : 'Configura tu zona habitual para entregas más rápidas.'}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-zipp-text block mb-1">
                    Nombre Completo *
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
                    Distrito en Huancayo *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value as HuancayoDistrict)}
                    className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl px-3.5 py-2.5 text-xs text-zipp-text focus:outline-none focus:border-zipp-red"
                  >
                    {HUANCAYO_DISTRICTS.map((d) => (
                      <option key={d} value={d} className="bg-zipp-surface text-zipp-text">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {role === 'rider' ? (
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
                        className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl px-3 py-2 text-xs font-mono font-bold text-zipp-text focus:outline-none focus:border-zipp-red"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zipp-text block mb-1">
                        Modelo de Moto
                      </label>
                      <input
                        type="text"
                        value={riderModel}
                        onChange={(e) => setRiderModel(e.target.value)}
                        placeholder="Ej. Honda GL 125"
                        className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl px-3 py-2 text-xs text-zipp-text focus:outline-none focus:border-zipp-red"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-zipp-text block mb-1">
                      Correo Electrónico (Boletas)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="gaor.labs@gmail.com"
                      className="w-full bg-zipp-surface-2 border border-zipp-border rounded-xl px-3.5 py-2.5 text-xs text-zipp-text focus:outline-none focus:border-zipp-red"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-zipp-red to-zipp-red-dark text-white font-display font-black text-sm shadow-xl shadow-zipp-red/35 hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <span>{role === 'rider' ? 'Comenzar a Repartir en Huancayo' : 'Ingresar al App Delivery'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

        </div>

        {/* HUANCAYO DELIVERY SERVICES SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-sm text-zipp-text">
              ¿Qué puedes pedir en YAVU?
            </h3>
            <span className="text-[10px] font-bold text-zipp-red">
              Tarifa Plana Huancayo
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-zipp-surface p-3 rounded-2xl border border-zipp-border text-center shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-zipp-red/10 text-zipp-red flex items-center justify-center mx-auto mb-1.5">
                <Package size={17} />
              </div>
              <span className="text-xs font-black text-zipp-text block leading-tight">Encomiendas</span>
              <span className="text-[9px] text-zipp-text-muted">Documentos & cajas</span>
            </div>

            <div className="bg-zipp-surface p-3 rounded-2xl border border-zipp-border text-center shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-1.5">
                <UtensilsCrossed size={17} />
              </div>
              <span className="text-xs font-black text-zipp-text block leading-tight">Pollerías</span>
              <span className="text-[9px] text-zipp-text-muted">Comida Wanka</span>
            </div>

            <div className="bg-zipp-surface p-3 rounded-2xl border border-zipp-border text-center shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-1.5">
                <ShoppingBag size={17} />
              </div>
              <span className="text-xs font-black text-zipp-text block leading-tight">Mandaditos</span>
              <span className="text-[9px] text-zipp-text-muted">Compras y farmacia</span>
            </div>
          </div>
        </div>

        {/* HUANCAYO DELIVERY ZONES & TRUST INDICATORS */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-xs text-zipp-text-muted">
            <span className="font-black uppercase tracking-wider text-[10px]">
              Zonas con Cobertura Express
            </span>
            <span className="text-emerald-500 font-bold text-[10px]">
              ✓ GPS Activo
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {HUANCAYO_DISTRICTS.slice(0, 6).map((dist) => (
              <span
                key={dist}
                className="text-[10px] font-bold bg-zipp-surface border border-zipp-border px-2.5 py-1 rounded-full text-zipp-text"
              >
                📍 {dist}
              </span>
            ))}
          </div>

          <div className="p-3.5 bg-gradient-to-r from-zipp-surface via-zipp-surface-2 to-zipp-surface border border-zipp-border rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
              <div>
                <span className="font-black text-zipp-text block text-xs">
                  Seguridad Garantizada YAVU
                </span>
                <span className="text-[10px] text-zipp-text-muted">
                  Conductores con DNI, antecedentes y SOAT verificado.
                </span>
              </div>
            </div>
            <span className="text-xs font-black text-zipp-red bg-zipp-red/10 px-2 py-1 rounded-lg shrink-0">
              100% Wanka
            </span>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-zipp-border/70 text-center space-y-1 bg-zipp-surface/50">
        <p className="text-[10px] text-zipp-text-muted">
          YAVU Delivery Express Huancayo 🇵🇪 • El Tambo • Chilca • San Carlos
        </p>
        <p className="text-[9px] text-zinc-500">
          Pagos aceptados con Yape, Plin, Transferencia BCP/Interbank y Efectivo
        </p>
      </div>

    </div>
  );
};
