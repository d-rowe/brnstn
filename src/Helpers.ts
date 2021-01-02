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

    getSemitoneOctave(semitone: number): number {
        return Math.floor(semitone / SEMITONES_PER_OCTAVE);
    },

    diatonicToSemitones(diatonic: number) {
        const simpleDiatonic = this.simplifyDiatonic(diatonic);
        const octave = this.getDiatonicOctave(diatonic);
        const octaveSemitones = octave * SEMITONES_PER_OCTAVE;

        return SCALE_SEMITONES[simpleDiatonic] + octaveSemitones;
    },

    semitonesToNearestDiatonic(semitones: number): number {
        const simpleSemitones = this.simplifySemitones(semitones);
        const octave = this.getSemitoneOctave(semitones);

        let minDiff = Infinity;
        let closestDiatonic = 0;

        for (let diatonic = 0; diatonic < SCALE_SEMITONES.length; diatonic++) {
            const refSemitones = SCALE_SEMITONES[diatonic];
            const octaveOffset = octave * DIATONICS_PER_OCTAVE;

            if (simpleSemitones === refSemitones) {
                return diatonic + octaveOffset;
            }

            const diff = Math.abs(simpleSemitones - refSemitones);
            if (diff < minDiff) {
                minDiff = diff;
                closestDiatonic = diatonic + octaveOffset;
            }
        }

        return closestDiatonic;
    },

    simplifyDiatonic(diatonic: number): number {
        return diatonic % DIATONICS_PER_OCTAVE;
    },

    simplifySemitones(semitones: number): number {
        return semitones % SEMITONES_PER_OCTAVE;
    },
};
