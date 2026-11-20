"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export type WatchProgress = {
  animeId: string;
  animeTitle: string;
  animeImage: string;
  episode: number;
  currentTime: number;
  duration: number;
  updatedAt: number;
};

type ProgressContextType = {
  progress: WatchProgress[];
  saveProgress: (data: WatchProgress) => Promise<void>;
  removeProgress: (animeId: string) => Promise<void>;
  getProgress: (animeId: string) => WatchProgress | undefined;
  loading: boolean;
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<WatchProgress[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!user) {
      setProgress([]);
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      setLoading(true);
      console.log("Fetching progress for user:", user.id);

      const { data, error } = await supabase
        .from("watch_progress")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching progress:", error);
      } else if (data) {
        console.log("Fetched progress data:", data);
        const items: WatchProgress[] = data.map((row: any) => ({
          animeId: row.anime_id,
          animeTitle: row.anime_title,
          animeImage: row.anime_image,
          episode: row.episode,
          currentTime: row.progress_time,
          duration: row.duration,
          updatedAt: new Date(row.updated_at).getTime(),
        }));
        setProgress(items);
      }
      setLoading(false);
    };

    fetchProgress();
  }, [user, supabase]);

  async function saveProgress(data: WatchProgress) {
    if (!user) {
      console.log("No user, skipping save");
      return;
    }

    console.log("Saving progress for user:", user.id, "data:", data);

    const { error } = await supabase.from("watch_progress").upsert(
      {
        user_id: user.id,
        anime_id: data.animeId,
        anime_title: data.animeTitle,
        anime_image: data.animeImage,
        episode: data.episode,
        progress_time: data.currentTime,
        duration: data.duration,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,anime_id" }
    );

    if (error) {
      console.error("Error saving progress:", error);
    } else {
      console.log("Progress saved successfully!");
    }

    setProgress((prev) => {
      const filtered = prev.filter((p) => p.animeId !== data.animeId);
      return [{ ...data, updatedAt: Date.now() }, ...filtered];
    });
  }

  async function removeProgress(animeId: string) {
    if (!user) return;
    await supabase
      .from("watch_progress")
      .delete()
      .eq("anime_id", animeId)
      .eq("user_id", user.id);

    setProgress((prev) => prev.filter((p) => p.animeId !== animeId));
  }

  function getProgress(animeId: string) {
    return progress.find((p) => p.animeId === animeId);
  }

  return (
    <ProgressContext.Provider
      value={{ progress, saveProgress, removeProgress, getProgress, loading }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}