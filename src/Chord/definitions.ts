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
 *       including integer notation.
 */

type StringMap = {
    [key: string]: string;
};

const SONORITIES: StringMap = keyMirror({
    DIMINISHED: null,
    MINOR: null,
    MAJOR: null,
    AUGMENTED: null,
    MINOR_SEVENTH: null,
    MINOR_MAJOR_SEVENTH: null,
    DOMINANT_SEVENTH: null,
    MAJOR_SEVENTH: null,
    MINOR_NINTH: null,
    DOMINANT_MINOR_NINTH: null,
    DOMINANT_NINTH: null,
    MAJOR_NINTH: null,
});

type SonorityIntervals = {
    [key: string]: string[];
};

export const SONORITY_INTERVALS: SonorityIntervals = {
    [SONORITIES.DIMINISHED]: ['P1', 'm3', 'd5'],
    [SONORITIES.MINOR]: ['P1', 'm3', 'P5'],
    [SONORITIES.MAJOR]: ['P1', 'M3', 'P5'],
    [SONORITIES.AUGMENTED]: ['P1', 'M3', 'A5'],
    [SONORITIES.MINOR_SEVENTH]: ['P1', 'm3', 'P5', 'm7'],
    [SONORITIES.MINOR_MAJOR_SEVENTH]: ['P1', 'm3', 'P5', 'M7'],
    [SONORITIES.DOMINANT_SEVENTH]: ['P1', 'M3', 'P5', 'm7'],
    [SONORITIES.MAJOR_SEVENTH]: ['P1', 'M3', 'P5', 'M7'],
    [SONORITIES.MINOR_NINTH]: ['P1', 'm3', 'P5', 'm7', 'm9'],
    [SONORITIES.DOMINANT_MINOR_NINTH]: ['P1', 'M3', 'P5', 'm7', 'm9'],
    [SONORITIES.DOMINANT_NINTH]: ['P1', 'M3', 'P5', 'm7', 'M9'],
    [SONORITIES.MAJOR_NINTH]: ['P1', 'M3', 'P5', 'M7', 'M9'],
};

export const SERIAL_SONORITY_MAP: StringMap = <const>{
    'P1,m3,d5': SONORITIES.DIMINISHED,
    'P1,m3,P5': SONORITIES.MINOR,
    'P1,M3,P5': SONORITIES.MAJOR,
    'P1,M3,A5': SONORITIES.AUGMENTED,
    'P1,m3,P5,m7': SONORITIES.MINOR_SEVENTH,
    'P1,m3,P5,M7': SONORITIES.MINOR_MAJOR_SEVENTH,
    'P1,M3,P5,m7': SONORITIES.DOMINANT_SEVENTH,
    'P1,M3,P5,M7': SONORITIES.MAJOR_SEVENTH,
    'P1,m3,P5,m7,m9': SONORITIES.MINOR_NINTH,
    'P1,M3,P5,m7,m9': SONORITIES.DOMINANT_MINOR_NINTH,
    'P1,M3,P5,m7,M9': SONORITIES.DOMINANT_NINTH,
    'P1,M3,P5,M7,M9': SONORITIES.MAJOR_NINTH,
};

/**
 * Used for identifying chords in interval notation
 * https://en.wikipedia.org/wiki/Pitch_class#Integer_notation
 *
 * This is more complicated because we do not have harmonic information
 * unlike with note names
 *
 * To assist with this we can compare relative differences in integer values
 * and check against this map for sonority definition
 */
export const INTEGER_NOTATION_SERIAL_SONORITY_MAP: StringMap = <const>{
    '0,4,7': SONORITIES.MAJOR,
    '0,3,7': SONORITIES.MINOR,
    '0,3,6': SONORITIES.DIMINISHED,
    '0,4,8': SONORITIES.AUGMENTED,
    '0,3,7,10': SONORITIES.MINOR_SEVENTH,
    '0,3,7,11': SONORITIES.MINOR_MAJOR_SEVENTH,
    '0,4,7,10': SONORITIES.DOMINANT_SEVENTH,
    '0,4,7,11': SONORITIES.MAJOR_SEVENTH,
    '0,1,4,7,10': SONORITIES.MINOR_NINTH,
    '0,2,3,7,10': SONORITIES.DOMINANT_MINOR_NINTH,
    '0,2,4,7,10': SONORITIES.DOMINANT_NINTH,
    '0,2,4,7,11': SONORITIES.MAJOR_NINTH,
};

export const ACADEMIC_SONORITY_ALIASES_SHORT: StringMap = <const>{
    [SONORITIES.DIMINISHED]: 'd',
    [SONORITIES.MINOR]: 'm',
    [SONORITIES.MAJOR]: 'M',
    [SONORITIES.AUGMENTED]: 'A',
    [SONORITIES.MINOR_SEVENTH]: 'm7',
    [SONORITIES.MINOR_MAJOR_SEVENTH]: 'mM7',
    [SONORITIES.DOMINANT_SEVENTH]: '7',
    [SONORITIES.MAJOR_SEVENTH]: 'M7',
    [SONORITIES.MINOR_NINTH]: 'm9',
    [SONORITIES.DOMINANT_MINOR_NINTH]: 'C7♭9',
    [SONORITIES.DOMINANT_NINTH]: 'C9',
    [SONORITIES.MAJOR_NINTH]: 'CM9',
};

export const ACADEMIC_SONORITY_ALIASES_FULL: StringMap = <const>{
    [SONORITIES.DIMINISHED]: 'diminished',
    [SONORITIES.MINOR]: 'minor',
    [SONORITIES.MAJOR]: 'major',
    [SONORITIES.AUGMENTED]: 'augmented',
    [SONORITIES.MINOR_SEVENTH]: 'minor seventh',
    [SONORITIES.MINOR_MAJOR_SEVENTH]: 'minor major seventh',
    [SONORITIES.DOMINANT_SEVENTH]: 'dominant seventh',
    [SONORITIES.MAJOR_SEVENTH]: 'major seventh',
    [SONORITIES.MINOR_NINTH]: 'minor ninth',
    [SONORITIES.DOMINANT_MINOR_NINTH]: 'dominant minor ninth',
    [SONORITIES.DOMINANT_NINTH]: 'dominant ninth',
    [SONORITIES.MAJOR_NINTH]: 'major ninth',
};
