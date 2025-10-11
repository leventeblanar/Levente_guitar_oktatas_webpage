import { useEffect, useRef, useState } from "react";

const FADE_MS = 800;
const LEAD_S = 0.25;

const SOURCES = [
  `${import.meta.env.BASE_URL}ai1.mp4`,
  `${import.meta.env.BASE_URL}ai2.mp4`,
  `${import.meta.env.BASE_URL}ai3.mp4`,
  `${import.meta.env.BASE_URL}ai4.mp4`,
  `${import.meta.env.BASE_URL}ai5.mp4`,
];

export default function BackgroundVideo() {
  const vA = useRef<HTMLVideoElement>(null);
  const vB = useRef<HTMLVideoElement>(null);
  const [useA, setUseA] = useState(true);
  const idxRef = useRef(0);
  const preppedRef = useRef(false);

  useEffect(() => {
    const a = vA.current!;
    a.src = SOURCES[0];
    a.preload = "auto";
    a.playbackRate = 0.8;
    a.play().catch(() => {});
    a.classList.add("is-visible");
  }, []);

  useEffect(() => {
    const active = useA ? vA.current! : vB.current!;
    const idle = useA ? vB.current! : vA.current!;

    preppedRef.current = false;

    const onTimeUpdate = () => {
      const d = active.duration;
      if (!Number.isFinite(d) || d === 0) return;
      const remain = d - active.currentTime;

      // Előkészítjük a következő klipet
      if (!preppedRef.current && remain < 1.0) {
        const nextIdx = (idxRef.current + 1) % SOURCES.length;
        idle.src = SOURCES[nextIdx];
        idle.preload = "auto";
        idle.currentTime = 0;
        idle.playbackRate = active.playbackRate;
        idle.play().catch(() => {});
        preppedRef.current = true;
      }

      // Crossfade váltás
      if (preppedRef.current && remain < LEAD_S) {
        idle.classList.add("is-visible");
        active.classList.remove("is-visible");

        setTimeout(() => {
          idxRef.current = (idxRef.current + 1) % SOURCES.length;
          setUseA(!useA);
          active.pause();
        }, FADE_MS);
      }
    };

    active.addEventListener("timeupdate", onTimeUpdate);
    return () => active.removeEventListener("timeupdate", onTimeUpdate);
  }, [useA]);

  return (
    <div className="video-bg-wrapper">
      <video
        ref={vA}
        muted
        playsInline
        preload="auto"
        className="bg-video"
        tabIndex={-1}
        aria-hidden="true"
      />
      <video
        ref={vB}
        muted
        playsInline
        preload="auto"
        className="bg-video"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
