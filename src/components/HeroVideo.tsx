"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const VIDEO = "/seafood-bbq.mp4";
const POSTER = "/seafood-bbq-poster.jpg";

export default function HeroVideo() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => {
      const autoplay = !motion.matches && !connection?.saveData;
      setEnabled(autoplay);
    };
    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);

  return (
    <>
      <Image src={POSTER} alt="Seafood grilling over flames with lemon and fresh herbs" fill priority sizes="100vw" className="object-cover" />
      {enabled && !failed && <video
        className={`hero-background-video ${ready ? "is-ready" : ""}`}
        src={VIDEO}
        poster={POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setReady(true)}
        onError={() => setFailed(true)}
      />}
    </>
  );
}
