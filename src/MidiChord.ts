import {MIDI_SERIAL_SONORITY_MAP} from './Chord/definitions';
import {SEMITONES_PER_OCTAVE} from './constants';

interface ParsedMidi {
    semitones: number[];
    sonority: string;
}

export default class MidiChord {
    private _parsedMidi: ParsedMidi;

    constructor(midis: number[]) {
        this._parsedMidi = parse(midis);
    }

    parsedMidi(): ParsedMidi {
        return this._parsedMidi;
    }
}

/**
 * Inverts and normalizes midi number array to find
 * a matching sonority definition
 */
export function parse(midis: number[]): ParsedMidi {
    // TODO: Investigate potential optimizations
    for (let i = 0; i < midis.length; i++) {
        const root = midis[i];

        const rootRelativeMidi = midis.map(m => {
            let current = m - root;

            while (current < 0) {
                current += SEMITONES_PER_OCTAVE;
            }

            return current % SEMITONES_PER_OCTAVE;
        });

        const sortedSemitones = rootRelativeMidi.sort();
        const serialized = sortedSemitones.join(',');
        const sonority = MIDI_SERIAL_SONORITY_MAP[serialized];

        if (sonority) {
            return {
                semitones: sortedSemitones,
                sonority,
            };
        }
    }

    return {
        semitones: [],
        sonority: '',
    };
}
