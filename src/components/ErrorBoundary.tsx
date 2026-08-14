import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#090E0B] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500 mb-4 shadow-lg shadow-red-500/20">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-xl font-bold font-display tracking-tight text-white mb-2">
            Error al Cargar la Aplicación
          </h1>
          <p className="text-sm text-zinc-400 max-w-xs mb-6 leading-relaxed">
            Se detectó un problema con datos en caché anteriores o una actualización pendiente.
          </p>
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
            >
              <RefreshCw size={16} />
              <span>Actualizar Página</span>
            </button>
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 font-medium transition-all"
            >
              Limpiar Caché y Reiniciar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
