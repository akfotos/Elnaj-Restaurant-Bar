import Link from "next/link";
import ReservationForm from "@/components/ReservationForm";
import HeroVideo from "@/components/HeroVideo";
import { getSetting } from "@/lib/settings";
import { getDiningArea } from "@/lib/dining-areas";

export const metadata = { title: "Reservations", description: "Request a table at Elnaj Restaurant & Bar. All requests are reviewed and confirmed by our team." };
export const dynamic = "force-dynamic";

export default async function ReservationPage({ searchParams }: { searchParams: Promise<{ area?: string | string[] }> }) {
  const params = await searchParams;
  const area = getDiningArea(params.area);
  const address = await getSetting("pickupAddress");
  return (
    <div className="dining-editorial">
      <section className="dining-page-hero" aria-labelledby="reservation-hero-title">
        <HeroVideo />
        <div className="hero-shade" />
        <div className="dining-page-hero-content animate-fade-up">
          <Link href="/" className="dining-breadcrumb">Elnaj Restaurant &amp; Bar <span aria-hidden="true">/</span> Reservations</Link>
          <h1 id="reservation-hero-title">Book a table.<br /><em>Make time for Elnaj.</em></h1>
          <p>Choose your preferred date, time and party size. Send a request for our team to review and confirm with you.</p>
          <div className="dining-actions"><a href="#reservation-form" className="dining-button dining-button-light">Request a table <span aria-hidden="true">↓</span></a></div>
        </div>
      </section>
      <div className="dining-container reservation-layout">
        <header><p className="dining-eyebrow">Staff-confirmed requests</p><h2>Plan your visit.</h2><p className="dining-copy">Your contact details let staff discuss availability with you. Use the optional notes for a special occasion, accessibility needs or a question about your visit. All requested times are Accra local time (GMT).</p><p className="reservation-notice"><strong>A request, not a confirmation.</strong> Please wait for staff to confirm your table before making plans around your booking. The times you enter are preferences, not live availability.</p>{address && <p className="dining-copy reservation-address">{address}</p>}<Link href="/support" className="dining-text-link">Have a question? <span aria-hidden="true">↗</span></Link></header>
        <section id="reservation-form" tabIndex={-1} aria-labelledby="reservation-form-title" className="scroll-mt-32"><h2 id="reservation-form-title" className="sr-only">Request a table</h2><ReservationForm key={area?.id ?? "dining"} initialArea={area?.id} /></section>
      </div>
    </div>
  );
}
