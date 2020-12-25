import {Chord, Pitch} from '../src';

describe('Chord', () => {
    describe('#intervalNames', () => {
        it('should create correct array of interval names', () => {
            const chord = chordFromSpns(['F4', 'A4', 'C5']);
            expect(chord.intervalNames()).toEqual(['P1', 'M3', 'P5']);
        });
    });
});

function chordFromSpns(spns: string[]): Chord {
    const pitches = spns.map(spn => new Pitch({spn}));
    return new Chord(pitches);
}
