import Pitch from '../Pitch';
import Interval from '../Interval';
import {SONORITY_ALIASES_LONG, SONORITY_ALIASES_ACADEMIC} from './definitions';
import Voicing from '../Voicing';

class BaseChord {
    intervals: Interval[] = [];
    pitches: Pitch[] = [];
    sonority: string = '';
    voicing: Voicing = new Voicing();

    reset(): void {
        this.intervals = [];
        this.pitches = [];
        this.sonority = '';
        this.voicing.clearIntervals();
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
