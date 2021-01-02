import {MidiChord} from '../src/Chord';

describe('MidiChord', () => {
    describe('#parse', () => {
        it('should calculate correct sonority and root', () => {
            expect(new MidiChord([2, 6, 9]).parse()).toEqual({sonority: 'M', root: 2});
            expect(new MidiChord([6, 10, 15]).parse()).toEqual({sonority: 'm', root: 15});
        });
    });
});
