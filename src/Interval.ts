import Pitch from './Pitch';
import { PitchCoordinate, SCALE_SEMITONES } from './Constants';

interface Props {
  coord?: PitchCoordinate;
  pitchRange?: {
    start: Pitch;
    end: Pitch;
  };
}

const PERFECT_INTERVALS = new Set([1, 4, 5]);
const SONORITIES = { d: 'd', m: 'm', M: 'M', P: 'P', A: 'A' };

const PERFECT_OFFSETS = new Map([
  [-1, SONORITIES.d],
  [0, SONORITIES.P],
  [1, SONORITIES.A],
]);

const MAJOR_OFFSETS = new Map([
  [-2, SONORITIES.d],
  [-1, SONORITIES.m],
  [0, SONORITIES.M],
  [1, SONORITIES.A],
]);

export default class Interval {
  _coord: PitchCoordinate;

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

  coord(): PitchCoordinate {
    return this._coord;
  }

  diatonic(): number {
    return this._coord[0];
  }

  octaves(): number {
    return Math.floor(this.diatonic() / 7);
  }

  semitones(): number {
    return this._coord[1];
  }

  simple(): Interval {
    return new Interval({ coord: this.simpleCoord() });
  }

  simpleCoord(): PitchCoordinate {
    return [this.simpleDiatonic(), this.simpleSemitones()];
  }

  simpleDiatonic(): number {
    const diatonic = this.diatonic();
    const simple = Math.abs(diatonic % 12);

    if (simple >= 0) {
      return simple;
    }

    return 9 - simple;
  }

  simpleSemitones(): number {
    const semitones = this.semitones();
    const simple = Math.abs(semitones % 12);

    if (semitones >= 0) {
      return simple;
    }

    // Invert if descending
    return 12 - simple;
  }

  // TODO: support n senority chars (ex. ddd)
  sonority(): string {
    const isPerfectType = PERFECT_INTERVALS.has(this.simpleDiatonic() + 1);
    const offsetMap = isPerfectType ? PERFECT_OFFSETS : MAJOR_OFFSETS;

    const sonorityMatch = offsetMap.get(this.sonorityOffset());
    if (sonorityMatch) {
      return sonorityMatch;
    }

    return '';
  }

  sonorityOffset(): number {
    const octaveSemitoneOffset = this.octaves() * 12;
    const referenceSemitones =
      SCALE_SEMITONES[this.simpleDiatonic()] + octaveSemitoneOffset;
    return this.semitones() - referenceSemitones;
  }
}
