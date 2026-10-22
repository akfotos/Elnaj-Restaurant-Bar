"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify, RESERVATION_STATUSES } from "@/lib/format";
import { setSetting } from "@/lib/settings";
import type { OrderStatus } from "@prisma/client";
import { z } from "zod";

async function audit(action: string, entity: string, entityId?: string, detail?: string) {
  const actor = await requireAdmin();
  await db.auditLog.create({ data: { actorId: actor?.id, actorName: actor?.name, action, entity, entityId, detail } });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, note?: string) {
  if (!(await requireAdmin())) throw new Error("Forbidden");
  await db.order.update({ where: { id: orderId }, data: { status } });
  await db.statusHistory.create({ data: { orderId, status, note } });
  await audit("update-status", "Order", orderId, status);
  revalidatePath("/admin/orders");
}

export async function refundOrder(orderId: string, amount?: number) {
  if (!(await requireAdmin())) throw new Error("Forbidden");
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Not found");
  const full = !amount || amount >= order.total;
  await db.order.update({
    where: { id: orderId },
    data: { paymentStatus: full ? "REFUNDED" : "PARTIALLY_REFUNDED" },
  });
  await audit("refund", "Order", orderId, full ? `Full refund ${order.total}` : `Partial refund ${amount}`);
  revalidatePath("/admin/orders");
}

export async function upsertProduct(data: {
  id?: string; name: string; description: string; price: number; compareAtPrice?: number;
  categoryId: string; image?: string; stock: number; trackStock: boolean;
  isActive: boolean; isFeatured: boolean; isBestseller: boolean; isSeasonal: boolean;
  ingredients?: string; allergens?: string; dietaryLabels?: string; nutrition?: string;
  storageNotes?: string; extras?: string; weightBased: boolean; unitLabel: string; spicyLevel: number; prepTimeMins: number;
}) {
  if (!(await requireAdmin())) throw new Error("Forbidden");
  const { id, ...rest } = data;
  const slug = slugify(data.name);
  if (id) {
    await db.product.update({ where: { id }, data: { ...rest, slug } });
    await audit("update", "Product", id, data.name);
  } else {
    const p = await db.product.create({ data: { ...rest, slug: `${slug}-${Date.now().toString(36)}` } });
    await audit("create", "Product", p.id, data.name);
  }
  revalidatePath("/admin/products");
}

export async function adjustStock(productId: string, delta: number) {
  if (!(await requireAdmin())) throw new Error("Forbidden");
  await db.product.update({ where: { id: productId }, data: { stock: { increment: delta } } });
  await audit("adjust-stock", "Product", productId, String(delta));
  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  if (!(await requireAdmin())) throw new Error("Forbidden");
  await db.product.update({ where: { id }, data: { isActive: false } });
  await audit("deactivate", "Product", id);
  revalidatePath("/admin/products");
}

export async function upsertCategory(data: { id?: string; name: string; description?: string; sortOrder: number }) {
  if (!(await requireAdmin())) throw new Error("Forbidden");
  const slug = slugify(data.name);
  if (data.id) await db.category.update({ where: { id: data.id }, data: { ...data, slug } });
  else await db.category.create({ data: { ...data, slug: `${slug}-${Date.now().toString(36)}` } });
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  if (!(await requireAdmin())) throw new Error("Forbidden");
  const count = await db.product.count({ where: { categoryId: id } });
  if (count > 0) throw new Error("Category has products");
  await db.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

export async function upsertCoupon(data: {
  id?: string; code: string; description?: string; percentOff?: number; amountOff?: number;
  minOrder: number; maxUses?: number; expiresAt?: string; isActive: boolean; freeDelivery: boolean;
}) {
  if (!(await requireAdmin())) throw new Error("Forbidden");
  const payload = {
    code: data.code.toUpperCase(), description: data.description,
    percentOff: data.percentOff || null, amountOff: data.amountOff || null,
    minOrder: data.minOrder, maxUses: data.maxUses || null,
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    isActive: data.isActive, freeDelivery: data.freeDelivery,
  };
  if (data.id) await db.coupon.update({ where: { id: data.id }, data: payload });
  else await db.coupon.create({ data: payload });
  await audit("upsert", "Coupon", data.id, data.code);
  revalidatePath("/admin/coupons");
}

export async function upsertZone(data: { id?: string; name: string; postalCodes: string; fee: number; minOrder: number; etaMinutes: number; isActive: boolean }) {
  if (!(await requireAdmin())) throw new Error("Forbidden");
  if (data.id) await db.deliveryZone.update({ where: { id: data.id }, data });
  else await db.deliveryZone.create({ data });
  revalidatePath("/admin/delivery");
}

export async function deleteZone(id: string) {
  if (!(await requireAdmin())) throw new Error("Forbidden");
  await db.deliveryZone.delete({ where: { id } });
  revalidatePath("/admin/delivery");
}

export async function saveSettings(entries: Record<string, string>) {
  if (!(await requireAdmin())) throw new Error("Forbidden");
  for (const [k, v] of Object.entries(entries)) await setSetting(k, v);
  await audit("update", "Setting", undefined, Object.keys(entries).join(","));
  revalidatePath("/admin/settings");
}

export async function setUserRole(userId: string, role: "CUSTOMER" | "STAFF" | "MANAGER" | "ADMIN") {
  const actor = await requireAdmin();
  if (actor?.role !== "ADMIN") throw new Error("Only admins can change roles");
  await db.user.update({ where: { id: userId }, data: { role } });
  await audit("set-role", "User", userId, role);
  revalidatePath("/admin/customers");
}

export async function resolveSupport(id: string) {
  if (!(await requireAdmin())) throw new Error("Forbidden");
  await db.supportMessage.update({ where: { id }, data: { resolved: true } });
  revalidatePath("/admin/support");
}

export async function updateReservationStatus(input: { id: string; status: string; currentStatus: string; guestContacted: boolean }) {
  const actor = await requireAdmin();
  if (!actor) throw new Error("Forbidden");
  const data = z.object({ id: z.string().cuid(), status: z.enum(RESERVATION_STATUSES), currentStatus: z.enum(RESERVATION_STATUSES), guestContacted: z.boolean() }).parse(input);
  if (data.status !== "PENDING" && !data.guestContacted) throw new Error("Contact the guest before changing the request status.");
  await db.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUniqueOrThrow({ where: { id: data.id } });
    if (data.status === "CONFIRMED" && reservation.requestedAt <= new Date()) throw new Error("A past reservation cannot be confirmed.");
    const updated = await tx.reservation.updateMany({ where: { id: data.id, status: data.currentStatus }, data: { status: data.status } });
    if (!updated.count) throw new Error("This request changed. Refresh before updating it.");
    await tx.auditLog.create({ data: { actorId: actor.id, actorName: actor.name, action: "update-status", entity: "Reservation", entityId: data.id, detail: `${data.currentStatus} to ${data.status}; guest contacted: ${data.guestContacted}` } });
  });
  revalidatePath("/admin/reservations");
}
