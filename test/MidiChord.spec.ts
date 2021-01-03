import {MidiChord} from '../src/Chord';

describe('MidiChord', () => {
    describe('#root', () => {
        it('should calculate correct sonority and root', () => {
            expect(new MidiChord([2, 6, 9]).root().spn()).toBe('D0');
            expect(new MidiChord([6, 10, 15]).root().spn()).toBe('D#1');
        });
    });

    describe('#sonority', () => {
        it('should calculate correct sonority and root', () => {
            expect(new MidiChord([2, 6, 9]).sonority()).toBe('M');
            expect(new MidiChord([6, 10, 15]).sonority()).toBe('m');
            expect(new MidiChord([0, 4, 7, 11]).sonority()).toBe('MM');
            expect(new MidiChord([0, 10, 7, 4]).sonority()).toBe('Mm');
        });
    });

    describe('#pitches', () => {
        it('should return correct pitches', () => {
            const pitches = new MidiChord([6, 10, 15]).pitches();
            const pitchSpns = pitches.map(p => p.spn());

            expect(pitchSpns).toEqual(['F#0', 'A#0', 'D#1']);
        });
    });
});
