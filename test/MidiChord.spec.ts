import {MidiChord} from '../src/Chord';

describe('MidiChord', () => {
    describe('#rootSonority', () => {
        it('should calculate correct sonority and root', () => {
            expect(new MidiChord([2, 6, 9]).rootSonority()).toEqual({sonority: 'M', root: 2});
            expect(new MidiChord([6, 10, 15]).rootSonority()).toEqual({sonority: 'm', root: 15});
        });
    });

    describe('#pitches', () => {
        // TODO: add cache tests
        it('should return correct pitches', () => {
            const pitches = new MidiChord([6, 10, 15]).pitches();
            const pitchSpns = pitches.map(p => p.spn());

            expect(pitchSpns).toEqual(['F#0', 'A#0', 'D#1']);
        });
    });
});
