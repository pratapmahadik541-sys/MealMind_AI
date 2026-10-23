import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Thermometer,
  Clock,
  Trash2,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Tag,
  DollarSign,
  Layers,
  X,
} from 'lucide-react';
import type { InventoryItem, FoodCategory, MealShift, ItemStatus } from '../types';

interface InventoryCrudProps {
  inventory: InventoryItem[];
  onAddItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onOpenStaffReview: (itemId: string) => void;
  activeShift: MealShift;
}

export const InventoryCrud: React.FC<InventoryCrudProps> = ({
  inventory,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onOpenStaffReview,
  activeShift,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<FoodCategory>('Main Course');
  const [formShift, setFormShift] = useState<MealShift>(activeShift);
  const [formPreparedQty, setFormPreparedQty] = useState(100);
  const [formSoldQty, setFormSoldQty] = useState(60);
  const [formReservedQty, setFormReservedQty] = useState(5);
  const [formUnit, setFormUnit] = useState('portions');
  const [formCostPerUnit, setFormCostPerUnit] = useState(4.0);
  const [formLocation, setFormLocation] = useState('Hot Bar Line 1');
  const [formBatchNumber, setFormBatchNumber] = useState('BATCH-' + Date.now().toString().slice(-6));
  const [formStorageTempC, setFormStorageTempC] = useState(65);
  const [formNotes, setFormNotes] = useState('');
  const [formHoursHolding, setFormHoursHolding] = useState(4);

  const categories: FoodCategory[] = [
    'Main Course',
    'Starches & Grains',
    'Soups & Broths',
    'Salads & Produce',
    'Bakery & Bread',
    'Desserts',
    'Grab & Go',
  ];

  const handleEditClick = (item: InventoryItem) => {
    setEditingItem(item);
    setFormName(item.itemName);
    setFormCategory(item.category);
    setFormShift(item.mealShift);
    setFormPreparedQty(item.preparedQty);
    setFormSoldQty(item.soldQty);
    setFormReservedQty(item.reservedQty || 0);
    setFormUnit(item.unit);
    setFormCostPerUnit(item.costPerUnit);
    setFormLocation(item.location);
    setFormBatchNumber(item.batchNumber);
    setFormStorageTempC(item.storageTempC);
    setFormNotes(item.notes || '');
    setIsAddModalOpen(true);
  };

  const handleOpenNewModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('Main Course');
    setFormShift(activeShift);
    setFormPreparedQty(80);
    setFormSoldQty(40);
    setFormReservedQty(5);
    setFormUnit('portions');
    setFormCostPerUnit(3.5);
    setFormLocation('Hot Bar Station 2');
    setFormBatchNumber('BATCH-' + Date.now().toString().slice(-6));
    setFormStorageTempC(64);
    setFormNotes('');
    setFormHoursHolding(3.5);
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const expiryDate = new Date(now.getTime() + formHoursHolding * 60 * 60 * 1000);

    if (editingItem) {
      onUpdateItem({
        ...editingItem,
        itemName: formName.trim(),
        category: formCategory,
        mealShift: formShift,
        preparedQty: Number(formPreparedQty),
        soldQty: Number(formSoldQty),
        reservedQty: Number(formReservedQty),
        unit: formUnit,
        costPerUnit: Number(formCostPerUnit),
        location: formLocation,
        batchNumber: formBatchNumber,
        storageTempC: Number(formStorageTempC),
        notes: formNotes,
        updatedAt: now.toISOString(),
      });
    } else {
      onAddItem({
        itemName: formName.trim(),
        category: formCategory,
        mealShift: formShift,
        preparedQty: Number(formPreparedQty),
        soldQty: Number(formSoldQty),
        reservedQty: Number(formReservedQty),
        unit: formUnit,
        costPerUnit: Number(formCostPerUnit),
        preparedAt: now.toISOString(),
        safeHoldingExpiry: expiryDate.toISOString(),
        location: formLocation,
        batchNumber: formBatchNumber,
        storageTempC: Number(formStorageTempC),
        status: 'active',
        notes: formNotes,
        isSampleData: false,
      });
    }

    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const handleQuickAddSold = (item: InventoryItem, delta: number) => {
    const newSold = Math.min(item.preparedQty, Math.max(0, item.soldQty + delta));
    onUpdateItem({
      ...item,
      soldQty: newSold,
      updatedAt: new Date().toISOString(),
    });
  };

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter and Actions Toolbar */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes, batch IDs, or stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white text-slate-900 placeholder-slate-400 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-emerald-600 mr-2" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active (On Counter)</option>
              <option value="review_pending">Review Pending</option>
              <option value="approved_donation">Approved for Donation</option>
              <option value="repurposed">Repurposed</option>
              <option value="composted">Composted</option>
            </select>
          </div>
        </div>

        {/* Add Item Button */}
        <button
          onClick={handleOpenNewModal}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Batch Item</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Dish & Batch Details</th>
                <th className="py-3 px-3">Category & Station</th>
                <th className="py-3 px-3 text-center">Prepared</th>
                <th className="py-3 px-3 text-center">Sold</th>
                <th className="py-3 px-3 text-center">Reserved</th>
                <th className="py-3 px-4 text-center">Calculated Surplus</th>
                <th className="py-3 px-3 text-center">Temp & Holding</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No food items match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const surplus = Math.max(0, item.preparedQty - item.soldQty - (item.reservedQty || 0));
                  const surplusPct = item.preparedQty > 0 ? (surplus / item.preparedQty) * 100 : 0;
                  const surplusValue = surplus * item.costPerUnit;

                  const inDangerZone = item.storageTempC > 4 && item.storageTempC < 60;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Name & Batch */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {item.itemName}
                          </span>
                          {item.isSampleData && (
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono border border-slate-200">
                              Demo
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                          <span>{item.batchNumber}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold">${item.costPerUnit.toFixed(2)} / {item.unit}</span>
                        </div>
                      </td>

                      {/* Category & Station */}
                      <td className="py-3.5 px-3">
                        <span className="inline-block bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-slate-200">
                          {item.category}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-1">
                          {item.location}
                        </div>
                      </td>

                      {/* Prepared */}
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-800">
                        {item.preparedQty}
                      </td>

                      {/* Sold (with quick increment buttons) */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="font-mono font-bold text-slate-900">
                          {item.soldQty}
                        </div>
                        <div className="flex items-center justify-center gap-1 mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            title="Simulate +1 sale"
                            onClick={() => handleQuickAddSold(item, 1)}
                            className="text-[10px] bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 px-1.5 py-0.5 rounded font-mono cursor-pointer transition-colors border border-slate-200"
                          >
                            +1
                          </button>
                          <button
                            title="Simulate +5 sales"
                            onClick={() => handleQuickAddSold(item, 5)}
                            className="text-[10px] bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 px-1.5 py-0.5 rounded font-mono cursor-pointer transition-colors border border-slate-200"
                          >
                            +5
                          </button>
                        </div>
                      </td>

                      {/* Reserved */}
                      <td className="py-3.5 px-3 text-center font-mono text-slate-400">
                        {item.reservedQty || 0}
                      </td>

                      {/* Accurate Surplus Calculation */}
                      <td className="py-3.5 px-4 text-center">
                        <div
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono font-bold text-xs ${
                            surplus === 0
                              ? 'bg-slate-100 text-slate-400'
                              : surplusPct > 25
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <span>{surplus} {item.unit}</span>
                          <span className="text-[10px] opacity-75">({surplusPct.toFixed(0)}%)</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Est. Loss: ${surplusValue.toFixed(2)}
                        </div>
                      </td>

                      {/* Temp & Holding */}
                      <td className="py-3.5 px-3 text-center">
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold ${
                            inDangerZone
                              ? 'bg-rose-50 text-rose-700 border border-rose-200 font-bold'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          <Thermometer className="w-3 h-3" />
                          <span>{item.storageTempC}°C</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mt-0.5 font-mono">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Hold: {new Date(item.safeHoldingExpiry).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenStaffReview(item.id)}
                            title="Submit for Staff Food Safety Verification"
                            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer shadow-xs"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Staff Gate</span>
                          </button>

                          <button
                            onClick={() => handleEditClick(item)}
                            title="Edit Item"
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDeleteItem(item.id)}
                            title="Delete Batch"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-3xl max-w-xl w-full p-6 bg-white border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">
                {editingItem ? 'Edit Batch Record' : 'Log New Prepared Food Batch'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Enter preparation metrics to enable accurate surplus calculation and HACCP time-temperature tracking.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Dish / Recipe Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Teriyaki Salmon Bowls, Vegan Lentil Stew"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white text-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Food Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as FoodCategory)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-900 text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Meal Shift
                  </label>
                  <select
                    value={formShift}
                    onChange={(e) => setFormShift(e.target.value as MealShift)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-900 text-xs"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Late Night">Late Night</option>
                  </select>
                </div>
              </div>

              {/* Quantities */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Prepared Qty *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formPreparedQty}
                    onChange={(e) => setFormPreparedQty(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-900 font-mono text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sold Qty *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formSoldQty}
                    onChange={(e) => setFormSoldQty(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-900 font-mono text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Reserved Qty
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formReservedQty}
                    onChange={(e) => setFormReservedQty(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-900 font-mono text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Real-time preview of surplus in modal */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between font-mono text-xs text-emerald-800">
                <span>Calculated Active Surplus:</span>
                <span className="font-bold text-sm">
                  {Math.max(0, formPreparedQty - formSoldQty - formReservedQty)} {formUnit}
                </span>
              </div>

              {/* Unit, Cost, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Cost per Unit ($)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    value={formCostPerUnit}
                    onChange={(e) => setFormCostPerUnit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Location / Counter
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Temp and Safe Holding */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Current Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formStorageTempC}
                    onChange={(e) => setFormStorageTempC(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Safe Hot: ≥60°C | Safe Cold: ≤4°C
                  </span>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Safe Holding Buffer (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="12"
                    value={formHoursHolding}
                    onChange={(e) => setFormHoursHolding(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Preparation Notes / Allergen Warnings
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Contains dairy, prepared in morning line shift"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-xs cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Create Inventory Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
