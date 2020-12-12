const NAMES = 'CDEFGAB';
const STEPS = [0, 2, 4, 5, 7, 9, 11];
const ACCIDENTAL_CHAR_OFFSETS = {b: -1, '#': 1, x: 2};
const OCTAVE_STEP_COUNT = 12;


export default class Pitch {
    private _diatonic: number;
    private _midi: number;

    constructor(diatonic?: number, midi?: number) {
        this._diatonic = diatonic || 0;
        this._midi = midi || 0;
    }

    fromSpn(spn: string): Pitch {
        const parsed = /([a-gA-G])([b|#|x]*)?([0-9])?/.exec(spn);

        if (!parsed) {
            throw new Error(`Cannot parse invalid scientific pitch notation: ${spn}`);
        }

        const [, name, accidental = '', octave = '4'] = parsed;
        const octaveNum = Number(octave);
        const simpleDiatonic = this._getSimpleDiatonicFromName(name);
        const octaveOffset = octaveNum * OCTAVE_STEP_COUNT;
    
        this._diatonic = simpleDiatonic + octaveNum * 7;
        this._midi = STEPS[simpleDiatonic] + octaveOffset + this._getAccidentalOffset(accidental); 

        return this;
    }

    private _getSimpleDiatonicFromName(name: string): number {
        for(let i = 0; i < NAMES.length; i++) {
            const curName = NAMES[i];

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
        return NAMES[this._diatonic % NAMES.length];
    }

    midi(): number {
        return this._midi;
    }

    diatonic(): number {
        return this._diatonic;
    }
}