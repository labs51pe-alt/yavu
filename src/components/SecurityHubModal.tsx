import React from 'react';
import { motion } from 'motion/react';
import { Shield, X, PhoneCall, AlertTriangle, CheckCircle2, Lock, Radio, MapPin } from 'lucide-react';

interface SecurityHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityHubModal: React.FC<SecurityHubModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-zipp-surface border-2 border-zipp-red/40 rounded-3xl p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-zipp-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-zipp-red text-white flex items-center justify-center font-black shadow-lg shadow-zipp-red/30">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-display font-black text-base text-zipp-text">Centro de Seguridad YAVU</h3>
              <p className="text-[11px] text-zipp-text-muted">Protección 100% garantizada en Huancayo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zipp-surface-2 flex items-center justify-center text-zipp-text-muted hover:text-zipp-text"
          >
            <X size={16} />
          </button>
        </div>

        {/* Emergency Direct Hotlines in Huancayo */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-zipp-text-muted flex items-center gap-1.5">
            <AlertTriangle size={12} className="text-zipp-red" /> Centrales de Emergencia en Huancayo
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <a
              href="tel:064484444"
              className="bg-zipp-red/10 border border-zipp-red/30 rounded-2xl p-3 flex flex-col justify-between hover:bg-zipp-red/20 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-zipp-text">Serenazgo HYO</span>
                <PhoneCall size={14} className="text-zipp-red" />
              </div>
              <span className="font-mono font-black text-sm text-amber-500 dark:text-zipp-yellow mt-1">064-484444</span>
            </a>

            <a
              href="tel:105"
              className="bg-zipp-surface-2 border border-zipp-border rounded-2xl p-3 flex flex-col justify-between hover:bg-zipp-surface-3 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-zipp-text">Policía Nacional</span>
                <PhoneCall size={14} className="text-green-500" />
              </div>
              <span className="font-mono font-black text-sm text-zipp-text mt-1">105 (Central)</span>
            </a>
          </div>
        </div>

        {/* 4 Guarantees */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-black uppercase tracking-widest text-zipp-text-muted">
            Garantías YAVU para Encomiendas & Delivery
          </h4>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-3 bg-zipp-surface-2 p-3.5 rounded-2xl border border-zipp-border shadow-sm">
              <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-zipp-text">Motorizados 100% Verificados</div>
                <div className="text-[11px] text-zipp-text-muted">
                  Validación de DNI, récord de conductor sin faltas graves y antecedentes policiales.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-zipp-surface-2 p-3.5 rounded-2xl border border-zipp-border shadow-sm">
              <Lock size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-zipp-text">Código PIN Secreto de Entrega</div>
                <div className="text-[11px] text-zipp-text-muted">
                  Nadie puede entregar tu paquete sin que el destinatario valide el código de 4 dígitos.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-zipp-surface-2 p-3.5 rounded-2xl border border-zipp-border shadow-sm">
              <Radio size={18} className="text-zipp-red shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-zipp-text">Rastreo GPS en Tiempo Real</div>
                <div className="text-[11px] text-zipp-text-muted">
                  Comparte el link de seguimiento con cualquier persona por WhatsApp al instante.
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-zipp-surface-2 text-zipp-text font-display font-bold text-xs hover:bg-zipp-surface-3 border border-zipp-border"
        >
          Cerrar
        </button>
      </motion.div>
    </div>
  );
};
