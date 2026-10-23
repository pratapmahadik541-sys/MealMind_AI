import React from 'react';
import {
  Sparkles,
  Bot,
  Plus,
  Clock,
  ShieldCheck,
  Activity,
  Layers,
  ArrowRight,
  Database,
  Leaf,
  CheckCircle2,
} from 'lucide-react';
import type { MealShift, CanteenStaff } from '../types';

interface HeroSectionProps {
  activeShift: MealShift;
  canteenName: string;
  onRunAudit: () => void;
  isAiLoading: boolean;
  onOpenChat: () => void;
  onNavigateTab?: (tab: string) => void;
  onOpenNewBatchModal?: () => void;
  currentStaff?: CanteenStaff;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeShift,
  canteenName,
  onRunAudit,
  isAiLoading,
  onOpenChat,
  onNavigateTab,
  onOpenNewBatchModal,
  currentStaff,
}) => {
  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-white via-slate-50/60 to-emerald-50/30 border border-slate-200/80 p-6 sm:p-8 lg:p-10 mb-8 shadow-sm overflow-hidden">
      {/* Background Soft Ambient Glow */}
      <div className="absolute top-0 right-10 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Heading, Subtitle & Live Status Indicators */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          {/* Status Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live AI Engine Active
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-700 bg-white border border-slate-200 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              {activeShift} Shift • 11:30 AM – 2:30 PM
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200">
              <Database className="w-3 h-3 text-teal-600" />
              Cloud Firestore Synced
            </span>
          </div>

          {/* Main Heading & Subtitle */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                MealMind.ai
              </span>
            </h1>
            <p className="text-lg sm:text-xl font-semibold text-slate-800 mt-2">
              Smarter food management. Less waste. Greater impact.
            </p>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              Real-time predictive surplus calculations, automated HACCP temperature safeguards, and staff-governed donation dispatch for{' '}
              <strong className="text-slate-900 font-semibold">{canteenName}</strong>.
            </p>
          </div>

          {/* Quick CTA Action Group */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={onRunAudit}
              disabled={isAiLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
              <span>{isAiLoading ? 'Auditing Shift...' : 'Run AI Shift Audit'}</span>
            </button>

            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Ask MealMind AI</span>
            </button>

            <button
              onClick={() => onNavigateTab ? onNavigateTab('inventory') : onOpenNewBatchModal?.()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-700 hover:text-emerald-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <span>View Surplus Food</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Stats Highlights */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600 border-t border-slate-200/60 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              100% Staff HACCP Sign-off
            </span>
            <span className="flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              Good Samaritan Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              Sub-second Cloud Sync
            </span>
          </div>
        </div>

        {/* Right Column: Split Food Photography + 3D AI Predictive Engine Orb */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-md">
            {/* Realistic Food Photography Grid Background */}
            <div className="grid grid-cols-2 gap-1.5 p-2 bg-slate-100">
              <div className="relative h-28 rounded-xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80"
                  alt="Indian Vegetarian Thali"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  Vegetarian Thali
                </span>
              </div>
              <div className="relative h-28 rounded-xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
                  alt="Vegetable Pulao"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  Vegetable Pulao
                </span>
              </div>
              <div className="relative h-28 rounded-xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
                  alt="Dal Tadka"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  Dal Tadka
                </span>
              </div>
              <div className="relative h-28 rounded-xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"
                  alt="Mixed Vegetables"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  Mixed Veggies
                </span>
              </div>
            </div>

            {/* Bottom clean status pill */}
            <div className="bg-white px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
              <span className="font-semibold flex items-center gap-1.5 text-[11px] text-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Live Kitchen Prep Monitor
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {activeShift} Shift Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
