import type {
  VideoProject,
} from "../project/project.types";

import type {
  AudioActivity,
} from "../audio/getAudioActivity";

export interface RenderFrameOptions {
  ctx: CanvasRenderingContext2D;
  project: VideoProject;

  backgroundImage:
    HTMLImageElement | null;

  vinylImage:
    HTMLImageElement | null;

  time: number;

  audioActivity:
    AudioActivity;
}