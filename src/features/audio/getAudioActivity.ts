import type {
  AudioAnalysis,
  AudioHit,
} from "./audioAnalysis.types";

export interface AudioActivity {
  bass: number;
  snare: number;
  hat: number;

  hatTrigger: boolean;
}

export function getAudioActivity(
  analysis: AudioAnalysis | null,
  time: number,
): AudioActivity {
  if (!analysis) {
    return {
      bass: 0,
      snare: 0,
      hat: 0,
      hatTrigger: false,
    };
  }

  const bass =
    getHitActivity(
      analysis.bassHits,
      time,
      0.18,
    );

  const snare =
    getHitActivity(
      analysis.snareHits,
      time,
      0.12,
    );

  const hat =
    getHitActivity(
      analysis.hatHits,
      time,
      0.055,
    );

  const hatTrigger =
    hasRecentHit(
      analysis.hatHits,
      time,
      0.035,
    );

  return {
    bass,
    snare,
    hat,
    hatTrigger,
  };
}

function getHitActivity(
  hits: AudioHit[],
  time: number,
  decay: number,
) {
  let activity = 0;

  for (
    let i = hits.length - 1;
    i >= 0;
    i--
  ) {
    const hit = hits[i];

    if (hit.time > time) {
      continue;
    }

    const elapsed =
      time - hit.time;

    if (elapsed > decay) {
      break;
    }

    const envelope =
      1 - elapsed / decay;

    const value =
      envelope *
      Math.max(
        0.25,
        hit.strength,
      );

    activity =
      Math.max(
        activity,
        value,
      );
  }

  return activity;
}

function hasRecentHit(
  hits: AudioHit[],
  time: number,
  duration: number,
) {
  for (
    let i = hits.length - 1;
    i >= 0;
    i--
  ) {
    const hit =
      hits[i];

    if (hit.time > time) {
      continue;
    }

    return (
      time - hit.time <=
      duration
    );
  }

  return false;
}