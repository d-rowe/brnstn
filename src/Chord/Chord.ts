import Interval from '../Interval';
import Pitch from '../Pitch';
import {PitchCoordinate} from '../types';
import {SONORITY_ALIASES_LONG, SONORITY_ALIASES_ACADEMIC, SERIAL_SONORITY_MAP} from './definitions';

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
        return SONORITY_ALIASES_LONG[this.sonority()] || '';
    }

    academicShortSonority(): string {
        return SONORITY_ALIASES_ACADEMIC[this.sonority()] || '';
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
