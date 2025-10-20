import { useEffect, useRef, useState } from "react";

const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const isCoarse =
  typeof window !== "undefined" &&
  window.matchMedia?.("(pointer: coarse)").matches;

const FADE_MS = prefersReduced || isCoarse ? 0 : 800;
const LEAD_S  = prefersReduced || isCoarse ? 0.0 : 0.25;

const VER = "v=20251011";

const SOURCES = [
  `${import.meta.env.BASE_URL}ai1.mp4?${VER}`,
  `${import.meta.env.BASE_URL}ai2.mp4?${VER}`,
  `${import.meta.env.BASE_URL}ai3.mp4?${VER}`,
  `${import.meta.env.BASE_URL}ai4.mp4?${VER}`,
  `${import.meta.env.BASE_URL}ai5.mp4?${VER}`,
];

const FALLBACK = `${import.meta.env.BASE_URL}home.jpg`;

export default function BackgroundVideo() {
  const vA = useRef<HTMLVideoElement>(null);
  const vB = useRef<HTMLVideoElement>(null);
  const [useA, setUseA] = useState(true);
  const idx = useRef(0);
  const prepped = useRef(false);
  const [needsUnlock, setNeedsUnlock] = useState(false);
  const [fallbackActive, setFallbackActive] = useState(true);
  const fallbackRef = useRef(true);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fallbackRef.current = fallbackActive;
  }, [fallbackActive]);

  const cancelScheduledUnlock = () => {
    if (unlockTimer.current) {
      clearTimeout(unlockTimer.current);
      unlockTimer.current = null;
    }
  };

  const scheduleUnlockCheck = (video: HTMLVideoElement) => {
    cancelScheduledUnlock();
    unlockTimer.current = setTimeout(() => {
      if (video.paused || video.readyState < 2) {
        setNeedsUnlock(true);
      }
    }, 600);
  };

  const tryPlay = async (v: HTMLVideoElement) => {
    try {
      v.muted = true;
      (v as any).playsInline = true;
      (v as any).webkitPlaysInline = true;
      v.autoplay = true as any;
      v.controls = false;
      v.disablePictureInPicture = true as any;

      const p = v.play();
      if (p && typeof p.then === "function") await p;

      const started = !v.paused && v.readyState >= 2;
      if (started) {
        if (fallbackRef.current) setFallbackActive(false);
        if (v.hasAttribute("poster")) v.removeAttribute("poster");
        cancelScheduledUnlock();
        setNeedsUnlock(false);
      }
      if (!started) scheduleUnlockCheck(v);
      return started;
    } catch {
      scheduleUnlockCheck(v);
      return false;
    }
  };

  useEffect(() => {
    const a = vA.current!;
    a.src = SOURCES[0];
    a.preload = "auto";
    a.poster = FALLBACK;
    a.classList.add("is-visible");

    const start = async () => {
      const ok = await tryPlay(a);
      if (!ok) setNeedsUnlock(true);
    };
    start();

    const onceUnlock = async () => {
      const okA = await tryPlay(a);
      const okB = vB.current ? await tryPlay(vB.current) : false;
      if (okA || okB) setNeedsUnlock(false);
      document.removeEventListener("pointerdown", onceUnlock);
      document.removeEventListener("touchstart", onceUnlock);
    };
    document.addEventListener("pointerdown", onceUnlock, { once: true, passive: true });
    document.addEventListener("touchstart", onceUnlock, { once: true, passive: true });

    return () => {
      document.removeEventListener("pointerdown", onceUnlock);
      document.removeEventListener("touchstart", onceUnlock);
    };
  }, []);

  useEffect(() => {
    if (FADE_MS === 0) return;

    const active = useA ? vA.current! : vB.current!;
    const idle   = useA ? vB.current! : vA.current!;

    prepped.current = false;

    const onTimeUpdate = async () => {
      const d = active.duration;
      if (!Number.isFinite(d) || d === 0) return;
      const remain = d - active.currentTime;

      if (!prepped.current && remain < 1.0) {
        const next = (idx.current + 1) % SOURCES.length;
        idle.src = SOURCES[next];
        idle.preload = "auto";
        idle.currentTime = 0;
        if (fallbackRef.current) {
          idle.poster = FALLBACK;
        } else if (idle.hasAttribute("poster")) {
          idle.removeAttribute("poster");
        }

        await tryPlay(idle);

        prepped.current = true;
      }

      if (prepped.current && remain < LEAD_S) {
        idle.classList.add("is-visible");
        active.classList.remove("is-visible");

        setTimeout(() => {
          idx.current = (idx.current + 1) % SOURCES.length;
          setUseA(!useA);
          active.pause();
        }, FADE_MS);
      }
    };

    active.addEventListener("timeupdate", onTimeUpdate);
    return () => active.removeEventListener("timeupdate", onTimeUpdate);
  }, [useA]);

  useEffect(() => {
    if (FADE_MS !== 0) return;
    const v = vA.current!;
    v.loop = false;

    const onEnded = async () => {
      idx.current = (idx.current + 1) % SOURCES.length;
      v.src = SOURCES[idx.current];
      v.load();
      await tryPlay(v);
    };

    v.addEventListener("ended", onEnded);
    return () => v.removeEventListener("ended", onEnded);
  }, []);

  const unlock = async () => {
    const A = vA.current!, B = vB.current!;
    cancelScheduledUnlock();
    const okA = await tryPlay(A);
    const okB = await tryPlay(B);
    if (okA || okB) setNeedsUnlock(false);
  };

  return (
    <>
      <div
        className="video-bg-wrapper"
        style={{
          backgroundImage: fallbackActive ? `url(${FALLBACK})` : "none",
          backgroundColor: fallbackActive ? "#050608" : "transparent",
        }}
      >
        <video
          ref={vA}
          className="bg-video"
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          aria-hidden="true"
          poster={fallbackActive ? FALLBACK : undefined}
        />
        <video
          ref={vB}
          className="bg-video"
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          aria-hidden="true"
          poster={fallbackActive ? FALLBACK : undefined}
        />
      </div>

      {needsUnlock && (
        <button className="bg-unlock" onClick={unlock}>
          Enable motion
        </button>
      )}
    </>
  );
}
