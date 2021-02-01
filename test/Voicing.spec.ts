import Voicing from '../src/Voicing';
import Interval from '../src/Interval';

describe('Voicing', () => {
    describe('#constructor', () => {
        it('should set intervals to empty array if not provided', () => {
            expect(new Voicing().intervals).toEqual([]);
        });

        it('should set intervals if provided', () => {
            const intervalNames = ['P1', 'M3'];
            const intervals = intervalNames.map(n => new Interval(n));
            expect(new Voicing(intervals).intervals).toEqual(intervals);
        });
    });

    describe('#voicing', () => {
        it('should return correct voicing', () => {
            const intervalNames = ['P1', 'M3'];
            const intervals = intervalNames.map(n => new Interval(n));
            expect(new Voicing(intervals).voicing()).toEqual(intervalNames);
        });
    });
});
