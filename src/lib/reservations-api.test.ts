import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST } from "../app/api/reservations/route";

const url = "http://localhost:3000/api/reservations";

test("rejects cross-origin reservation submissions before any database call", async () => {
  const response = await POST(new NextRequest(url, { method: "POST", headers: { origin: "https://example.org", "content-type": "application/json" }, body: "{}" }));
  assert.equal(response.status, 403);
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("requires JSON and rejects malformed JSON", async () => {
  const wrongType = await POST(new NextRequest(url, { method: "POST", body: "{}" }));
  assert.equal(wrongType.status, 415);
  const malformed = await POST(new NextRequest(url, { method: "POST", headers: { "content-type": "application/json" }, body: "{" }));
  assert.equal(malformed.status, 400);
});

test("rejects missing reservation fields and oversized requests", async () => {
  const invalid = await POST(new NextRequest(url, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }));
  assert.equal(invalid.status, 400);
  const oversized = await POST(new NextRequest(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ notes: "x".repeat(17000) }) }));
  assert.equal(oversized.status, 413);
});
