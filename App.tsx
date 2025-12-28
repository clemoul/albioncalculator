
import React, { useState, useMemo } from 'react';
import { FarmingData, CraftingData, CalculationResults } from './types';

const SEEDS_TOTAL = 144;

const App: React.FC = () => {
  // --- State ---
  const [farming, setFarming] = useState<FarmingData>({
    seedPrice: 2500,
    seedsRecovered: 126,
    wheatHarvested: 860,
    marketWheatPrice: 480,
  });

  const [crafting, setCrafting] = useState<CraftingData>({
    wheatPerCraft: 16,
    foodPerCraft: 10,
    returnRate: 15,
    wheatPriceUsed: 480,
    marketFoodPrice: 950,
  });

  // --- Calculations ---
  const results = useMemo((): CalculationResults => {
    // Farming logic
    const seedsBought = Math.max(0, SEEDS_TOTAL - farming.seedsRecovered);
    const realCycleCost = seedsBought * farming.seedPrice;
    const costPerWheat = farming.wheatHarvested > 0 ? realCycleCost / farming.wheatHarvested : 0;
    const diffMarket = farming.marketWheatPrice - costPerWheat;
    const isProfitable = costPerWheat < farming.marketWheatPrice;

    // Crafting logic (Uses crafting.wheatPriceUsed instead of farming result if desired)
    const effectiveWheatConsumed = crafting.wheatPerCraft * (1 - (crafting.returnRate / 100));
    const realCraftCost = effectiveWheatConsumed * crafting.wheatPriceUsed;
    const costPerFood = crafting.foodPerCraft > 0 ? realCraftCost / crafting.foodPerCraft : 0;
    const foodMarketDiff = crafting.marketFoodPrice - costPerFood;
    const isFoodProfitable = costPerFood < crafting.marketFoodPrice;

    return {
      seedsBought,
      realCycleCost: Math.round(realCycleCost),
      costPerWheat: Math.round(costPerWheat),
      diffMarket: Math.round(diffMarket),
      isProfitable,
      effectiveWheatConsumed: Number(effectiveWheatConsumed.toFixed(2)),
      realCraftCost: Math.round(realCraftCost),
      costPerFood: Math.round(costPerFood),
      foodMarketDiff: Math.round(foodMarketDiff),
      isFoodProfitable
    };
  }, [farming, crafting]);

  const useFarmingCostInCraft = () => {
    setCrafting({ ...crafting, wheatPriceUsed: results.costPerWheat });
  };

  return (
    <div className="min-h-screen pb-12 bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-4 px-4 sticky top-0 z-10 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-600 p-2 rounded-lg shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-lg font-black uppercase tracking-widest text-amber-500">Albion Calc</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Inputs */}
        <section className="space-y-6">
          {/* Section 1 : Farming */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
            <h2 className="text-amber-500 font-black mb-5 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rotate-45" />
              Farming (Cycle 144)
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <InputGroup 
                label="Prix unitaire graine" 
                value={farming.seedPrice} 
                onChange={(v) => setFarming({...farming, seedPrice: v})}
                unit="Silver"
              />
              <InputGroup 
                label="Graines récupérées" 
                value={farming.seedsRecovered} 
                onChange={(v) => setFarming({...farming, seedsRecovered: v})}
                max={SEEDS_TOTAL}
                unit="u"
              />
              <InputGroup 
                label="Blés récoltés" 
                value={farming.wheatHarvested} 
                onChange={(v) => setFarming({...farming, wheatHarvested: v})}
                unit="u"
              />
              <InputGroup 
                label="Prix marché blé" 
                value={farming.marketWheatPrice} 
                onChange={(v) => setFarming({...farming, marketWheatPrice: v})}
                unit="Silver"
              />
            </div>
          </div>

          {/* Section 2 : Crafting */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
            <h2 className="text-blue-500 font-black mb-5 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rotate-45" />
              Crafting : Wheat Soup
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between items-end">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Prix du blé utilisé</label>
                    <button 
                      onClick={useFarmingCostInCraft}
                      className="text-[9px] text-indigo-400 hover:text-indigo-300 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20"
                    >
                      UTILISER COÛT FARMING ({results.costPerWheat})
                    </button>
                </div>
                <div className="relative">
                  <input 
                    type="number"
                    value={crafting.wheatPriceUsed}
                    onChange={(e) => setCrafting({...crafting, wheatPriceUsed: parseFloat(e.target.value) || 0})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 focus:ring-1 focus:ring-blue-500 text-sm font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-bold uppercase">Silver</span>
                </div>
              </div>

              <InputGroup 
                label="Prix de vente (Marché Soupe)" 
                value={crafting.marketFoodPrice} 
                onChange={(v) => setCrafting({...crafting, marketFoodPrice: v})}
                unit="Silver"
              />

              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Blés / Craft" value={crafting.wheatPerCraft} onChange={(v) => setCrafting({...crafting, wheatPerCraft: v})} unit="u" />
                <InputGroup label="Soupes / Craft" value={crafting.foodPerCraft} onChange={(v) => setCrafting({...crafting, foodPerCraft: v})} unit="u" />
              </div>
              
              <InputGroup 
                label="Taux de retour (RRR)" 
                value={crafting.returnRate} 
                onChange={(v) => setCrafting({...crafting, returnRate: v})}
                unit="%"
                max={100}
              />
            </div>
          </div>
        </section>

        {/* Right Column: Results */}
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 font-mono text-xs leading-relaxed shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <div className="text-center mb-6 text-slate-500 font-bold uppercase tracking-widest border-b border-slate-800 pb-2">
              Rapport Économique Albion
            </div>
            
            <div className="mb-8">
              <div className="text-slate-700 mb-1 font-bold tracking-tighter">──────────────</div>
              <div className="text-amber-500 font-black uppercase text-[11px]">FARMING – RÉSUMÉ</div>
              <div className="text-slate-700 mb-2 font-bold tracking-tighter">──────────────</div>
              <div className="space-y-1">
                <div className="flex justify-between"><span>Graines plantées</span> <span className="text-slate-300 font-bold">{SEEDS_TOTAL}</span></div>
                <div className="flex justify-between"><span>Graines récupérées</span> <span className="text-slate-300">{farming.seedsRecovered}</span></div>
                <div className="flex justify-between"><span>Graines achetées</span> <span className="text-white font-bold">{results.seedsBought}</span></div>
                <div className="flex justify-between font-bold text-amber-500 mt-2 border-t border-slate-800 pt-1">
                  <span>Coût réel cycle</span> <span>{results.realCycleCost.toLocaleString()} s</span>
                </div>
                <div className="mt-4 flex justify-between"><span>Blés récoltés</span> <span className="text-slate-300 font-bold">{farming.wheatHarvested}</span></div>
                <div className="flex justify-between font-bold text-white text-[13px]">
                  <span>Coût / Blé</span> <span>{results.costPerWheat.toLocaleString()} s</span>
                </div>
                <div className="flex justify-between text-slate-500 italic">
                  <span>Prix marché</span> <span>{farming.marketWheatPrice.toLocaleString()} s</span>
                </div>
                <div className={`mt-2 text-center py-1.5 rounded text-[10px] font-black uppercase ${results.isProfitable ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                   {results.isProfitable ? 'Farming rentable' : 'Farming non rentable'}
                </div>
              </div>
            </div>

            <div>
              <div className="text-slate-700 mb-1 font-bold tracking-tighter">──────────────</div>
              <div className="text-blue-500 font-black uppercase text-[11px]">CRAFT FOOD – WHEAT SOUP</div>
              <div className="text-slate-700 mb-2 font-bold tracking-tighter">──────────────</div>
              <div className="space-y-1">
                <div className="flex justify-between"><span>Blés utilisés (RRR incl.)</span> <span className="text-slate-300 font-bold">{results.effectiveWheatConsumed}</span></div>
                <div className="flex justify-between"><span>Prix blé unité</span> <span className="text-slate-300">{crafting.wheatPriceUsed} s</span></div>
                <div className="flex justify-between font-bold text-blue-500 mt-2 border-t border-slate-800 pt-1">
                  <span>Coût réel craft</span> <span>{results.realCraftCost.toLocaleString()} s</span>
                </div>
                <div className="mt-4 flex justify-between font-bold text-white text-[13px]">
                  <span>Coût revient / Food</span> <span>{results.costPerFood.toLocaleString()} s</span>
                </div>
                <div className="flex justify-between text-slate-500 italic">
                  <span>Prix vente (Marché)</span> <span>{crafting.marketFoodPrice.toLocaleString()} s</span>
                </div>
                <div className={`flex justify-between font-black mt-2 pt-1 border-t border-slate-800 ${results.foodMarketDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <span>Profit / unité</span> <span>{results.foodMarketDiff.toLocaleString()} s</span>
                </div>
                <div className={`mt-2 text-center py-1.5 rounded text-[10px] font-black uppercase ${results.isFoodProfitable ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                   {results.isFoodProfitable ? 'Craft rentable' : 'Craft non rentable'}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// --- Helper Components ---

interface InputGroupProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  unit: string;
  max?: number;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, unit, max }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</label>
      <div className="relative">
        <input 
          type="number"
          value={value}
          onChange={(e) => {
            const val = parseFloat(e.target.value) || 0;
            if (max !== undefined && val > max) onChange(max);
            else onChange(val);
          }}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-slate-600 transition-all text-sm font-bold pr-16"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600 uppercase">
          {unit}
        </span>
      </div>
    </div>
  );
};

export default App;
