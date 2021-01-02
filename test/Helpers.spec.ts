import {Helpers} from '../src';

describe('Helpers', () => {
    describe('#semitonesToNearestDiatonic', () => {
        it('should get closest diatonic to given semitone', () => {
            expect(Helpers.semitonesToNearestDiatonic(0)).toBe(0);
            expect(Helpers.semitonesToNearestDiatonic(2)).toBe(1);
            expect(Helpers.semitonesToNearestDiatonic(12)).toBe(7);
            expect(Helpers.semitonesToNearestDiatonic(15)).toBe(8);
            expect(Helpers.semitonesToNearestDiatonic(26)).toBe(15);
        });
    });
});
