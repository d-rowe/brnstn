import {Chord, Pitch} from '../../src';

describe('Chord', () => {
    describe('#serialize', () => {
        it('should create correct interval signature', () => {
            expect(chordFromSpns(['F4', 'A4', 'C5']).serialize()).toEqual('P1,M3,P5');
            expect(chordFromSpns(['E4', 'G4', 'B4']).serialize()).toEqual('P1,m3,P5');
            expect(chordFromSpns(['B3', 'D4', 'F4']).serialize()).toEqual('P1,m3,d5');
        });
    });

    describe('#name', () => {
        it('should provide correct names for root position chords', () => {
            expect(chordFromSpns(['F4', 'A4', 'C5']).name()).toEqual('FM');
            expect(chordFromSpns(['F4', 'Ab4', 'C5']).name()).toEqual('Fm');
            expect(chordFromSpns(['C4', 'Eb4', 'Gb4']).name()).toEqual('Cd');
        });
    });
});

function chordFromSpns(spns: string[]): Chord {
    const pitches = spns.map(spn => new Pitch(spn));
    return new Chord(pitches);
}
