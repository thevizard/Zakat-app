import { z } from "zod";

export const assetInputSchema = z.object({
  cash: z.number().min(0, "Must be 0 or more"),
  gold: z.number().min(0, "Must be 0 or more"),
  silver: z.number().min(0, "Must be 0 or more"),
  stocks: z.number().min(0, "Must be 0 or more"),
  businessInventory: z.number().min(0, "Must be 0 or more"),
  rentalIncome: z.number().min(0, "Must be 0 or more"),
  moneyOwed: z.number().min(0, "Must be 0 or more"),
  otherAssets: z.number().min(0, "Must be 0 or more"),
  liabilities: z.number().min(0, "Must be 0 or more"),
});

export type AssetInputSchema = z.infer<typeof assetInputSchema>;
