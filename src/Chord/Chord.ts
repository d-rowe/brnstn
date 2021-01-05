import Interval from '../Interval';
import Pitch from '../Pitch';
import {PitchCoordinate} from '../types';
import {SERIAL_SONORITY_MAP} from './definitions';

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
        const rootName = `${root.letter()}${root.accidental()}`;
        const sonority = this.sonority();

        return `${rootName}${sonority}`;
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

    sonority(): string {
        const serialized = this.serialize();
        const match = SERIAL_SONORITY_MAP[serialized];

        if (!match) {
            return '';
        }

        return match;
    }
}
