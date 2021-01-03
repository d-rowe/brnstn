import Helpers from '../Helpers';
import Interval from '../Interval';
import Pitch from '../Pitch';
import {DIATONICS_PER_OCTAVE, SEMITONES_PER_OCTAVE} from '../constants';
import {MIDI_SERIAL_SONORITY_MAP, SONORITY_INTERVALS} from './definitions';

type RootSonorityCache = {
    sonority: string;
    root: number;
} | null;

export default class MidiChord {
    private _midiNums: number[] = [];
    private _rootSonorityCache: RootSonorityCache = null;
    private _pitchesCache: Pitch[] = [];

    constructor(midiNums?: number[]) {
        this._midiNums = midiNums || [];
    }

    /**
     * Tries to find a matching sonority definition match
     * built from a given root
     */
    private _getSonorityForRoot(root: number): string {
        const rootRelativeMidi = this._midiNums.map(m => {
            let current = m - root;

            while (current <= 0) {
                current += SEMITONES_PER_OCTAVE;
            }

            return current % SEMITONES_PER_OCTAVE;
        });

        const sortedRootRelativeMidi = rootRelativeMidi.sort((a, b) => a - b);
        const serialized = sortedRootRelativeMidi.join(',');

        return MIDI_SERIAL_SONORITY_MAP[serialized] || '';
    }

    /**
     * Inverts and normalizes midi number array to find
     * a matching sonority definition and caches the result
     *
     * This is the main parsing algorithm
     */
    private _getOrSetRootSonorityCache(): RootSonorityCache {
        if (this._rootSonorityCache) {
            return this._rootSonorityCache;
        }

        for (let i = 0; i < this._midiNums.length; i++) {
            // We're going to try each note as a potential root
            // as the chord can be inverted
            const root = this._midiNums[i];
            const sonority = this._getSonorityForRoot(root);

            if (sonority) {
                this._rootSonorityCache = {root, sonority};
                return this._rootSonorityCache;
            }
        }

        this._rootSonorityCache = null;

        return this._rootSonorityCache;
    }

    root(): Pitch {
        this._getOrSetRootSonorityCache();
        if (!this._rootSonorityCache) {
            return new Pitch({});
        }

        return new Pitch({semitones: this._rootSonorityCache.root});
    }

    setMidi(midiNums: number[]): void {
        this._rootSonorityCache = null;
        this._pitchesCache = [];

        this._midiNums = midiNums;
    }

    sonority(): string {
        this._getOrSetRootSonorityCache();
        if (!this._rootSonorityCache) {
            return '';
        }

        return this._rootSonorityCache.sonority;
    }

    pitches(): Pitch[] {
        if (this._pitchesCache.length !== 0) {
            return this._pitchesCache;
        }

        this._getOrSetRootSonorityCache();
        if (!this._rootSonorityCache) {
            return [];
        }

        const {root: rootMidi, sonority} = this._rootSonorityCache;
        const intervalNames = SONORITY_INTERVALS[sonority];
        const intervals = intervalNames.map(name => new Interval({name}));
        const rootDiatonic = Helpers.semitonesToNearestDiatonic(rootMidi);
        const rootPitch = new Pitch({coord: [rootDiatonic, rootMidi]});

        this._pitchesCache = [];

        this._midiNums.forEach(m => {
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
