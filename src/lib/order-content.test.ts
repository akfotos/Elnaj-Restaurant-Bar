import { test } from "node:test";
import assert from "node:assert/strict";
import type { OrderStatus } from "@prisma/client";
import { getOrderContent, getOrderTrackingIndex, getOrderTrackingLabel, ORDER_TRACKING_STEPS } from "./order-content";

test("pending orders are received, not confirmed or ready for pickup", () => {
  const copy = getOrderContent("PENDING", "PICKUP");
  assert.equal(copy.title, "Order received.");
  assert.match(copy.description, /awaiting/);
  assert.doesNotMatch(copy.description, /ready for collection/);
});

test("ready orders explain the correct fulfillment method", () => {
  assert.match(getOrderContent("READY", "PICKUP").description, /collection/);
  assert.match(getOrderContent("READY", "DELIVERY").description, /delivery/);
});

test("tracking uses collection wording for pickup instead of delivery", () => {
  assert.equal(getOrderTrackingLabel("READY", "PICKUP"), "Ready for collection");
  assert.equal(getOrderTrackingLabel("DELIVERED", "PICKUP"), "Collected");
  assert.equal(getOrderTrackingLabel("DELIVERED", "DELIVERY"), "Delivered");
});

test("every order status has its own usable heading and explanation", () => {
  const statuses: OrderStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED", "COMPLETED", "CANCELLED"];
  const titles = statuses.map((status) => {
    const copy = getOrderContent(status, "DELIVERY");
    assert.ok(copy.title.length > 0 && copy.description.length > 0);
    return copy.title;
  });
  assert.equal(new Set(titles).size, statuses.length);
});

test("completed tracking retains progress and cancellation has no active preparation step", () => {
  assert.equal(getOrderTrackingIndex("COMPLETED"), ORDER_TRACKING_STEPS.length - 1);
  assert.equal(getOrderTrackingIndex("CANCELLED"), -1);
  assert.equal(getOrderTrackingIndex("PREPARING"), 2);
});
