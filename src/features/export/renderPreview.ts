import { Renderer } from "../renderer/Renderer";

import { getAudioActivity } from "../audio/getAudioActivity";

import type {
  AudioAnalysis,
} from "../audio/audioAnalysis.types";

import type {
  VideoProject,
} from "../project/project.types";

import type {
  RenderProgress,
  RenderResult,
} from "./export.types";

interface RenderPreviewOptions {
  project: VideoProject;
  audioAnalysis: AudioAnalysis | null;
  duration?: number;
  fps?: number;
  onProgress?: (progress: RenderProgress) => void;
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
    image.onerror = () => reject(
      new Error("Could not load image"),
    );

    image.src = url;
  });
}

export async function renderPreview({
  project,
  audioAnalysis,
  duration = 10,
  fps = 30,
  onProgress,
}: RenderPreviewOptions): Promise<RenderResult> {
  if (
    typeof MediaRecorder === "undefined"
  ) {
    throw new Error(
      "MediaRecorder is not supported",
    );
  }

  const canvas =
    document.createElement("canvas");

  canvas.width = 960;
  canvas.height = 540;

  const renderer =
    new Renderer(canvas);

  const [
    backgroundImage,
    vinylImage,
  ] = await Promise.all([
    loadImage(project.background.url),
    loadImage(project.vinyl.url),
  ]);

  const renderProject: VideoProject = {
    ...project,

    output: {
      ...project.output,
      width: 960,
      height: 540,
    },
  };

  const totalFrames =
    Math.ceil(duration * fps);

  const stream =
    canvas.captureStream(0);

 const track =
  stream.getVideoTracks()[0] as
    CanvasCaptureMediaStreamTrack | undefined;

  if (!track) {
    throw new Error(
      "Could not capture canvas",
    );
  }

  const mimeType =
    MediaRecorder.isTypeSupported(
      "video/webm;codecs=vp9",
    )
      ? "video/webm;codecs=vp9"
      : "video/webm";

  const recorder =
    new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 4_000_000,
    });

  const chunks: Blob[] = [];

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  const finished =
    new Promise<Blob>((resolve, reject) => {
      recorder.onerror = () => {
        reject(
          new Error("Video recording failed"),
        );
      };

      recorder.onstop = () => {
        resolve(
          new Blob(chunks, {
            type: mimeType,
          }),
        );
      };
    });

  recorder.start();

  const frameDuration =
    1000 / fps;

  try {
    for (
      let frame = 0;
      frame < totalFrames;
      frame++
    ) {
      const time = frame / fps;

      const audioActivity =
        getAudioActivity(
          audioAnalysis,
          time,
        );

      renderer.render(
        renderProject,
        backgroundImage,
        vinylImage,
        time,
        audioActivity,
      );

      track.requestFrame?.();

      onProgress?.({
        currentFrame: frame + 1,
        totalFrames,
        progress:
          (frame + 1) / totalFrames,
      });

      await new Promise<void>((resolve) => {
        setTimeout(
          resolve,
          frameDuration,
        );
      });
    }

    recorder.stop();

    const blob = await finished;

    return {
      blob,
      url: URL.createObjectURL(blob),
      duration,
    };
  } finally {
    stream.getTracks().forEach(
      (track) => track.stop(),
    );
  }
}