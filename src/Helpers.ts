import { PitchCoordinate } from './Constants';

function absCoord(coord: PitchCoordinate): PitchCoordinate {
  const [diatonic, semitones] = coord;
  const direction = diatonic >= 0 ? 1 : -1;
  return [Math.abs(diatonic), semitones * direction];
}

function octave(diatonic: number): number {
  return Math.floor(diatonic / 7);
}

function simplifyDiatonic(diatonic: number): number {
  return diatonic % 7;
}

function simplifySemitones(semitones: number): number {
  return semitones % 12;
}

export default {
  absCoord,
  octave,
  simplifyDiatonic,
  simplifySemitones,
};
