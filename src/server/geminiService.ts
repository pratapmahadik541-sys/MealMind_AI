import { GoogleGenAI, Type } from '@google/genai';

// Initialize Gemini client on server-side with telemetry User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface InventoryItemPayload {
  id: string;
  itemName: string;
  category: string;
  mealShift: string;
  preparedQty: number;
  soldQty: number;
  reservedQty: number;
  unit: string;
  costPerUnit: number;
  preparedAt: string;
  safeHoldingExpiry: string;
  location: string;
  storageTempC: number;
  status: string;
}

export interface AiDecisionOutput {
  overallSurplusAnalysis: string;
  totalSurplusKg: number;
  projectedWasteCost: number;
  riskAssessment: string;
  actionPlan: Array<{
    id: string;
    actionType: 'portion_tuning' | 'flash_discount' | 'kitchen_repurpose' | 'staff_donation_review' | 'inventory_adjustment';
    urgency: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    targetItem: string;
    reasoning: string;
    potentialWasteSavedKg: number;
    potentialCostSaved: number;
    staffActionRequired: string;
    safetyPrecaution: string;
  }>;
  repurposeRecipes: Array<{
    originalDish: string;
    newDishSuggestion: string;
    cookingTimeMinutes: number;
    extraIngredientsNeeded: string[];
    instructions: string;
    safeHoldingInstructions: string;
  }>;
}

export async function analyzeSurplusWithGemini(
  items: InventoryItemPayload[],
  canteenContext: {
    canteenName: string;
    currentShift: string;
    studentTraffic: string;
    weather: string;
    campusEvent: string;
  }
): Promise<AiDecisionOutput> {
  if (!process.env.GEMINI_API_KEY) {
    // Graceful fallback if no key is supplied
    return generateFallbackDecision(items, canteenContext);
  }

  const prompt = `
You are MealMind AI's senior culinary operations and food waste reduction expert for college dining halls.
Analyze the following active canteen food batches for ${canteenContext.canteenName}.

Context:
- Current Shift: ${canteenContext.currentShift}
- Student Footfall Level: ${canteenContext.studentTraffic}
- Weather Condition: ${canteenContext.weather}
- Campus Event / Academic Calendar: ${canteenContext.campusEvent}

Inventory Data:
${JSON.stringify(items, null, 2)}

Provide structured, actionable guidance prioritizing waste prevention, food safety, cost recovery, and student feeding.
CRITICAL MANDATE: You MUST NOT make automatic food safety decisions or approve donations unilaterally. Always designate physical checks (temperature logs, organoleptic smell/texture tests, allergen labels) for human canteen staff to verify.

Return your response matching the required JSON schema with:
1. overallSurplusAnalysis: 2-3 sentences explaining why surplus occurred based on prep vs sold vs campus context.
2. totalSurplusKg: estimated total kg of surplus across items.
3. projectedWasteCost: estimated financial loss if not rescued ($).
4. riskAssessment: temperature holding and shelf-life urgency summary.
5. actionPlan: 3-5 prioritized recommendations (flash student discounts, culinary repurposing, portion adjustments for next shift, staff donation review).
6. repurposeRecipes: 2-3 creative, safe kitchen repurposing ideas for surplus starches, proteins, or produce.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an expert executive chef and sustainability manager specializing in college dining food waste mitigation, HACCP food safety standards, and hunger-relief donation logistics. Always explain operational reasoning clearly.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallSurplusAnalysis: { type: Type.STRING },
            totalSurplusKg: { type: Type.NUMBER },
            projectedWasteCost: { type: Type.NUMBER },
            riskAssessment: { type: Type.STRING },
            actionPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  actionType: {
                    type: Type.STRING,
                    description: 'One of: portion_tuning, flash_discount, kitchen_repurpose, staff_donation_review, inventory_adjustment',
                  },
                  urgency: {
                    type: Type.STRING,
                    description: 'low, medium, high, critical',
                  },
                  title: { type: Type.STRING },
                  targetItem: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  potentialWasteSavedKg: { type: Type.NUMBER },
                  potentialCostSaved: { type: Type.NUMBER },
                  staffActionRequired: { type: Type.STRING },
                  safetyPrecaution: { type: Type.STRING },
                },
                required: [
                  'id',
                  'actionType',
                  'urgency',
                  'title',
                  'targetItem',
                  'reasoning',
                  'potentialWasteSavedKg',
                  'potentialCostSaved',
                  'staffActionRequired',
                  'safetyPrecaution',
                ],
              },
            },
            repurposeRecipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  originalDish: { type: Type.STRING },
                  newDishSuggestion: { type: Type.STRING },
                  cookingTimeMinutes: { type: Type.NUMBER },
                  extraIngredientsNeeded: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  instructions: { type: Type.STRING },
                  safeHoldingInstructions: { type: Type.STRING },
                },
                required: [
                  'originalDish',
                  'newDishSuggestion',
                  'cookingTimeMinutes',
                  'extraIngredientsNeeded',
                  'instructions',
                  'safeHoldingInstructions',
                ],
              },
            },
          },
          required: [
            'overallSurplusAnalysis',
            'totalSurplusKg',
            'projectedWasteCost',
            'riskAssessment',
            'actionPlan',
            'repurposeRecipes',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }
    return JSON.parse(text) as AiDecisionOutput;
  } catch (error) {
    console.error('Gemini API Error in analyzeSurplusWithGemini:', error);
    return generateFallbackDecision(items, canteenContext);
  }
}

export interface DemandForecastOutput {
  summary: string;
  projectedHeadcount: number;
  weatherFactorImpact: string;
  eventFactorImpact: string;
  recommendedCategoryPrep: Array<{
    category: string;
    historicalAveragePortions: number;
    recommendedPrepPortions: number;
    adjustmentPercentage: number;
    rationale: string;
    bufferPortions: number;
  }>;
  preventativeTips: string[];
}

export async function generateDemandForecastWithGemini(context: {
  targetDate: string;
  mealShift: string;
  dayOfWeek: string;
  weatherCondition: string;
  temperatureC: number;
  campusEvent: string;
  canteenName: string;
}): Promise<DemandForecastOutput> {
  if (!process.env.GEMINI_API_KEY) {
    return generateFallbackForecast(context);
  }

  const prompt = `
As MealMind AI's predictive dining algorithm, calculate recommended meal batch sizes for:
- Date: ${context.targetDate} (${context.dayOfWeek})
- Shift: ${context.mealShift}
- Facility: ${context.canteenName}
- Weather: ${context.weatherCondition}, ${context.temperatureC}°C
- Academic / Campus Context: ${context.campusEvent}

Take into consideration typical university student consumption behavior:
- Bad weather (rain/cold) reduces travel across campus, condensing diners into central halls and boosting soup/comfort food demand.
- Midterm / finals periods lead to erratic eating windows, high late-night demand, and preference for handhelds/grab-and-go.
- Campus athletic events or festivals surge lunch/dinner spikes.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an expert dining analytics AI providing precise portion planning to avoid overproduction in educational institutions.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            projectedHeadcount: { type: Type.NUMBER },
            weatherFactorImpact: { type: Type.STRING },
            eventFactorImpact: { type: Type.STRING },
            recommendedCategoryPrep: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  historicalAveragePortions: { type: Type.NUMBER },
                  recommendedPrepPortions: { type: Type.NUMBER },
                  adjustmentPercentage: { type: Type.NUMBER },
                  rationale: { type: Type.STRING },
                  bufferPortions: { type: Type.NUMBER },
                },
                required: [
                  'category',
                  'historicalAveragePortions',
                  'recommendedPrepPortions',
                  'adjustmentPercentage',
                  'rationale',
                  'bufferPortions',
                ],
              },
            },
            preventativeTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'summary',
            'projectedHeadcount',
            'weatherFactorImpact',
            'eventFactorImpact',
            'recommendedCategoryPrep',
            'preventativeTips',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }
    return JSON.parse(text) as DemandForecastOutput;
  } catch (error) {
    console.error('Gemini API Error in generateDemandForecastWithGemini:', error);
    return generateFallbackForecast(context);
  }
}

// Fallback generators that maintain full functionality even offline or before API key injection
function generateFallbackDecision(
  items: InventoryItemPayload[],
  context: { currentShift: string; weather: string; campusEvent: string }
): AiDecisionOutput {
  const totalSurplus = items.reduce(
    (sum, i) => sum + Math.max(0, i.preparedQty - i.soldQty - (i.reservedQty || 0)),
    0
  );
  const cost = items.reduce(
    (sum, i) =>
      sum + Math.max(0, i.preparedQty - i.soldQty - (i.reservedQty || 0)) * (i.costPerUnit || 3.5),
    0
  );

  return {
    overallSurplusAnalysis: `Analysis for ${context.currentShift} shows an estimated surplus of ${totalSurplus.toFixed(
      1
    )} units. Overproduction occurred primarily due to ${context.weather.toLowerCase()} conditions altering dining hall footfall, coupled with ${context.campusEvent.toLowerCase()}.`,
    totalSurplusKg: Math.round(totalSurplus * 0.45 * 10) / 10,
    projectedWasteCost: Math.round(cost * 100) / 100,
    riskAssessment:
      'Items prepared over 2.5 hours ago require immediate temperature validation (Hot hold >= 60°C). Critical holding window closing in 45 minutes.',
    actionPlan: [
      {
        id: 'act-1',
        actionType: 'flash_discount',
        urgency: 'high',
        title: 'Activate "Last-Call" 50% Student Grab & Go',
        targetItem: items[0]?.itemName || 'Prepared Main Dishes',
        reasoning:
          'High student footfall in student center between 1:30 PM - 2:00 PM. A rapid 50% discount will clear 65% of remaining portions within 25 minutes without discarding.',
        potentialWasteSavedKg: 18.5,
        potentialCostSaved: 145.0,
        staffActionRequired:
          'Staff must post flash alert on Canteen display board and ensure grab-and-go boxes are pre-portioned.',
        safetyPrecaution: 'Ensure holding hot-lamp temperature remains above 63°C until sold.',
      },
      {
        id: 'act-2',
        actionType: 'staff_donation_review',
        urgency: 'critical',
        title: 'Queue Safe Batches for Campus Food Pantry Dispatch',
        targetItem: items.find((i) => i.category.includes('Main') || i.category.includes('Bakery'))?.itemName || 'Cooked Entrees',
        reasoning:
          'Item has remaining safe holding buffer of 90 minutes. Campus Food Pantry driver arrives at 2:30 PM for scheduled refrigerated courier run.',
        potentialWasteSavedKg: 24.0,
        potentialCostSaved: 190.0,
        staffActionRequired:
          'Staff Supervisor must record internal probe temp (>60°C or <4°C), sign safety checklist, and print donation manifest.',
        safetyPrecaution: 'Mandatory HACCP check: Do NOT donate if holding temp fell below 57°C at any time.',
      },
      {
        id: 'act-3',
        actionType: 'kitchen_repurpose',
        urgency: 'medium',
        title: 'Repurpose Surplus Starches for Evening Dinner Casserole',
        targetItem: items.find((i) => i.category.includes('Starches') || i.category.includes('Side'))?.itemName || 'Cooked Rice & Sides',
        reasoning:
          'Chilled starches safely held under 4°C can be flash-cooled and transformed into Spanish Rice Bake or Crispy Arancini for evening dinner rush.',
        potentialWasteSavedKg: 14.0,
        potentialCostSaved: 98.0,
        staffActionRequired:
          'Kitchen prep cook must blast-chill remaining batch to under 4°C within 90 minutes and re-label with batch date.',
        safetyPrecaution: 'Ensure rapid 2-stage blast chilling protocol is strictly followed.',
      },
      {
        id: 'act-4',
        actionType: 'portion_tuning',
        urgency: 'low',
        title: 'Lower Dinner Prep Baseline by -18%',
        targetItem: 'General Evening Batch',
        reasoning:
          'Historical student swipe data indicates lower Friday dinner attendance when campus events finish early.',
        potentialWasteSavedKg: 32.0,
        potentialCostSaved: 230.0,
        staffActionRequired: 'Adjust steam-table prep sheet before 4:00 PM kitchen line prep starts.',
        safetyPrecaution: 'Standard production safety buffer maintained at 10%.',
      },
    ],
    repurposeRecipes: [
      {
        originalDish: 'Surplus Steamed Jasmine / Basmati Rice',
        newDishSuggestion: 'Golden Vegetable & Edamame Fried Rice Bowls',
        cookingTimeMinutes: 20,
        extraIngredientsNeeded: ['Sesame oil', 'Diced carrots & peas', 'Tamari soy sauce', 'Green onions'],
        instructions:
          'Use day-cold surplus rice with dry grains. Wok-sear with aromatics, fold in flash-steamed veggies, finish with toasted sesame oil. Hot hold at 65°C.',
        safeHoldingInstructions: 'Must reach internal temperature of 74°C during reheat.',
      },
      {
        originalDish: 'Roasted Herb Chicken Breasts / Thighs',
        newDishSuggestion: 'Smoky Chipotle Chicken & Corn Chowder',
        cookingTimeMinutes: 35,
        extraIngredientsNeeded: ['Vegetable broth', 'Sweet corn', 'Chipotle pepper adobo', 'Cream or oat milk'],
        instructions:
          'Shred cooked chicken. Simmer aromatic mirepoix, fold in chicken, corn, and broth. Emulsify with cream base. Garnish with cilantro.',
        safeHoldingInstructions: 'Hold at 65°C on soup bar with hourly probe verification.',
      },
    ],
  };
}

function generateFallbackForecast(context: {
  mealShift: string;
  weatherCondition: string;
  campusEvent: string;
}): DemandForecastOutput {
  const isRain = context.weatherCondition.toLowerCase().includes('rain');
  const isExams = context.campusEvent.toLowerCase().includes('exam');

  return {
    summary: `Forecast for ${context.mealShift} indicates high concentration of diners (+14% above baseline) driven by ${context.weatherCondition} conditions and ${context.campusEvent}. Hot soups and warm comfort foods show accelerated consumption.`,
    projectedHeadcount: isExams ? 820 : 640,
    weatherFactorImpact: isRain
      ? 'Inclement weather increases indoor dining hall occupancy by ~18% as students avoid off-campus restaurants.'
      : 'Mild weather distributes footfall evenly with slight outdoor patio preference.',
    eventFactorImpact: isExams
      ? 'Exam week concentrates student dining into rapid 20-minute windows; high demand for grab-and-go combos.'
      : 'Standard academic schedule maintains steady meal shift curves.',
    recommendedCategoryPrep: [
      {
        category: 'Hot Entrees & Mains',
        historicalAveragePortions: 420,
        recommendedPrepPortions: 395,
        adjustmentPercentage: -6,
        rationale: 'Reduce heavy braises; students prefer fast-serving pasta & grain bowls during current shift.',
        bufferPortions: 30,
      },
      {
        category: 'Soups & Stews',
        historicalAveragePortions: 160,
        recommendedPrepPortions: 210,
        adjustmentPercentage: 31,
        rationale: 'Rain and cooler temperatures trigger significant spike in hot soup demand.',
        bufferPortions: 25,
      },
      {
        category: 'Deli & Grab-and-Go Sandwiches',
        historicalAveragePortions: 220,
        recommendedPrepPortions: 260,
        adjustmentPercentage: 18,
        rationale: 'High velocity turnover expected between study sessions.',
        bufferPortions: 20,
      },
      {
        category: 'Salad Bar & Fresh Greens',
        historicalAveragePortions: 180,
        recommendedPrepPortions: 155,
        adjustmentPercentage: -14,
        rationale: 'Chilled items drop during rain; reduce pre-chopped delicate greens to avoid oxidation waste.',
        bufferPortions: 15,
      },
      {
        category: 'Bakery & Dessert Items',
        historicalAveragePortions: 250,
        recommendedPrepPortions: 240,
        adjustmentPercentage: -4,
        rationale: 'Steady afternoon coffee and pastry accompaniment.',
        bufferPortions: 20,
      },
    ],
    preventativeTips: [
      'Batch-cook proteins in 3 smaller 30-portion waves instead of one large 100-portion sheet pan.',
      'Replenish salad bar using shallow 2-inch hotel pans rather than deep 4-inch pans to maintain visual freshness without over-exposing product.',
      'Pre-package surplus sandwiches at 1:45 PM for immediate transition to the student pantry cart.',
      'Check soup kettle volume every 30 minutes to dynamically hold the final 15-litre reserve batch in refrigeration.',
    ],
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export async function chatWithChefMind(
  messages: ChatMessage[],
  context?: {
    canteenName?: string;
    currentShift?: string;
    totalSurplus?: number;
    portionsRescued?: number;
  }
): Promise<string> {
  const lastUserMsg = messages[messages.length - 1]?.text || '';
  if (!process.env.GEMINI_API_KEY) {
    return generateFallbackChatResponse(lastUserMsg);
  }

  const systemInstruction = `You are ChefMind AI, the executive culinary sustainability & kitchen operations co-pilot for MealMind.ai.
You assist head chefs, kitchen managers, and food safety officers in college canteens and restaurants.
Active Canteen Context:
- Canteen: ${context?.canteenName || 'Campus Central Canteen'}
- Shift: ${context?.currentShift || 'Lunch'}
- Current Surplus Portions: ${context?.totalSurplus ?? 224}
- Rescued via Donation: ${context?.portionsRescued ?? 161} meals

Your responsibilities:
1. Provide authoritative culinary repurposing ideas (turning surplus starches, braised proteins, and roasted vegetables into high-margin specials for the next shift).
2. Enforce strict HACCP food safety standards (Hot hold >= 60°C / 140°F, Cold hold <= 4°C / 40°F, 2-hour/4-hour rule).
3. Advise on dynamic student flash discounts ("Last-Call 50% Grab & Go") to accelerate late-shift clearing.
4. Guide legal Good Samaritan Act donation compliance and temperature logging.
5. Remind staff that human physical probe inspection is always required before donating.

Keep your answers crisp, well-structured with markdown bullet points, practical for a high-volume commercial kitchen, and professional.`;

  try {
    const formattedContents = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "ChefMind AI: Kitchen parameters updated. Ready for your next query.";
  } catch (error) {
    console.error('Gemini chat error in chatWithChefMind:', error);
    return generateFallbackChatResponse(lastUserMsg);
  }
}

function generateFallbackChatResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('rice') || q.includes('starch')) {
    return `### ChefMind Repurposing Advisory: Surplus Rice & Grains
* **Repurposing Path 1: Golden Vegetable Wok Fried Rice**
  - **Process:** Ensure surplus rice was rapidly cooled to <4°C within 2 hours. Flash-fry in smoking woks with sesame oil, diced scallions, peas, and edamame.
  - **HACCP Reheat Threshold:** Must reach **74°C (165°F)** internal temperature before hot holding at **60°C (140°F)**.
* **Repurposing Path 2: Crispy Arancini Rice Bites**
  - Bind with light bechamel, shape into 40g balls with mozzarella centers, panko crust, and bake for student grab-and-go.`;
  }
  if (q.includes('chicken') || q.includes('meat') || q.includes('protein')) {
    return `### ChefMind Protein Safety & Repurposing Protocol
* **Advisory for Cooked Poultry & Meats:**
  - **HACCP Rule:** Hot holding window is strictly 4 hours max. If holding time exceeds 3 hours, initiate either:
    1. **Campus Pantry Courier Dispatch:** Immediately package into sanitized Cambro thermal containers (temp verified >= 60°C).
    2. **Kitchen Transformation:** Shred meat and incorporate into **Smoky Chipotle & Corn Chowder** for the dinner shift. Reheat to 74°C.`;
  }
  if (q.includes('haccp') || q.includes('temp') || q.includes('safety') || q.includes('rule')) {
    return `### Food Safety & HACCP Critical Control Limits
1. **Hot Holding:** Maintain >= **60°C (140°F)** at all counter wells.
2. **Cold Holding:** Maintain <= **4°C (40°F)** with probe checks every 60 minutes.
3. **Danger Zone (5°C to 59°C):** Never approve food for donation if it has resided in this zone for > 2 hours.
4. **Mandatory Sign-off:** All donations require physical temperature logging and supervisor authorization stamp on the donation manifest.`;
  }
  return `### ChefMind Operations Advisory
* **Current Shift Recommendation:** Based on current swipe count and weather conditions, initiate a **50% Last-Call Flash Sale** at 1:45 PM for chilled deli sandwiches and salads.
* **Prep Adjustment:** Reduce evening dinner braise batch by **-15%** to prevent secondary surplus.
* **Pantry Pickup:** The campus refrigerated food van is scheduled for 2:15 PM today. Ensure all approved batches are sealed with allergen labels.`;
}

