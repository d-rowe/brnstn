import Helpers from '../Helpers';
import Interval from '../Interval';
import Pitch from '../Pitch';
import {DIATONICS_PER_OCTAVE, SEMITONES_PER_OCTAVE} from '../constants';
import {
    ACADEMIC_SONORITY_ALIASES_FULL,
    ACADEMIC_SONORITY_ALIASES_SHORT,
    INTEGER_NOTATION_SERIAL_SONORITY_MAP,
    SONORITY_INTERVALS,
} from './definitions';

type RootSonority = {
    sonority?: string;
    semitones?: number;
};

export default class IntegerChord {
    private _integerNotation: number[] = [];

    constructor(integerNotation?: number[]) {
        this._integerNotation = integerNotation || [];
    }

    /**
     * Tries to find a matching sonority definition match
     * built from a given root
     */
    private _getSonorityForRootSemitones(root: number): string {
        const uniqueSimpleIntegers: Set<number> = new Set();

        const rootRelativeIntegers: number[] = [];

        this._integerNotation.forEach(m => {
            const simpleInteger = Helpers.simplifySemitones(m);

            if (uniqueSimpleIntegers.has(simpleInteger)) {
                return;
            }

            uniqueSimpleIntegers.add(simpleInteger);

            let current = m - root;

            while (current <= 0) {
                current += SEMITONES_PER_OCTAVE;
            }

            rootRelativeIntegers.push(Helpers.simplifySemitones(current));
        });

        const sortedRootRelativeIntegers = rootRelativeIntegers.sort((a, b) => a - b);
        const serialized = sortedRootRelativeIntegers.join(',');

        return INTEGER_NOTATION_SERIAL_SONORITY_MAP[serialized] || '';
    }

    /**
     * Inverts and normalizes midi number array to find
     * a matching sonority definition and caches the result
     *
     * This is the main parsing algorithm
     */
    private getSemitonesAndSonority(): RootSonority {
        for (let i = 0; i < this._integerNotation.length; i++) {
            // We're going to try each note as a potential root
            // as the chord can be inverted
            const semitones = this._integerNotation[i];
            const sonority = this._getSonorityForRootSemitones(semitones);

            if (sonority) {
                return {semitones, sonority};
            }
        }

        return {
            semitones: undefined,
            sonority: undefined,
        };
    }

    root(): Pitch {
        const {semitones} = this.getSemitonesAndSonority();
        if (!semitones) {
            return new Pitch();
        }

        return new Pitch().fromSemitones(semitones);
    }

    setMidi(midiNums: number[]): void {
        this._integerNotation = midiNums;
    }

    academicSonority(): string {
        return ACADEMIC_SONORITY_ALIASES_FULL[this.sonority()] || '';
    }

    academicShortSonority(): string {
        return ACADEMIC_SONORITY_ALIASES_SHORT[this.sonority()] || '';
    }

    sonority(): string {
        return this.getSemitonesAndSonority().sonority || '';
    }

    pitches(): Pitch[] {
        return this.getPitchesAndIntervals().pitches;
    }

    intervals(): Interval[] {
        return this.getPitchesAndIntervals().intervals;
    }

    getPitchesAndIntervals(): {pitches: Pitch[]; intervals: Interval[]} {
        const {semitones, sonority} = this.getSemitonesAndSonority();

        if (!sonority || semitones === undefined) {
            return {
                pitches: [],
                intervals: [],
            };
        }

        const intervalNames = SONORITY_INTERVALS[sonority];
        const intervals = intervalNames.map(name => new Interval(name));
        const rootDiatonic = Helpers.semitonesToNearestDiatonic(semitones);
        const rootPitch = new Pitch().fromCoord([rootDiatonic, semitones]);

        const parsedPitches: Pitch[] = [];
        const parsedIntervals: Interval[] = [];

        this._integerNotation.forEach(m => {
            if (m === semitones) {
                parsedIntervals.push(new Interval('P1'));
                parsedPitches.push(rootPitch);
                return;
            }

            for (let i = 0; i < intervals.length; i++) {
                const [refIntervalDiatonic, refIntervalSemitones] = intervals[i].coord();
                const refDiatonic = refIntervalDiatonic + rootPitch.diatonic();
                const refSemitones = refIntervalSemitones + rootPitch.semitones();

                if (Helpers.simplifySemitones(m) === Helpers.simplifySemitones(refSemitones)) {
                    const octaveOffset = Helpers.getSemitoneOctave(m) * DIATONICS_PER_OCTAVE;
                    const diatonic = Helpers.simplifyDiatonic(refDiatonic) + octaveOffset;
                    const pitch = new Pitch().fromCoord([diatonic, m]);

                    parsedIntervals.push(new Interval().fromPitchRange(rootPitch, pitch));
                    parsedPitches.push(pitch);
                    return;
                }
            }
        });

        return {
            pitches: parsedPitches,
            intervals: parsedIntervals,
        };
    }
}
