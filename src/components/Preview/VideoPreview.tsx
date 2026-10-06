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
}

function loadImage(
  url: string | null,
): Promise<HTMLImageElement | null> {
  if (!url) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = reject;

    image.src = url;
  });
}

export function VideoPreview({
  project,
}: VideoPreviewProps) {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const projectRef =
    useRef(project);

  const backgroundRef =
    useRef<HTMLImageElement | null>(null);

  const vinylRef =
    useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    projectRef.current = project;
  }, [project]);

  useEffect(() => {
    let cancelled = false;

    loadImage(
      project.background.url,
    ).then((image) => {
      if (!cancelled) {
        backgroundRef.current = image;
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
        vinylRef.current = image;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [project.vinyl.url]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const renderer =
      new Renderer(canvas);

    let animationFrame = 0;

    const startTime =
      performance.now();

    const animate = (
      now: number,
    ) => {
      const time =
        (now - startTime) / 1000;

      renderer.render(
        projectRef.current,
        backgroundRef.current,
        vinylRef.current,
        time,
      );

      animationFrame =
        requestAnimationFrame(animate);
    };

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(
        animationFrame,
      );
    };
  }, []);

  return (
    <div className="video-preview">
      <canvas
        ref={canvasRef}
        className="video-preview__canvas"
      />
    </div>
  );
}