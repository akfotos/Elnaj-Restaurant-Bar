import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

export default function PageIntro({ eyebrow, title, description, children, className = "" }: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal as="header" className={`page-intro ${className}`}>
      <p className="page-intro-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-intro-description">{description}</p>
      {children}
    </Reveal>
  );
}
