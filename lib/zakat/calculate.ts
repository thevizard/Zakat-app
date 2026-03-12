import { ZAKAT_RATE, NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS } from '@/constants/zakat'
import { AssetInputs, NisabData, NisabStandard, ZakatResult, AssetBreakdownItem } from '@/types/zakat.types'

export function calculateZakat(
  assets: AssetInputs,
  nisabData: NisabData,
  nisabStandard: NisabStandard = 'gold'
): ZakatResult {
  const zakatableRetirement = assets.retirementAccounts * 0.3
  const zakatablePassiveStocks = assets.passiveStocks * 0.3

  const nisabThreshold =
    nisabStandard === 'gold'
      ? NISAB_GOLD_GRAMS * nisabData.goldPriceUSD
      : NISAB_SILVER_GRAMS * nisabData.silverPriceUSD

  const totalAssets =
    assets.cash +
    assets.gold +
    assets.silver +
    assets.stocks +
    zakatablePassiveStocks +
    assets.crypto +
    zakatableRetirement +
    assets.investmentProperty +
    assets.businessInventory +
    assets.moneyOwed +
    assets.otherAssets

  const zakatableWealth = Math.max(0, totalAssets - assets.liabilities)
  const meetsNisab = zakatableWealth >= nisabThreshold
  const zakatDue = meetsNisab ? zakatableWealth * ZAKAT_RATE : 0
  const rate = meetsNisab ? ZAKAT_RATE : 0

  const breakdown: AssetBreakdownItem[] = [
    {
      label: 'Cash & Bank Accounts',
      stepName: 'cash',
      entered: assets.cash,
      zakatable: assets.cash,
      zakatDue: assets.cash * rate,
    },
    {
      label: 'Gold',
      stepName: 'goldsilver',
      entered: assets.gold,
      zakatable: assets.gold,
      zakatDue: assets.gold * rate,
    },
    {
      label: 'Silver',
      stepName: 'goldsilver',
      entered: assets.silver,
      zakatable: assets.silver,
      zakatDue: assets.silver * rate,
    },
    {
      label: 'Active Stocks',
      stepName: 'stocks',
      entered: assets.stocks,
      zakatable: assets.stocks,
      zakatDue: assets.stocks * rate,
    },
    {
      label: 'Passive Stocks (30%)',
      stepName: 'stocks',
      entered: assets.passiveStocks,
      zakatable: zakatablePassiveStocks,
      zakatDue: zakatablePassiveStocks * rate,
    },
    {
      label: 'Cryptocurrency',
      stepName: 'crypto',
      entered: assets.crypto,
      zakatable: assets.crypto,
      zakatDue: assets.crypto * rate,
    },
    {
      label: 'Retirement Accounts (30%)',
      stepName: 'retirement',
      entered: assets.retirementAccounts,
      zakatable: zakatableRetirement,
      zakatDue: zakatableRetirement * rate,
    },
    {
      label: 'Investment Property',
      stepName: 'property',
      entered: assets.investmentProperty,
      zakatable: assets.investmentProperty,
      zakatDue: assets.investmentProperty * rate,
    },
    {
      label: 'Business Inventory',
      stepName: 'business',
      entered: assets.businessInventory,
      zakatable: assets.businessInventory,
      zakatDue: assets.businessInventory * rate,
    },
    {
      label: 'Money Owed To You',
      stepName: 'debts',
      entered: assets.moneyOwed,
      zakatable: assets.moneyOwed,
      zakatDue: assets.moneyOwed * rate,
    },
    {
      label: 'Other Assets',
      stepName: 'debts',
      entered: assets.otherAssets,
      zakatable: assets.otherAssets,
      zakatDue: assets.otherAssets * rate,
    },
  ].filter((item) => item.entered > 0)

  return {
    totalAssets,
    totalLiabilities: assets.liabilities,
    zakatableWealth,
    nisabThreshold,
    nisabStandard,
    meetsNisab,
    zakatDue,
    breakdown,
  }
}