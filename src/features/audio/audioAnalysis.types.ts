export interface AudioHit {
  time: number;
  strength: number;
}

export interface AudioAnalysis {
  duration: number;

  bassHits: AudioHit[];
  snareHits: AudioHit[];
  hatHits: AudioHit[];
}