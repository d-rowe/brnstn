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
    private setRootSemitonesAndSonority(): void {
        for (let i = 0; i < this.integerNotation.length; i++) {
            // we're going to try each note as a potential root
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
        this.setRootSemitonesAndSonority();
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
        // NOTE: currently root has sharp bias, no accidental minimizing logic
        const rootDiatonic = Helpers.semitonesToNearestDiatonic(this.rootSemitones);
        const rootPitch = new Pitch().fromCoord([rootDiatonic, this.rootSemitones]);

        for (let i = 0; i < this.integerNotation.length; i++) {
            const m = this.integerNotation[i];

            if (m === this.rootSemitones) {
                this.intervals.push(new Interval('P1'));
                this.pitches.push(rootPitch);
                continue;
            }

            for (let j = 0; j < intervals.length; j++) {
                const curInterval = intervals[j];
                const [curIntervalDiatonic, curIntervalSemitones] = curInterval.coord();
                // reference diatonic and semitone values built off of root
                // NOTE: these are in root position
                const refDiatonic = curIntervalDiatonic + rootPitch.diatonic();
                const refSemitones = curIntervalSemitones + rootPitch.semitones();

                // check if current interval matches current pitch in integer notation
                if (Helpers.simplifySemitones(m) === Helpers.simplifySemitones(refSemitones)) {
                    // we need to transform our reference values to be in correct octave
                    // this can most likely can be simplified
                    let curSemitones: number = refSemitones;
                    let curDiatonic = refDiatonic;
                    while (curSemitones !== m) {
                        if (curSemitones > m) {
                            curSemitones -= SEMITONES_PER_OCTAVE;
                            curDiatonic -= DIATONICS_PER_OCTAVE;
                        } else {
                            curSemitones += SEMITONES_PER_OCTAVE;
                            curDiatonic += DIATONICS_PER_OCTAVE;
                        }
                    }

                    const pitch = new Pitch().fromCoord([curDiatonic, m]);

                    this.intervals.push(new Interval().fromPitchRange(rootPitch, pitch));
                    this.pitches.push(pitch);
                    continue;
                }
            }
        }
    }
}

export default IntegerChord;
