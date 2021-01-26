import Pitch from '../Pitch';
import Interval from '../Interval';
import {SONORITY_ALIASES_LONG, SONORITY_ALIASES_ACADEMIC} from './definitions';

class BaseChord {
    intervals: Interval[] = [];
    pitches: Pitch[] = [];
    sonority: string = '';

    reset(): void {
        this.intervals = [];
        this.pitches = [];
        this.sonority = '';
    }

    root(): Pitch {
        throw new Error('Not implemented');
    }

    sonorityLong(): string {
        return SONORITY_ALIASES_LONG[this.sonority] || '';
    }

    sonorityAcademic(): string {
        return SONORITY_ALIASES_ACADEMIC[this.sonority] || '';
    }
}

export default BaseChord;
