export interface RenderProgress {
  currentFrame: number;
  totalFrames: number;
  progress: number;
}

export interface RenderResult {
  blob: Blob;
  url: string;
  duration: number;
}