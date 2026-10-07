import type {
  VideoProject,
} from "../project/project.types";

import {
  renderFrame,
} from "./renderFrame";
import type {
  AudioActivity,
} from "../audio/getAudioActivity";

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(
    canvas: HTMLCanvasElement,
  ) {
    const ctx =
      canvas.getContext("2d");

    if (!ctx) {
      throw new Error(
        "Could not create canvas context",
      );
    }

    this.ctx = ctx;
  }

render(
  project: VideoProject,
  backgroundImage:
    HTMLImageElement | null,
  vinylImage:
    HTMLImageElement | null,
  time: number,
  audioActivity: AudioActivity,
) {
  this.ctx.canvas.width =
    project.output.width;

  this.ctx.canvas.height =
    project.output.height;

  renderFrame({
    ctx: this.ctx,
    project,
    backgroundImage,
    vinylImage,
    time,
    audioActivity,
  });
}
}