import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  ShieldCheck,
  HeartHandshake,
  TrendingUp,
  BarChart3,
  UtensilsCrossed,
  AlertCircle,
  Bot,
  Activity,
  Plus,
  Calendar,
  Lightbulb,
  Leaf,
  Users,
  Settings as SettingsIcon,
  CheckCircle2,
  Database,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

import { Sidebar, type NavigationItem } from './components/Sidebar';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { KpiMetricsRow } from './components/KpiMetricsRow';
import { AvailableSurplusCards } from './components/AvailableSurplusCards';
import { AdvancedAnalyticsCharts } from './components/AdvancedAnalyticsCharts';
import { AiDecisionHub } from './components/AiDecisionHub';
import { InventoryCrud } from './components/InventoryCrud';
import { StaffReviewGate } from './components/StaffReviewGate';
import { DonationManifests } from './components/DonationManifests';
import { DemandForecasting } from './components/DemandForecasting';
import { AnalyticsView } from './components/AnalyticsView';
import { ChefMindChatbot } from './components/ChefMindChatbot';

import {
  INITIAL_LOCATIONS,
  INITIAL_STAFF,
  INITIAL_INVENTORY_ITEMS,
  INITIAL_REVIEWS,
  INITIAL_MANIFESTS,
  HISTORICAL_SHIFTS,
} from './data/initialData';

import type {
  InventoryItem,
  SurplusReview,
  DonationManifest,
  CanteenLocation,
  CanteenStaff,
  MealShift,
} from './types';

import type { AiDecisionOutput, DemandForecastOutput } from './server/geminiService';
import {
  testFirestoreConnection,
  saveInventoryItemToFirestore,
  deleteInventoryItemFromFirestore,
  saveSurplusReviewToFirestore,
  saveDonationManifestToFirestore,
} from './services/firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationItem>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // App Core State
  const [locations, setLocations] = useState<CanteenLocation[]>(INITIAL_LOCATIONS);
  const [selectedLocation, setSelectedLocation] = useState<CanteenLocation>(INITIAL_LOCATIONS[0]);
  const [staffList, setStaffList] = useState<CanteenStaff[]>(INITIAL_STAFF);
  const [currentStaff, setCurrentStaff] = useState<CanteenStaff>(INITIAL_STAFF[0]);
  const [activeShift, setActiveShift] = useState<MealShift>('Lunch');

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('mealmind_inventory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_INVENTORY_ITEMS;
      }
    }
    return INITIAL_INVENTORY_ITEMS;
  });

  const [reviews, setReviews] = useState<SurplusReview[]>(() => {
    const saved = localStorage.getItem('mealmind_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_REVIEWS;
      }
    }
    return INITIAL_REVIEWS;
  });

  const [manifests, setManifests] = useState<DonationManifest[]>(() => {
    const saved = localStorage.getItem('mealmind_manifests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MANIFESTS;
      }
    }
    return INITIAL_MANIFESTS;
  });

  // Selected item to inspect in safety gate
  const [targetedReviewItemId, setTargetedReviewItemId] = useState<string | null>(null);

  // Assistant Chatbot State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // AI Decision Engine State
  const [aiDecision, setAiDecision] = useState<AiDecisionOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Demand Forecast State
  const [forecastResult, setForecastResult] = useState<DemandForecastOutput | null>(null);
  const [isForecastLoading, setIsForecastLoading] = useState<boolean>(false);

  // Firestore status
  const [firestoreStatus, setFirestoreStatus] = useState<{ connected: boolean; message: string }>({
    connected: false,
    message: 'Testing connection...',
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('mealmind_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('mealmind_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('mealmind_manifests', JSON.stringify(manifests));
  }, [manifests]);

  // Test Firestore on boot
  useEffect(() => {
    testFirestoreConnection().then((res) => {
      setFirestoreStatus(res);
    });
  }, []);

  // Run AI Decision Engine via server endpoint
  const runAiDecisionAudit = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: inventory,
          context: {
            canteenName: selectedLocation.name,
            currentShift: activeShift,
            studentTraffic: 'Moderate-High (1,150 student swipe cards logged)',
            weather: 'Rainy & Cool (14°C)',
            campusEvent: 'Midterms Preparation Week',
          },
        }),
      });

      const res = await response.json();
      if (res.success && res.data) {
        setAiDecision(res.data);
      }
    } catch (err) {
      console.error('API call error in runAiDecisionAudit:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    runAiDecisionAudit();
  }, []);

  const handleGenerateForecast = async (context: {
    targetDate: string;
    mealShift: string;
    dayOfWeek: string;
    weatherCondition: string;
    temperatureC: number;
    campusEvent: string;
    canteenName: string;
  }) => {
    setIsForecastLoading(true);
    try {
      const response = await fetch('/api/ai/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context }),
      });

      const res = await response.json();
      if (res.success && res.data) {
        setForecastResult(res.data);
      }
    } catch (err) {
      console.error('API call error in handleGenerateForecast:', err);
    } finally {
      setIsForecastLoading(false);
    }
  };

  const handleAddItem = (itemData: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: 'inv-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInventory((prev) => [newItem, ...prev]);

    saveInventoryItemToFirestore(newItem).catch((err) =>
      console.warn('Firestore sync note:', err)
    );
  };

  const handleUpdateItem = (updated: InventoryItem) => {
    setInventory((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    saveInventoryItemToFirestore(updated).catch((err) =>
      console.warn('Firestore sync note:', err)
    );
  };

  const handleDeleteItem = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    deleteInventoryItemFromFirestore(id).catch((err) =>
      console.warn('Firestore sync note:', err)
    );
  };

  const handleSimulateSale = (item: InventoryItem, delta: number) => {
    const newSold = Math.min(item.preparedQty, Math.max(0, item.soldQty + delta));
    handleUpdateItem({
      ...item,
      soldQty: newSold,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleOpenStaffReview = (itemId: string) => {
    setTargetedReviewItemId(itemId);
    setActiveTab('surplus');
  };

  const handleSubmitReview = (reviewData: Omit<SurplusReview, 'id' | 'reviewedAt'>) => {
    const newReview: SurplusReview = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      reviewedAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);

    const targetStatus =
      reviewData.decision === 'approved_for_donation'
        ? 'approved_donation'
        : reviewData.decision === 'discount_flash_sale'
        ? 'flash_discount'
        : reviewData.decision === 'repurpose_in_kitchen'
        ? 'repurposed'
        : 'composted';

    setInventory((prev) =>
      prev.map((item) =>
        item.id === reviewData.inventoryId ? { ...item, status: targetStatus } : item
      )
    );

    saveSurplusReviewToFirestore(newReview).catch((err) =>
      console.warn('Firestore review sync note:', err)
    );

    if (reviewData.decision === 'approved_for_donation') {
      setActiveTab('donations');
    }
  };

  const handleAddManifest = (manifestData: Omit<DonationManifest, 'id' | 'createdAt'>) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newManifest: DonationManifest = {
      ...manifestData,
      id: `MAN-2026-${randomSuffix}`,
      createdAt: new Date().toISOString(),
    };
    setManifests((prev) => [newManifest, ...prev]);

    saveDonationManifestToFirestore(newManifest).catch((err) =>
      console.warn('Firestore manifest sync note:', err)
    );
  };

  const handleUpdateManifestStatus = (id: string, status: DonationManifest['status']) => {
    setManifests((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              completedAt: status === 'completed' ? new Date().toISOString() : m.completedAt,
            }
          : m
      )
    );
  };

  const handleResetSampleData = () => {
    localStorage.removeItem('mealmind_inventory');
    localStorage.removeItem('mealmind_reviews');
    localStorage.removeItem('mealmind_manifests');
    setInventory(INITIAL_INVENTORY_ITEMS);
    setReviews(INITIAL_REVIEWS);
    setManifests(INITIAL_MANIFESTS);
    runAiDecisionAudit();
  };

  const pendingCount = inventory.filter(
    (i) => i.status === 'review_pending' || (i.preparedQty - i.soldQty > 15 && i.status === 'active')
  ).length;

  const totalCurrentSurplus = inventory.reduce((sum, item) => {
    return sum + Math.max(0, item.preparedQty - item.soldQty - (item.reservedQty || 0));
  }, 0);

  const portionsDonated = manifests.reduce((sum, m) => sum + m.totalPortions, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] flex antialiased">
      {/* Desktop Collapsible Left Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          pendingReviewsCount={pendingCount}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/40 backdrop-blur-sm">
          <div className="w-64 bg-white h-full shadow-2xl">
            <Sidebar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setIsMobileSidebarOpen(false);
              }}
              isCollapsed={false}
              onToggleCollapse={() => setIsMobileSidebarOpen(false)}
              pendingReviewsCount={pendingCount}
            />
          </div>
          <div
            className="flex-1"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        </div>
      )}

      {/* Right Column: Top Navigation + Scrollable Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          locations={locations}
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
          staffList={staffList}
          currentStaff={currentStaff}
          onSelectStaff={setCurrentStaff}
          activeShift={activeShift}
          onChangeShift={setActiveShift}
          onRunAiAudit={runAiDecisionAudit}
          isAiLoading={isAiLoading}
          firestoreStatus={firestoreStatus}
          onResetSampleData={handleResetSampleData}
          onOpenChat={() => setIsChatOpen(true)}
          onToggleSidebarMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <HeroSection
                currentStaff={currentStaff}
                activeShift={activeShift}
                canteenName={selectedLocation.name}
                onRunAudit={runAiDecisionAudit}
                isAiLoading={isAiLoading}
                onOpenChat={() => setIsChatOpen(true)}
                onOpenNewBatchModal={() => setActiveTab('inventory')}
              />

              <KpiMetricsRow
                inventory={inventory}
                reviews={reviews}
                manifests={manifests}
              />

              <AvailableSurplusCards
                inventory={inventory}
                onOpenStaffReview={handleOpenStaffReview}
                onSimulateSale={handleSimulateSale}
              />

              <AdvancedAnalyticsCharts
                inventory={inventory}
                reviews={reviews}
                manifests={manifests}
                historicalShifts={HISTORICAL_SHIFTS}
              />
            </div>
          )}

          {/* Food Intelligence View */}
          {activeTab === 'intelligence' && (
            <AiDecisionHub
              inventory={inventory}
              aiDecision={aiDecision}
              isLoading={isAiLoading}
              onRefreshAi={runAiDecisionAudit}
              onOpenStaffReview={handleOpenStaffReview}
              currentStaff={currentStaff}
              canteenName={selectedLocation.name}
              activeShift={activeShift}
            />
          )}

          {/* Surplus Prediction & Safety Review Gate View */}
          {activeTab === 'surplus' && (
            <div className="space-y-8">
              <AvailableSurplusCards
                inventory={inventory}
                onOpenStaffReview={(id) => setTargetedReviewItemId(id)}
                onSimulateSale={handleSimulateSale}
              />

              <StaffReviewGate
                inventory={inventory}
                reviews={reviews}
                onSubmitReview={handleSubmitReview}
                currentStaff={currentStaff}
                selectedItemId={targetedReviewItemId}
                onClearSelectedItem={() => setTargetedReviewItemId(null)}
              />
            </div>
          )}

          {/* Donation Management View */}
          {activeTab === 'donations' && (
            <DonationManifests
              manifests={manifests}
              inventory={inventory}
              reviews={reviews}
              onAddManifest={handleAddManifest}
              onUpdateManifestStatus={handleUpdateManifestStatus}
              currentStaff={currentStaff}
            />
          )}

          {/* Analytics & Reports View */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <AdvancedAnalyticsCharts
                inventory={inventory}
                reviews={reviews}
                manifests={manifests}
                historicalShifts={HISTORICAL_SHIFTS}
              />
              <AnalyticsView
                inventory={inventory}
                reviews={reviews}
                manifests={manifests}
                canteenName={selectedLocation.name}
              />
            </div>
          )}

          {/* Inventory (CRUD) View */}
          {activeTab === 'inventory' && (
            <InventoryCrud
              inventory={inventory}
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
              onOpenStaffReview={handleOpenStaffReview}
              activeShift={activeShift}
            />
          )}

          {/* Meal Planning & Forecasting View */}
          {activeTab === 'planning' && (
            <DemandForecasting
              historicalData={HISTORICAL_SHIFTS}
              onGenerateForecast={handleGenerateForecast}
              forecastResult={forecastResult}
              isLoading={isForecastLoading}
              canteenName={selectedLocation.name}
              activeShift={activeShift}
            />
          )}

          {/* AI Recommendations View */}
          {activeTab === 'recommendations' && (
            <AiDecisionHub
              inventory={inventory}
              aiDecision={aiDecision}
              isLoading={isAiLoading}
              onRefreshAi={runAiDecisionAudit}
              onOpenStaffReview={handleOpenStaffReview}
              currentStaff={currentStaff}
              canteenName={selectedLocation.name}
              activeShift={activeShift}
            />
          )}

          {/* Impact Tracker View */}
          {activeTab === 'impact' && (
            <AnalyticsView
              inventory={inventory}
              reviews={reviews}
              manifests={manifests}
              canteenName={selectedLocation.name}
            />
          )}

          {/* Team & Staff Roster View */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Canteen Culinary Operations & Safety Team
                    </h2>
                    <p className="text-xs text-slate-500">
                      Authorized kitchen supervisors certified for physical HACCP food safety gate verification and Good Samaritan Act transfers.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {staffList.map((member) => (
                    <div
                      key={member.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        currentStaff.id === member.id
                          ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                          {member.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-[10px] font-mono font-semibold bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-full">
                          {member.badgeId}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{member.name}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{member.role}</p>
                      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono text-[11px]">{member.shift} Shift</span>
                        {currentStaff.id === member.id ? (
                          <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Active On-Duty
                          </span>
                        ) : (
                          <button
                            onClick={() => setCurrentStaff(member)}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                          >
                            Switch Supervisor
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings View */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                    <SettingsIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      MealMind.ai System Configuration & Governance
                    </h2>
                    <p className="text-xs text-slate-500">
                      Manage campus dining parameters, AI model connections, and cloud database persistence.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Cloud Database Info */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-bold text-slate-900 text-sm">Firebase Cloud Firestore</h4>
                    </div>
                    <div className="space-y-2 font-mono text-[11px] text-slate-600">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-emerald-700 font-bold">{firestoreStatus.message}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Database ID:</span>
                        <span>ai-studio-18e2eaa8-05c2-488a-94b2-106ba76b7619</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Collections:</span>
                        <span>canteen_inventory, surplus_reviews, donation_manifests</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Reasoning Core */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-bold text-slate-900 text-sm">Google Gemini 3.8 Flash Neural Core</h4>
                    </div>
                    <div className="space-y-2 font-mono text-[11px] text-slate-600">
                      <div className="flex justify-between">
                        <span>API Proxy:</span>
                        <span className="text-slate-900 font-bold">Secure Server-Side (/api/ai/*)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Human-in-the-Loop Gate:</span>
                        <span className="text-amber-700 font-bold">Enforced (HACCP Code)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Surplus Loss Valuation:</span>
                        <span>Active Dynamic Margin Calculator</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Floating Action Button for MealMind AI Assistant */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4.5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold shadow-xl shadow-emerald-600/25 hover:scale-105 transition-all cursor-pointer group"
        >
          <Bot className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide">MealMind AI Assistant</span>
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
        </button>

        {/* MealMind AI Assistant Drawer / Chatbot */}
        <ChefMindChatbot
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          canteenName={selectedLocation.name}
          activeShift={activeShift}
          totalSurplus={totalCurrentSurplus}
          portionsRescued={portionsDonated}
        />

        {/* Clean Footer */}
        <footer className="bg-white border-t border-slate-200/80 mt-auto py-5 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono">
              <span className="font-bold text-slate-900 font-sans">MealMind.ai</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">Zero-Waste Campus Dining Intelligence</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Powered by Google Gemini 3.8 Flash • Three.js WebGL • Firebase Firestore • HACCP Safe
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
