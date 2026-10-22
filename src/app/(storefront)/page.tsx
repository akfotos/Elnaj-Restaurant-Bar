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

      <section className="dining-intro dining-container">
        <Reveal><h2>Rooted in flavour.<br /><em>Made to be enjoyed.</em></h2></Reveal>
        <Reveal><p className="dining-copy">Elnaj brings local favourites, bold grills and refreshing drinks together. Explore the menu, order for delivery or pickup, request a table, or follow an existing order — all from one place.</p></Reveal>
        <Reveal><Link href="/about" className="dining-text-link">About Elnaj <span aria-hidden="true">↗</span></Link></Reveal>
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
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
