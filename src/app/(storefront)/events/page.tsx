import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Private Hire & Events",
  description: "Celebrate at ELNAJ in Accra. Explore private venue hire for up to 50 seated or 65 standing guests, and outdoor events for up to 100 seated guests.",
};

const spaces = [
  { name: "The Private Venue", capacity: "Up to 50 seated guests · Up to 65 standing guests", description: "Suitable for private dining, birthdays, corporate events and evening celebrations.", detail: "Food, drinks and entertainment options available." },
  { name: "The Outdoor Space", capacity: "Up to 100 seated guests", description: "Ideal for outdoor dining, birthdays, engagements, naming ceremonies, bridal showers and corporate celebrations.", detail: "Customisable menus and event arrangements." },
];

export default function EventsPage() {
  return (
    <div className="dining-editorial">
      <header className="dining-container py-24 md:py-36">
        <Reveal className="max-w-3xl">
          <p className="dining-eyebrow mb-6">ELNAJ · Private Hire &amp; Events Brochure</p>
          <h1 className="text-5xl leading-tight md:text-7xl">Dine. Drink. Dance.<br /><em>Celebrate.</em></h1>
          <p className="dining-copy mt-8 max-w-xl">Where unforgettable celebrations meet exceptional hospitality.</p>
          <Link href="/support?subject=events#enquiry" className="dining-button dining-button-burgundy mt-8">Enquire about your event <span aria-hidden="true">↗</span></Link>
        </Reveal>
      </header>

      <section className="dining-container pb-24 md:pb-36" aria-labelledby="welcome-title">
        <Reveal className="max-w-2xl">
          <p className="dining-eyebrow mb-4">Welcome to ELNAJ</p>
          <h2 id="welcome-title">Your occasion.<br /><em>Our hospitality.</em></h2>
          <p className="dining-copy mt-6">Located in Accra, ELNAJ brings together restaurant dining, cocktails, music and entertainment to create memorable experiences for every occasion.</p>
          <p className="dining-copy mt-4">Whether you’re planning an intimate dinner, birthday celebration, engagement, corporate gathering or outdoor event, our team will help bring your vision to life.</p>
        </Reveal>
      </section>

      <section className="dining-container pb-24 md:pb-36" aria-labelledby="spaces-title">
        <Reveal><p className="dining-eyebrow mb-4">Our event spaces</p><h2 id="spaces-title">Room to <em>celebrate.</em></h2></Reveal>
        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-20">
          {spaces.map((space, index) => (
            <Reveal key={space.name} delay={index * 80} className="border-t border-black/10 pt-8">
              <h3 className="font-serif text-3xl">{space.name}</h3>
              <p className="mt-4 text-sm text-brand-500">{space.capacity}</p>
              <p className="dining-copy mt-6">{space.description}</p>
              <p className="dining-copy mt-4">{space.detail}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="dining-container pb-24 md:pb-36" aria-labelledby="personalise-title">
        <Reveal className="max-w-3xl">
          <p className="dining-eyebrow mb-4">Personalise your celebration</p>
          <h2 id="personalise-title">Make it <em>your own.</em></h2>
          <p className="dining-copy mt-6">Ask our team about:</p>
          <ul className="mt-6 grid gap-x-12 gap-y-4 text-sm text-stone-600 sm:grid-cols-2">
            {["DJ and entertainment arrangements", "Birthday presentations", "Event decoration", "Welcome drinks", "Cocktail packages", "Photography and videography", "Customised dining menus"].map((service) => <li key={service} className="border-b border-black/10 pb-4">{service}</li>)}
          </ul>
          <p className="dining-copy mt-8">Additional services are subject to availability and separate quotation.</p>
        </Reveal>
      </section>

      <section className="dining-container pb-24 md:pb-36" aria-labelledby="event-enquiry-title">
        <Reveal className="max-w-2xl border-t border-black/10 pt-12">
          <p className="dining-eyebrow mb-4">Let’s create something special</p>
          <h2 id="event-enquiry-title">Your celebration <em>deserves ELNAJ.</em></h2>
          <p className="dining-copy mt-6">Contact our events team to discuss your date, guest numbers, preferred space and budget.</p>
          <Link href="/support?subject=events#enquiry" className="dining-button dining-button-burgundy mt-8">Enquire about your event <span aria-hidden="true">↗</span></Link>
          <p className="dining-copy mt-8 text-xs">All prices are indicative starting rates. Final inclusions, booking conditions and quotations are confirmed in writing. Sending an enquiry does not confirm a booking.</p>
        </Reveal>
      </section>
    </div>
  );
}
