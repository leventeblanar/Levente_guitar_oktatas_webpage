import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const SOURCES = [
  `${import.meta.env.BASE_URL}ai1.mp4`,
  `${import.meta.env.BASE_URL}ai2.mp4`,
  `${import.meta.env.BASE_URL}ai3.mp4`,
  `${import.meta.env.BASE_URL}ai4.mp4`,
  `${import.meta.env.BASE_URL}ai5.mp4`,
];

function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [i, setI] = useState(0);

  const next = () => setI((p) => (p + 1) % SOURCES.length);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handleEnded = () => next();
    v.addEventListener("ended", handleEnded);

    v.src = SOURCES[i];
    v.load();
    const t = setTimeout(() => {
      v.play().catch(() => {});
    }, 0);

    return () => {
      clearTimeout(t);
      v.removeEventListener("ended", handleEnded);
    };
  }, [i]);

  return (
    <div className="video-bg-wrapper">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        loop={false}
        preload="auto"
        className="bg-video"
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BackgroundVideo />
    <App />
  </React.StrictMode>
);
