import {IntegerChord} from '../src/Chord';

describe('IntegerChord', () => {
    describe('#root', () => {
        it('should calculate correct root', () => {
            expect(new IntegerChord([2, 6, 9]).root().spn()).toBe('D0');
            expect(new IntegerChord([6, 10, 15]).root().spn()).toBe('D#1');
        });
    });

    describe('#academicShortSonority', () => {
        it('should calculate correct academic short sonority', () => {
            expect(new IntegerChord([2, 6, 9]).academicShortSonority()).toBe('M');
            expect(new IntegerChord([6, 10, 15]).academicShortSonority()).toBe('m');
            expect(new IntegerChord([0, 4, 7, 11]).academicShortSonority()).toBe('M7');
            expect(new IntegerChord([0, 10, 7, 4]).academicShortSonority()).toBe('7');
            expect(new IntegerChord([0, 10, 7, 4, 12]).academicShortSonority()).toBe('7');
        });
    });

    describe('#pitches', () => {
        it('should return correct pitches', () => {
            const pitches = new IntegerChord([6, 10, 15]).pitches();
            const pitchSpns = pitches.map(p => p.spn());

            expect(pitchSpns).toEqual(['F#0', 'A#0', 'D#1']);
        });
    });

    describe('#intervals', () => {
        it('should return correct intervals while preserving voicing', () => {
            const chord = new IntegerChord([0, 10, 7, 4, 12, 10, 16]);
            const intervalNames = chord.intervals().map(i => i.name());

            expect(intervalNames).toEqual(['P1', 'm7', 'P5', 'M3', 'P8', 'm7', 'M10']);
        });
    });
});
