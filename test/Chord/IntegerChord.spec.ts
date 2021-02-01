import {IntegerChord} from '../../src/Chord';

describe('IntegerChord', () => {
    describe('#root', () => {
        it('should calculate correct root', () => {
            expect(new IntegerChord([2, 6, 9]).root().spn()).toBe('D0');
            expect(new IntegerChord([6, 10, 15]).root().spn()).toBe('D#1');
        });
    });

    describe('#academicShortSonority', () => {
        it('should calculate correct academic short sonority', () => {
            expect(new IntegerChord([2, 6, 9]).sonorityAcademic()).toBe('M');
            expect(new IntegerChord([6, 10, 15]).sonorityAcademic()).toBe('m');
            expect(new IntegerChord([0, 4, 7, 11]).sonorityAcademic()).toBe('M7');
            expect(new IntegerChord([0, 10, 7, 4]).sonorityAcademic()).toBe('7');
            expect(new IntegerChord([0, 10, 7, 4, 12]).sonorityAcademic()).toBe('7');
        });
    });

    describe('#setPitchesAndIntervals', () => {
        describe('pitches', () => {
            it('should set correct pitches', () => {
                expectSpns([6, 10, 15], ['F#0', 'A#0', 'D#1']);
                expectSpns([8, 12, 15], ['G#0', 'B#0', 'D#1']);
            });
        });

        describe('intervals', () => {
            it('should set correct intervals while preserving voicing', () => {
                const chord = new IntegerChord([0, 10, 7, 4, 12, 10, 16]);
                const intervalNames = chord.intervals.map(i => i.name());

                expect(intervalNames).toEqual(['P1', 'm7', 'P5', 'M3', 'P8', 'm7', 'M10']);
            });
        });

        describe('voicing', () => {
            it('should return correct voicings', () => {
                expectVoicing([0, 4, 7], ['P1', 'M3', 'P5']);
                expectVoicing([4, 7, 0], ['M3', 'P5', 'P1']);
                expectVoicing([7, 11, 12, 16], ['P5', 'M7', 'P1', 'M3']);
            });
        });
    });
});

function expectSpns(semitones: number[], expectedSpns: string[]): void {
    const pitches = new IntegerChord(semitones).pitches;
    const pitchSpns = pitches.map(p => p.spn());

    expect(pitchSpns).toEqual(expectedSpns);
}

function expectVoicing(semitones: number[], expectedVoicing: string[]): void {
    expect(new IntegerChord(semitones).voicing.voicing()).toEqual(expectedVoicing);
}
