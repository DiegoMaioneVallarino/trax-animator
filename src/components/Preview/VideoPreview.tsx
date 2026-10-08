import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  VideoProject,
  VinylSettings,
} from "../../features/project/project.types";

import {
  Renderer,
} from "../../features/renderer/Renderer";

import "./VideoPreview.css";
import type {
  AudioAnalysis,
} from "../../features/audio/audioAnalysis.types";

import {
  getAudioActivity,
} from "../../features/audio/getAudioActivity";

interface VideoPreviewProps {
  project: VideoProject;
  time: number;

  audioAnalysis:
    AudioAnalysis | null;

  onVinylChange: (
    changes: Partial<VinylSettings>,
  ) => void;
}

function loadImage(
  url: string | null,
): Promise<HTMLImageElement | null> {
  if (!url) {
    return Promise.resolve(null);
  }

  return new Promise(
    (resolve, reject) => {
      const image = new Image();

      image.onload = () =>
        resolve(image);

      image.onerror = reject;

      image.src = url;
    },
  );
}

export function VideoPreview({
  project,
  time,
  audioAnalysis,
  onVinylChange,
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

  const [isDragging, setIsDragging] =
    useState(false);

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
const audioActivity = getAudioActivity(
  audioAnalysis,
  time,
  project.audioDetection,
);
    renderer.render(
  project,
  backgroundRef.current,
  vinylRef.current,
  time,
  audioActivity,
);
  }, [
    project,
    time,
  ]);

  function getPointerPosition(
    event:
      React.PointerEvent<HTMLCanvasElement>,
  ) {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return null;
    }

    const rect =
      canvas.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) /
      rect.width;

    const y =
      (event.clientY - rect.top) /
      rect.height;

    return {
      x,
      y,
    };
  }

  function isPointerOverVinyl(
    x: number,
    y: number,
  ) {
    const {
      width,
      height,
    } = project.output;

    const vinylDiameter =
      Math.min(
        width,
        height,
      ) * project.vinyl.size;

    const radiusX =
      vinylDiameter /
      width /
      2;

    const radiusY =
      vinylDiameter /
      height /
      2;

    const dx =
      (x - project.vinyl.x) /
      radiusX;

    const dy =
      (y - project.vinyl.y) /
      radiusY;

    return (
      dx * dx +
        dy * dy <=
      1
    );
  }

  function handlePointerDown(
    event:
      React.PointerEvent<HTMLCanvasElement>,
  ) {
    if (!project.vinyl.url) {
      return;
    }

    const position =
      getPointerPosition(event);

    if (!position) {
      return;
    }

    if (
      !isPointerOverVinyl(
        position.x,
        position.y,
      )
    ) {
      return;
    }

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    setIsDragging(true);
  }

  function handlePointerMove(
    event:
      React.PointerEvent<HTMLCanvasElement>,
  ) {
    if (!isDragging) {
      return;
    }

    const position =
      getPointerPosition(event);

    if (!position) {
      return;
    }

    onVinylChange({
      x: Math.max(
        0,
        Math.min(1, position.x),
      ),

      y: Math.max(
        0,
        Math.min(1, position.y),
      ),
    });
  }

  function handlePointerUp(
    event:
      React.PointerEvent<HTMLCanvasElement>,
  ) {
    if (!isDragging) {
      return;
    }

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    setIsDragging(false);
  }

  return (
    <div className="video-preview">
      <canvas
        ref={canvasRef}
        className={
          isDragging
            ? "video-preview__canvas video-preview__canvas--dragging"
            : "video-preview__canvas"
        }
        onPointerDown={
          handlePointerDown
        }
        onPointerMove={
          handlePointerMove
        }
        onPointerUp={
          handlePointerUp
        }
        onPointerCancel={
          handlePointerUp
        }
      />
    </div>
  );
}