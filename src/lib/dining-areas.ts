export const diningAreas = [
  { id: "bar", name: "Elnaj BAR", description: "Make time for drinks and company. Request a table in the bar." },
  { id: "dining", name: "Elnaj DINING", description: "Come together over a meal. Request a table for your next visit." },
  { id: "private", name: "Private Dining", description: "Planning a gathering? Ask our team about private dining availability." },
] as const;

export type DiningArea = typeof diningAreas[number]["id"];

export function getDiningArea(value: unknown) {
  return diningAreas.find((area) => area.id === value);
}

export function reservationNotes(area: DiningArea, notes: string) {
  return `Preferred area: ${getDiningArea(area)!.name}\n${notes.trim()}`.trim();
}
