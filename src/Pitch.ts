import {DIATONICS_PER_OCTAVE, SCALE_SEMITONES, SEMITONES_PER_OCTAVE} from './constants';
import Helpers from './Helpers';
import {PitchCoordinate} from './types';

const ACCIDENTAL_CHAR_OFFSETS = {b: -1, '#': 1, x: 2};
const DEFAULT_COORD: PitchCoordinate = [0, 0];
const PITCH_NAMES = 'CDEFGAB';
const spnRegEx = /([a-gA-G])([b|#|x]*)?(-?[0-9]*)?/;

interface Props {
    coord?: PitchCoordinate;
    spn?: string;
}

export default class Pitch {
    private _coord: PitchCoordinate;

    constructor({coord, spn}: Props) {
        if (!coord && !spn) {
            throw new Error('Pitch needs either coord or spn');
        }

        this._coord = spn ? this._getCoordFromSpn(spn) : coord || DEFAULT_COORD;
    }

    private _getCoordFromSpn(spn: string): PitchCoordinate {
        const parsed = spnRegEx.exec(spn);

        if (!parsed) {
            throw new Error(`Cannot parse invalid scientific pitch notation: ${spn}`);
        }

        const [, letter, accidental = '', octave = '4'] = parsed;
        const octaveNum = Number(octave);
        const simpleDiatonic = this._getSimpleDiatonicFromLetter(letter);
        const diatonic = simpleDiatonic + octaveNum * DIATONICS_PER_OCTAVE;
        const simpleSemitones = SCALE_SEMITONES[simpleDiatonic];
        const octaveOffset = octaveNum * SEMITONES_PER_OCTAVE;
        const accidentalOffset = this._getOffsetFromAccidental(accidental);
        const semitones = simpleSemitones + octaveOffset + accidentalOffset;

        return [diatonic, semitones];
    }

    private _getSimpleDiatonicFromLetter(name: string): number {
        const upperName = name.toUpperCase();

        for (let i = 0; i < PITCH_NAMES.length; i++) {
            const curName = PITCH_NAMES[i];

            if (curName === upperName) {
                return i;
            }
        }

        return 0;
    }

    private _getOffsetFromAccidental(accidental: string = ''): number {
        let totalOffset = 0;
        for (let i = 0; i < accidental.length; i++) {
            const curChar = accidental[i];
            // @ts-ignore this is static, no need to define interface
            const curOffset = ACCIDENTAL_CHAR_OFFSETS[curChar];
            totalOffset += curOffset || 0;
        }

        return totalOffset;
    }

    accidental(): string {
        const offset = this.accidentalOffset();

        if (offset < 0) {
            return 'b'.repeat(Math.abs(offset));
        }

        if (offset > 0) {
            const doubleSharpCount = Math.floor(offset / 2);
            const singleSharpCount = offset - doubleSharpCount * 2;

            return `${'x'.repeat(doubleSharpCount)}${'#'.repeat(singleSharpCount)}`;
        }

        return '';
    }

    accidentalOffset(): number {
        const diatonic = this.diatonic();
        const diatonicSemitones = Helpers.diatonicToSemitones(diatonic);

        return this.semitones() - diatonicSemitones;
    }

    coord() {
        return this._coord;
    }

    diatonic(): number {
        return this.coord()[0];
    }

    letter() {
        return PITCH_NAMES[this.simpleDiatonic()];
    }

    octave() {
        return Helpers.getDiatonicOctave(this.diatonic());
    }

    semitones(): number {
        return this.coord()[1];
    }

    simpleDiatonic(): number {
        return Helpers.simplifyDiatonic(this.diatonic());
    }

    spn() {
        return `${this.letter()}${this.octave}`;
    }
}
