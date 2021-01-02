import {MIDI_SERIAL_SONORITY_MAP} from './definitions';
import {SEMITONES_PER_OCTAVE} from '../constants';

interface ParsedMidiChord {
    sonority: string | null;
    root: number | null;
}

const NULL_PARSE: ParsedMidiChord = {
    sonority: null,
    root: null,
};

/**
 * NOTE: This assumes midi number array is sorted
 */
export default class MidiChord {
    private _midis: number[];

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
    parse(): ParsedMidiChord {
        for (let i = 0; i < this._midis.length; i++) {
            // We're going to try each note as a potential root
            // as the chord can be inverted
            const root = this._midis[i];
            const sonority = this._getSonorityForRoot(root);

            if (sonority) {
                return {sonority, root};
            }
        }

        return NULL_PARSE;
    }
}
