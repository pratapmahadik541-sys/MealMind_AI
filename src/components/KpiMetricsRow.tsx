import React from 'react';
import {
  Scale,
  Award,
  DollarSign,
  Leaf,
  Droplets,
  ShieldCheck,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { MetricCard3D } from './MetricCard3D';
import type { InventoryItem, SurplusReview, DonationManifest } from '../types';

interface KpiMetricsRowProps {
  inventory: InventoryItem[];
  reviews: SurplusReview[];
  manifests: DonationManifest[];
}

export const KpiMetricsRow: React.FC<KpiMetricsRowProps> = ({
  inventory,
  reviews,
  manifests,
}) => {
  const totalPrepared = inventory.reduce((sum, item) => sum + item.preparedQty, 0);
  const totalSold = inventory.reduce((sum, item) => sum + item.soldQty, 0);
  const totalReserved = inventory.reduce((sum, item) => sum + (item.reservedQty || 0), 0);

  // Live calculated surplus
  const calculatedSurplus = inventory.reduce((sum, item) => {
    return sum + Math.max(0, item.preparedQty - item.soldQty - (item.reservedQty || 0));
  }, 0);

  const surplusValue = calculatedSurplus > 0 ? calculatedSurplus : 224;
  const surplusPercentage = totalPrepared > 0 ? (surplusValue / totalPrepared) * 100 : 21.6;

  // Donated Portions & Values
  const portionsDonated = manifests.reduce((sum, m) => sum + m.totalPortions, 0) || 161;
  const valueRescued = manifests.reduce((sum, m) => sum + m.estimatedValueSaved, 0) || 494.2;

  // Environmental Footprint (FAO multipliers)
  const kgFoodSaved = Math.round(portionsDonated * 0.45 * 10) / 10;
  const co2AvoidedKg = Math.round(kgFoodSaved * 2.5 * 10) / 10 || 181.3;
  const waterPreservedKiloLitres = 77.3; // 77.3k litres as requested

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {/* 1. Current Surplus: 224 portions */}
      <MetricCard3D
        title="Current Surplus"
        value={surplusValue}
        suffix="portions"
        decimals={0}
        trendText="-8.4%"
        trendPositive={true}
        sublabel="Surplus Ratio"
        subvalue={`${surplusPercentage.toFixed(1)}% of prep`}
        icon={Scale}
        sparklineData={[310, 285, 260, 250, 238, 228, surplusValue]}
        accentColor="amber"
      />

      {/* 2. Rescued via Donation: 161 meals saved */}
      <MetricCard3D
        title="Rescued via Donation"
        value={portionsDonated}
        suffix="meals saved"
        decimals={0}
        trendText="+18.5%"
        trendPositive={true}
        sublabel="Weight Rescued"
        subvalue={`${kgFoodSaved} kg food`}
        icon={Award}
        sparklineData={[90, 110, 125, 138, 148, 155, portionsDonated]}
        accentColor="emerald"
      />

      {/* 3. Value Rescued: $494.20 */}
      <MetricCard3D
        title="Value Rescued"
        value={valueRescued}
        prefix="$"
        decimals={2}
        trendText="+$145 today"
        trendPositive={true}
        sublabel="Direct Savings"
        subvalue="Zero disposal fee"
        icon={DollarSign}
        sparklineData={[240, 280, 340, 390, 420, 460, valueRescued]}
        accentColor="blue"
      />

      {/* 4. GHG Avoided: 181.3 kg CO2e */}
      <MetricCard3D
        title="GHG Avoided"
        value={co2AvoidedKg}
        suffix="kg CO₂e"
        decimals={1}
        trendText="+12.4%"
        trendPositive={true}
        sublabel="Landfill Diverted"
        subvalue="92.4% rate"
        icon={Leaf}
        sparklineData={[80, 98, 120, 142, 160, 172, co2AvoidedKg]}
        accentColor="teal"
      />

      {/* 5. Water Preserved: 77.3k litres */}
      <MetricCard3D
        title="Water Preserved"
        value={waterPreservedKiloLitres}
        suffix="k litres"
        decimals={1}
        trendText="Supply chain"
        trendPositive={true}
        sublabel="Water Footprint"
        subvalue="Aquifer saved"
        icon={Droplets}
        sparklineData={[35, 44, 52, 61, 68, 73, waterPreservedKiloLitres]}
        accentColor="coral"
      />
    </div>
  );
};
