
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
      diffMarket: Math.round(farming.marketWheatPrice - costPerWheat),
      isProfitable,
      effectiveWheatConsumed: Number(effectiveWheatConsumed.toFixed(2)),
      realCraftCost: Math.round(realCraftCost),
      costPerFood: Math.round(costPerFood),
      foodMarketDiff: Math.round(foodMarketDiff),
      isFoodProfitable
    };
  }, [farming, crafting]);

  const useFarmingCostInCraft = () => {
    setCrafting(prev => ({ ...prev, wheatPriceUsed: results.costPerWheat }));
  };

  return (
    <div className="min-h-screen pb-16 bg-[#1a120b] selection:bg-[#c5a059] selection:text-[#1a120b]">
      <header className="bg-[#2d1f14] border-b-4 border-[#3d2b1f] py-8 px-6 shadow-2xl relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-[#c5a059] p-4 rounded-sm border-2 border-[#8b6d31] shadow-[0_0_20px_rgba(197,160,89,0.3)] rotate-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#1a120b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="medieval-font text-4xl font-bold text-[#c5a059] tracking-widest uppercase drop-shadow-lg">Grimoire de l'Économe</h1>
              <p className="text-[#8b6d31] text-[10px] font-bold tracking-[0.4em] uppercase mt-2 opacity-80">Registres Royaux d'Albion Online</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-10">
          <section className="bg-[#2d1f14] border-2 border-[#3d2b1f] p-8 rounded-sm shadow-2xl relative">
            <h2 className="medieval-font text-[#c5a059] text-2xl mb-8 flex items-center gap-4 border-b border-[#3d2b1f] pb-4">
              <span className="text-[#8b6d31] font-serif italic text-3xl">I.</span> Terres Agricoles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputGroup label="Prix de la Graine" value={farming.seedPrice} onChange={(v) => setFarming({...farming, seedPrice: v})} unit="Silver" />
              <InputGroup label="Graines Récupérées" value={farming.seedsRecovered} onChange={(v) => setFarming({...farming, seedsRecovered: v})} max={SEEDS_TOTAL} unit="u" />
              <InputGroup label="Récolte de Blé" value={farming.wheatHarvested} onChange={(v) => setFarming({...farming, wheatHarvested: v})} unit="u" />
              <InputGroup label="Prix Marché Blé" value={farming.marketWheatPrice} onChange={(v) => setFarming({...farming, marketWheatPrice: v})} unit="Silver" />
            </div>
          </section>

          <section className="bg-[#2d1f14] border-2 border-[#3d2b1f] p-8 rounded-sm shadow-2xl relative">
            <h2 className="medieval-font text-[#c5a059] text-2xl mb-8 flex items-center gap-4 border-b border-[#3d2b1f] pb-4">
              <span className="text-[#8b6d31] font-serif italic text-3xl">II.</span> Cuisine des Soupes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="col-span-full space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-[#8b6d31] uppercase tracking-widest">Coût du Blé utilisé</label>
                  <button onClick={useFarmingCostInCraft} className="text-[9px] text-[#c5a059] border border-[#c5a059]/30 px-3 py-1 rounded-sm hover:bg-[#c5a059]/10 transition-all font-bold">
                    LIER AU COÛT DU TERROIR
                  </button>
                </div>
                <div className="relative">
                  <input type="number" value={crafting.wheatPriceUsed} onChange={(e) => setCrafting({...crafting, wheatPriceUsed: parseFloat(e.target.value) || 0})} className="w-full bg-[#1a120b] border border-[#3d2b1f] rounded-sm py-4 px-5 text-[#f4e4bc] text-lg font-bold focus:border-[#c5a059] outline-none" />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] text-[#8b6d31] font-black uppercase">Silver / u</span>
                </div>
              </div>
              <InputGroup label="Prix Vente Soupe" value={crafting.marketFoodPrice} onChange={(v) => setCrafting({...crafting, marketFoodPrice: v})} unit="Silver" />
              <InputGroup label="Taux de Retour (%)" value={crafting.returnRate} onChange={(v) => setCrafting({...crafting, returnRate: v})} unit="%" max={100} />
              <InputGroup label="Blés par marmite" value={crafting.wheatPerCraft} onChange={(v) => setCrafting({...crafting, wheatPerCraft: v})} unit="u" />
              <InputGroup label="Soupes obtenues" value={crafting.foodPerCraft} onChange={(v) => setCrafting({...crafting, foodPerCraft: v})} unit="u" />
            </div>
          </section>
        </div>

        <div className="lg:col-span-5">
          <div className="parchment-texture border-[10px] border-[#d9c5a0] p-10 min-h-[700px] relative text-[#2a1e17] parchment-font flex flex-col">
            <div className="text-center mb-12 border-b-2 border-[#2a1e17]/20 pb-6">
              <h3 className="text-3xl font-bold uppercase tracking-tighter medieval-font text-[#5c4033]">Bilan du Scribe</h3>
              <p className="text-[11px] italic opacity-70 mt-1">Dressé en ce jour pour le maître du domaine</p>
            </div>
            <div className="space-y-10 flex-grow">
              <div>
                <h4 className="text-[10px] font-black text-[#8b4513] mb-5 uppercase tracking-[0.3em] flex items-center gap-3">
                  <span className="h-px bg-[#8b4513]/20 grow"></span>L'Agriculture<span className="h-px bg-[#8b4513]/20 grow"></span>
                </h4>
                <div className="space-y-4 text-base font-medium">
                  <div className="flex justify-between border-b border-[#2a1e17]/10 pb-1"><span>Semis acquis :</span> <span className="font-bold underline">{results.seedsBought} sacs</span></div>
                  <div className="flex justify-between border-b border-[#2a1e17]/10 pb-1"><span>Dépense totale :</span> <span className="font-bold">{results.realCycleCost.toLocaleString()} s</span></div>
                  <div className="flex justify-between items-end mt-4">
                    <span className="text-xs uppercase font-bold opacity-70">Valeur de revient :</span>
                    <span className="text-2xl font-black">{results.costPerWheat.toLocaleString()} <span className="text-xs">s/u</span></span>
                  </div>
                  <div className={`mt-4 py-3 text-center rounded-sm border-2 text-[11px] font-black uppercase tracking-widest ${results.isProfitable ? 'bg-[#4a5d23]/10 border-[#4a5d23]/40 text-[#4a5d23]' : 'bg-red-900/10 border-red-900/40 text-red-900'}`}>
                    {results.isProfitable ? '✨ Terres Prospères' : '⚠️ Terres Stériles'}
                  </div>
                </div>
              </div>
              <div className="relative pt-6 border-t border-[#2a1e17]/10">
                <h4 className="text-[10px] font-black text-[#8b4513] mb-5 uppercase tracking-[0.3em] flex items-center gap-3">
                  <span className="h-px bg-[#8b4513]/20 grow"></span>La Cuisine<span className="h-px bg-[#8b4513]/20 grow"></span>
                </h4>
                <div className="space-y-4 text-base font-medium">
                  <div className="flex justify-between border-b border-[#2a1e17]/10 pb-1"><span>Coût du bol :</span> <span className="font-bold underline">{results.costPerFood.toLocaleString()} s</span></div>
                  <div className="flex justify-between border-b border-[#2a1e17]/10 pb-1"><span>Prix d'étal :</span> <span className="font-bold">{crafting.marketFoodPrice.toLocaleString()} s</span></div>
                  <div className={`flex justify-between items-center mt-6 pt-4 border-t-4 border-[#2a1e17]/10 ${results.foodMarketDiff >= 0 ? 'text-[#4a5d23]' : 'text-red-900'}`}>
                    <span className="text-sm font-black uppercase">Bénéfice Net :</span>
                    <span className="text-3xl font-black drop-shadow-sm">{results.foodMarketDiff.toLocaleString()} <span className="text-xs">s/u</span></span>
                  </div>
                   <div className={`mt-5 py-3 text-center rounded-sm border-2 text-[11px] font-black uppercase tracking-widest ${results.isFoodProfitable ? 'bg-[#4a5d23]/10 border-[#4a5d23]/40 text-[#4a5d23]' : 'bg-red-900/10 border-red-900/40 text-red-900'}`}>
                    {results.isFoodProfitable ? '🍲 Gastronomie Royale' : '🥄 Gamelle de Gueux'}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-16 text-center">
              <div className="inline-block p-6 border-4 border-[#8b4513]/40 rounded-full medieval-font text-sm font-bold text-[#8b4513]/60 rotate-[-12deg] uppercase tracking-widest">
                Sceau de l'Économe
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="max-w-6xl mx-auto px-6 mt-16 text-center">
        <p className="text-[#3d2b1f] text-[10px] font-bold uppercase tracking-[0.5em]">Optimisé pour Albion Online • Édition Grimoire</p>
      </footer>
    </div>
  );
};

interface InputGroupProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  unit: string;
  max?: number;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, unit, max }) => {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[10px] font-bold text-[#8b6d31] uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input 
          type="number"
          value={value}
          onChange={(e) => {
            const val = parseFloat(e.target.value) || 0;
            if (max !== undefined && val > max) onChange(max);
            else onChange(val);
          }}
          className="w-full bg-[#1a120b] border-2 border-[#3d2b1f] rounded-sm py-3.5 px-4 text-[#f4e4bc] text-base font-bold focus:border-[#c5a059] transition-all outline-none"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-[#8b6d31] uppercase opacity-60">
          {unit}
        </span>
      </div>
    </div>
  );
};

export default App;
