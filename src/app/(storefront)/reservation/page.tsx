import Link from "next/link";
import ReservationForm from "@/components/ReservationForm";
import { getSetting } from "@/lib/settings";

export const metadata = { title: "Reservations", description: "Request a table at Elnaj Restaurant & Bar. All requests are reviewed and confirmed by our team." };
export const dynamic = "force-dynamic";

export default async function ReservationPage() {
  const address = await getSetting("pickupAddress");
  return (
    <div className="dining-editorial">
      <div className="dining-container reservation-layout">
        <header><p className="dining-eyebrow">Reservations</p><h1>Good company.<br /><em>A table at Elnaj.</em></h1><p className="dining-copy">Tell us when you’d like to join us. Our team will review your request and contact you to discuss availability.</p><p className="reservation-notice"><strong>A request, not a confirmation.</strong> Please wait for staff to confirm your table before making plans around your booking. The times you enter are preferences, not live availability.</p>{address && <p className="dining-copy reservation-address">{address}</p>}<Link href="/support" className="dining-text-link">Have a question? <span aria-hidden="true">↗</span></Link></header>
        <section aria-labelledby="reservation-form-title"><h2 id="reservation-form-title" className="sr-only">Request a table</h2><ReservationForm /></section>
      </div>
    </div>
  );
}
