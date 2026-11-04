"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const VIDEO = "/seafood-bbq.mp4";
const POSTER = "/seafood-bbq-poster.jpg";

export default function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => {
      const autoplay = !motion.matches && !connection?.saveData;
      setEnabled(autoplay);
      if (!autoplay) setPlaying(false);
    };
    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);

  return (
    <>
      <Image src={POSTER} alt="Seafood grilling over flames with lemon and fresh herbs" fill priority sizes="100vw" className="object-cover" />
      {enabled && !failed && <video
        ref={video}
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
        onPlaying={() => { setPlaying(true); setReady(true); }}
        onPause={() => setPlaying(false)}
        onError={() => { setFailed(true); setPlaying(false); }}
      />}
      {!failed && <button
        type="button"
        className="hero-video-control"
        aria-label={playing ? "Pause background video" : "Play background video"}
        onClick={() => {
          if (!enabled) {
            setEnabled(true);
          } else if (playing) {
            video.current?.pause();
          } else {
            void video.current?.play().catch(() => setPlaying(false));
          }
        }}
      >
        <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" aria-hidden="true">{playing ? <path d="M5 4h3v12H5zm7 0h3v12h-3z" /> : <path d="m6 3 10 7-10 7z" />}</svg>
        {playing ? "Pause video" : "Play video"}
      </button>}
    </>
  );
}
