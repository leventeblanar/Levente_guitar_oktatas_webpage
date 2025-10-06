import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.8;
    }
  }, []);

  return (
    <div className="video-bg-wrapper">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="bg-video"
      >
        <source src="/home-vid.mp4" type="video/mp4" />
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
