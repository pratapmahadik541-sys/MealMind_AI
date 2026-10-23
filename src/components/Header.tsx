import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  Clock,
  UserCheck,
  Database,
  RefreshCw,
  Bot,
  Bell,
  Check,
  ChevronDown,
  Menu,
} from 'lucide-react';
import type { CanteenLocation, CanteenStaff, MealShift } from '../types';

interface HeaderProps {
  locations: CanteenLocation[];
  selectedLocation: CanteenLocation;
  onSelectLocation: (loc: CanteenLocation) => void;
  staffList: CanteenStaff[];
  currentStaff: CanteenStaff;
  onSelectStaff: (staff: CanteenStaff) => void;
  activeShift: MealShift;
  onChangeShift: (shift: MealShift) => void;
  onRunAiAudit: () => void;
  isAiLoading: boolean;
  firestoreStatus: { connected: boolean; message: string };
  onResetSampleData: () => void;
  onOpenChat: () => void;
  onToggleSidebarMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  staffList,
  currentStaff,
  onSelectStaff,
  activeShift,
  onChangeShift,
  onRunAiAudit,
  isAiLoading,
  firestoreStatus,
  onResetSampleData,
  onOpenChat,
  onToggleSidebarMobile,
}) => {
  const shifts: MealShift[] = ['Breakfast', 'Lunch', 'Dinner', 'Late Night'];
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Pantry Pickup in 45 mins',
      desc: 'Campus Food Pantry refrigerated van scheduled for 2:15 PM.',
      time: '10m ago',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'HACCP Probe Temp Verified',
      desc: 'Fresh Fruit Salad inspected at 3.5°C by Elena Rostova.',
      time: '25m ago',
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'Demand Surge Alert: Rain Forecast',
      desc: 'Rain predicted for evening shift: soup demand +28%.',
      time: '1h ago',
      unread: false,
    },
  ];

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6">
      <div className="h-full max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile menu button + Location selector */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleSidebarMobile}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Canteen Location Selector */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 hover:border-slate-300 transition-all">
            <Building2 className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0" />
            <select
              value={selectedLocation.id}
              onChange={(e) => {
                const loc = locations.find((l) => l.id === e.target.value);
                if (loc) onSelectLocation(loc);
              }}
              className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer pr-1 text-xs"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Shift Selector (Breakfast, Lunch, Dinner, Late Night) */}
        <div className="hidden lg:flex items-center bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/80 text-xs font-semibold">
          <span className="text-slate-400 pl-2.5 pr-1.5">
            <Clock className="w-3.5 h-3.5" />
          </span>
          {shifts.map((s) => (
            <button
              key={s}
              onClick={() => onChangeShift(s)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeShift === s
                  ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 text-xs">
          {/* Live Firebase Status Indicator */}
          <div
            title={firestoreStatus.message}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border bg-emerald-50 text-emerald-800 border-emerald-200"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline font-mono text-[11px]">Firestore</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Reset / Reload Demo Data */}
          <button
            onClick={onResetSampleData}
            title="Reset Canteen Demo Data"
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
              className="relative p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] text-emerald-600 font-medium">2 unread</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2 rounded-xl border ${
                        n.unread
                          ? 'bg-emerald-50/50 border-emerald-100 text-slate-800'
                          : 'bg-slate-50 border-slate-100 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Shift Audit Button */}
          <button
            onClick={onRunAiAudit}
            disabled={isAiLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-60"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isAiLoading ? 'Auditing...' : 'AI Shift Audit'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
