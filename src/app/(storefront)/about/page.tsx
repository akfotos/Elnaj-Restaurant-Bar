import Image from "next/image";
import Link from "next/link";
import DiningHero from "@/components/DiningHero";
import DiningInvitation from "@/components/DiningInvitation";
import Reveal from "@/components/Reveal";

export const metadata = { title: "About Elnaj | Restaurant & Bar", description: "Discover Elnaj’s world of local favourites, flame-grilled dishes and signature drinks." };

export default function AboutPage() {
  return (
    <div className="dining-editorial">
      <DiningHero eyebrow="Our story" title="More than a meal." accent="An Elnaj moment." description="Local favourites, bold flavours and the pleasure of coming together over good food." image="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=85" imageAlt="A generous spread of grilled food and fresh accompaniments" />
      <section className="dining-container about-story">
        <div className="about-story-image"><Image src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1000&q=85" alt="Golden samosas served with a dipping sauce" fill sizes="(max-width: 700px) 100vw, 45vw" className="object-cover" /></div>
        <Reveal><div><p className="dining-eyebrow">The Elnaj way</p><h2>Familiar favourites.<br /><em>A fresh sense of occasion.</em></h2><p className="dining-copy">Some meals are about discovering something new. Others are about returning to the flavours you love. Our menu makes room for both: local favourites, flame-grilled mains, small chops and drinks to bring it all together.</p><p className="dining-copy">Whether you’re choosing a quick bite, putting together a spread to share, or settling on a sweet finish, make the moment your own. Explore the menu and enjoy Elnaj with delivery or pickup.</p><Link href="/menu" className="dining-text-link">Discover the menu <span aria-hidden="true">↗</span></Link></div></Reveal>
      </section>
      <section className="about-values"><div className="dining-container"><p className="dining-eyebrow">A few things to savour</p><h2>Find your reason <em>to return.</em></h2><div className="journey-grid">
        {[
          { title: "Flavours that feel like home", text: "Explore local favourites alongside grills and mains, with ingredients and dietary information on individual dishes." },
          { title: "A menu for the moment", text: "Start with small chops, choose a main, add a refreshing drink and leave a little room for dessert." },
          { title: "Elnaj, wherever you are", text: "Bring your favourites to your table with delivery to supported zones, or choose pickup at checkout." },
        ].map((value, index) => <Reveal key={value.title} delay={index * 80}><div className="journey-step"><span className="journey-number">0{index + 1}</span><h3>{value.title}</h3><p className="dining-copy">{value.text}</p></div></Reveal>)}
      </div></div></section>
      <section className="dining-container about-next"><p className="dining-eyebrow">The next chapter is on your plate</p><h2>Come for the flavour.<br /><em>Find your favourite.</em></h2><div className="dining-actions"><Link href="/menu" className="dining-button dining-button-burgundy">Explore the menu <span aria-hidden="true">↗</span></Link></div></section>
      <DiningInvitation />
    </div>
  );
}
