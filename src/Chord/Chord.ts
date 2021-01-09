import Interval from '../Interval';
import Pitch from '../Pitch';
import {PitchCoordinate} from '../types';
import {
    ACADEMIC_SONORITY_ALIASES_FULL,
    ACADEMIC_SONORITY_ALIASES_SHORT,
    SERIAL_SONORITY_MAP,
} from './definitions';

export default class Chord {
    private _pitches: Pitch[];

    constructor(pitches: Pitch[]) {
        this._pitches = pitches;
    }

    coords(): PitchCoordinate[] {
        return this._pitches.map(p => p.coord());
    }

    name(): string {
        const root = this.root();
        return `${root.letter()}${root.accidental()}${this.academicShortSonority()}`;
    }

    pitches(): Pitch[] {
        return this._pitches;
    }

    // TODO: Handle inverted chords
    root(): Pitch {
        return this._pitches[0];
    }

    serialize(): string {
        const root = this._pitches[0];

        const intervals = this._pitches.map(p => {
            const curInterval = new Interval().fromPitchRange(root, p);

            return curInterval.name();
        });

        return intervals.join(',');
    }

    academicSonority(): string {
        return ACADEMIC_SONORITY_ALIASES_FULL[this.sonority()] || '';
    }

    academicShortSonority(): string {
        return ACADEMIC_SONORITY_ALIASES_SHORT[this.sonority()] || '';
    }

    sonority(): string {
        const serialized = this.serialize();
        const match = SERIAL_SONORITY_MAP[serialized];

        if (!match) {
            return '';
        }

        return match;
    }
}
