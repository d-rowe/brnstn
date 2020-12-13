import { PitchCoordinate, SCALE_SEMITONES } from './Constants';

const ACCIDENTAL_CHAR_OFFSETS = { b: -1, '#': 1, x: 2 };
const DEFAULT_COORD: PitchCoordinate = [0, 0];
const PITCH_NAMES = 'CDEFGAB';

interface Props {
  coord?: PitchCoordinate;
  spn?: string;
}

export default class Pitch {
  private _coord: PitchCoordinate;

  constructor({ coord, spn }: Props) {
    if (!coord && !spn) {
      throw new Error('Pitch needs either coord or spn');
    }

    this._coord = spn ? this._getCoordFromSpn(spn) : coord || DEFAULT_COORD;
  }

  private _getCoordFromSpn(spn: string): PitchCoordinate {
    const parsed = /([a-gA-G])([b|#|x]*)?([0-9]*)?/.exec(spn);

    if (!parsed) {
      throw new Error(`Cannot parse invalid scientific pitch notation: ${spn}`);
    }

    const [, name, accidental = '', octave = '4'] = parsed;
    const octaveNum = Number(octave);
    const simpleDiatonic = this._getSimpleDiatonicFromName(name);
    const octaveOffset = octaveNum * 12;

    const diatonic = simpleDiatonic + octaveNum * 7;
    const semitones =
      SCALE_SEMITONES[simpleDiatonic] +
      octaveOffset +
      this._getAccidentalOffset(accidental);

    return [diatonic, semitones];
  }

  private _getSimpleDiatonicFromName(name: string): number {
    for (let i = 0; i < PITCH_NAMES.length; i++) {
      const curName = PITCH_NAMES[i];

      if (curName === name) {
        return i;
      }
    }

    return 0;
  }

  private _getAccidentalOffset(accidental: string = ''): number {
    let totalOffset = 0;
    for (let i = 0; i < accidental.length; i++) {
      const curChar = accidental[i];
      // @ts-ignore this is static, no need to define interface
      const curOffset = ACCIDENTAL_CHAR_OFFSETS[curChar];
      totalOffset += curOffset || 0;
    }

    return totalOffset;
  }

  name() {
    return PITCH_NAMES[this.diatonic() % PITCH_NAMES.length];
  }

  coord() {
    return this._coord;
  }

  diatonic(): number {
    return this._coord[0];
  }

  semitones(): number {
    return this._coord[1];
  }
}
