import {MIDI_SERIAL_SONORITY_MAP} from './Chord/definitions';
import {SEMITONES_PER_OCTAVE} from './constants';

/**
 * NOTE: This assumes midi number array is sorted
 */
export default class MidiChord {
    private _midis: number[];

    constructor(midis: number[]) {
        this._midis = midis;
    }

    /**
     * Inverts and normalizes midi number array to find
     * a matching sonority definition
     */
    sonority(): string {
        for (let i = 0; i < this._midis.length; i++) {
            // We're going to try each note as a potential root
            // as the chord can be inverted
            const potentialRoot = this._midis[i];

            const sonority = this._inversionSonority(potentialRoot);

            if (sonority) {
                return sonority;
            }
        }

        return '';
    }

    private _inversionSonority(root: number): string {
        let serialized = '';

        this._midis.forEach((m, i) => {
            let current = m - root;

            while (current < 0) {
                current += SEMITONES_PER_OCTAVE;
            }

            const relativeCurrent = current % SEMITONES_PER_OCTAVE;

            if (i === this._midis.length - 1) {
                serialized += relativeCurrent;
            } else {
                serialized += `${relativeCurrent},`;
            }
        });

        return MIDI_SERIAL_SONORITY_MAP[serialized] || '';
    }
}
