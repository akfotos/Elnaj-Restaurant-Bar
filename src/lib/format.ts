export const CURRENCY = "GHS";

export function money(amount: number) {
  return `${CURRENCY} ${amount.toFixed(2)}`;
}

export function orderNumber() {
  return `ELN-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
] as const;

export const DIETARY_LABELS = ["vegan", "vegetarian", "halal", "gluten-free", "spicy", "nut-free"];
