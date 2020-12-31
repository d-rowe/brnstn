import keyMirror from 'keymirror';

/**
 * Chord and sonority definitions
 * This is where we add definitions, aliases, etc
 *
 * While these could be identified dynamically, statically defining
 * these chords allows for much more control for specific definitions
 * and customizations (Ex. Neapolitan & Tristan chords)
 *
 * NOTE: If you add a definition, you will need to add to all maps,
 *       including midi.
 */

interface StringMap {
    [key: string]: string;
}

const SONORITIES: StringMap = keyMirror({
    d: null,
    m: null,
    M: null,
    A: null,
    mm: null,
    mM: null,
    Mm: null,
    MM: null,
});

interface SonorityIntervals {
    [key: string]: string[];
}

export const SONORITY_INTERVALS: SonorityIntervals = {
    [SONORITIES.d]: ['P1', 'm3', 'd5'],
    [SONORITIES.m]: ['P1', 'm3', 'P5'],
    [SONORITIES.M]: ['P1', 'M3', 'P5'],
    [SONORITIES.A]: ['P1', 'M3', 'A5'],
    [SONORITIES.mm]: ['P1', 'm3', 'P5', 'm7'],
    [SONORITIES.mM]: ['P1', 'm3', 'P5', 'M7'],
    [SONORITIES.Mm]: ['P1', 'M3', 'P5', 'm7'],
    [SONORITIES.MM]: ['P1', 'M3', 'P5', 'M7'],
};

export const SERIAL_SONORITY_MAP: StringMap = <const>{
    'P1,m3,d5': SONORITIES.d,
    'P1,m3,P5': SONORITIES.m,
    'P1,M3,P5': SONORITIES.M,
    'P1,M3,A5': SONORITIES.A,
    'P1,m3,P5,m7': SONORITIES.mm,
    'P1,m3,P5,M7': SONORITIES.mM,
    'P1,M3,P5,m7': SONORITIES.Mm,
    'P1,M3,P5,M7': SONORITIES.MM,
};

/**
 * Used for midi analysis
 *
 * This is more complicated because midi data is
 * enharmonic (61 could be C#4, Db4, Ebbb4, etc...)
 *
 * To assist with this we can compare relative differences in midi values
 * and check against this map for sonority definition
 */
export const MIDI_SERIAL_SONORITY_MAP: StringMap = <const>{
    '0,4,7': SONORITIES.M,
    '0,3,7': SONORITIES.m,
    '0,3,6': SONORITIES.d,
    '0,4,8': SONORITIES.A,
    '0,3,7,10': SONORITIES.mm,
    '0,3,7,11': SONORITIES.mM,
    '0,4,7,10': SONORITIES.Mm,
    '0,4,7,11': SONORITIES.MM,
};
