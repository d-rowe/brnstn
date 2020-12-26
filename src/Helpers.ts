import {DIATONICS_PER_OCTAVE, SEMITONES_PER_OCTAVE, SCALE_SEMITONES} from './constants';
import {PitchCoordinate} from './types';

export default {
    absCoord(coord: PitchCoordinate): PitchCoordinate {
        const [diatonic, semitones] = coord;
        const direction = diatonic >= 0 ? 1 : -1;
        return [Math.abs(diatonic), semitones * direction];
    },

    getDiatonicOctave(diatonic: number): number {
        return Math.floor(diatonic / DIATONICS_PER_OCTAVE);
    },

    diatonicToSemitones(diatonic: number) {
        const simpleDiatonic = this.simplifyDiatonic(diatonic);
        const octave = this.getDiatonicOctave(diatonic);
        const octaveSemitones = octave * SEMITONES_PER_OCTAVE;

        return SCALE_SEMITONES[simpleDiatonic] + octaveSemitones;
    },

    simplifyDiatonic(diatonic: number): number {
        return diatonic % DIATONICS_PER_OCTAVE;
    },

    simplifySemitones(semitones: number): number {
        return semitones % SEMITONES_PER_OCTAVE;
    },
};
