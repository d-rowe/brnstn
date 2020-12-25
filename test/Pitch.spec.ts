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
      expect(pitchFromSpn('Ebbb4').accidentalOffset()).toBe(-3);
      expect(pitchFromSpn('Cb4').accidentalOffset()).toBe(-1);
      expect(pitchFromSpn('D5').accidentalOffset()).toBe(0);
      expect(pitchFromSpn('A#3').accidentalOffset()).toBe(1);
      expect(pitchFromSpn('Fx12').accidentalOffset()).toBe(2);
      expect(pitchFromSpn('Gxx2').accidentalOffset()).toBe(4);
    });
  });

  describe('#accidental', () => {
    it('should calculate correct accidental', () => {
      expect(pitchFromSpn('Ebbb4').accidental()).toBe('bbb');
      expect(pitchFromSpn('Cb4').accidental()).toBe('b');
      expect(pitchFromSpn('D5').accidental()).toBe('');
      expect(pitchFromSpn('A#3').accidental()).toBe('#');
      expect(pitchFromSpn('Fx12').accidental()).toBe('x');
      expect(pitchFromSpn('Ax#4').accidental()).toBe('x#');
      expect(pitchFromSpn('Gxx2').accidental()).toBe('xx');
    });
  });

  describe('#letter', () => {
    it('should calculate correct letter', () => {
      expect(pitchFromSpn('Ebbb4').letter()).toBe('E');
      expect(pitchFromSpn('Cb4').letter()).toBe('C');
      expect(pitchFromSpn('d5').letter()).toBe('D');
      expect(pitchFromSpn('A#3').letter()).toBe('A');
      expect(pitchFromSpn('Fx12').letter()).toBe('F');
      expect(pitchFromSpn('gxx2').letter()).toBe('G');
    });
  });

  describe('#octave', () => {
    it('should calculate correct octave', () => {
      expect(pitchFromSpn('Ebbb4').octave()).toBe(4);
      expect(pitchFromSpn('Cb4').octave()).toBe(4);
      expect(pitchFromSpn('D5').octave()).toBe(5);
      expect(pitchFromSpn('A#3').octave()).toBe(3);
      expect(pitchFromSpn('Fx12').octave()).toBe(12);
      expect(pitchFromSpn('Gxx2').octave()).toBe(2);
    });
  });
});

function pitchFromSpn(spn: string): Pitch {
  return new Pitch({ spn });
}

function expectSpnCoords(expected: [string, PitchCoordinate][]): void {
  expected.forEach(([spn, coord]) => {
    expect(pitchFromSpn(spn).coord()).toEqual(coord);
  });
}
