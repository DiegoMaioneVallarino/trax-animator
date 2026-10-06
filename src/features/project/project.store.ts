import type {
  VideoProject,
} from "./project.types";

export const defaultProject: VideoProject = {
  audio: {
    file: null,
    url: null,
    duration: 0,
    name: null,
  },

  background: {
  file: null,
  url: null,

  x: 0.5,
  y: 0.5,

  scale: 1,
  blur: 0,
  brightness: 1,

  motion: "static",
  motionAmount: 0.05,
},

vinyl: {
  file: null,
  url: null,

  x: 0.5,
  y: 0.5,

  size: 0.42,
  rpm: 8,

  borderWidth: 0,
  borderColor: "#ffffff",

  shadowBlur: 30,
  shadowOpacity: 0.35,
  shadowOffsetX: 0,
  shadowOffsetY: 12,
},

  output: {
    width: 1920,
    height: 1080,
    fps: 30,
    aspectRatio: "16:9",
  },
};

export function createProject(): VideoProject {
  return structuredClone(defaultProject);
}