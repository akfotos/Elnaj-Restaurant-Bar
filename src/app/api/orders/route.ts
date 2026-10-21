import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { orderNumber } from "@/lib/format";

type Item = { productId: string; variantName?: string; quantity: number; extras?: { name: string; price?: number }[] };

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fulfillment, name, email, phone, line1, line2, city, postalCode, timeSlot, notes, paymentMethod, couponCode, addressId } = body;
  const items: Item[] = body.items ?? [];

  if (!name || !email || !phone) return NextResponse.json({ error: "Name, email and phone are required" }, { status: 400 });
  if (items.length === 0) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  if (fulfillment === "DELIVERY" && !addressId && (!line1 || !city || !postalCode))
    return NextResponse.json({ error: "Delivery address is required" }, { status: 400 });

  const user = await getSessionUser();
  const settings = await getSettings();

  // resolve products & prices server-side
  const productIds = items.map((i) => i.productId);
  const products = await db.product.findMany({ where: { id: { in: productIds }, isActive: true }, include: { variants: true } });
  if (products.length !== items.length) return NextResponse.json({ error: "Some items are no longer available" }, { status: 400 });

  const orderItems = items.map((i) => {
    const p = products.find((x) => x.id === i.productId)!;
    const variant = i.variantName ? p.variants.find((v) => v.name === i.variantName) : null;
    const basePrice = variant?.price ?? p.price;
    // extras are validated against the product's configured add-ons — prices come from the DB, never the client
    const allowed: { name: string; price: number }[] = p.extras ? JSON.parse(p.extras) : [];
    const extras = (i.extras ?? [])
      .map((e) => allowed.find((a) => a.name === e.name))
      .filter((e): e is { name: string; price: number } => Boolean(e));
    const unitPrice = basePrice + extras.reduce((s, e) => s + e.price, 0);
    return { product: p, variant, extras, unitPrice, quantity: i.quantity, total: unitPrice * i.quantity };
  });

  for (const oi of orderItems) {
    const stock = oi.variant ? oi.variant.stock : oi.product.trackStock ? oi.product.stock : Infinity;
    if (stock < oi.quantity) return NextResponse.json({ error: `Insufficient stock for ${oi.product.name}` }, { status: 400 });
  }

  const subtotal = orderItems.reduce((s, i) => s + i.total, 0);

  // delivery zone & fee
  let deliveryFee = 0;
  let deliveryZoneId: string | undefined;
  if (fulfillment === "DELIVERY") {
    const zones = await db.deliveryZone.findMany({ where: { isActive: true } });
    const zone = zones.find((z) => z.postalCodes.split(",").map((s) => s.trim()).some((p) => postalCode?.startsWith(p)));
    if (zone) {
      deliveryZoneId = zone.id;
      deliveryFee = zone.fee;
      if (subtotal < zone.minOrder)
        return NextResponse.json({ error: `Minimum order for ${zone.name} is GHS ${zone.minOrder}` }, { status: 400 });
    }
  }

  // coupon
  let discount = 0;
  let couponId: string | undefined;
  if (couponCode) {
    const coupon = await db.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
    if (!coupon || !coupon.isActive) return NextResponse.json({ error: "Invalid promo code" }, { status: 400 });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return NextResponse.json({ error: "Promo code expired" }, { status: 400 });
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return NextResponse.json({ error: "Promo code exhausted" }, { status: 400 });
    if (subtotal < coupon.minOrder) return NextResponse.json({ error: `Minimum order for this code is GHS ${coupon.minOrder}` }, { status: 400 });
    discount = coupon.percentOff ? subtotal * (coupon.percentOff / 100) : Math.min(coupon.amountOff ?? 0, subtotal);
    if (coupon.freeDelivery) deliveryFee = 0;
    couponId = coupon.id;
  }

  const tax = (subtotal - discount) * (+(settings.taxRate ?? 0) / 100);
  const total = subtotal - discount + deliveryFee + tax;

  const addressSnapshot = fulfillment === "DELIVERY" ? JSON.stringify({ line1, line2, city, postalCode }) : null;

  const order = await db.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber: orderNumber(),
        userId: user?.id,
        guestEmail: user ? undefined : email,
        guestName: user ? undefined : name,
        guestPhone: phone,
        fulfillment,
        addressId: addressId || undefined,
        addressSnapshot,
        deliveryZoneId,
        timeSlot,
        notes,
        subtotal,
        deliveryFee,
        discount,
        tax,
        total,
        couponId,
        paymentMethod,
        status: "PENDING",
        items: {
          create: orderItems.map((oi) => ({
            productId: oi.product.id,
            variantName: oi.variant?.name,
            extras: oi.extras.length ? JSON.stringify(oi.extras) : null,
            nameSnapshot:
              oi.product.name +
              (oi.variant ? ` (${oi.variant.name})` : "") +
              (oi.extras.length ? ` + ${oi.extras.map((e) => e.name).join(", ")}` : ""),
            unitPrice: oi.unitPrice,
            quantity: oi.quantity,
            total: oi.total,
          })),
        },
        statusHistory: { create: { status: "PENDING", note: "Order placed" } },
      },
    });
    // decrement stock
    for (const oi of orderItems) {
      if (oi.variant) await tx.productVariant.update({ where: { id: oi.variant.id }, data: { stock: { decrement: Math.ceil(oi.quantity) } } });
      else if (oi.product.trackStock) await tx.product.update({ where: { id: oi.product.id }, data: { stock: { decrement: Math.ceil(oi.quantity) } } });
    }
    if (couponId) await tx.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } });
    return created;
  });

  return NextResponse.json({ orderNumber: order.orderNumber, id: order.id });
}
