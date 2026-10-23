import React, { useState } from 'react';
import {
  HeartHandshake,
  FileCheck2,
  Printer,
  CheckCircle2,
  Clock,
  Truck,
  Building,
  User,
  ShieldCheck,
  Plus,
  QrCode,
  ExternalLink,
  X,
} from 'lucide-react';
import type { DonationManifest, InventoryItem, SurplusReview, CanteenStaff } from '../types';

interface DonationManifestsProps {
  manifests: DonationManifest[];
  inventory: InventoryItem[];
  reviews: SurplusReview[];
  onAddManifest: (manifest: Omit<DonationManifest, 'id' | 'createdAt'>) => void;
  onUpdateManifestStatus: (id: string, status: DonationManifest['status']) => void;
  currentStaff: CanteenStaff;
}

export const DonationManifests: React.FC<DonationManifestsProps> = ({
  manifests,
  inventory,
  reviews,
  onAddManifest,
  onUpdateManifestStatus,
  currentStaff,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedManifestForPrint, setSelectedManifestForPrint] = useState<DonationManifest | null>(null);

  const [partnerOrg, setPartnerOrg] = useState('Campus Student Food Pantry (Union Rm 102)');
  const [contactPerson, setContactPerson] = useState('Jordan Cole (555-0199)');
  const [selectedItemsSummary, setSelectedItemsSummary] = useState('');
  const [totalPortions, setTotalPortions] = useState(50);
  const [estimatedValue, setEstimatedValue] = useState(175.0);
  const [handoffTempC, setHandoffTempC] = useState(64.0);
  const [scheduledTime, setScheduledTime] = useState('3:00 PM Today');

  const approvedReviewItems = reviews.filter((r) => r.decision === 'approved_for_donation');

  const partners = [
    {
      name: 'Campus Student Food Pantry (Union Rm 102)',
      contact: 'Jordan Cole (Ext. 4110)',
    },
    {
      name: 'Metro Hope Community Kitchen',
      contact: 'David Miller (555-0192)',
    },
    {
      name: 'City Harvest Refrigerated Food Courier',
      contact: 'Dispatch Desk (555-0811)',
    },
    {
      name: 'Westside Community Fridge Network',
      contact: 'Sarah Lin (555-0433)',
    },
  ];

  const handleOpenCreateModal = () => {
    if (approvedReviewItems.length > 0) {
      const summary = approvedReviewItems.map((r) => `${r.surplusQty} ${r.unit} ${r.itemName}`).join(', ');
      setSelectedItemsSummary(summary);
      const portions = approvedReviewItems.reduce((sum, r) => sum + r.surplusQty, 0);
      setTotalPortions(portions);
      setEstimatedValue(Math.round(portions * 3.5 * 100) / 100);
      setHandoffTempC(approvedReviewItems[0]?.currentTempC || 63.5);
    } else {
      setSelectedItemsSummary('40 Portions Prepared Mains & Sides');
    }
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const verifCode = `MM-VERIF-${randomSuffix}-VERIFIED`;

    onAddManifest({
      recipientOrg: partnerOrg,
      contactPerson,
      itemsSummary: selectedItemsSummary.trim(),
      itemDetails: [
        {
          itemName: selectedItemsSummary.slice(0, 40),
          quantity: Number(totalPortions),
          unit: 'portions',
          tempAtPackingC: Number(handoffTempC),
        },
      ],
      totalPortions: Number(totalPortions),
      estimatedValueSaved: Number(estimatedValue),
      tempAtHandoffC: Number(handoffTempC),
      staffSupervisor: `${currentStaff.name} (${currentStaff.role.split('&')[0].trim()})`,
      verificationCode: verifCode,
      status: 'pending_pickup',
      scheduledPickupTime: scheduledTime,
      isSampleData: false,
    });

    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Staff-Approved Food Donation Manifests & Transfers
            </h2>
            <p className="text-xs text-slate-500">
              Compliant Good Samaritan Act redistribution vouchers with digital chain-of-custody tracking.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Donation Transfer Manifest</span>
        </button>
      </div>

      {/* Manifest Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {manifests.map((manifest) => (
          <div
            key={manifest.id}
            className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 pb-3.5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {manifest.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        manifest.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : manifest.status === 'in_transit'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {manifest.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-2">
                    {manifest.recipientOrg}
                  </h3>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Contact: {manifest.contactPerson}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-mono font-extrabold text-emerald-600">
                    {manifest.totalPortions} Portions
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    ~${manifest.estimatedValueSaved.toFixed(2)} Value
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              <div className="py-3 text-xs text-slate-600">
                <span className="font-semibold text-slate-700 block mb-1 text-[11px] uppercase tracking-wide">
                  Food Inventory Manifest:
                </span>
                <p className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[11px] text-slate-700 leading-relaxed font-mono">
                  {manifest.itemsSummary}
                </p>
              </div>

              {/* Chain of Custody & Temp Log */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-3 font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Handoff Temp:</span>
                  <span className="font-bold text-emerald-700">{manifest.tempAtHandoffC}°C (Verified Safe)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Supervisor Sign-off:</span>
                  <span className="font-bold text-slate-800 truncate block">{manifest.staffSupervisor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Pickup Schedule:</span>
                  <span className="text-slate-600">{manifest.scheduledPickupTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Security Voucher:</span>
                  <span className="text-teal-700 font-bold">{manifest.verificationCode}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {manifest.status === 'pending_pickup' && (
                  <button
                    onClick={() => onUpdateManifestStatus(manifest.id, 'in_transit')}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold cursor-pointer transition-colors border border-slate-200"
                  >
                    Mark In Transit
                  </button>
                )}
                {manifest.status === 'in_transit' && (
                  <button
                    onClick={() => onUpdateManifestStatus(manifest.id, 'completed')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    Confirm Delivery
                  </button>
                )}
                {manifest.status === 'completed' && (
                  <span className="text-emerald-700 flex items-center gap-1.5 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    Transferred Successfully
                  </span>
                )}
              </div>

              {/* View / Print Digital Transfer Voucher */}
              <button
                onClick={() => setSelectedManifestForPrint(manifest)}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 font-medium cursor-pointer transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span>View Voucher</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Printable / View Voucher Modal */}
      {selectedManifestForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-3xl max-w-lg w-full p-6 bg-white border border-slate-200 shadow-2xl relative text-xs text-slate-900">
            <div className="border-2 border-emerald-500/30 p-5 rounded-2xl bg-emerald-50/20">
              <div className="flex items-start justify-between border-b border-emerald-500/20 pb-3 mb-3">
                <div>
                  <h3 className="text-base font-extrabold uppercase tracking-tight text-slate-900">
                    Official Food Rescue Transfer Manifest
                  </h3>
                  <div className="text-[10px] text-slate-500 font-mono">
                    MealMind AI System • Safe Food Rescue Protocol
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-[11px] font-bold text-emerald-700">
                    {selectedManifestForPrint.id}
                  </div>
                  <div className="text-[9px] text-slate-400">
                    {new Date(selectedManifestForPrint.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="space-y-3 font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Recipient Organization:</span>
                  <div className="font-bold text-slate-900 text-sm">
                    {selectedManifestForPrint.recipientOrg}
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    Authorized Contact: {selectedManifestForPrint.contactPerson}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Manifested Food Batches:</span>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-800 font-sans text-xs">
                    {selectedManifestForPrint.itemsSummary}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Servings:</span>
                    <span className="font-bold text-slate-900">{selectedManifestForPrint.totalPortions} Portions</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Handoff Probe Temp:</span>
                    <span className="font-bold text-emerald-700">{selectedManifestForPrint.tempAtHandoffC}°C</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Supervisor Sign-off:</span>
                    <span className="font-bold text-slate-900">{selectedManifestForPrint.staffSupervisor}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Voucher Verification Hash:</span>
                    <span className="font-bold text-teal-700 text-[10px]">{selectedManifestForPrint.verificationCode}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 text-[9px] text-slate-500 font-sans leading-tight">
                  Bill Emerson Good Samaritan Food Donation Act Protection: Donated in good faith to non-profit entities for charitable distribution. Temperature verified within safe limits at transfer time.
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedManifestForPrint(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer text-xs"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold cursor-pointer text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Transfer Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Manifest Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-3xl max-w-lg w-full p-6 bg-white border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">
                Dispatch Food Rescue Donation Manifest
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Formalize handoff documentation for verified hunger-relief community partners.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Verified Partner Organization
                </label>
                <select
                  value={partnerOrg}
                  onChange={(e) => {
                    setPartnerOrg(e.target.value);
                    const p = partners.find((pr) => pr.name === e.target.value);
                    if (p) setContactPerson(p.contact);
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-blue-500 text-xs"
                >
                  {partners.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Recipient Contact Person & Phone
                </label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Manifested Items Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={selectedItemsSummary}
                  onChange={(e) => setSelectedItemsSummary(e.target.value)}
                  placeholder="e.g. 40 portions Herb Roasted Chicken, 30 portions Basmati Rice in sanitized cambro hot boxes"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Portions Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={totalPortions}
                    onChange={(e) => setTotalPortions(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl font-mono text-slate-900 text-xs bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Est. Value ($)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl font-mono text-slate-900 text-xs bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Handoff Temp (°C)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={handoffTempC}
                    onChange={(e) => setHandoffTempC(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl font-mono text-slate-900 text-xs bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Scheduled Pickup Window
                </label>
                <input
                  type="text"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-500 text-[11px]">
                Authorizing Supervisor on duty: <strong className="text-slate-900">{currentStaff.name}</strong> ({currentStaff.role})
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs cursor-pointer"
                >
                  Generate Manifest & Assign Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
