import {
  DIATONICS_PER_OCTAVE,
  PitchCoordinate,
  SEMITONES_PER_OCTAVE,
} from './Constants';

function absCoord(coord: PitchCoordinate): PitchCoordinate {
  const [diatonic, semitones] = coord;
  const direction = diatonic >= 0 ? 1 : -1;
  return [Math.abs(diatonic), semitones * direction];
}

function getOctave(diatonic: number): number {
  return Math.floor(diatonic / DIATONICS_PER_OCTAVE);
}

function simplifyDiatonic(diatonic: number): number {
  return diatonic % DIATONICS_PER_OCTAVE;
}

function simplifySemitones(semitones: number): number {
  return semitones % SEMITONES_PER_OCTAVE;
}

export default {
  absCoord,
  getOctave,
  simplifyDiatonic,
  simplifySemitones,
};
