import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { money } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, featured, bestsellers, seasonal, deals] = await Promise.all([
    db.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { products: { where: { isActive: true }, orderBy: { name: "asc" }, take: 3 } },
    }),
    db.product.findMany({ where: { isActive: true, isFeatured: true }, take: 4, orderBy: { name: "asc" } }),
    db.product.findMany({ where: { isActive: true, isBestseller: true }, take: 4, orderBy: { name: "asc" } }),
    db.product.findMany({ where: { isActive: true, isSeasonal: true }, take: 4, orderBy: { name: "asc" } }),
    db.product.findMany({ where: { isActive: true, compareAtPrice: { not: null } }, take: 4, orderBy: { name: "asc" } }),
  ]);
  const grillImage = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=85";
  const drinksImage = "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1000&q=85";
  const menuStories = [
    { slug: "small-chops", title: "To begin", subtitle: "Small plates. Big flavours." },
    { slug: "grills", title: "From the grill", subtitle: "Fire, spice & everything nice" },
    { slug: "drinks", title: "Raise a glass", subtitle: "Something worth sipping" },
    { slug: "desserts", title: "The sweet finish", subtitle: "Save a little room" },
  ].flatMap((story) => {
    const category = categories.find((item) => item.slug === story.slug);
    return category?.products.length ? [{ ...story, category }] : [];
  });
  const barDrinks = categories.find((category) => category.slug === "drinks")?.products ?? [];

  return (
    <div className="elnaj-home">
      <section className="dining-hero" aria-labelledby="hero-title">
        <Image src={grillImage} alt="Flame-grilled skewers and a colourful spread of fresh food" fill priority sizes="100vw" className="object-cover" />
        <div className="hero-shade" />
        <div className="hero-content animate-fade-up">
          <p className="dining-eyebrow">Welcome to Elnaj Restaurant &amp; Bar</p>
          <span className="hero-ornament" aria-hidden="true">✦</span>
          <h1 id="hero-title">Good food.<br /><em>Great company.</em></h1>
          <p className="hero-description">Bold flavours. Familiar favourites. A little indulgence.<br className="hidden sm:block" /> Discover your next favourite, from our kitchen to your table.</p>
          <div className="dining-actions">
            <Link href="/menu" className="dining-button dining-button-light">Explore our menu <span aria-hidden="true">↗</span></Link>
            <Link href="/food" className="dining-button dining-button-outline">Order online <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className="hero-bottom"><span>Grills · Local favourites · Signature drinks</span><a href="#our-story">Discover Elnaj <span aria-hidden="true">↓</span></a></div>
      </section>

      <section id="our-story" className="dining-intro dining-container">
        <Reveal><p className="dining-eyebrow">A taste of something special</p></Reveal>
        <Reveal><h2>Rooted in flavour.<br /><em>Made to be enjoyed.</em></h2></Reveal>
        <Reveal><p className="dining-copy">The warmth of local favourites. The sizzle of the grill. That first sip of something refreshing. At Elnaj, we bring together bold dishes and little moments worth slowing down for.</p></Reveal>
        <Reveal><Link href="/about" className="dining-text-link">Discover the Elnaj story <span aria-hidden="true">↗</span></Link></Reveal>
      </section>

      <section className="dining-signatures">
        <div className="dining-container signature-layout">
          <Reveal><div className="signature-heading"><p className="dining-eyebrow">From the Elnaj kitchen</p><h2>Our signature<br /><em>flavours.</em></h2><p className="dining-copy">A selection of the dishes and drinks that make our menu unmistakably Elnaj.</p><Link href="/menu" className="dining-text-link">View the full menu <span aria-hidden="true">↗</span></Link></div></Reveal>
          <div className="signature-list">
            {featured.length ? featured.map((product, index) => (
              <Reveal key={product.id} delay={index * 60}>
                <Link href={`/product/${product.slug}`} className="signature-dish"><div><h3>{product.name}</h3><p>{product.description}</p></div><span>{money(product.price)}</span></Link>
              </Reveal>
            )) : <p className="dining-copy">Explore our menu to discover what’s cooking.</p>}
          </div>
        </div>
      </section>

      <section className="dining-container dining-explore">
        <Reveal><div className="dining-section-heading"><div><p className="dining-eyebrow">Whatever you’re in the mood for</p><h2>Make it <em>an Elnaj moment.</em></h2></div><Link href="/menu" className="dining-text-link">Explore all <span aria-hidden="true">↗</span></Link></div></Reveal>
        <div className="experience-grid">
          {menuStories.map((story, index) => {
            const dish = story.category.products.find((product) => product.image);
            const href = story.slug === "drinks" ? "/drinks" : `/food?category=${story.slug}`;
            return (
              <Link key={story.slug} href={href} className="experience-card group">
                {dish?.image && <Image src={dish.image} alt={dish.name} fill sizes="(max-width: 700px) 100vw, 50vw" className="object-cover img-zoom" />}
                <div className="experience-shade" />
                <span className="experience-number" aria-hidden="true">0{index + 1}</span>
                <div className="experience-caption"><p className="dining-eyebrow">{story.subtitle}</p><h3>{story.title}</h3><span className="experience-menu-link">Explore {story.category.name}</span><span className="experience-arrow" aria-hidden="true">↗</span></div>
              </Link>
            );
          })}
        </div>
        <nav className="dining-categories" aria-label="Menu categories">{categories.map((category) => <Link key={category.id} href={category.slug === "drinks" ? "/drinks" : `/food?category=${category.slug}`}>{category.name} <span aria-hidden="true">↗</span></Link>)}</nav>
      </section>

      {barDrinks.length > 0 && (
        <section className="dining-bar" aria-labelledby="bar-title">
          <div className="bar-image"><Image src={drinksImage} alt="Citrus-garnished cocktails ready to enjoy" fill sizes="(max-width: 700px) 100vw, 50vw" className="object-cover" /></div>
          <div className="bar-content">
            <Reveal>
              <p className="dining-eyebrow">The other half of a great meal</p>
              <h2 id="bar-title">A sip of<br /><em>something special.</em></h2>
              <p className="dining-copy">From refreshing coolers to signature cocktails, find the perfect companion to your favourite dish.</p>
              <div className="bar-menu">{barDrinks.map((drink) => <Link href={`/product/${drink.slug}`} key={drink.id}><span>{drink.name}</span><span>{money(drink.price)}</span></Link>)}</div>
              <Link href="/drinks" className="dining-text-link">Discover the drinks menu <span aria-hidden="true">↗</span></Link>
            </Reveal>
          </div>
        </section>
      )}

      {[
        { title: "The favourites", subtitle: "Come back for seconds", items: bestsellers },
        { title: "A little more to love", subtitle: "Deals & promotions", items: deals },
        { title: "Something for the season", subtitle: "Fresh picks", items: seasonal },
      ].map((section) => section.items.length > 0 && (
        <section key={section.title} className="dining-container dining-products"><Reveal><div className="dining-section-heading"><div><p className="dining-eyebrow">{section.subtitle}</p><h2>{section.title}</h2></div><Link href="/menu" className="dining-text-link">View all <span aria-hidden="true">↗</span></Link></div></Reveal><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{section.items.map((product, index) => <Reveal key={product.id} delay={index * 60}><ProductCard product={product} /></Reveal>)}</div></section>
      ))}

      <section className="dining-container dining-journey" aria-labelledby="journey-title">
        <Reveal><div className="dining-section-heading"><div><p className="dining-eyebrow">From our kitchen to your table</p><h2 id="journey-title">Good food. <em>Your way.</em></h2></div></div></Reveal>
        <div className="journey-grid">
          {[
            { title: "Find your flavour", text: "Explore local favourites, grills, small chops and something sweet.", href: "/menu", label: "Browse the menu" },
            { title: "Make it yours", text: "Review your basket and choose delivery or pickup at checkout.", href: "/cart", label: "Your basket" },
            { title: "We’ll take it from here", text: "Already placed an order? Follow its progress with your order number.", href: "/track", label: "Track your order" },
          ].map((step, index) => <Reveal key={step.href} delay={index * 60}><div className="journey-step"><span className="journey-number">0{index + 1}</span><h3>{step.title}</h3><p className="dining-copy">{step.text}</p><Link href={step.href} className="dining-text-link">{step.label} <span aria-hidden="true">↗</span></Link></div></Reveal>)}
        </div>
      </section>

      <section className="dining-closing"><Reveal><p className="dining-eyebrow">Your next good meal starts here</p><h2>A little taste.<br /><em>A lasting impression.</em></h2><p>Enjoy Elnaj your way. Order for delivery or pickup.</p><div className="dining-actions"><Link href="/menu" className="dining-button dining-button-light">Order from our kitchen <span aria-hidden="true">↗</span></Link><Link href="/support" className="dining-button dining-button-outline">Get in touch <span aria-hidden="true">↗</span></Link></div></Reveal></section>
    </div>
  );
}
