import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const SOURCES = ["/ai1.mp4", "/ai5.mp4", "/ai2.mp4", "/ai3.mp4", "/ai4.mp4",]

function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [i, setI] = useState(0);

  const next = () => setI((p) => (p + 1) % SOURCES.length);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => next();
    video.addEventListener("ended", handleEnded);

    video.src = SOURCES[i];
    video.load();
    video.play().catch(() => {});

    return () => video.removeEventListener("ended", handleEnded);
  }, [i]);

  return (
    <div className="video-bg-wrapper">
      <video
        ref={videoRef}
        autoPlay
        loop={false}
        muted
        playsInline
        className="bg-video"
      >
        <source src="/ai1.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BackgroundVideo />
    <App />
  </React.StrictMode>
);
