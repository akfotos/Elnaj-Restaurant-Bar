import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { RESERVATION_STATUSES, RESERVATION_TIME_ZONE } from "@/lib/format";
import ReservationActions from "@/components/admin/ReservationActions";

export const dynamic = "force-dynamic";

export default async function ReservationsAdmin({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!(await requireAdmin())) redirect("/admin/login");
  const sp = await searchParams;
  const status = sp.status === "all" ? undefined : RESERVATION_STATUSES.find((value) => value === sp.status) ?? "PENDING";
  const total = await db.reservation.count({ where: { status } });
  const pages = Math.max(1, Math.ceil(total / 20));
  const requestedPage = typeof sp.page === "string" ? Number(sp.page) : 1;
  const page = Number.isInteger(requestedPage) ? Math.max(1, Math.min(pages, requestedPage)) : 1;
  const reservations = await db.reservation.findMany({ where: { status }, orderBy: [{ requestedAt: "asc" }, { createdAt: "asc" }], skip: (page - 1) * 20, take: 20 });
  const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: RESERVATION_TIME_ZONE });
  const pageHref = (value: number) => `/admin/reservations?status=${status ?? "all"}&page=${value}`;

  return (
    <div>
      <h1 className="text-2xl font-bold">Reservations</h1>
      <p className="text-sm text-stone-500 mt-2 max-w-2xl">Requests are not guaranteed bookings. Check availability and contact the guest by phone or email before confirming, declining or cancelling. Status changes do not send automatic messages. All visit times are Accra local time (GMT).</p>
      <nav aria-label="Reservation status" className="flex flex-wrap gap-2 my-6">{[...RESERVATION_STATUSES, "all"].map((value) => <Link key={value} href={`/admin/reservations?status=${value}`} aria-current={(status ?? "all") === value ? "page" : undefined} className={`text-xs rounded-full border px-3 py-2 ${(status ?? "all") === value ? "border-brand-500 text-brand-500" : "border-white/10 text-stone-500"}`}>{value === "all" ? "All requests" : value.charAt(0) + value.slice(1).toLowerCase()}</Link>)}</nav>
      <p className="text-xs text-stone-500 mb-4">{total} request{total === 1 ? "" : "s"} · Page {page} of {pages}</p>
      <div className="grid xl:grid-cols-2 gap-5">{reservations.map((reservation) => (
        <article key={reservation.id} className="bg-ink-800 border border-white/10 rounded-xl p-5 min-w-0">
          <div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold">{reservation.name}</h2><p className="text-sm text-stone-500 mt-1">{dateFormat.format(reservation.requestedAt)} GMT · {reservation.guests} guests</p></div><span className="text-xs text-brand-500">{reservation.status}</span></div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm"><a href={`mailto:${reservation.email}`} className="text-stone-400 underline break-all">{reservation.email}</a><a href={`tel:${reservation.phone.replace(/[^\d+]/g, "")}`} className="text-stone-400 underline">{reservation.phone}</a></div>
          {reservation.notes && <p className="text-sm text-stone-500 mt-4 whitespace-pre-wrap break-words">{reservation.notes}</p>}
          <p className="text-xs text-stone-500 mt-4 break-all">Reference: {reservation.id}</p>
          <ReservationActions key={`${reservation.id}-${reservation.status}`} id={reservation.id} currentStatus={reservation.status} isPast={reservation.requestedAt.getTime() <= Date.now()} />
        </article>
      ))}</div>
      {!reservations.length && <p className="text-sm text-stone-500 py-10">No requests in this view.</p>}
      {pages > 1 && <nav aria-label="Reservation pages" className="flex gap-6 mt-6 text-sm">{page > 1 && <Link href={pageHref(page - 1)} className="text-brand-500">← Previous</Link>}{page < pages && <Link href={pageHref(page + 1)} className="text-brand-500">Next →</Link>}</nav>}
    </div>
  );
}
