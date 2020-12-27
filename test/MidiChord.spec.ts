import {parse} from '../src/MidiChord';

describe('midiTranslator', () => {
    describe('#parse', () => {
        it('should find correct sonority', () => {
            expect(parse([2, 6, 9])).toEqual({semitones: [0, 4, 7], sonority: 'M'});
            expect(parse([6, 3, 10])).toEqual({semitones: [0, 3, 7], sonority: 'm'});
            expect(parse([4, -5, 22])).toEqual({semitones: [0, 3, 6], sonority: 'd'});
        });
    });
});
