export type OutputAspectRatio =
  | "16:9"
  | "9:16"
  | "1:1";

export interface AudioSettings {
  file: File | null;
  url: string | null;
  duration: number;
  name: string | null;
}

export interface BackgroundSettings {
  file: File | null;
  url: string | null;

  scale: number;
  blur: number;
  brightness: number;
}

export interface VinylSettings {
  file: File | null;
  url: string | null;

  x: number;
  y: number;

  size: number;
  rpm: number;
}

export interface OutputSettings {
  width: number;
  height: number;
  fps: number;
  aspectRatio: OutputAspectRatio;
}

export interface VideoProject {
  audio: AudioSettings;
  background: BackgroundSettings;
  vinyl: VinylSettings;
  output: OutputSettings;
}