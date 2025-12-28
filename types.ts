
export interface FarmingData {
  seedPrice: number;
  seedsRecovered: number;
  wheatHarvested: number;
  marketWheatPrice: number;
}

export interface CraftingData {
  wheatPerCraft: number;
  foodPerCraft: number;
  returnRate: number;
  wheatPriceUsed: number;
  marketFoodPrice: number;
}

export interface CalculationResults {
  seedsBought: number;
  realCycleCost: number;
  costPerWheat: number;
  diffMarket: number;
  isProfitable: boolean;
  effectiveWheatConsumed: number;
  realCraftCost: number;
  costPerFood: number;
  foodMarketDiff: number;
  isFoodProfitable: boolean;
}
