"use client";

import { useEffect, useRef } from "react";
import { useProgress } from "./ProgressContext";

export default function VideoPlayer({
  src,
  poster,
  title,
  animeId,
  animeTitle,
  animeImage,
  episode,
}: {
  src: string;
  poster?: string;
  title?: string;
  animeId: string;
  animeTitle: string;
  animeImage: string;
  episode: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { saveProgress } = useProgress();
  const lastSaveRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;

      if (!duration || duration === 0) return;
      if (currentTime < 3) return;

      const now = Date.now();
      if (now - lastSaveRef.current < 5000) return;
      lastSaveRef.current = now;

      saveProgress({
        animeId,
        animeTitle,
        animeImage,
        episode,
        currentTime,
        duration,
        updatedAt: now,
      });
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [animeId, animeTitle, animeImage, episode, saveProgress]);

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        className="w-full h-full"
        src={src}
        poster={poster}
        controls
        playsInline
      />
    </div>
  );
}