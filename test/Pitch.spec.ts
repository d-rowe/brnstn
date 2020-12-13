import { PitchCoordinate } from '../src/Constants';
import Pitch from '../src/Pitch';

describe('Pitch', () => {
  describe('#constructor', () => {
    it('parses names correctly', () => {
      expectSpnCoords([
        ['C0', [0, 0]],
        ['D0', [1, 2]],
        ['E0', [2, 4]],
        ['F0', [3, 5]],
        ['G0', [4, 7]],
        ['A0', [5, 9]],
        ['B0', [6, 11]],
      ]);
    });

    it('parses accidentals correctly', () => {
      expectSpnCoords([
        ['Cbbb0', [0, -3]],
        ['Cbb0', [0, -2]],
        ['Cb0', [0, -1]],
        ['C#0', [0, 1]],
        ['Cx0', [0, 2]],
        ['Cx#0', [0, 3]],
        ['C###0', [0, 3]],
      ]);
    });

    it('parses octaves correctly', () => {
      expectSpnCoords([
        ['C0', [0, 0]],
        ['C1', [7, 12]],
        ['C2', [14, 24]],
        ['C3', [21, 36]],
      ]);
    });
  });
});

function expectSpnCoords(expected: [string, PitchCoordinate][]): void {
  expected.forEach(([spn, coord]) => {
    const pitch = new Pitch({ spn });
    expect(pitch.coord()).toEqual(coord);
  });
}
