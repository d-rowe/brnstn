import {
    ACADEMIC_SONORITY_ALIASES_FULL,
    ACADEMIC_SONORITY_ALIASES_SHORT,
    INTEGER_NOTATION_SERIAL_SONORITY_MAP,
    SERIAL_SONORITY_MAP,
    SONORITIES,
    SONORITY_INTERVALS,
} from '../../src/Chord/definitions';

type SonorityValueOccurences = {
    [key: string]: number;
};

describe('Chord definitions', () => {
    it('should have unique sonority intervals', () => {
        const valueOccurrences: SonorityValueOccurences = {};
        Object.values(SONORITY_INTERVALS).forEach(valArr => {
            const serializedVal = JSON.stringify(valArr);
            if (!valueOccurrences[serializedVal]) {
                valueOccurrences[serializedVal] = 0;
            }

            valueOccurrences[serializedVal] += 1;

            expect(valueOccurrences[serializedVal]).toBeLessThan(2);
        });
    });

    it('should have same amount of entries in sonority maps', () => {
        expectSameObjectSizes([INTEGER_NOTATION_SERIAL_SONORITY_MAP, SERIAL_SONORITY_MAP]);
    });

    it('should have aliases for all sonorites', () => {
        Object.keys(SONORITIES).forEach(sonority => {
            expect(ACADEMIC_SONORITY_ALIASES_FULL[sonority]).not.toBe(undefined);
            expect(ACADEMIC_SONORITY_ALIASES_SHORT[sonority]).not.toBe(undefined);
        });
    });
});

function expectSameObjectSizes(objects: Object[]) {
    const [firstObject, ...restOfObjects] = objects;

    const expectedLength = objectSize(firstObject);
    restOfObjects.forEach(obj => {
        expect(objectSize(obj)).toBe(expectedLength);
    });
}

function objectSize(object: Object) {
    return Object.keys(object).length;
}
