import { z } from "zod";
import StoreSettings from "../models/StoreSettings.js";

const settingsSchema = z.object({
  storeName: z.string().trim().min(2).max(120),
  storeEmail: z.string().trim().email().max(254),
  currency: z.enum(["XOF", "EUR", "USD"]),
  notificationsEnabled: z.boolean(),
});

const defaultSettings = {
  key: "default",
  storeName: "ShopFlow",
  storeEmail: "contact@shopflow.ci",
  currency: "XOF",
  notificationsEnabled: true,
};

function publicSettings(settings) {
  return {
    storeName: settings.storeName,
    storeEmail: settings.storeEmail,
    currency: settings.currency,
    notificationsEnabled: settings.notificationsEnabled,
    updatedAt: settings.updatedAt,
  };
}

export async function getSettings(request, response) {
  const settings = await StoreSettings.findOneAndUpdate(
    { key: "default" },
    { $setOnInsert: defaultSettings },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  return response.json({ settings: publicSettings(settings) });
}

export async function updateSettings(request, response) {
  const result = settingsSchema.safeParse(request.body);
  if (!result.success) {
    return response.status(400).json({
      message: "Paramètres invalides.",
      errors: result.error.issues.map((issue) => issue.message),
    });
  }

  const settings = await StoreSettings.findOneAndUpdate(
    { key: "default" },
    { $set: result.data, $setOnInsert: { key: "default" } },
    { new: true, upsert: true, runValidators: true },
  );
  return response.json({ settings: publicSettings(settings) });
}
