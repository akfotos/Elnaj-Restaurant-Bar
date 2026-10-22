import type { FulfillmentType, OrderStatus } from "@prisma/client";

export const ORDER_TRACKING_STEPS: OrderStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED"];

export function getOrderTrackingLabel(status: OrderStatus, fulfillment: FulfillmentType) {
  return {
    PENDING: "Awaiting confirmation",
    CONFIRMED: "Confirmed by the restaurant",
    PREPARING: "In the kitchen",
    READY: fulfillment === "PICKUP" ? "Ready for collection" : "Ready for delivery",
    OUT_FOR_DELIVERY: "Out for delivery",
    DELIVERED: fulfillment === "PICKUP" ? "Collected" : "Delivered",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  }[status];
}

export function getOrderTrackingIndex(status: OrderStatus) {
  return status === "COMPLETED" ? ORDER_TRACKING_STEPS.length - 1 : ORDER_TRACKING_STEPS.indexOf(status);
}

export function getOrderContent(status: OrderStatus, fulfillment: FulfillmentType) {
  return {
    PENDING: { title: "Order received.", description: "Your order is recorded and awaiting the restaurant’s confirmation. Keep your reference and use tracking to follow the next steps." },
    CONFIRMED: { title: "Your order is confirmed.", description: "The restaurant has confirmed your order. Track its progress as the team prepares your meal." },
    PREPARING: { title: "In the kitchen.", description: "Our team is preparing your meal. Keep your order reference handy for updates or questions." },
    READY: { title: "Your food is ready.", description: fulfillment === "PICKUP" ? "Your order is marked ready for collection. Have your order number available when you arrive." : "Your meal is ready. Check tracking for the next delivery update." },
    OUT_FOR_DELIVERY: { title: "On its way.", description: "Your order is marked out for delivery. Keep your phone available in case the team needs to contact you." },
    DELIVERED: { title: "Delivered. Enjoy your meal.", description: "Your order is marked delivered. If anything needs attention, contact our team with your order number." },
    COMPLETED: { title: "Thank you for choosing Elnaj.", description: "Your order is complete. Your order details remain below for reference or any follow-up questions." },
    CANCELLED: { title: "This order was cancelled.", description: "Contact our team with your order number if you need to discuss the cancellation or any payment arrangements." },
  }[status];
}
