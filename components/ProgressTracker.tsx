"use client";

import { useEffect, useRef } from "react";
import { useProgress } from "./ProgressContext";

export default function ProgressTracker({
  animeId,
  animeTitle,
  animeImage,
  episode,
  videoRef,
}: {
  animeId: string;
  animeTitle: string;
  animeImage: string;
  episode: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
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
      // نحفظ كل 5 ثواني عشان الأداء
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

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoRef, animeId, animeTitle, animeImage, episode, saveProgress]);

  return null;
}