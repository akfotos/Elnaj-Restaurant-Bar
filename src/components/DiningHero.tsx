import Image from "next/image";
import Link from "next/link";

export default function DiningHero({ eyebrow, title, accent, description, image, imageAlt }: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  image: string;
  imageAlt: string;
}) {
  return (
    <section className="dining-page-hero">
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
      <div className="hero-shade" />
      <div className="dining-page-hero-content animate-fade-up">
        <Link href="/" className="dining-breadcrumb">Elnaj Restaurant &amp; Bar <span aria-hidden="true">/</span> {eyebrow}</Link>
        <h1>{title}<br /><em>{accent}</em></h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
