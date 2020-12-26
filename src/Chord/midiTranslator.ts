import {SEMITONES_PER_OCTAVE} from '../constants';
import {MIDI_SIGNATURE_SONORITIES} from './definitions';

/**
 * Inverts and normalizes midi number array to find
 * a matching sonority definition
 */
export function getSonority(midis: number[]): string {
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

        const signature = rootRelativeMidi.sort().join(',');
        const sonority = MIDI_SIGNATURE_SONORITIES[signature];

        if (sonority) {
            return sonority;
        }
    }

    return '';
}
