import Interval from '../src/Interval';
import Pitch from '../src/Pitch';
import { PitchCoordinate } from '../src/Constants';

describe('Interval', () => {
  describe('#constructor', () => {
    it('should calculate from pitch range correctly', () => {
      expectIntervalCoords('C4', 'C4', [0, 0]);
      expectIntervalCoords('C4', 'D4', [1, 2]);
      expectIntervalCoords('C4', 'F#6', [17, 30]);
    });
  });

  describe('#referenceOffset', () => {
    it('should get correct offset', () => {
      expectIntervalReferenceOffset('C4', 'C4', 0);
      expectIntervalReferenceOffset('C4', 'Cx4', 2);
      expectIntervalReferenceOffset('C4', 'Dbb4', -2);
      expectIntervalReferenceOffset('Bb3', 'D#4', 1);
      expectIntervalReferenceOffset('D4', 'Fbb4', -3);
    });
  });
});

function expectIntervalCoords(
  startSpn: string,
  endSpn: string,
  coord: PitchCoordinate
): void {
  const interval = new Interval({
    pitchRange: {
      start: new Pitch({ spn: startSpn }),
      end: new Pitch({ spn: endSpn }),
    },
  });

  expect(interval.coord()).toEqual(coord);
}

function expectIntervalReferenceOffset(
  startSpn: string,
  endSpn: string,
  offset: number
): void {
  const interval = new Interval({
    pitchRange: {
      start: new Pitch({ spn: startSpn }),
      end: new Pitch({ spn: endSpn }),
    },
  });

  expect(interval.referenceOffset()).toBe(offset);
}
