import BaseChord from './BaseChord';
import Helpers from '../Helpers';
import Interval from '../Interval';
import Pitch from '../Pitch';
import {DIATONICS_PER_OCTAVE, SEMITONES_PER_OCTAVE} from '../constants';
import {INTEGER_NOTATION_SERIAL_SONORITY_MAP, SONORITY_INTERVALS} from './definitions';

class IntegerChord extends BaseChord {
    private integerNotation: number[] = [];
    private rootSemitones: number | undefined;

    constructor(integerNotation?: number[]) {
        super();

        this.setIntegerNotation(integerNotation);
    }

    /**
     * Tries to find a matching sonority definition match
     * built from a given root
     */
    private getSonorityForRootSemitones(root: number): string {
        const uniqueSimpleIntegers: Set<number> = new Set();

        const rootRelativeIntegers: number[] = [];

        this.integerNotation.forEach(m => {
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
    private setSemitonesAndSonority(): void {
        for (let i = 0; i < this.integerNotation.length; i++) {
            // We're going to try each note as a potential root
            // as the chord can be inverted
            const semitones = this.integerNotation[i];
            const sonority = this.getSonorityForRootSemitones(semitones);

            if (sonority) {
                this.rootSemitones = semitones;
                this.sonority = sonority;
                return;
            }
        }
    }

    root(): Pitch {
        if (!this.rootSemitones) {
            return new Pitch();
        }

        return new Pitch().fromSemitones(this.rootSemitones);
    }

    setIntegerNotation(midiNums: number[] = []): void {
        this.integerNotation = midiNums;
        this.rootSemitones = undefined;

        this.reset();
        this.setSemitonesAndSonority();
        this.setPitchesAndIntervals();
    }

    private setPitchesAndIntervals(): void {
        this.intervals = [];
        this.pitches = [];

        if (!this.sonority || this.rootSemitones === undefined) {
            return;
        }

        const intervalNames = SONORITY_INTERVALS[this.sonority];
        const intervals = intervalNames.map(name => new Interval(name));
        const rootDiatonic = Helpers.semitonesToNearestDiatonic(this.rootSemitones);
        const rootPitch = new Pitch().fromCoord([rootDiatonic, this.rootSemitones]);

        this.integerNotation.forEach(m => {
            if (m === this.rootSemitones) {
                this.intervals.push(new Interval('P1'));
                this.pitches.push(rootPitch);
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

                    this.intervals.push(new Interval().fromPitchRange(rootPitch, pitch));
                    this.pitches.push(pitch);
                    return;
                }
            }
        });
    }
}

export default IntegerChord;
