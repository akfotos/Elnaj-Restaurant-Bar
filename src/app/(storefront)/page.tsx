import Link from "next/link";
import HeroVideo from "@/components/HeroVideo";
import Reveal from "@/components/Reveal";

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
          <div className="dining-actions"><Link href="/reservation" className="dining-button dining-button-light">Book a table <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>

      <section className="dining-intro dining-container">
        <Reveal><h2>Rooted in flavour.<br /><em>Made to be enjoyed.</em></h2></Reveal>
        <Reveal><p className="dining-copy">From a familiar favourite to something new, find your next good meal at Elnaj. Order for delivery or pickup, and enjoy it your way.</p></Reveal>
        <Reveal><Link href="/about" className="dining-text-link">About Elnaj <span aria-hidden="true">↗</span></Link></Reveal>
      </section>

    </div>
  );
}
