import Interval from './Interval';

class Voicing {
    intervals: Interval[] = [];

    constructor(intervals?: Interval[]) {
        if (!intervals) {
            return;
        }

        this.intervals = intervals;
    }

    appendInterval(interval: Interval): Interval[] {
        this.intervals.push(interval);

        return this.intervals;
    }

    clearIntervals(): void {
        this.intervals = [];
    }

    voicing(): string[] {
        return this.intervals.map(interval => interval.name());
    }
}

export default Voicing;
