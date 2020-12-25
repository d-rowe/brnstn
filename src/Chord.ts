import Interval from './Interval';
import Pitch from './Pitch';
import {PitchCoordinate} from './types';

export default class Chord {
    private _pitches: Pitch[];

    constructor(pitches: Pitch[]) {
        this._pitches = pitches;
    }

    coords(): PitchCoordinate[] {
        return this._pitches.map(p => p.coord());
    }

    pitches(): Pitch[] {
        return this._pitches;
    }

    intervalNames(): string[] {
        const pitches = this._pitches;
        const root = pitches[0];

        return pitches.map(p =>
            new Interval({
                pitchRange: {
                    start: root,
                    end: p,
                },
            }).name()
        );
    }
}
