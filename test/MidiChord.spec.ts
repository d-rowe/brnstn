import MidiChord from '../src/MidiChord';
// import MidiChord from '../src/MidiChord';

describe('midiTranslator', () => {
    describe('#sonority', () => {
        it('should find correct sonority', () => {
            expect(new MidiChord([2, 6, 9]).sonority()).toBe('M');
            expect(new MidiChord([3, 6, 10]).sonority()).toBe('m');
        });
    });
});
