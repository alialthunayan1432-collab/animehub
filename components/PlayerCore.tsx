"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

import { MediaPlayer, MediaProvider, useMediaState } from "@vidstack/react";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";
import { useEffect, useRef } from "react";
import { useProgress } from "./ProgressContext";

function ProgressTracker({
  animeId,
  animeTitle,
  animeImage,
  episode,
}: {
  animeId: string;
  animeTitle: string;
  animeImage: string;
  episode: number;
}) {
  const { saveProgress } = useProgress();
  const currentTime = useMediaState("currentTime");
  const duration = useMediaState("duration");
  const lastSaveRef = useRef(0);

  useEffect(() => {
    if (!duration || duration === 0) return;
    if (!currentTime || currentTime < 3) return;

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
  }, [currentTime, duration, animeId, animeTitle, animeImage, episode, saveProgress]);

  return null;
}

export default function PlayerCore({
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
  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
      <MediaPlayer
        title={title || "Video"}
        src={src}
        poster={poster}
        playsInline
        className="w-full h-full"
        storage={`anime-${animeId}-ep-${episode}`}
      >
        <MediaProvider />
        <ProgressTracker
          animeId={animeId}
          animeTitle={animeTitle}
          animeImage={animeImage}
          episode={episode}
        />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  );
}