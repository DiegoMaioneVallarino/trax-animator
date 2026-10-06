import type {
  VideoProject,
} from "../project/project.types";

export interface RenderFrameOptions {
  ctx: CanvasRenderingContext2D;
  project: VideoProject;

  backgroundImage: HTMLImageElement | null;
  vinylImage: HTMLImageElement | null;

  time: number;
}