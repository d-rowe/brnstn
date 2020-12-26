import {SCALE_SEMITONES, SEMITONES_PER_OCTAVE} from './constants';
import {PitchCoordinate} from './types';
import Helpers from './Helpers';
import Pitch from './Pitch';

const PERFECT_INTERVALS = new Set<number>([1, 4, 5]);
const QUALITIES = {d: 'd', m: 'm', M: 'M', P: 'P', A: 'A'};

const PERFECT_OFFSETS = new Map<number, string>([
    [-1, QUALITIES.d],
    [0, QUALITIES.P],
    [1, QUALITIES.A],
]);

const MAJOR_OFFSETS = new Map<number, string>([
    [-2, QUALITIES.d],
    [-1, QUALITIES.m],
    [0, QUALITIES.M],
    [1, QUALITIES.A],
]);

interface Props {
    coord?: PitchCoordinate;
    pitchRange?: {
        start: Pitch;
        end: Pitch;
    };
}

export default class Interval {
    private _coord: PitchCoordinate;

    constructor({coord, pitchRange}: Props) {
        if (!coord && !pitchRange) {
            throw new Error('Interval must have either coord or pitch range');
        }

        this._coord = pitchRange
            ? this._getCoordFromPitchRange(pitchRange.start, pitchRange.end)
            : coord || [0, 0];
    }

    private _getCoordFromPitchRange(start: Pitch, end: Pitch): PitchCoordinate {
        const [startDiatonic, startSemitones] = start.coord();
        const [endDiatonic, endSemitones] = end.coord();

        return [endDiatonic - startDiatonic, endSemitones - startSemitones];
    }

    absCoord(): PitchCoordinate {
        return Helpers.absCoord(this.coord());
    }

    coord(): PitchCoordinate {
        return this._coord;
    }

    diatonic(): number {
        return this.coord()[0];
    }

    /**
     * 1 for ascending, -1 for descending
     */
    direction(): number {
        return this.diatonic() >= 0 ? 1 : -1;
    }

    /**
     * Name in shortened form (ex. P5, m3)
     */
    name(): string {
        const absDiatonic = Math.abs(this.diatonic());
        return `${this.quality()}${absDiatonic + 1}`;
    }

    octaves(): number {
        return Helpers.getDiatonicOctave(this.diatonic());
    }

    semitones(): number {
        return this.coord()[1];
    }

    simple(): Interval {
        return new Interval({coord: this.simpleCoord()});
    }

    simpleCoord(): PitchCoordinate {
        return [this.simpleDiatonic(), this.simpleSemitones()];
    }

    simpleDiatonic(): number {
        return Helpers.simplifyDiatonic(this.diatonic());
    }

    simpleSemitones(): number {
        return Helpers.simplifySemitones(this.semitones());
    }

    /**
     * Quality in shortend notation (ex. P for Perfect, m for minor)
     */
    quality(): string {
        const absSimpleDiatonic = Math.abs(this.simpleDiatonic());
        const isPerfectType = PERFECT_INTERVALS.has(absSimpleDiatonic + 1);
        const offsetMap = isPerfectType ? PERFECT_OFFSETS : MAJOR_OFFSETS;
        const offset = this.qualityOffset();
        const absOffset = Math.abs(offset);
        const match = offsetMap.get(offset);

        if (absOffset < 2 && match) {
            return match;
        }

        const simpleMatch = offsetMap.get(absOffset / offset);
        if (isPerfectType && simpleMatch) {
            return simpleMatch.repeat(absOffset);
        }

        if (offset >= 0) {
            return QUALITIES.A.repeat(absOffset);
        }

        return QUALITIES.d.repeat(absOffset - 1);
    }

    /**
     * Distance in semitones from respective reference interval
     * Similar to a pitch's concept of accidentalOffset
     *
     * Ex. B3 -> D4 returns -1 as it's 1 semitone
     *     below a major 3rd (reference interval)
     */
    qualityOffset(): number {
        const [diatonic, semitones] = this.absCoord();
        const simpleDiatonic = Helpers.simplifyDiatonic(diatonic);
        const diatonicSemitones = SCALE_SEMITONES[simpleDiatonic];
        const octave = Helpers.getDiatonicOctave(diatonic);
        const octaveSemitones = octave * SEMITONES_PER_OCTAVE;
        const referenceSemitones = diatonicSemitones + octaveSemitones;

        return semitones - referenceSemitones;
    }
}
