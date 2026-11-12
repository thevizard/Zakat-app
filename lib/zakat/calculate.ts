import { ZAKAT_RATE, NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS } from '@/constants/zakat'
import { AssetInputs, NisabData, NisabStandard, ZakatResult, AssetBreakdownItem } from '@/types/zakat.types'

export function calculateZakat(
  assets: AssetInputs,
  nisabData: NisabData,
  nisabStandard: NisabStandard = 'gold',
  passiveInvestmentRate: number = 0.3,
  retirementRate: number = 0.6
): ZakatResult {
  const zakatableRetirement = (assets.retirementAccounts || 0) * retirementRate
  const zakatablePassiveStocks = (assets.passiveStocks || 0) * passiveInvestmentRate

  const nisabThreshold =
    nisabStandard === 'gold'
      ? NISAB_GOLD_GRAMS * nisabData.goldPriceUSD
      : NISAB_SILVER_GRAMS * nisabData.silverPriceUSD

  const totalAssets =
    (assets.cash || 0) +
    (assets.gold || 0) +
    (assets.silver || 0) +
    (assets.stocks || 0) +
    zakatablePassiveStocks +
    (assets.crypto || 0) +
    zakatableRetirement +
    (assets.investmentProperty || 0) +
    (assets.businessInventory || 0) +
    (assets.moneyOwed || 0) +
    (assets.otherAssets || 0)

  const zakatableWealth = Math.max(0, totalAssets - (assets.liabilities || 0))
  // Everyone visiting is eligible; Zakat is calculated at the standard 2.5% rate on positive net wealth
  const meetsNisab = zakatableWealth > 0
  const zakatDue = zakatableWealth * ZAKAT_RATE
  const rate = meetsNisab ? ZAKAT_RATE : 0

  const breakdown: AssetBreakdownItem[] = [
    {
      label: 'Cash & Bank Accounts',
      stepName: 'cash',
      entered: assets.cash || 0,
      zakatable: assets.cash || 0,
      zakatDue: (assets.cash || 0) * rate,
    },
    {
      label: 'Gold',
      stepName: 'goldsilver',
      entered: assets.gold || 0,
      zakatable: assets.gold || 0,
      zakatDue: (assets.gold || 0) * rate,
    },
    {
      label: 'Silver',
      stepName: 'goldsilver',
      entered: assets.silver || 0,
      zakatable: assets.silver || 0,
      zakatDue: (assets.silver || 0) * rate,
    },
    {
      label: 'Active Stocks',
      stepName: 'stocks',
      entered: assets.stocks || 0,
      zakatable: assets.stocks || 0,
      zakatDue: (assets.stocks || 0) * rate,
    },
    {
      label: `Passive Stocks (${Math.round(passiveInvestmentRate * 100)}%)`,
      stepName: 'stocks',
      entered: assets.passiveStocks || 0,
      zakatable: zakatablePassiveStocks,
      zakatDue: zakatablePassiveStocks * rate,
    },
    {
      label: 'Cryptocurrency',
      stepName: 'crypto',
      entered: assets.crypto || 0,
      zakatable: assets.crypto || 0,
      zakatDue: (assets.crypto || 0) * rate,
    },
    {
      label: `Retirement Accounts (${Math.round(retirementRate * 100)}%)`,
      stepName: 'retirement',
      entered: assets.retirementAccounts || 0,
      zakatable: zakatableRetirement,
      zakatDue: zakatableRetirement * rate,
    },
    {
      label: 'Investment Property',
      stepName: 'property',
      entered: assets.investmentProperty || 0,
      zakatable: assets.investmentProperty || 0,
      zakatDue: (assets.investmentProperty || 0) * rate,
    },
    {
      label: 'Business Inventory',
      stepName: 'business',
      entered: assets.businessInventory || 0,
      zakatable: assets.businessInventory || 0,
      zakatDue: (assets.businessInventory || 0) * rate,
    },
    {
      label: 'Money Owed To You',
      stepName: 'receivables',
      entered: assets.moneyOwed || 0,
      zakatable: assets.moneyOwed || 0,
      zakatDue: (assets.moneyOwed || 0) * rate,
    },
    {
      label: 'Other Assets',
      stepName: 'receivables',
      entered: assets.otherAssets || 0,
      zakatable: assets.otherAssets || 0,
      zakatDue: (assets.otherAssets || 0) * rate,
    },
  ].filter((item) => item.entered > 0)

  return {
    totalAssets,
    totalLiabilities: assets.liabilities || 0,
    zakatableWealth,
    nisabThreshold,
    nisabStandard,
    meetsNisab,
    zakatDue,
    breakdown,
  }
}
