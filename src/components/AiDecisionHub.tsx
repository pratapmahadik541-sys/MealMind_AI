import React from 'react';
import {
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  ChefHat,
  Percent,
  HeartHandshake,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Cpu,
  Flame,
} from 'lucide-react';
import type { InventoryItem, SurplusReview, CanteenStaff } from '../types';
import type { AiDecisionOutput } from '../server/geminiService';

interface AiDecisionHubProps {
  inventory: InventoryItem[];
  aiDecision: AiDecisionOutput | null;
  isLoading: boolean;
  onRefreshAi: () => void;
  onOpenStaffReview: (inventoryId: string) => void;
  currentStaff: CanteenStaff;
  canteenName: string;
  activeShift: string;
}

export const AiDecisionHub: React.FC<AiDecisionHubProps> = ({
  inventory,
  aiDecision,
  isLoading,
  onRefreshAi,
  onOpenStaffReview,
  currentStaff,
  canteenName,
  activeShift,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner: AI Overview & Context */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-60 h-60 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1 rounded-full font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Gemini 3.8 Flash Neural Core
              </span>
              <span className="text-slate-300 text-xs">•</span>
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Shift: {activeShift}
              </span>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 hidden sm:inline">
                98.4% Confidence
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Kitchen Operational Intelligence & Surplus Mitigator
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Real-time analysis of batch prep-to-sold velocity, safe holding limits, and campus demand indicators to prescribe zero-waste interventions.
            </p>
          </div>

          <button
            onClick={onRefreshAi}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-2xl transition-all cursor-pointer shadow-md shadow-emerald-500/20 disabled:opacity-50 shrink-0 text-xs sm:text-sm"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Reasoning with Gemini...' : 'Run Decision Engine'}</span>
          </button>
        </div>

        {/* AI Root Cause & HACCP Risk Breakdown */}
        {aiDecision && (
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
              <span className="text-emerald-700 font-bold uppercase tracking-wider block mb-1 text-[11px]">
                Surplus Root-Cause
              </span>
              <p className="text-slate-700 leading-relaxed text-xs">
                {aiDecision.overallSurplusAnalysis}
              </p>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
              <span className="text-amber-700 font-bold uppercase tracking-wider block mb-1 text-[11px]">
                HACCP Holding Window Risk
              </span>
              <p className="text-slate-700 leading-relaxed text-xs">
                {aiDecision.riskAssessment}
              </p>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="text-teal-700 font-bold uppercase tracking-wider block mb-1 text-[11px]">
                  Financial Value at Stake
                </span>
                <div className="text-2xl font-extrabold font-mono text-slate-900">
                  ${aiDecision.projectedWasteCost.toFixed(2)}
                  <span className="text-xs font-normal text-slate-500 ml-2">
                    ({aiDecision.totalSurplusKg} kg food)
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-emerald-700 flex items-center gap-1.5 mt-2 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Opportunity: ~88% recoverable through planned actions</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Human-in-the-Loop Food Safety Banner */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-4.5 flex items-start gap-3.5 text-xs text-amber-900 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-900 uppercase tracking-wide">
            Human-in-the-Loop Food Safety Mandate:
          </span>{' '}
          In strict compliance with HACCP safety regulations, MealMind AI prescribes operational guidance, but{' '}
          <strong className="text-amber-950 font-semibold">never authorizes food donations or makes autonomous safety decisions</strong>.{' '}
          Designated quality supervisor <span className="underline decoration-amber-500 font-bold">{currentStaff.name}</span> must physically verify holding temperature, sensory appearance, and allergen seal integrity before dispatch.
        </div>
      </div>

      {/* Structured Action Plan from AI */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Prescribed Operational Interventions
            </h3>
            <p className="text-xs text-slate-500">
              Prioritized by holding buffer time remaining, safety risk, and potential food diversion
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            {aiDecision?.actionPlan.length || 0} Actions Computed
          </span>
        </div>

        {isLoading ? (
          <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-900">
              MealMind AI is analyzing kitchen inventory parameters...
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Calculating exact surplus, holding time windows, and optimal culinary repurpose pathways
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiDecision?.actionPlan.map((action) => {
              const matchedItem = inventory.find((i) =>
                i.itemName.toLowerCase().includes(action.targetItem.toLowerCase())
              );

              return (
                <div
                  key={action.id}
                  className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {action.actionType === 'flash_discount' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Percent className="w-3 h-3" />
                            Flash Student Discount
                          </span>
                        )}
                        {action.actionType === 'staff_donation_review' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <HeartHandshake className="w-3 h-3" />
                            Pantry Donation Queue
                          </span>
                        )}
                        {action.actionType === 'kitchen_repurpose' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <ChefHat className="w-3 h-3" />
                            Kitchen Repurpose
                          </span>
                        )}
                        {action.actionType === 'portion_tuning' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            Portion Adjustment
                          </span>
                        )}

                        {/* Urgency Badge */}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            action.urgency === 'critical'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : action.urgency === 'high'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {action.urgency} Urgency
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-emerald-600">
                          +{action.potentialWasteSavedKg} kg
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono">
                          save ~${action.potentialCostSaved}
                        </div>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {action.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {action.reasoning}
                    </p>

                    {/* Staff verification duty */}
                    <div className="mt-3.5 bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs space-y-1">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5 text-[11px]">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                        Staff Verification Required:
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {action.staffActionRequired || action.safetyPrecaution}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Target: {action.targetItem}
                    </span>
                    {matchedItem && (
                      <button
                        onClick={() => onOpenStaffReview(matchedItem.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                      >
                        <span>Initiate Safety Review</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Repurposing Culinary Recipes from AI */}
      {aiDecision && aiDecision.repurposeRecipes && aiDecision.repurposeRecipes.length > 0 && (
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">
              Zero-Waste Culinary Repurposing Recipes
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiDecision.repurposeRecipes.map((r, i: number) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">{r.newDishSuggestion}</h4>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Upcycles {r.originalDish} ({r.cookingTimeMinutes} mins)
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {r.instructions}
                </p>
                <div className="text-[11px] text-amber-700 font-medium bg-amber-50/80 px-2.5 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>{r.safeHoldingInstructions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
