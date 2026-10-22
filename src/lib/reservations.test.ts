import { test } from "node:test";
import assert from "node:assert/strict";
import { parseReservationRequest } from "./reservations";

const now = new Date("2026-10-21T12:00:00Z");
const request = { name: "  Ama Mensah  ", email: "ama@example.com", phone: "+233 24 123 4567", date: "2026-10-22", time: "18:30", guests: 4, notes: "Window seat if possible", requestId: "36e2e01a-568a-4b18-8d16-803be52fbb50" };

test("normalizes a valid request using Accra local time", () => {
  const result = parseReservationRequest(request, now);
  assert.equal(result.success, true);
  if (!result.success) return;
  assert.equal(result.data.name, "Ama Mensah");
  assert.equal(result.data.requestedAt.toISOString(), "2026-10-22T18:30:00.000Z");
  assert.equal(result.data.guests, 4);
});

test("rejects invalid calendar dates and times", () => {
  for (const change of [{ date: "2027-02-30" }, { date: "2026-13-01" }, { time: "24:00" }, { time: "18:60" }]) {
    assert.equal(parseReservationRequest({ ...request, ...change }, now).success, false);
  }
});

test("rejects past requests including earlier today", () => {
  for (const change of [{ date: "2026-10-20" }, { date: "2026-10-21", time: "11:59" }, { date: "2026-10-21", time: "12:00" }]) {
    assert.equal(parseReservationRequest({ ...request, ...change }, now).success, false);
  }
});

test("requires real contact information and a whole party size", () => {
  for (const change of [{ name: " " }, { email: "invalid" }, { phone: "-------" }, { guests: 0 }, { guests: 2.5 }, { guests: 100 }, { guests: "4" }, { requestId: "invalid" }, { notes: "x".repeat(2001) }]) {
    assert.equal(parseReservationRequest({ ...request, ...change }, now).success, false);
  }
});

test("does not accept guest-supplied confirmation status", () => {
  const result = parseReservationRequest({ ...request, status: "CONFIRMED", createdAt: "2020-01-01" }, now);
  assert.equal(result.success, true);
  if (!result.success) return;
  assert.equal("status" in result.data, false);
  assert.equal("createdAt" in result.data, false);
});

test("rejects a filled bot field and accepts optional notes", () => {
  assert.equal(parseReservationRequest({ ...request, website: "spam.example" }, now).success, false);
  assert.equal(parseReservationRequest({ ...request, notes: undefined }, now).success, true);
});
