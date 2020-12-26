/**
 * Chord and sonority definitions
 * This is where we add definitions, aliases, etc
 */

interface StringMap {
    [key: string]: string;
}

const SONORITIES: StringMap = <const>{
    M: 'M',
    Mm7: 'Mm7',
    MM7: 'MM7',
    m: 'm',
    mm7: 'mm',
    mM7: 'mM7',
    d: 'd',
};

export const SONORITY_DEFINITIONS: StringMap = <const>{
    'P1,M3,P5': SONORITIES.M,
    'P1,m3,P5': SONORITIES.m,
    'P1,m3,d5': SONORITIES.d,
};
