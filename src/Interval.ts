import {DIATONICS_PER_OCTAVE, SCALE_SEMITONES, SEMITONES_PER_OCTAVE} from './constants';
import {PitchCoordinate} from './types';
import Helpers from './Helpers';
import Pitch from './Pitch';

const PERFECT_INTERVALS = new Set<number>([1, 4, 5]);
const QUALITIES = {d: 'd', m: 'm', M: 'M', P: 'P', A: 'A'};
const NAME_REGEX = /^([d|m|M|P|A]*)([1-9]*)$/;

const PERFECT_OFFSETS_QUALITIES = new Map<number, string>([
    [-1, QUALITIES.d],
    [0, QUALITIES.P],
    [1, QUALITIES.A],
]);

const MAJOR_OFFSETS_QUALITIES = new Map<number, string>([
    [-2, QUALITIES.d],
    [-1, QUALITIES.m],
    [0, QUALITIES.M],
    [1, QUALITIES.A],
]);

const PERFECT_QUALITY_OFFSETS = new Map<string, number>([
    [QUALITIES.d, -1],
    [QUALITIES.P, 0],
    [QUALITIES.A, 1],
]);

const MAJOR_QUALITY_OFFSETS = new Map<string, number>([
    [QUALITIES.d, -2],
    [QUALITIES.m, -1],
    [QUALITIES.M, 0],
    [QUALITIES.A, 1],
]);

export default class Interval {
    private _coord: PitchCoordinate = [0, 0];

    constructor(name?: string) {
        if (!name) {
            return;
        }

        this._coord = this._getCoordFromName(name);
    }

    fromCoord(coord: PitchCoordinate): Interval {
        this._coord = coord;

        return this;
    }

    fromPitchRange(start: Pitch, end: Pitch): Interval {
        const [startDiatonic, startSemitones] = start.coord();
        const [endDiatonic, endSemitones] = end.coord();

        this._coord = [endDiatonic - startDiatonic, endSemitones - startSemitones];

        return this;
    }

    private _getCoordFromName(name: string): PitchCoordinate {
        const parsed = NAME_REGEX.exec(name);

        if (!parsed) {
            throw new Error(`Cannot parse invalid interval name: ${name}`);
        }

        const [, quality, intervalDiatonic] = parsed;
        const intervalDiatonicNum = Number(intervalDiatonic);
        const simpleIntervalDiatonic = Helpers.simplifyDiatonic(intervalDiatonicNum);
        const diatonic = intervalDiatonicNum - 1;
        let semitones = Helpers.diatonicToSemitones(diatonic);

        const offsetMap = PERFECT_INTERVALS.has(simpleIntervalDiatonic)
            ? PERFECT_QUALITY_OFFSETS
            : MAJOR_QUALITY_OFFSETS;

        for (let i = 0; i < quality.length; i++) {
            const qualityChar = quality[i];
            semitones += offsetMap.get(qualityChar) || 0;
        }

        return [diatonic, semitones];
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

    invert(): Interval {
        return new Interval().fromCoord([
            DIATONICS_PER_OCTAVE - this.simpleDiatonic(),
            SEMITONES_PER_OCTAVE - this.simpleSemitones(),
        ]);
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
        return new Interval().fromCoord(this.simpleCoord());
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
        const offsetMap = isPerfectType ? PERFECT_OFFSETS_QUALITIES : MAJOR_OFFSETS_QUALITIES;
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
