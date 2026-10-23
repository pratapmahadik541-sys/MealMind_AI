export type FoodCategory =
  | 'Main Course'
  | 'Starches & Grains'
  | 'Soups & Broths'
  | 'Salads & Produce'
  | 'Bakery & Bread'
  | 'Desserts'
  | 'Grab & Go';

export type MealShift = 'Breakfast' | 'Lunch' | 'Dinner' | 'Late Night';

export type ItemStatus =
  | 'active'
  | 'review_pending'
  | 'approved_donation'
  | 'repurposed'
  | 'flash_discount'
  | 'composted';

export type ReviewUrgency = 'Low' | 'Medium' | 'High' | 'Critical';

export interface InventoryItem {
  id: string;
  itemName: string;
  category: FoodCategory;
  mealShift: MealShift;
  preparedQty: number; // e.g., portions
  soldQty: number;     // e.g., portions sold
  reservedQty: number; // held or pre-booked
  unit: string;        // 'portions', 'kg', 'trays'
  costPerUnit: number; // $
  preparedAt: string;  // ISO timestamp
  safeHoldingExpiry: string; // ISO timestamp
  location: string;    // e.g., 'Station 1 - Hot Line'
  batchNumber: string;
  storageTempC: number;// °C
  status: ItemStatus;
  notes?: string;
  imageUrl?: string;
  isSampleData?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SurplusReview {
  id: string;
  inventoryId: string;
  itemName: string;
  surplusQty: number;
  unit: string;
  urgency: ReviewUrgency;
  currentTempC: number;
  tempCheckPassed: boolean;
  smellVisualPassed: boolean;
  allergenLabelled: boolean;
  holdingTimeWithinSafeLimit: boolean;
  safetyNotes: string;
  reviewedByStaff: string;
  decision:
    | 'pending'
    | 'approved_for_donation'
    | 'repurpose_in_kitchen'
    | 'discount_flash_sale'
    | 'compost_discard';
  reviewedAt: string;
  isSampleData?: boolean;
}

export interface DonationManifest {
  id: string;
  recipientOrg: string;
  contactPerson: string;
  itemsSummary: string;
  itemDetails: Array<{
    itemName: string;
    quantity: number;
    unit: string;
    tempAtPackingC: number;
  }>;
  totalPortions: number;
  estimatedValueSaved: number;
  tempAtHandoffC: number;
  staffSupervisor: string;
  verificationCode: string;
  status: 'pending_pickup' | 'in_transit' | 'completed' | 'cancelled';
  scheduledPickupTime: string;
  completedAt?: string;
  createdAt: string;
  isSampleData?: boolean;
}

export interface HistoricalShiftData {
  date: string;
  dayOfWeek: string;
  mealShift: MealShift;
  preparedPortions: number;
  soldPortions: number;
  surplusPortions: number;
  rescuedPortions: number;
  wasteCost: number;
  weather: string;
}

export interface CanteenStaff {
  id?: string;
  name: string;
  role: string;
  badgeId: string;
  shift?: string;
}

export interface CanteenLocation {
  id: string;
  name: string;
  campusArea: string;
  currentShift: MealShift;
  dailyCapacity: number;
}
