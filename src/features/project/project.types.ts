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

export type BackgroundMotion =
  | "static"
  | "zoom-in"
  | "zoom-out"
  | "drift-left"
  | "drift-right";

export interface BackgroundSettings {
  file: File | null;
  url: string | null;

  x: number;
  y: number;

  scale: number;
  blur: number;
  brightness: number;

  motion: BackgroundMotion;
  motionAmount: number;
}

export interface VinylSettings {
  file: File | null;
  url: string | null;

  x: number;
  y: number;

  size: number;
  rpm: number;

  borderWidth: number;
  borderColor: string;

  shadowBlur: number;
  shadowOpacity: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}
export interface AudioDetectionSettings {
  bass: boolean;
  snare: boolean;
  hat: boolean;
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
  audioDetection: AudioDetectionSettings;
}