import {
    INTEGER_NOTATION_SERIAL_SONORITY_MAP,
    SERIAL_SONORITY_MAP,
    SONORITY_INTERVALS,
} from '../../src/Chord/definitions';

type SonorityValueOccurences = {
    [key: string]: number;
};

describe('Chord definitions', () => {
    it('SONORITY_INTERVALS should have unique values', () => {
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
