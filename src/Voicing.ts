import Interval from './Interval';

class Voicing {
    intervals: Interval[] = [];
    full: string[] = [];
    simple: string[] = [];

    constructor(intervals?: Interval[]) {
        if (!intervals) {
            return;
        }

        this.appendInterval = this.appendInterval.bind(this);

        intervals.forEach(this.appendInterval);
    }

    appendInterval(interval: Interval): Interval[] {
        this.intervals.push(interval);

        const name = interval.name();
        const nameMatch = name.match(/\d+/);
        this.full.push(name);
        this.simple.push((nameMatch && nameMatch[0]) || '');

        return this.intervals;
    }

    clearIntervals(): void {
        this.intervals = [];
        this.full = [];
        this.simple = [];
    }
}

export default Voicing;
