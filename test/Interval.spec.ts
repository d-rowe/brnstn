import {Interval, Pitch} from '../src';
import {PitchCoordinate} from '../src/types';

describe('Interval', () => {
    describe('#constructor', () => {
        it('should calculate coord from name correctly', () => {
            const nameCoordExpectations: [string, PitchCoordinate][] = [
                ['P1', [0, 0]],
                ['d2', [1, 0]],
                ['m2', [1, 1]],
                ['M2', [1, 2]],
                ['A2', [1, 3]],
                ['d11', [10, 16]],
                ['P11', [10, 17]],
                ['A11', [10, 18]],
            ];

            nameCoordExpectations.forEach(([name, coord]) => {
                expect(new Interval(name).coord()).toEqual(coord);
            });
        });

        it('should calculate coord from pitch range correctly', () => {
            expectPitchRangeCoords([
                ['C4', 'C4', [0, 0]],
                ['C4', 'D4', [1, 2]],
                ['C4', 'F#6', [17, 30]],
            ]);
        });
    });

    describe('#absCoord', () => {
        it('should leave ascending coordinates unchanged', () => {
            const interval = new Interval().fromCoord([12, 36]);
            expect(interval.absCoord()).toEqual([12, 36]);
        });

        it('should return ascending coordinate for descending coordinate', () => {
            const interval = new Interval().fromCoord([-12, -36]);
            expect(interval.absCoord()).toEqual([12, 36]);
        });
    });

    describe('#name', () => {
        it('should calculate correct names', () => {
            expectNames([
                ['C4', 'G4', 'P5'],
                ['G4', 'C4', 'P5'],
                ['Bb4', 'D6', 'M10'],
            ]);
        });
    });

    describe('#qualityOffset', () => {
        it('should get correct offset', () => {
            expectQualityOffsets([
                ['D4', 'Fbb4', -3],
                ['C4', 'Dbb4', -2],
                ['F4', 'D4', -1],
                ['C4', 'C4', 0],
                ['C4', 'G4', 0],
                ['G5', 'C4', 0],
                ['C4', 'Cx4', 2],
                ['Bb3', 'D#4', 1],
            ]);
        });
    });

    describe('#quality', () => {
        it('should get correct quality', () => {
            expectQualities([
                ['E2', 'Bx', 'AA'],
                ['C4', 'Fx4', 'AA'],
                ['G4', 'D#5', 'A'],
                ['C4', 'A4', 'M'],
                ['G4', 'G4', 'P'],
                ['G5', 'C4', 'P'],
                ['F14', 'D4', 'm'],
                ['F14', 'D#4', 'd'],
                ['Bb3', 'Dbb4', 'd'],
                ['D4', 'Fb4', 'd'],
                ['G4', 'Cbb5', 'dd'],
                ['G4', 'Cbb5', 'dd'],
                ['F4', 'Abbbb5', 'ddd'],
            ]);
        });
    });
});

function getIntervalFromSpnRange(startSpn: string, endSpn: string): Interval {
    return new Interval().fromPitchRange(new Pitch(startSpn), new Pitch(endSpn));
}

function expectPitchRangeCoords(expectations: [string, string, PitchCoordinate][]): void {
    expectations.forEach(([startSpn, endSpn, coord]) => {
        expect(getIntervalFromSpnRange(startSpn, endSpn).coord()).toEqual(coord);
    });
}

function expectNames(expectations: [string, string, string][]): void {
    expectations.forEach(([startSpn, endSpn, name]) => {
        expect(getIntervalFromSpnRange(startSpn, endSpn).name()).toBe(name);
    });
}

function expectQualityOffsets(expectations: [string, string, number][]): void {
    expectations.forEach(([startSpn, endSpn, offset]) => {
        expect(getIntervalFromSpnRange(startSpn, endSpn).qualityOffset()).toBe(offset);
    });
}

function expectQualities(expectations: [string, string, string][]): void {
    expectations.forEach(([startSpn, endSpn, quality]) => {
        expect(getIntervalFromSpnRange(startSpn, endSpn).quality()).toBe(quality);
    });
}
