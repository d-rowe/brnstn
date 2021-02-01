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

        it('should set correct full voicing', () => {
            const intervalNames = ['P1', 'M3'];
            const intervals = intervalNames.map(n => new Interval(n));
            expect(new Voicing(intervals).full).toEqual(intervalNames);
        });

        it('should set correct simple voicing', () => {
            const intervalNames = ['P1', 'M3'];
            const intervals = intervalNames.map(n => new Interval(n));
            expect(new Voicing(intervals).simple).toEqual(['1', '3']);
        });
    });
});
