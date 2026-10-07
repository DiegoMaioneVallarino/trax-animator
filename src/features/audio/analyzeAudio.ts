import FFT from "fft.js";

import type {
  AudioAnalysis,
  AudioHit,
} from "./audioAnalysis.types";

interface FrequencyBand {
  minHz: number;
  maxHz: number;

  threshold: number;
  cooldown: number;
}

const BASS: FrequencyBand = {
  minHz: 30,
  maxHz: 160,
  threshold: 1.65,
  cooldown: 0.16,
};

const SNARE: FrequencyBand = {
  minHz: 180,
  maxHz: 3500,
  threshold: 1.8,
  cooldown: 0.12,
};

const HAT: FrequencyBand = {
  minHz: 5000,
  maxHz: 16000,
  threshold: 1.9,
  cooldown: 0.06,
};

const WINDOW_SIZE = 2048;
const HOP_SIZE = 512;
const HISTORY_SIZE = 24;

export async function analyzeAudio(
  file: File,
): Promise<AudioAnalysis> {
  const arrayBuffer =
    await file.arrayBuffer();

  const audioContext =
    new AudioContext();

  try {
    const audioBuffer =
      await audioContext.decodeAudioData(
        arrayBuffer.slice(0),
      );

    const samples =
      mixToMono(audioBuffer);

    const analysis =
      analyzeSamples(
        samples,
        audioBuffer.sampleRate,
      );

    return {
      duration:
        audioBuffer.duration,

      ...analysis,
    };
  } finally {
    await audioContext.close();
  }
}

function mixToMono(
  buffer: AudioBuffer,
) {
  const mono =
    new Float32Array(
      buffer.length,
    );

  for (
    let channel = 0;
    channel <
    buffer.numberOfChannels;
    channel++
  ) {
    const data =
      buffer.getChannelData(
        channel,
      );

    for (
      let i = 0;
      i < data.length;
      i++
    ) {
      mono[i] +=
        data[i] /
        buffer.numberOfChannels;
    }
  }

  return mono;
}

function analyzeSamples(
  samples: Float32Array,
  sampleRate: number,
) {
  const fft =
    new FFT(WINDOW_SIZE);

  const spectrum =
    fft.createComplexArray();

  const input =
    new Float64Array(
      WINDOW_SIZE,
    );

  const window =
    createHannWindow(
      WINDOW_SIZE,
    );

  const bassHistory: number[] =
    [];

  const snareHistory: number[] =
    [];

  const hatHistory: number[] =
    [];

  const bassHits: AudioHit[] =
    [];

  const snareHits: AudioHit[] =
    [];

  const hatHits: AudioHit[] =
    [];

  let lastBassHit =
    -Infinity;

  let lastSnareHit =
    -Infinity;

  let lastHatHit =
    -Infinity;

  for (
    let start = 0;
    start + WINDOW_SIZE <=
    samples.length;
    start += HOP_SIZE
  ) {
    for (
      let i = 0;
      i < WINDOW_SIZE;
      i++
    ) {
      input[i] =
        samples[start + i] *
        window[i];
    }

    fft.realTransform(
      spectrum,
      input,
    );

    const bassEnergy =
      getBandEnergy(
        spectrum,
        sampleRate,
        BASS.minHz,
        BASS.maxHz,
      );

    const snareEnergy =
      getBandEnergy(
        spectrum,
        sampleRate,
        SNARE.minHz,
        SNARE.maxHz,
      );

    const hatEnergy =
      getBandEnergy(
        spectrum,
        sampleRate,
        HAT.minHz,
        HAT.maxHz,
      );

    const time =
      start / sampleRate;

    const bassResult =
      detectHit(
        bassEnergy,
        bassHistory,
        BASS,
        time,
        lastBassHit,
      );

    if (bassResult.hit) {
      bassHits.push({
        time,
        strength:
          bassResult.strength,
      });

      lastBassHit = time;
    }

    const snareResult =
      detectHit(
        snareEnergy,
        snareHistory,
        SNARE,
        time,
        lastSnareHit,
      );

    if (snareResult.hit) {
      snareHits.push({
        time,
        strength:
          snareResult.strength,
      });

      lastSnareHit = time;
    }

    const hatResult =
      detectHit(
        hatEnergy,
        hatHistory,
        HAT,
        time,
        lastHatHit,
      );

    if (hatResult.hit) {
      hatHits.push({
        time,
        strength:
          hatResult.strength,
      });

      lastHatHit = time;
    }
  }

  return {
    bassHits,
    snareHits,
    hatHits,
  };
}

function getBandEnergy(
  spectrum: number[],
  sampleRate: number,
  minHz: number,
  maxHz: number,
) {
  const binFrequency =
    sampleRate / WINDOW_SIZE;

  const minBin =
    Math.max(
      1,
      Math.floor(
        minHz / binFrequency,
      ),
    );

  const maxBin =
    Math.min(
      WINDOW_SIZE / 2 - 1,
      Math.ceil(
        maxHz / binFrequency,
      ),
    );

  let energy = 0;
  let count = 0;

  for (
    let bin = minBin;
    bin <= maxBin;
    bin++
  ) {
    const real =
      spectrum[2 * bin];

    const imaginary =
      spectrum[
        2 * bin + 1
      ];

    energy +=
      real * real +
      imaginary * imaginary;

    count++;
  }

  if (count === 0) {
    return 0;
  }

  return energy / count;
}

function detectHit(
  energy: number,
  history: number[],
  band: FrequencyBand,
  time: number,
  lastHitTime: number,
) {
  const average =
    history.length > 0
      ? history.reduce(
          (sum, value) =>
            sum + value,
          0,
        ) / history.length
      : energy;

  const ratio =
    average > 0
      ? energy / average
      : 0;

  const canTrigger =
    history.length >=
      HISTORY_SIZE / 2 &&
    ratio >= band.threshold &&
    time - lastHitTime >=
      band.cooldown;

  let strength = 0;

  if (canTrigger) {
    strength =
      Math.min(
        1,
        Math.max(
          0,
          (
            ratio -
            band.threshold
          ) /
            band.threshold,
        ),
      );
  }

  history.push(energy);

  if (
    history.length >
    HISTORY_SIZE
  ) {
    history.shift();
  }

  return {
    hit: canTrigger,
    strength,
  };
}

function createHannWindow(
  size: number,
) {
  const window =
    new Float64Array(size);

  for (
    let i = 0;
    i < size;
    i++
  ) {
    window[i] =
      0.5 *
      (
        1 -
        Math.cos(
          (
            2 *
            Math.PI *
            i
          ) /
            (size - 1),
        )
      );
  }

  return window;
}