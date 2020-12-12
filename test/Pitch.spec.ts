import Pitch from '../src/Pitch';

describe('Pitch', () => {
  describe('#name', () => {
    it('gets correct name', () => {
      [
        [0, 'C'],
        [1, 'D'],
        [2, 'E'],
        [3, 'F'],
        [4, 'G'],
        [5, 'A'],
        [6, 'B'],
        [7, 'C'],
      ].forEach(([diatonic, name]) => {
        // @ts-ignore
        expect(new Pitch(diatonic).name()).toBe(name);
      });
    });
  });

  describe('#getSPN', () => {
    it('parses names correctly', () => {
      testSpnValues([
        ['C0', 0, 0],
        ['D0', 1, 2],
        ['E0', 2, 4],
        ['F0', 3, 5],
        ['G0', 4, 7],
        ['A0', 5, 9],
        ['B0', 6, 11],
      ]);
    });

    it('parses accidentals correctly', () => {
      testSpnValues([
        ['Cbbb0', 0, -3],
        ['Cbb0', 0, -2],
        ['Cb0', 0, -1],
        ['C#0', 0, 1],
        ['Cx0', 0, 2],
        ['Cx#0', 0, 3],
        ['C###0', 0, 3],
      ]);
    });

    it('parses octaves correctly', () => {
      testSpnValues([
        ['C0', 0, 0],
        ['C1', 7, 12],
        ['C2', 14, 24],
        ['C3', 21, 36],
      ]);
    });
  });
});

function testSpnValues(expected: [string, number, number][]) {
  expected.forEach(([spn, diatonic, midi]) => {
    const pitch = new Pitch().fromSpn(spn);
    expect(pitch.diatonic()).toBe(diatonic);
    expect(pitch.midi()).toBe(midi);
  });
}
