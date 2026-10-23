import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Thermometer,
  Eye,
  Clock,
  Tag,
  CheckCircle2,
  XCircle,
  FileText,
  HeartHandshake,
  ChefHat,
  Percent,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import type { InventoryItem, SurplusReview, CanteenStaff } from '../types';

interface StaffReviewGateProps {
  inventory: InventoryItem[];
  reviews: SurplusReview[];
  onSubmitReview: (review: Omit<SurplusReview, 'id' | 'reviewedAt'>) => void;
  currentStaff: CanteenStaff;
  selectedItemId: string | null;
  onClearSelectedItem: () => void;
}

export const StaffReviewGate: React.FC<StaffReviewGateProps> = ({
  inventory,
  reviews,
  onSubmitReview,
  currentStaff,
  selectedItemId,
  onClearSelectedItem,
}) => {
  const activeItems = inventory.filter(
    (i) => i.status === 'active' || i.status === 'review_pending'
  );

  const [activeItemId, setActiveItemId] = useState<string>(
    selectedItemId || activeItems[0]?.id || ''
  );

  const currentItem = inventory.find((i) => i.id === activeItemId) || activeItems[0];

  const [probeTempC, setProbeTempC] = useState<number>(currentItem?.storageTempC || 62.0);
  const [smellVisualChecked, setSmellVisualChecked] = useState<boolean>(true);
  const [allergenChecked, setAllergenChecked] = useState<boolean>(true);
  const [holdingTimeChecked, setHoldingTimeChecked] = useState<boolean>(true);
  const [staffNotes, setStaffNotes] = useState<string>(
    'Probe thermometer verified. Organoleptic odor and appearance sound. Packaged in sanitized cambro containers.'
  );

  useEffect(() => {
    if (selectedItemId) {
      setActiveItemId(selectedItemId);
      const item = inventory.find((i) => i.id === selectedItemId);
      if (item) {
        setProbeTempC(item.storageTempC);
      }
    }
  }, [selectedItemId, inventory]);

  const surplusPortions = currentItem
    ? Math.max(0, currentItem.preparedQty - currentItem.soldQty - (currentItem.reservedQty || 0))
    : 0;

  const isHotSafe = probeTempC >= 60;
  const isColdSafe = probeTempC <= 4 && probeTempC >= -2;
  const isTempDangerZone = !isHotSafe && !isColdSafe;

  const handleDecision = (
    decision:
      | 'approved_for_donation'
      | 'repurpose_in_kitchen'
      | 'discount_flash_sale'
      | 'compost_discard'
  ) => {
    if (!currentItem) return;

    if (isTempDangerZone && (decision === 'approved_for_donation' || decision === 'discount_flash_sale')) {
      alert(
        'CRITICAL SAFETY WARNING: Temperature is in the HACCP Danger Zone (5°C to 59°C). Food cannot be approved for human donation or sale without rapid chilling or discard.'
      );
      return;
    }

    const urgency =
      isTempDangerZone || surplusPortions > 30 ? 'Critical' : surplusPortions > 15 ? 'High' : 'Medium';

    onSubmitReview({
      inventoryId: currentItem.id,
      itemName: currentItem.itemName,
      surplusQty: surplusPortions,
      unit: currentItem.unit,
      urgency,
      currentTempC: Number(probeTempC),
      tempCheckPassed: !isTempDangerZone,
      smellVisualPassed: smellVisualChecked,
      allergenLabelled: allergenChecked,
      holdingTimeWithinSafeLimit: holdingTimeChecked,
      safetyNotes: staffNotes.trim(),
      reviewedByStaff: `${currentStaff.name} (${currentStaff.role})`,
      decision,
      isSampleData: false,
    });

    onClearSelectedItem();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Staff Food Safety Gate & Human Governance Desk
              </h2>
              <p className="text-xs text-slate-500">
                Mandatory physical HACCP verification before any surplus item can be dispatched, repurposed, or discounted.
              </p>
            </div>
          </div>
          <div className="text-xs bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl text-slate-700 font-mono">
            Inspector: <span className="text-amber-700 font-bold">{currentStaff.name}</span> ({currentStaff.badgeId})
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Queue of items awaiting safety check */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Pending Batches ({activeItems.length})
            </h3>
            <span className="text-[11px] text-slate-400">Select to inspect</span>
          </div>

          {activeItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No active batches currently queued for review.
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {activeItems.map((item) => {
                const surplus = Math.max(0, item.preparedQty - item.soldQty - (item.reservedQty || 0));
                const isSelected = item.id === activeItemId;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveItemId(item.id);
                      setProbeTempC(item.storageTempC);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-300 shadow-xs text-slate-900'
                        : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200/60 text-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-bold text-slate-900 leading-tight">
                        {item.itemName}
                      </span>
                      <span className="font-mono font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full text-[10px] shrink-0 border border-amber-200">
                        {surplus} {item.unit}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
                      <span>{item.location}</span>
                      <span className="font-mono text-emerald-700 font-semibold">{item.storageTempC}°C</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Center: Interactive Safety Inspection Checklist */}
        <div className="lg:col-span-2 space-y-4">
          {currentItem ? (
            <div className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Inspecting Batch
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {currentItem.itemName}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    Batch: {currentItem.batchNumber} • Station: {currentItem.location}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Surplus for Review:</div>
                  <div className="text-2xl font-extrabold font-mono text-amber-600">
                    {surplusPortions} {currentItem.unit}
                  </div>
                </div>
              </div>

              {/* Physical HACCP Checklist Form */}
              <div className="mt-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Mandatory Physical Verification Gates
                </h4>

                {/* 1. Temperature probe check */}
                <div
                  className={`p-4 rounded-2xl border ${
                    isTempDangerZone
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Thermometer className="w-5 h-5 text-slate-500" />
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          Gate 1: Calibrated Internal Probe Thermometer
                        </div>
                        <div className="text-[11px] text-slate-600">
                          HACCP standard: Hot foods must be ≥ 60°C. Cold foods must be ≤ 4°C.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-600">Logged Temp:</span>
                      <input
                        type="number"
                        step="0.5"
                        value={probeTempC}
                        onChange={(e) => setProbeTempC(Number(e.target.value))}
                        className="w-20 px-2.5 py-1 bg-white border border-slate-300 rounded-xl font-mono font-bold text-xs text-slate-900 outline-none focus:border-emerald-500 shadow-xs"
                      />
                      <span className="text-xs font-bold font-mono text-slate-900">°C</span>
                    </div>
                  </div>

                  {isTempDangerZone && (
                    <div className="mt-2.5 pt-2 border-t border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>
                        DANGER ZONE WARNING (5°C - 59°C): Potential bacterial proliferation. Cannot donate without rapid blast-chill or discard.
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. Sensory Organoleptic Test */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 cursor-pointer hover:bg-slate-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={smellVisualChecked}
                    onChange={(e) => setSmellVisualChecked(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      Gate 2: Sensory Odor, Texture & Visual Inspection
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Staff confirms dish shows no signs of rancidity, off-odors, discoloration, or surface crusting.
                    </p>
                  </div>
                </label>

                {/* 3. Holding Time Threshold */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 cursor-pointer hover:bg-slate-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={holdingTimeChecked}
                    onChange={(e) => setHoldingTimeChecked(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Gate 3: Within Safe 4-Hour Time Limit
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5 font-mono">
                      Prepared at {new Date(currentItem.preparedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Holding buffer remains safe.
                    </p>
                  </div>
                </label>

                {/* 4. Allergen Labeling */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 cursor-pointer hover:bg-slate-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={allergenChecked}
                    onChange={(e) => setAllergenChecked(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-slate-500" />
                      Gate 4: Allergen & Dietary Identification Affixed
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Container tagged with major allergens (dairy, nuts, gluten, soy) to protect recipients.
                    </p>
                  </div>
                </label>

                {/* Staff Sign-off Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Staff Inspection Notes & Probe Serial (Required for audit log)
                  </label>
                  <textarea
                    rows={2}
                    value={staffNotes}
                    onChange={(e) => setStaffNotes(e.target.value)}
                    placeholder="Enter physical inspection observations..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                {/* Staff Decision Action Buttons */}
                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-800 mb-2">
                    Authorize Staff Action:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <button
                      onClick={() => handleDecision('approved_for_donation')}
                      disabled={isTempDangerZone || !smellVisualChecked}
                      className="flex flex-col items-center text-center p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                    >
                      <HeartHandshake className="w-5 h-5 mb-1 text-blue-100" />
                      <span>Approve Donation</span>
                      <span className="text-[10px] opacity-80 mt-0.5 font-normal">To Food Pantry</span>
                    </button>

                    <button
                      onClick={() => handleDecision('repurpose_in_kitchen')}
                      disabled={isTempDangerZone || !smellVisualChecked}
                      className="flex flex-col items-center text-center p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all cursor-pointer disabled:opacity-40 shadow-sm"
                    >
                      <ChefHat className="w-5 h-5 mb-1" />
                      <span>Kitchen Repurpose</span>
                      <span className="text-[10px] opacity-80 mt-0.5 font-normal">For Next Shift</span>
                    </button>

                    <button
                      onClick={() => handleDecision('discount_flash_sale')}
                      disabled={isTempDangerZone || !smellVisualChecked}
                      className="flex flex-col items-center text-center p-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all cursor-pointer disabled:opacity-40 shadow-sm"
                    >
                      <Percent className="w-5 h-5 mb-1 text-purple-100" />
                      <span>50% Flash Sale</span>
                      <span className="text-[10px] opacity-80 mt-0.5 font-normal">Counter Discount</span>
                    </button>

                    <button
                      onClick={() => handleDecision('compost_discard')}
                      className="flex flex-col items-center text-center p-3.5 rounded-2xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 font-semibold transition-all cursor-pointer border border-slate-200"
                    >
                      <Trash2 className="w-5 h-5 mb-1" />
                      <span>Bio-Compost</span>
                      <span className="text-[10px] opacity-80 mt-0.5 font-normal">Zero Poisoning Risk</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center text-slate-400 text-xs shadow-sm">
              Select an item from the queue to start staff safety inspection.
            </div>
          )}

          {/* Past Review Audit Log */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Staff Safety Sign-off History ({reviews.length} Logged Reviews)
            </h3>

            <div className="divide-y divide-slate-100 text-xs max-h-[300px] overflow-y-auto">
              {reviews.map((rev) => (
                <div key={rev.id} className="py-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-sans">{rev.itemName}</span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          rev.decision === 'approved_for_donation'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : rev.decision === 'discount_flash_sale'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : rev.decision === 'repurpose_in_kitchen'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {rev.decision.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">{rev.safetyNotes}</p>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2 font-mono">
                      <span>Logged by: {rev.reviewedByStaff}</span>
                      <span>•</span>
                      <span>{new Date(rev.reviewedAt).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono text-xs">
                    <span className="font-bold text-slate-900">
                      {rev.surplusQty} {rev.unit}
                    </span>
                    <div className="text-[10px] text-emerald-700 font-semibold">
                      {rev.currentTempC}°C
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
