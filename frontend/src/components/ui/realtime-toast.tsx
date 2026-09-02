'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  onClose: () => void;
}

export function RealtimeToast({ type, title, message, onClose }: ToastProps) {
  return (
    <div className={`p-4 rounded-xl shadow-xl border flex items-start space-x-3 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300 ${
      type === 'error' 
        ? 'bg-slate-900 border-red-500/50 text-white' 
        : type === 'success'
        ? 'bg-slate-900 border-emerald-500/50 text-white'
        : 'bg-slate-900 border-blue-500/50 text-white'
    }`}>
      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
        type === 'error' ? 'bg-red-500/20 text-red-400' : type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
      }`}>
        {type === 'error' ? <AlertTriangle className="w-5 h-5" /> : type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">{title}</h4>
        <p className="text-xs font-medium text-slate-100 mt-0.5 leading-relaxed">{message}</p>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
