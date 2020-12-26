import Interval from '../Interval';
import Pitch from '../Pitch';
import {PitchCoordinate} from '../types';
import {SIGNATURE_SONORITIES} from './definitions';

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

    intervalSignature(): string {
        return getIntervalSignature(this._pitches);
    }

    sonority(): string {
        const signature = this.intervalSignature();
        const match = SIGNATURE_SONORITIES[signature];

        if (!match) {
            return '';
        }

        return match;
    }
}

function getIntervalSignature(pitches: Pitch[]) {
    const root = pitches[0];

    const intervals = pitches.map(p => {
        const curInterval = new Interval({
            pitchRange: {
                start: root,
                end: p,
            },
        });

        return curInterval.name();
    });

    return intervals.join(',');
}
