'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, XCircle, Bell, X } from 'lucide-react';

type Toast = {
  id: string;
  title: string;
  description?: string;
  duration?: number;
};

type ToastContextType = {
  toast: (opts: Omit<Toast, 'id'>) => void;
};

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function DemoToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...opts, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, opts.duration ?? 5000);
  }, []);

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full">
        {toasts.map(t => (
          <div
            key={t.id}
            className="bg-pn-surface-strong border border-pn-border rounded-xl p-4 shadow-2xl flex gap-3 items-start animate-in slide-in-from-bottom-4 duration-300"
          >
            <div className="text-lg shrink-0">
              {t.title.startsWith('✅') ? <CheckCircle2 size={20} className="text-green-500" /> :
               t.title.startsWith('❌') ? <XCircle size={20} className="text-red-500" /> :
               <Bell size={20} className="text-pn-gold" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-pn-text text-sm">{t.title.replace(/^[✅❌📢]\s?/, '')}</p>
              {t.description && <p className="text-xs text-pn-text-muted mt-0.5">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-pn-text-muted hover:text-pn-text shrink-0">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
