import {
  useEffect,
  useRef,
} from "react";

import type {
  VideoProject,
} from "../../features/project/project.types";

import {
  Renderer,
} from "../../features/renderer/Renderer";

import "./VideoPreview.css";

interface VideoPreviewProps {
  project: VideoProject;
  time: number;
}

function loadImage(
  url: string | null,
): Promise<HTMLImageElement | null> {
  if (!url) {
    return Promise.resolve(null);
  }

  return new Promise(
    (resolve, reject) => {
      const image =
        new Image();

      image.onload = () =>
        resolve(image);

      image.onerror =
        reject;

      image.src = url;
    },
  );
}

export function VideoPreview({
  project,
  time,
}: VideoPreviewProps) {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const backgroundRef =
    useRef<HTMLImageElement | null>(
      null,
    );

  const vinylRef =
    useRef<HTMLImageElement | null>(
      null,
    );

  useEffect(() => {
    let cancelled = false;

    loadImage(
      project.background.url,
    ).then((image) => {
      if (!cancelled) {
        backgroundRef.current =
          image;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [project.background.url]);

  useEffect(() => {
    let cancelled = false;

    loadImage(
      project.vinyl.url,
    ).then((image) => {
      if (!cancelled) {
        vinylRef.current =
          image;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [project.vinyl.url]);

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const renderer =
      new Renderer(canvas);

    renderer.render(
      project,
      backgroundRef.current,
      vinylRef.current,
      time,
    );
  }, [
    project,
    time,
    project.background.url,
    project.vinyl.url,
  ]);

  return (
    <div className="video-preview">
      <canvas
        ref={canvasRef}
        className="video-preview__canvas"
      />
    </div>
  );
}