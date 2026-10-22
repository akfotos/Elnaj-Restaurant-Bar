import Link from "next/link";
import HeroVideo from "@/components/HeroVideo";
import Reveal from "@/components/Reveal";
import { diningAreas } from "@/lib/dining-areas";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="elnaj-home">
      <section className="dining-hero" aria-labelledby="hero-title">
        <HeroVideo />
        <div className="hero-shade" />
        <div className="hero-content animate-fade-up">
          <p className="dining-eyebrow">Elnaj Restaurant &amp; Bar</p>
          <h1 id="hero-title">Good food.<br /><em>Great company.</em></h1>
          <p className="hero-description">Local favourites. Bold grills. Something worth sipping.</p>
          <div className="dining-actions">
            <Link href="/reservation" className="dining-button dining-button-light">Book a table <span aria-hidden="true">↗</span></Link>
            <Link href="/track" className="dining-button dining-button-outline">Track order <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="dining-intro dining-container" aria-labelledby="welcome-title">
        <Reveal><p className="dining-eyebrow">Welcome to ELNAJ</p><h2 id="welcome-title">Where exceptional dining meets<br /><em>unforgettable experiences.</em></h2></Reveal>
        <Reveal><p className="dining-copy">Discover ELNAJ, a vibrant restaurant, bar and entertainment destination in the heart of Accra, Ghana, where delicious cuisine, refreshing cocktails and warm hospitality come together.</p></Reveal>
        <Reveal><p className="dining-copy">Offering a unique blend of exceptional dining, stylish ambience and lively entertainment, ELNAJ provides the perfect setting for every occasion. Whether you’re enjoying a casual meal, catching up with friends, celebrating a special moment or experiencing Accra’s nightlife, there’s something for everyone at ELNAJ.</p></Reveal>
        <Reveal><p className="dining-copy">From intimate dinners to private celebrations and unforgettable nights, experience great food, great music and memorable moments at ELNAJ — where every visit is an experience worth sharing.</p></Reveal>
        <Reveal><Link href="/reservation" className="dining-button dining-button-burgundy">Reserve a table <span aria-hidden="true">↗</span></Link></Reveal>
      </section>

      <section className="dining-container pb-24 md:pb-36" aria-labelledby="booking-title">
        <Reveal className="mb-12 max-w-xl">
          <p className="dining-eyebrow mb-4">Your next visit</p>
          <h2 id="booking-title">A table for <em>your occasion.</em></h2>
          <p className="dining-copy mt-6">Choose your preferred setting. Our team will be in touch to discuss availability and confirm your request.</p>
        </Reveal>
        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          {diningAreas.map((area, index) => (
            <Reveal key={area.id} delay={index * 80} className="border-t border-black/10 pt-8">
              <h3 className="font-serif text-3xl tracking-tight">{area.name}</h3>
              <p className="dining-copy mt-5 mb-8">{area.description}</p>
              <Link href={`/reservation?area=${area.id}#reservation-form`} className="dining-text-link" aria-label={`Request a table — ${area.name}`}>Book a table <span aria-hidden="true">↗</span></Link>
              {area.id === "private" && <div className="mt-6"><Link href="/events" className="dining-text-link">Private hire &amp; events <span aria-hidden="true">↗</span></Link></div>}
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
