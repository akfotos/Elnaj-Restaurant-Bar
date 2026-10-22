import { z } from "zod";

const requestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().regex(/^[+()\d .-]{7,32}$/).refine((phone) => phone.replace(/\D/g, "").length >= 7),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
  guests: z.number().int().min(1).max(99),
  notes: z.string().trim().max(2000).optional().default(""),
  requestId: z.string().uuid(),
  website: z.string().max(0).optional(),
});

export function parseReservationRequest(input: unknown, now = new Date()) {
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check your name, email, phone number, date, time and party size (1–99 guests)." };
  const { date, time, website, ...data } = parsed.data;
  const requestedAt = new Date(`${date}T${time}:00Z`);
  if (!Number.isFinite(requestedAt.getTime()) || requestedAt.toISOString().slice(0, 16) !== `${date}T${time}`) {
    return { success: false as const, error: "Please choose a valid calendar date and time." };
  }
  if (requestedAt <= now) return { success: false as const, error: "Please choose a future date and time, using Accra local time (GMT)." };
  return { success: true as const, data: { ...data, requestedAt } };
}
