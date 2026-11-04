import { money } from "./format";

type MenuPrice = { price: number; unitLabel: string };

export function requiresPriceConfirmation(product: Pick<MenuPrice, "unitLabel">) {
  return /^GHS \d+(?:\.\d+)?[–-]\d+(?:\.\d+)?$/.test(product.unitLabel) || /^Provisional: GHS \d+(?:\.\d+)?$/.test(product.unitLabel);
}

export function menuPrice(product: MenuPrice) {
  return requiresPriceConfirmation(product) ? product.unitLabel : money(product.price);
}
