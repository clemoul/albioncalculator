
import React, { useState, useMemo } from 'react';
import { FarmingData, CraftingData, CalculationResults } from './types';

const SEEDS_TOTAL = 144;

const App: React.FC = () => {
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

  const results = useMemo((): CalculationResults => {
    const seedsBought = Math.max(0, SEEDS_TOTAL - farming.seedsRecovered);
    const realCycleCost = seedsBought * farming.seedPrice;
    const costPerWheat = farming.wheatHarvested > 0 ? realCycleCost / farming.wheatHarvested : 0;
    const diffMarket = farming.marketWheatPrice - costPerWheat;
    const isProfitable = costPerWheat < farming.marketWheatPrice;

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
    <div className="min-h-screen pb-12 bg-[#1a120b]">
      {/* Header Médieval */}
      <header className="bg-[#2d1f14] border-b-4 border-[#3d2b1f] py-8 px-4 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/leather.png')]"></div>
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <div className="bg-[#c5a059] p-3 rounded-sm border-2 border-[#8b6d31] shadow-[0_0_20px_rgba(197,160,89,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#1a120b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="medieval-font text-3xl font-bold text-[#c5a059] tracking-widest uppercase">Livre de Comptes d'Albion</h1>
            <p className="text-[#8b6d31] text-xs font-bold tracking-[0.3em] uppercase mt-1">Gestionnaire de Domaine & Cuisine</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Entrées (6 colonnes sur large) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Bloc Culture */}
          <div className="bg-[#2d1f14] border-2 border-[#3d2b1f] p-6 rounded-sm shadow-xl relative group">
            <div className="absolute -top-3 right-6 bg-[#3d2b1f] px-4 py-1 border border-[#c5a059]/40 text-[#c5a059] text-[10px] font-black uppercase">
              Laboratoire de Terre
            </div>
            <h2 className="medieval-font text-[#c5a059] text-xl mb-6 flex items-center gap-3">
              <span className="text-[#8b6d31]">I.</span> Culture du Blé
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Prix graine" value={farming.seedPrice} onChange={(v) => setFarming({...farming, seedPrice: v})} unit="Silver" />
              <InputGroup label="Graines récupérées" value={farming.seedsRecovered} onChange={(v) => setFarming({...farming, seedsRecovered: v})} max={SEEDS_TOTAL} unit="u" />
              <InputGroup label="Récolte totale" value={farming.wheatHarvested} onChange={(v) => setFarming({...farming, wheatHarvested: v})} unit="u" />
              <InputGroup label="Prix Marché Blé" value={farming.marketWheatPrice} onChange={(v) => setFarming({...farming, marketWheatPrice: v})} unit="Silver" />
            </div>
          </div>

          {/* Bloc Cuisine */}
          <div className="bg-[#2d1f14] border-2 border-[#3d2b1f] p-6 rounded-sm shadow-xl relative group">
             <div className="absolute -top-3 right-6 bg-[#3d2b1f] px-4 py-1 border border-[#6b8e23]/40 text-[#6b8e23] text-[10px] font-black uppercase">
              Fourneaux Royaux
            </div>
            <h2 className="medieval-font text-[#c5a059] text-xl mb-6 flex items-center gap-3">
              <span className="text-[#8b6d31]">II.</span> Soupe de Blé
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 col-span-full">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold text-[#8b6d31] uppercase">Coût du blé (matière)</label>
                  <button onClick={useFarmingCostInCraft} className="text-[9px] text-[#c5a059] border border-[#c5a059]/20 px-2 py-0.5 rounded-sm hover:bg-[#c5a059]/5 transition-all">
                    Utiliser coût récolte
                  </button>
                </div>
                <div className="relative">
                  <input type="number" value={crafting.wheatPriceUsed} onChange={(e) => setCrafting({...crafting, wheatPriceUsed: parseFloat(e.target.value) || 0})} className="w-full bg-[#1a120b] border border-[#3d2b1f] rounded-sm py-3 px-4 text-[#f4e4bc] font-bold focus:border-[#c5a059] outline-none" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#8b6d31] font-bold">SILVER</span>
                </div>
              </div>
              <InputGroup label="Prix vente Soupe" value={crafting.marketFoodPrice} onChange={(v) => setCrafting({...crafting, marketFoodPrice: v})} unit="Silver" />
              <InputGroup label="Taux retour (RRR)" value={crafting.returnRate} onChange={(v) => setCrafting({...crafting, returnRate: v})} unit="%" max={100} />
              <InputGroup label="Blés par craft" value={crafting.wheatPerCraft} onChange={(v) => setFarming({...farming, seedPrice: v})} unit="u" hideLabel={true} />
              <InputGroup label="Soupes par craft" value={crafting.foodPerCraft} onChange={(v) => setFarming({...farming, seedPrice: v})} unit="u" hideLabel={true} />
              <div className="grid grid-cols-2 gap-4 col-span-full">
                 <InputGroup label="Blés / Craft" value={crafting.wheatPerCraft} onChange={(v) => setCrafting({...crafting, wheatPerCraft: v})} unit="u" />
                 <InputGroup label="Soupes / Craft" value={crafting.foodPerCraft} onChange={(v) => setCrafting({...crafting, foodPerCraft: v})} unit="u" />
              </div>
            </div>
          </div>
        </div>

        {/* Parchemin de résultats (5 colonnes sur large) */}
        <div className="lg:col-span-5">
          <div className="parchment-texture border-[12px] border-[#d9c5a0] p-10 shadow-[20px_20px_40px_rgba(0,0,0,0.5)] min-h-[600px] relative text-[#2a1e17] parchment-font">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold border-b-2 border-[#2a1e17]/20 pb-4 mb-2">Grand Bilan</h3>
              <p className="text-[10px] italic opacity-60">Fait à l'encre de seiche par le scribe royal</p>
            </div>

            <div className="space-y-8">
              {/* Section Terre */}
              <div>
                <h4 className="text-xs font-bold text-[#8b4513] mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="h-px bg-[#8b4513]/30 grow"></span>
                  Rapport de Terre
                  <span className="h-px bg-[#8b4513]/30 grow"></span>
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span>Semis achetés :</span> <span className="font-bold underline">{results.seedsBought} u</span></div>
                  <div className="flex justify-between"><span>Dépense totale :</span> <span className="font-bold">{results.realCycleCost.toLocaleString()} s</span></div>
                  <div className="flex justify-between text-lg font-black mt-4 pt-4 border-t border-[#2a1e17]/10">
                    <span>Prix de revient :</span> <span>{results.costPerWheat.toLocaleString()} s</span>
                  </div>
                  <div className={`mt-4 py-2 text-center rounded-sm border text-[10px] font-black uppercase ${results.isProfitable ? 'bg-[#4a5d23]/10 border-[#4a5d23]/30 text-[#4a5d23]' : 'bg-red-900/10 border-red-900/30 text-red-900'}`}>
                    {results.isProfitable ? '📜 Culture Rentable' : '📜 Culture à perte'}
                  </div>
                </div>
              </div>

              {/* Section Cuisine */}
              <div>
                <h4 className="text-xs font-bold text-[#8b4513] mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="h-px bg-[#8b4513]/30 grow"></span>
                  Rapport de Cuisine
                  <span className="h-px bg-[#8b4513]/30 grow"></span>
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span>Coût du bol :</span> <span className="font-bold">{results.costPerFood.toLocaleString()} s</span></div>
                  <div className="flex justify-between"><span>Prix de vente :</span> <span className="font-bold">{crafting.marketFoodPrice.toLocaleString()} s</span></div>
                  <div className={`flex justify-between text-xl font-black mt-4 pt-4 border-t-2 border-[#2a1e17]/10 ${results.foodMarketDiff >= 0 ? 'text-[#4a5d23]' : 'text-red-900'}`}>
                    <span>Bénéfice Net :</span> <span>{results.foodMarketDiff.toLocaleString()} s</span>
                  </div>
                   <div className={`mt-4 py-2 text-center rounded-sm border text-[10px] font-black uppercase ${results.isFoodProfitable ? 'bg-[#4a5d23]/10 border-[#4a5d23]/30 text-[#4a5d23]' : 'bg-red-900/10 border-red-900/30 text-red-900'}`}>
                    {results.isFoodProfitable ? '🍲 Soupe de Qualité Royale' : '🥄 Cuisine de Misère'}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-0 right-0 text-center opacity-30 select-none">
              <div className="inline-block p-4 border-4 border-[#8b4513] rounded-full medieval-font text-xs font-bold rotate-[-15deg]">
                SCEAU ROYAL
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Composant Input Médieval ---

interface InputGroupProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  unit: string;
  max?: number;
  hideLabel?: boolean;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, unit, max, hideLabel }) => {
  return (
    <div className="flex flex-col gap-2">
      {!hideLabel && <label className="text-[10px] font-bold text-[#8b6d31] uppercase tracking-wider">{label}</label>}
      <div className="relative group">
        <input 
          type="number"
          value={value}
          onChange={(e) => {
            const val = parseFloat(e.target.value) || 0;
            if (max !== undefined && val > max) onChange(max);
            else onChange(val);
          }}
          className="w-full bg-[#1a120b] border border-[#3d2b1f] rounded-sm py-3 px-4 text-[#f4e4bc] text-sm font-bold focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]/20 transition-all outline-none"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[#8b6d31] uppercase pointer-events-none tracking-tighter">
          {unit}
        </span>
      </div>
    </div>
  );
};

export default App;
