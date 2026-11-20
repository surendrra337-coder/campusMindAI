import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border p-3.5 shadow-glass backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'
                : isError
                ? 'bg-rose-950/90 border-rose-500/30 text-rose-200'
                : 'bg-campus-surface/90 border-campus-border text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
              {isError && <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />}
              {!isSuccess && !isError && <Info className="h-4 w-4 text-blue-400 shrink-0" />}
              <span className="text-xs font-medium leading-snug">{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Close notification"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
