import React, { useState } from 'react';
import {
  TrendingUp,
  CloudRain,
  Sun,
  Snowflake,
  GraduationCap,
  Sparkles,
  Calendar,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
} from 'lucide-react';
import type { HistoricalShiftData, MealShift } from '../types';
import type { DemandForecastOutput } from '../server/geminiService';

interface DemandForecastingProps {
  historicalData: HistoricalShiftData[];
  onGenerateForecast: (context: {
    targetDate: string;
    mealShift: string;
    dayOfWeek: string;
    weatherCondition: string;
    temperatureC: number;
    campusEvent: string;
    canteenName: string;
  }) => void;
  forecastResult: DemandForecastOutput | null;
  isLoading: boolean;
  canteenName: string;
  activeShift: MealShift;
}

export const DemandForecasting: React.FC<DemandForecastingProps> = ({
  historicalData,
  onGenerateForecast,
  forecastResult,
  isLoading,
  canteenName,
  activeShift,
}) => {
  const [targetDate, setTargetDate] = useState('2026-10-24');
  const [dayOfWeek, setDayOfWeek] = useState('Friday');
  const [mealShift, setMealShift] = useState<MealShift>(activeShift);
  const [weatherCondition, setWeatherCondition] = useState('Rainy & Chilly');
  const [temperatureC, setTemperatureC] = useState(13);
  const [campusEvent, setCampusEvent] = useState('Midterms Exam Study Week');

  const weatherPresets = [
    { label: 'Rainy & Chilly (13°C)', condition: 'Rainy & Chilly', temp: 13, icon: CloudRain },
    { label: 'Sunny & Pleasant (22°C)', condition: 'Sunny & Pleasant', temp: 22, icon: Sun },
    { label: 'Snow & Freezing (-2°C)', condition: 'Heavy Snowfall', temp: -2, icon: Snowflake },
  ];

  const eventPresets = [
    'Midterms Exam Study Week',
    'Campus Homecoming Football Game',
    'Spring Student Arts Festival',
    'Standard Academic Lecture Day',
    'Pre-Holiday Break Friday',
  ];

  const handleRunSimulation = () => {
    onGenerateForecast({
      targetDate,
      mealShift,
      dayOfWeek,
      weatherCondition,
      temperatureC,
      campusEvent,
      canteenName,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Simulation Controls */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono">
                Predictive Analytics Engine
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs font-mono text-slate-500">{canteenName}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Demand Forecasting & Production Batch Optimizer
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate campus variables (weather, academic exam pressure, athletics) to generate portion recommendations before food is prepared.
            </p>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-2xl shadow-xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Computing AI Forecast...' : 'Generate Shift Forecast'}</span>
          </button>
        </div>

        {/* Simulation Parameter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-5 text-xs">
          {/* Shift & Day */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Meal Shift & Target Day
            </label>
            <div className="flex items-center gap-2">
              <select
                value={mealShift}
                onChange={(e) => setMealShift(e.target.value as MealShift)}
                className="w-1/2 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 outline-none focus:border-emerald-500"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Late Night">Late Night</option>
              </select>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-1/2 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 outline-none focus:border-emerald-500"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                  (d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Weather Condition */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Weather Condition Simulator
            </label>
            <select
              value={weatherCondition}
              onChange={(e) => {
                setWeatherCondition(e.target.value);
                const found = weatherPresets.find((w) => w.condition === e.target.value);
                if (found) setTemperatureC(found.temp);
              }}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 outline-none focus:border-emerald-500"
            >
              {weatherPresets.map((w) => (
                <option key={w.condition} value={w.condition}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>

          {/* Campus Event Factor */}
          <div className="lg:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">
              Campus Academic Calendar / Event
            </label>
            <select
              value={campusEvent}
              onChange={(e) => setCampusEvent(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 outline-none focus:border-emerald-500"
            >
              {eventPresets.map((evt) => (
                <option key={evt} value={evt}>
                  {evt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* AI Forecast Output Cards */}
      {forecastResult && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Projected Headcount */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Projected Student Diners
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">
                  {forecastResult.projectedHeadcount}
                </span>
                <span className="text-xs text-slate-500">expected covers</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 border-t border-slate-100 pt-2 leading-relaxed">
                {forecastResult.summary}
              </p>
            </div>

            {/* Weather Impact Factor */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Weather Correlation Factor
              </span>
              <div className="text-xs font-bold text-teal-700 mb-1 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-teal-600" />
                <span>{weatherCondition} ({temperatureC}°C)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {forecastResult.weatherFactorImpact}
              </p>
            </div>

            {/* Event Factor */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Campus Dynamics Impact
              </span>
              <div className="text-xs font-bold text-emerald-700 mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>{campusEvent}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {forecastResult.eventFactorImpact}
              </p>
            </div>
          </div>

          {/* Recommended Batch Quantities by Category */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
              AI-Recommended Prep Quantities for {mealShift}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Food Station / Category</th>
                    <th className="py-2.5 px-3 text-center">Historical Baseline</th>
                    <th className="py-2.5 px-3 text-center">AI Recommended Prep</th>
                    <th className="py-2.5 px-3 text-center">Suggested Buffer</th>
                    <th className="py-2.5 px-3">Culinary Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {forecastResult.recommendedCategoryPrep.map((cat, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {cat.category}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-600">
                        {cat.historicalAveragePortions} portions
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
                            cat.adjustmentPercentage > 0
                              ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {cat.recommendedPrepPortions}
                          <span className="text-[10px] opacity-75">
                            ({cat.adjustmentPercentage > 0 ? '+' : ''}
                            {cat.adjustmentPercentage}%)
                          </span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-amber-600 font-semibold">
                        +{cat.bufferPortions} portions
                      </td>
                      <td className="py-3 px-3 text-slate-600 text-[11px] leading-relaxed">
                        {cat.rationale}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Preventative Kitchen Tips */}
          <div className="rounded-3xl bg-emerald-50 border border-emerald-200/80 p-5 text-xs text-emerald-900 shadow-xs">
            <h4 className="font-bold flex items-center gap-2 mb-2 text-emerald-800 text-sm">
              <Lightbulb className="w-4 h-4 text-emerald-600" />
              Kitchen Prep Waste Mitigation Guidelines
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 list-disc list-inside text-[11px] text-emerald-800">
              {forecastResult.preventativeTips.map((tip, idx) => (
                <li key={idx} className="leading-relaxed">{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Historical Shift Consumption Log */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Historical 7-Day Canteen Performance Trends
          </h3>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Avg. Rescued Food Rate: 89.4%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Date & Shift</th>
                <th className="py-2.5 px-3 text-center">Prepared</th>
                <th className="py-2.5 px-3 text-center">Sold</th>
                <th className="py-2.5 px-3 text-center">Surplus</th>
                <th className="py-2.5 px-3 text-center">Rescued via Donation</th>
                <th className="py-2.5 px-3 text-right">Net Waste Cost</th>
                <th className="py-2.5 px-3 text-right">Weather</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historicalData.map((h, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 font-mono">
                  <td className="py-3 px-3 font-sans font-medium text-slate-900">
                    {h.date} ({h.dayOfWeek}) - {h.mealShift}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-700 font-bold">
                    {h.preparedPortions}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-600">
                    {h.soldPortions}
                  </td>
                  <td className="py-3 px-3 text-center text-amber-600 font-bold">
                    {h.surplusPortions}
                  </td>
                  <td className="py-3 px-3 text-center text-emerald-700 font-bold">
                    {h.rescuedPortions} ({Math.round((h.rescuedPortions / h.surplusPortions) * 100)}%)
                  </td>
                  <td className="py-3 px-3 text-right text-rose-600 font-semibold">
                    ${h.wasteCost.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-sans text-slate-500 text-[11px]">
                    {h.weather}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
