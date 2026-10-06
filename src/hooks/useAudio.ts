import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface UseAudioOptions {
  url: string | null;
}

export function useAudio({
  url,
}: UseAudioOptions) {
  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const animationFrameRef =
    useRef<number | null>(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const stopClock = useCallback(() => {
    if (
      animationFrameRef.current !== null
    ) {
      cancelAnimationFrame(
        animationFrameRef.current,
      );

      animationFrameRef.current = null;
    }
  }, []);

  const startClock = useCallback(() => {
    stopClock();

    const update = () => {
      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

      setCurrentTime(
        audio.currentTime,
      );

      if (!audio.paused) {
        animationFrameRef.current =
          requestAnimationFrame(update);
      }
    };

    animationFrameRef.current =
      requestAnimationFrame(update);
  }, [stopClock]);

  useEffect(() => {
    const audio =
      new Audio();

    audio.preload = "metadata";

    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      if (
        Number.isFinite(
          audio.duration,
        )
      ) {
        setDuration(
          audio.duration,
        );
      }
    };

    const handleEnded = () => {
      stopClock();

      setIsPlaying(false);
      setCurrentTime(
        audio.duration || 0,
      );
    };

    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata,
    );

    audio.addEventListener(
      "durationchange",
      handleLoadedMetadata,
    );

    audio.addEventListener(
      "ended",
      handleEnded,
    );

    return () => {
      stopClock();

      audio.pause();

      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata,
      );

      audio.removeEventListener(
        "durationchange",
        handleLoadedMetadata,
      );

      audio.removeEventListener(
        "ended",
        handleEnded,
      );

      audioRef.current = null;
    };
  }, [
    stopClock,
  ]);

  useEffect(() => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    stopClock();

    audio.pause();

    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    if (!url) {
      audio.removeAttribute(
        "src",
      );

      audio.load();

      return;
    }

    audio.src = url;
    audio.load();
  }, [
    url,
    stopClock,
  ]);

  const play = useCallback(
    async () => {
      const audio =
        audioRef.current;

      if (!audio || !url) {
        return;
      }

      if (
        audio.duration &&
        audio.currentTime >=
          audio.duration
      ) {
        audio.currentTime = 0;
      }

      await audio.play();

      setIsPlaying(true);

      startClock();
    },
    [
      url,
      startClock,
    ],
  );

  const pause = useCallback(() => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();

    stopClock();

    setCurrentTime(
      audio.currentTime,
    );

    setIsPlaying(false);
  }, [
    stopClock,
  ]);

  const toggle = useCallback(
    async () => {
      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

      if (audio.paused) {
        await play();
      } else {
        pause();
      }
    },
    [
      play,
      pause,
    ],
  );

  const seek = useCallback(
    (time: number) => {
      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

      const maxTime =
        Number.isFinite(
          audio.duration,
        )
          ? audio.duration
          : duration;

      const nextTime =
        Math.max(
          0,
          Math.min(
            time,
            maxTime || 0,
          ),
        );

      audio.currentTime =
        nextTime;

      setCurrentTime(
        nextTime,
      );
    },
    [
      duration,
    ],
  );

  return {
    audioRef,

    isPlaying,
    currentTime,
    duration,

    play,
    pause,
    toggle,
    seek,
  };
}