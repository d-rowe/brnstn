import Helpers from './Helpers';
import Pitch from './Pitch';
import { PitchCoordinate, SCALE_SEMITONES } from './Constants';

interface Props {
  coord?: PitchCoordinate;
  pitchRange?: {
    start: Pitch;
    end: Pitch;
  };
}

const PERFECT_INTERVALS = new Set<number>([1, 4, 5]);
const SONORITIES = { d: 'd', m: 'm', M: 'M', P: 'P', A: 'A' };

const PERFECT_OFFSETS = new Map<number, string>([
  [-1, SONORITIES.d],
  [0, SONORITIES.P],
  [1, SONORITIES.A],
]);

const MAJOR_OFFSETS = new Map<number, string>([
  [-2, SONORITIES.d],
  [-1, SONORITIES.m],
  [0, SONORITIES.M],
  [1, SONORITIES.A],
]);

export default class Interval {
  private _coord: PitchCoordinate;

  constructor({ coord, pitchRange }: Props) {
    if (!coord && !pitchRange) {
      throw new Error('Interval must have either coord or pitch range');
    }

    this._coord = pitchRange
      ? this._getCoordFromPitchRange(pitchRange.start, pitchRange.end)
      : coord || [0, 0];
  }

  private _getCoordFromPitchRange(start: Pitch, end: Pitch): PitchCoordinate {
    const [startDiatonic, startSemitones] = start.coord();
    const [endDiatonic, endSemitones] = end.coord();

    return [endDiatonic - startDiatonic, endSemitones - startSemitones];
  }

  absCoord(): PitchCoordinate {
    return Helpers.absCoord(this.coord());
  }

  coord(): PitchCoordinate {
    return this._coord;
  }

  diatonic(): number {
    return this.coord()[0];
  }

  direction(): number {
    return this.diatonic() >= 0 ? 1 : -1;
  }

  octaves(): number {
    return Helpers.octave(this.diatonic());
  }

  semitones(): number {
    return this.coord()[1];
  }

  simple(): Interval {
    return new Interval({ coord: this.simpleCoord() });
  }

  simpleCoord(): PitchCoordinate {
    return [this.simpleDiatonic(), this.simpleSemitones()];
  }

  simpleDiatonic(): number {
    return Helpers.simplifyDiatonic(this.diatonic());
  }

  simpleSemitones(): number {
    return Helpers.simplifySemitones(this.semitones());
  }

  quality(): string {
    const absSimpleDiatonic = Math.abs(this.simpleDiatonic());
    const isPerfectType = PERFECT_INTERVALS.has(absSimpleDiatonic + 1);
    const offsetMap = isPerfectType ? PERFECT_OFFSETS : MAJOR_OFFSETS;
    const offset = this.qualityOffset();
    const absOffset = Math.abs(offset);
    const match = offsetMap.get(offset);

    if (absOffset < 2 && match) {
      return match;
    }

    const simpleMatch = offsetMap.get(absOffset / offset);
    if (isPerfectType && simpleMatch) {
      return simpleMatch.repeat(absOffset);
    }

    if (offset >= 0) {
      return SONORITIES.A.repeat(absOffset);
    }

    return SONORITIES.d.repeat(absOffset - 1);
  }

  qualityOffset(): number {
    const [diatonic, semitones] = this.absCoord();
    const diatonicSemitones =
      SCALE_SEMITONES[Helpers.simplifyDiatonic(diatonic)];
    const octaveSemitones = Helpers.octave(diatonic) * 12;
    const referenceSemitones = diatonicSemitones + octaveSemitones;
    return semitones - referenceSemitones;
  }
}
