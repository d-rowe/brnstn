import {getSonority} from '../../src/Chord/midiTranslator';

describe('midiTranslator', () => {
    describe('#getMidisSonority', () => {
        it('should find correct sonority', () => {
            expect(getSonority([2, 6, 9])).toBe('M');
            expect(getSonority([6, 3, 10])).toBe('m');
            expect(getSonority([4, -5, 22])).toBe('d');
        });
    });
});
