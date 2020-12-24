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

  describe('#accidentalOffset', () => {
    it('should calculate correct accidental offset', () => {
      expect(new Pitch({ spn: 'Ebbb4' }).accidentalOffset()).toBe(-3);
      expect(new Pitch({ spn: 'Cb4' }).accidentalOffset()).toBe(-1);
      expect(new Pitch({ spn: 'D5' }).accidentalOffset()).toBe(0);
      expect(new Pitch({ spn: 'A#3' }).accidentalOffset()).toBe(1);
      expect(new Pitch({ spn: 'Fx12' }).accidentalOffset()).toBe(2);
      expect(new Pitch({ spn: 'Gxx2' }).accidentalOffset()).toBe(4);
    });
  });

  describe('#accidental', () => {
    it('should calculate correct accidental', () => {
      expect(new Pitch({ spn: 'Ebbb4' }).accidental()).toBe('bbb');
      expect(new Pitch({ spn: 'Cb4' }).accidental()).toBe('b');
      expect(new Pitch({ spn: 'D5' }).accidental()).toBe('');
      expect(new Pitch({ spn: 'A#3' }).accidental()).toBe('#');
      expect(new Pitch({ spn: 'Fx12' }).accidental()).toBe('x');
      expect(new Pitch({ spn: 'Gxx2' }).accidental()).toBe('xx');
    });
  });

  describe('#octave', () => {
    it('should calculate correct octave', () => {
      expect(new Pitch({ spn: 'Ebbb4' }).octave()).toBe(4);
      expect(new Pitch({ spn: 'Cb4' }).octave()).toBe(4);
      expect(new Pitch({ spn: 'D5' }).octave()).toBe(5);
      expect(new Pitch({ spn: 'A#3' }).octave()).toBe(3);
      expect(new Pitch({ spn: 'Fx12' }).octave()).toBe(12);
      expect(new Pitch({ spn: 'Gxx2' }).octave()).toBe(2);
    });
  });
});

function expectSpnCoords(expected: [string, PitchCoordinate][]): void {
  expected.forEach(([spn, coord]) => {
    const pitch = new Pitch({ spn });
    expect(pitch.coord()).toEqual(coord);
  });
}
