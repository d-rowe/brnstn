import Pitch from './Pitch';
import { PitchCoordinate, SCALE_SEMITONES } from './constants';

interface Props {
  coord?: PitchCoordinate;
  pitchRange?: {
    start: Pitch;
    end: Pitch;
  };
}

export default class Interval {
  _coord: PitchCoordinate;

  constructor({ coord, pitchRange }: Props) {
    if (!coord && !pitchRange) {
      throw new Error('Interval must have either coord or pitchRange');
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

  coord() {
    return this._coord;
  }

  diatonic() {
    return this._coord[0];
  }

  octaves() {
    return Math.floor(this.diatonic() / 7);
  }

  referenceOffset() {
    const octaveSemitoneOffset = this.octaves() * 12;
    const referenceSemitones =
      SCALE_SEMITONES[this.simpleDiatonic()] + octaveSemitoneOffset;
    return this.semitones() - referenceSemitones;
  }

  semitones() {
    return this._coord[1];
  }

  simpleCoord() {
    return [this.simpleDiatonic(), this.simpleSemitones()];
  }

  simpleDiatonic() {
    return this.diatonic() % 7;
  }

  simpleSemitones() {
    return this.semitones() % 12;
  }
}
