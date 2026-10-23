import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  HeartHandshake,
  BarChart3,
  Layers,
  Calendar,
  Lightbulb,
  Leaf,
  Users,
  Settings,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export type NavigationItem =
  | 'dashboard'
  | 'intelligence'
  | 'surplus'
  | 'donations'
  | 'analytics'
  | 'inventory'
  | 'planning'
  | 'recommendations'
  | 'impact'
  | 'team'
  | 'settings';

interface SidebarProps {
  activeTab: NavigationItem;
  onSelectTab: (tab: NavigationItem) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  pendingReviewsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  pendingReviewsCount,
}) => {
  const menuItems: Array<{
    id: NavigationItem;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'intelligence', label: 'Food Intelligence', icon: Sparkles },
    { id: 'surplus', label: 'Surplus Prediction', icon: TrendingUp },
    { id: 'donations', label: 'Donation Management', icon: HeartHandshake },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'inventory', label: 'Inventory', icon: Layers },
    { id: 'planning', label: 'Meal Planning', icon: Calendar },
    { id: 'recommendations', label: 'AI Recommendations', icon: Lightbulb },
    { id: 'impact', label: 'Impact Tracker', icon: Leaf },
    { id: 'team', label: 'Team & Staff', icon: Users, badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined, badgeColor: 'bg-amber-100 text-amber-900 border-amber-300' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200/90 flex flex-col transition-all duration-300 ease-in-out shrink-0 z-30 ${
        isCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="text-base font-extrabold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                MealMind<span className="text-emerald-600 font-mono">.ai</span>
              </span>
              <span className="text-[10px] block font-semibold text-emerald-700 tracking-wider uppercase">
                Enterprise Dining
              </span>
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-2.5 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-50/90 text-emerald-900 border border-emerald-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div
                className={`shrink-0 transition-colors ${
                  isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {!isCollapsed && item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold border ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom User / Compliance Badge */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
              MM
            </div>
            <div className="truncate text-xs">
              <span className="font-bold text-slate-900 block truncate">
                MealMind Operating OS
              </span>
              <span className="text-[10px] text-emerald-700 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                HACCP Cloud Live
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="HACCP Cloud Live" />
          </div>
        )}
      </div>
    </aside>
  );
};
