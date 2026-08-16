"use client";

import React, { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export function VideoPlayer({ src, poster, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const handleEnded = () => setPlaying(false);

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-[32px] bg-black border border-black/10 shadow-2xl ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="absolute inset-0 h-full w-full object-contain"
        playsInline
        loop
        preload="metadata"
        onEnded={handleEnded}
      />
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute right-4 sm:right-6 bottom-4 sm:bottom-6 z-10 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#F5F547] text-black shadow-xl shadow-black/30 transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        {playing ? (
          <Pause className="h-6 w-6 sm:h-7 sm:w-7 fill-black" />
        ) : (
          <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-black translate-x-0.5" />
        )}
      </button>
    </div>
  );
}
