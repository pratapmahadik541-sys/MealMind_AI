import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  Calendar,
  Layers,
  HeartHandshake,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { InventoryItem, SurplusReview, DonationManifest, HistoricalShiftData } from '../types';

interface AdvancedAnalyticsChartsProps {
  inventory: InventoryItem[];
  reviews: SurplusReview[];
  manifests: DonationManifest[];
  historicalShifts: HistoricalShiftData[];
}

export const AdvancedAnalyticsCharts: React.FC<AdvancedAnalyticsChartsProps> = ({
  inventory,
  reviews,
  manifests,
  historicalShifts,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'prep_vs_sold' | 'donations' | 'categories'>('prep_vs_sold');

  // Prep vs Sold Historical Data
  const prepVsDemandData = historicalShifts.map((h) => ({
    name: `${h.date} (${h.dayOfWeek})`,
    Prepared: h.preparedPortions,
    Sold: h.soldPortions,
    Surplus: h.surplusPortions,
    Rescued: h.rescuedPortions,
  }));

  // Category Distribution Data
  const categoryMap: Record<string, number> = {};
  inventory.forEach((i) => {
    categoryMap[i.category] = (categoryMap[i.category] || 0) + i.preparedQty;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#14b8a6'];

  // Donation Distribution by Recipient
  const donationByPartner: Record<string, number> = {};
  manifests.forEach((m) => {
    const org = m.recipientOrg.split('(')[0].trim();
    donationByPartner[org] = (donationByPartner[org] || 0) + m.totalPortions;
  });
  const partnerData = Object.entries(donationByPartner).map(([name, portions]) => ({
    partner: name.length > 20 ? name.slice(0, 18) + '...' : name,
    portions,
  }));

  // Custom Light Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 border border-slate-200 p-3 rounded-2xl shadow-xl backdrop-blur-md text-xs font-mono">
          <p className="font-bold text-slate-800 mb-1.5 font-sans">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 font-sans" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold text-slate-900">{entry.value} portions</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Chart Section Card */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                Interactive Analytics
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs font-medium text-slate-500">7-Day Rolling Shift Window</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Kitchen Production Dynamics & Surplus Variance
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Accurate breakdown of kitchen prep volume vs. student purchases and verified charity rescue volumes.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60 text-xs font-medium">
            <button
              onClick={() => setActiveChartTab('prep_vs_sold')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeChartTab === 'prep_vs_sold'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Prep vs. Sold
            </button>
            <button
              onClick={() => setActiveChartTab('donations')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeChartTab === 'donations'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Shelter Rescues
            </button>
            <button
              onClick={() => setActiveChartTab('categories')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeChartTab === 'categories'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Category Shares
            </button>
          </div>
        </div>

        {/* Chart Viewports */}
        <div className="pt-6 h-[320px] w-full">
          {activeChartTab === 'prep_vs_sold' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={prepVsDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="prepGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="soldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="surplusGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 14, fontSize: 11, color: '#64748b' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="Prepared"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#prepGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="Sold"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#soldGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="Surplus"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#surplusGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'donations' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={partnerData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="partner" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="portions"
                  name="Portions Rescued"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                >
                  {partnerData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 h-full items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                {categoryData.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <div className="truncate">
                      <span className="text-slate-700 font-sans block truncate text-[11px] font-medium">
                        {entry.name}
                      </span>
                      <span className="text-emerald-600 font-bold">{entry.value} portions</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Operational Activity Timeline */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Live Kitchen Activity Stream
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Real-time Feed
          </span>
        </div>

        <div className="space-y-3 text-xs">
          {reviews.slice(0, 3).map((r, i) => (
            <div key={r.id || i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 font-sans">{r.itemName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(r.reviewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">{r.safetyNotes}</p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono">
                  <span className="text-emerald-700 font-semibold">{r.surplusQty} {r.unit} evaluated</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">Inspector: {r.reviewedByStaff}</span>
                </div>
              </div>
            </div>
          ))}

          {manifests.slice(0, 2).map((m, i) => (
            <div key={m.id || i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 font-sans">{m.recipientOrg}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold uppercase bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    {m.status}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">{m.itemsSummary}</p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono">
                  <span className="text-blue-600 font-semibold">{m.totalPortions} meals dispatched</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">Code: {m.verificationCode}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
