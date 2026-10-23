import React from 'react';
import {
  Thermometer,
  Clock,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  Layers,
  ArrowRight,
  Plus,
  AlertTriangle,
} from 'lucide-react';
import type { InventoryItem } from '../types';

interface AvailableSurplusCardsProps {
  inventory: InventoryItem[];
  onOpenStaffReview: (itemId: string) => void;
  onSimulateSale: (item: InventoryItem, delta: number) => void;
}

export const AvailableSurplusCards: React.FC<AvailableSurplusCardsProps> = ({
  inventory,
  onOpenStaffReview,
  onSimulateSale,
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
              Live Kitchen Counter
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-700">Real-Time Batch Monitoring</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
            Available Surplus Today
          </h2>
          <p className="text-xs text-slate-500">
            Active prepared batches with calculated remaining surplus, HACCP temperature status, and holding buffers.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 w-fit">
          {inventory.length} Batches Monitored
        </div>
      </div>

      {/* Grid of Food Cards with Realistic Photography */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {inventory.map((item) => {
          const surplus = Math.max(0, item.preparedQty - item.soldQty - (item.reservedQty || 0));
          const surplusPct = item.preparedQty > 0 ? (surplus / item.preparedQty) * 100 : 0;
          const inDangerZone = item.storageTempC > 4 && item.storageTempC < 60;

          return (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photorealistic Food Image with Status Overlays */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={
                      item.imageUrl ||
                      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={item.itemName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category Pill */}
                  <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>

                  {/* Surplus Status Badge */}
                  <span
                    className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md shadow-xs ${
                      surplus === 0
                        ? 'bg-slate-900/80 text-white'
                        : surplusPct > 25
                        ? 'bg-rose-500/90 text-white animate-pulse'
                        : 'bg-amber-500/90 text-white'
                    }`}
                  >
                    {surplus} {item.unit} Surplus ({surplusPct.toFixed(0)}%)
                  </span>

                  {/* Temperature Pill */}
                  <div
                    className={`absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-md ${
                      inDangerZone
                        ? 'bg-rose-600 text-white'
                        : 'bg-white/95 text-slate-800'
                    }`}
                  >
                    <Thermometer className="w-3 h-3 text-emerald-600" />
                    <span>{item.storageTempC}°C</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {item.itemName}
                  </h3>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center justify-between">
                    <span>{item.location}</span>
                    <span className="font-semibold text-slate-700">${item.costPerUnit.toFixed(2)}/portion</span>
                  </div>

                  {/* Quantities Bar */}
                  <div className="mt-3 grid grid-cols-3 gap-1 p-2 rounded-xl bg-slate-50 border border-slate-100 text-center font-mono text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans uppercase">Prepared</span>
                      <span className="font-bold text-slate-800">{item.preparedQty}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans uppercase">Sold</span>
                      <span className="font-bold text-emerald-700">{item.soldQty}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans uppercase">Surplus</span>
                      <span className="font-bold text-amber-700">{surplus}</span>
                    </div>
                  </div>

                  {/* Expiry & Holding Info */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Hold exp:
                    </span>
                    <span className="font-mono text-slate-700 font-medium">
                      {new Date(item.safeHoldingExpiry).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 pt-0 flex items-center gap-1.5 border-t border-slate-100">
                <button
                  onClick={() => onSimulateSale(item, 5)}
                  title="Simulate +5 portions sold during dining rush"
                  className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-center"
                >
                  +5 Sold
                </button>
                <button
                  onClick={() => onOpenStaffReview(item.id)}
                  title="Review for donation or repurposing"
                  className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Safety Gate</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
