import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { PDFFont } from "pdf-lib";
import { money } from "./format";

export type MenuPdfCategory = {
  name: string;
  products: {
    name: string;
    description: string;
    ingredients: string | null;
    allergens: string | null;
    dietaryLabels: string | null;
    price: number;
    unitLabel: string;
    trackStock: boolean;
    stock: number;
    variants: { name: string; price: number }[];
  }[];
};

export async function createMenuPdf(categories: MenuPdfCategory[], title: string) {
  const doc = await PDFDocument.create();
  doc.setTitle(`Elnaj ${title}`);
  doc.setAuthor("Elnaj Restaurant & Bar");
  const body = await doc.embedFont(StandardFonts.Helvetica);
  const display = await doc.embedFont(StandardFonts.TimesRoman);
  const supported = new Set(body.getCharacterSet());
  const clean = (value: string) => Array.from(value.replace(/\s+/g, " ").trim()).map((character) => supported.has(character.codePointAt(0)!) ? character : "?").join("");
  const burgundy = rgb(0.5, 0, 0.125);
  const ink = rgb(0.19, 0.15, 0.13);
  const muted = rgb(0.43, 0.39, 0.35);
  const margin = 48;
  const width = 595.28;
  const height = 841.89;
  const contentWidth = width - margin * 2;
  let page = doc.addPage([width, height]);
  let y = height - margin;
  let categoryName = "";

  const header = () => {
    page.drawText("Elnaj", { x: margin, y: height - 65, size: 29, font: display, color: burgundy });
    page.drawText(clean(title), { x: margin, y: height - 88, size: 11, font: body, color: ink });
    page.drawText("RESTAURANT & BAR", { x: width - margin - 118, y: height - 62, size: 9, font: body, color: muted });
    page.drawLine({ start: { x: margin, y: height - 105 }, end: { x: width - margin, y: height - 105 }, thickness: 0.5, color: rgb(0.84, 0.8, 0.75) });
    y = height - 138;
    if (categoryName) {
      page.drawText(clean(categoryName), { x: margin, y, size: 17, font: display, color: burgundy });
      y -= 32;
    }
  };
  const ensure = (space: number) => {
    if (y - space >= 72) return;
    page = doc.addPage([width, height]);
    header();
  };
  const wrap = (value: string, font: PDFFont, size: number, maxWidth = contentWidth) => {
    const lines: string[] = [];
    let line = "";
    for (const word of clean(value).split(" ")) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        line = candidate;
        continue;
      }
      if (line) lines.push(line);
      line = "";
      for (const character of word) {
        if (font.widthOfTextAtSize(line + character, size) > maxWidth) {
          lines.push(line);
          line = "";
        }
        line += character;
      }
    }
    if (line) lines.push(line);
    return lines;
  };
  const write = (value: string, size = 10, font = body, color = muted) => {
    for (const line of wrap(value, font, size)) {
      ensure(size + 6);
      page.drawText(line, { x: margin, y, size, font, color });
      y -= size + 6;
    }
  };

  header();
  write(`Updated ${new Date().toLocaleDateString("en-GB", { timeZone: "UTC" })}. Prices in Ghana cedis (GHS).`);
  y -= 20;
  for (const category of categories.filter((item) => item.products.length)) {
    categoryName = category.name;
    if (y < 170) {
      page = doc.addPage([width, height]);
      header();
    } else {
      write(category.name, 20, display, burgundy);
      y -= 12;
    }
    for (const product of category.products) {
      ensure(66);
      const nameLines = wrap(product.name, display, 15, contentWidth - 115);
      const price = money(product.price);
      page.drawText(price, { x: width - margin - body.widthOfTextAtSize(price, 11), y, size: 11, font: body, color: burgundy });
      for (const line of nameLines) {
        ensure(21);
        page.drawText(line, { x: margin, y, size: 15, font: display, color: ink });
        y -= 21;
      }
      write(product.description);
      if (product.ingredients) write(`Ingredients: ${product.ingredients}`, 9);
      if (product.allergens) write(`Allergen information: ${product.allergens}`, 9);
      if (product.dietaryLabels) write(`Dietary labels: ${product.dietaryLabels}`, 9);
      write(`Price unit: ${product.unitLabel}`, 9);
      if (product.variants.length) write(`Options: ${product.variants.map((variant) => `${variant.name} - ${money(variant.price)}`).join("; ")}`, 9);
      if (product.trackStock && product.stock <= 0) write("Currently unavailable", 9, body, burgundy);
      y -= 22;
    }
    y -= 12;
  }
  if (!categories.some((category) => category.products.length)) write("No menu items are currently available.");
  y -= 8;
  write("Please contact our team before ordering if you have an allergy. Dietary labels are guidance, not a guarantee. Prices and availability may change; check the website before ordering.", 9);
  const pages = doc.getPages();
  pages.forEach((item, index) => {
    item.drawText("Elnaj Restaurant & Bar", { x: margin, y: 38, size: 8, font: body, color: muted });
    const number = `${index + 1} / ${pages.length}`;
    item.drawText(number, { x: width - margin - body.widthOfTextAtSize(number, 8), y: 38, size: 8, font: body, color: muted });
  });
  return doc.save();
}
