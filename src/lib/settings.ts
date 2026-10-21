import { db } from "@/lib/db";

const DEFAULTS: Record<string, string> = {
  storeName: "Elnaj Restaurant & Bar",
  currency: "GHS",
  taxRate: "0",
  pickupAddress: "12 Osu Oxford Street, Accra",
  deliveryEnabled: "true",
  pickupEnabled: "true",
  timeSlots: "ASAP,12:00-12:30,12:30-13:00,18:00-18:30,18:30-19:00,19:00-19:30,19:30-20:00",
  announcement: "Free delivery on orders over GHS 200",
};

export async function getSetting(key: string): Promise<string> {
  const row = await db.setting.findUnique({ where: { key } });
  return row?.value ?? DEFAULTS[key] ?? "";
}

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await db.setting.findMany();
  const map = { ...DEFAULTS };
  for (const r of rows) map[r.key] = r.value;
  return map;
}

export async function setSetting(key: string, value: string) {
  await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
}
