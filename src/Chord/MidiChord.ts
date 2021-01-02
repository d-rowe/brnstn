import Helpers from '../Helpers';
import {MIDI_SERIAL_SONORITY_MAP, SONORITY_INTERVALS} from './definitions';
import {Interval, Pitch} from '..';
import {DIATONICS_PER_OCTAVE, SEMITONES_PER_OCTAVE} from '../constants';

type RootSonority = {
    sonority: string;
    root: number;
} | null;

/**
 * NOTE: This assumes midi number array is sorted
 */
export default class MidiChord {
    private _midis: number[];
    private _rootSonorityCache: RootSonority = null;
    private _pitchesCache: Pitch[] = [];

    constructor(midis: number[]) {
        this._midis = midis;
    }

    /**
     * Tries to find sonority match for a given root
     */
    private _getSonorityForRoot(root: number): string {
        const rootRelativeMidi = this._midis.map(m => {
            let current = m - root;

            while (current <= 0) {
                current += SEMITONES_PER_OCTAVE;
            }

            return current % SEMITONES_PER_OCTAVE;
        });

        const serialized = rootRelativeMidi.sort().join(',');

        return MIDI_SERIAL_SONORITY_MAP[serialized] || '';
    }

    /**
     * Inverts and normalizes midi number array to find
     * a matching sonority definition
     */
    rootSonority(): RootSonority {
        if (this._rootSonorityCache) {
            return this._rootSonorityCache;
        }

        for (let i = 0; i < this._midis.length; i++) {
            // We're going to try each note as a potential root
            // as the chord can be inverted
            const root = this._midis[i];
            const sonority = this._getSonorityForRoot(root);

            if (sonority) {
                this._rootSonorityCache = {root, sonority};
                return this._rootSonorityCache;
            }
        }

        this._rootSonorityCache = null;

        return this._rootSonorityCache;
    }

    pitches(): Pitch[] {
        if (this._pitchesCache.length !== 0) {
            return this._pitchesCache;
        }

        if (!this._rootSonorityCache) {
            this.rootSonority();

            if (!this._rootSonorityCache) {
                return [];
            }
        }

        const {root: rootMidi, sonority} = this._rootSonorityCache;
        const intervalNames = SONORITY_INTERVALS[sonority];
        const intervals = intervalNames.map(name => new Interval({name}));
        const rootDiatonic = Helpers.semitonesToNearestDiatonic(rootMidi);
        const rootPitch = new Pitch({coord: [rootDiatonic, rootMidi]});

        this._pitchesCache = [];

        this._midis.forEach(m => {
            if (m === rootMidi) {
                this._pitchesCache.push(rootPitch);
                return;
            }

            for (let i = 0; i < intervals.length; i++) {
                const [refIntervalDiatonic, refIntervalSemitones] = intervals[i].coord();
                const refDiatonic = refIntervalDiatonic + rootPitch.diatonic();
                const refSemitones = refIntervalSemitones + rootPitch.semitones();

                if (Helpers.simplifySemitones(m) === Helpers.simplifySemitones(refSemitones)) {
                    const octaveOffset = Helpers.getSemitoneOctave(m) * DIATONICS_PER_OCTAVE;
                    const diatonic = Helpers.simplifyDiatonic(refDiatonic) + octaveOffset;

                    this._pitchesCache.push(new Pitch({coord: [diatonic, m]}));
                    return;
                }
            }
        });

        return this._pitchesCache;
    }
}
