import keyMirror from 'keymirror';

/**
 * Chord and sonority definitions
 * This is where we add definitions, aliases, etc
 *
 * While these could be identified dynamically, statically defining
 * these chords allows for much more control for specific definitions
 * and customizations (Ex. Neapolitan & Tristan chords)
 *
 * Wikipedia is generally a good source for validating chord definitions
 *
 * NOTE: If you add a definition, you will need to add to all maps,
 *       including integer notation.
 *
 *       There can be multiple sonority map entries per chord (ex 5th-less voicing)
 */

type StringMap = {
    [key: string]: string;
};

export const SONORITIES: StringMap = keyMirror({
    // Triads
    DIMINISHED: null,
    MINOR: null,
    MAJOR: null,
    AUGMENTED: null,

    // Seventh chords
    DIMINISHED_SEVENTH: null,
    HALF_DIMINISHED_SEVENTH: null,
    MINOR_SEVENTH: null,
    MINOR_MAJOR_SEVENTH: null,
    DOMINANT_SEVENTH: null,
    MAJOR_SEVENTH: null,

    // Ninth chords
    MINOR_NINTH: null,
    DOMINANT_MINOR_NINTH: null,
    DOMINANT_NINTH: null,
    MAJOR_NINTH: null,

    // Suspending chords
    SUSPENDED_SECOND: null,
    SUSPENDED_FORTH: null,
});

type SonorityIntervals = {
    [key: string]: string[];
};

export const SONORITY_INTERVALS: SonorityIntervals = {
    // Triads
    [SONORITIES.DIMINISHED]: ['P1', 'm3', 'd5'],
    [SONORITIES.MINOR]: ['P1', 'm3', 'P5'],
    [SONORITIES.MAJOR]: ['P1', 'M3', 'P5'],
    [SONORITIES.AUGMENTED]: ['P1', 'M3', 'A5'],

    // Seventh chords
    [SONORITIES.DIMINISHED_SEVENTH]: ['P1', 'm3', 'd5', 'd7'],
    [SONORITIES.HALF_DIMINISHED_SEVENTH]: ['P1', 'm3', 'd5', 'm7'],
    [SONORITIES.MINOR_SEVENTH]: ['P1', 'm3', 'P5', 'm7'],
    [SONORITIES.MINOR_MAJOR_SEVENTH]: ['P1', 'm3', 'P5', 'M7'],
    [SONORITIES.DOMINANT_SEVENTH]: ['P1', 'M3', 'P5', 'm7'],
    [SONORITIES.MAJOR_SEVENTH]: ['P1', 'M3', 'P5', 'M7'],

    // Ninth chords
    [SONORITIES.MINOR_NINTH]: ['P1', 'm3', 'P5', 'm7', 'm9'],
    [SONORITIES.DOMINANT_MINOR_NINTH]: ['P1', 'M3', 'P5', 'm7', 'm9'],
    [SONORITIES.DOMINANT_NINTH]: ['P1', 'M3', 'P5', 'm7', 'M9'],
    [SONORITIES.MAJOR_NINTH]: ['P1', 'M3', 'P5', 'M7', 'M9'],

    // Suspended chords
    [SONORITIES.SUSPENDED_SECOND]: ['P1', 'M2', 'P5'],
    [SONORITIES.SUSPENDED_FORTH]: ['P1', 'P4', 'P5'],
};

export const SERIAL_SONORITY_MAP: StringMap = <const>{
    // Triads
    'P1,m3,d5': SONORITIES.DIMINISHED,
    'P1,m3,P5': SONORITIES.MINOR,
    'P1,M3,P5': SONORITIES.MAJOR,
    'P1,M3,A5': SONORITIES.AUGMENTED,

    // Seventh chords
    'P1,m3,d5,d7': SONORITIES.DIMINISHED_SEVENTH,
    'P1,m3,d5,m7': SONORITIES.HALF_DIMINISHED_SEVENTH,
    'P1,m3,m7': SONORITIES.MINOR_SEVENTH,
    'P1,m3,P5,m7': SONORITIES.MINOR_SEVENTH,
    'P1,m3,M7': SONORITIES.MINOR_MAJOR_SEVENTH,
    'P1,m3,P5,M7': SONORITIES.MINOR_MAJOR_SEVENTH,
    'P1,M3,m7': SONORITIES.DOMINANT_SEVENTH,
    'P1,M3,P5,m7': SONORITIES.DOMINANT_SEVENTH,
    'P1,M3,M7': SONORITIES.MAJOR_SEVENTH,
    'P1,M3,P5,M7': SONORITIES.MAJOR_SEVENTH,

    // Ninth chords
    'P1,m3,m7,m9': SONORITIES.MINOR_NINTH,
    'P1,m3,P5,m7,m9': SONORITIES.MINOR_NINTH,
    'P1,M3,m7,m9': SONORITIES.DOMINANT_MINOR_NINTH,
    'P1,M3,P5,m7,m9': SONORITIES.DOMINANT_MINOR_NINTH,
    'P1,M3,m7,M9': SONORITIES.DOMINANT_NINTH,
    'P1,M3,P5,m7,M9': SONORITIES.DOMINANT_NINTH,
    'P1,M3,M7,M9': SONORITIES.MAJOR_NINTH,
    'P1,M3,P5,M7,M9': SONORITIES.MAJOR_NINTH,

    // Suspended chords
    'P1,M2,P5': SONORITIES.SUSPENDED_SECOND,
    'P1,P4,P5': SONORITIES.SUSPENDED_FORTH,
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
    // Triads
    '0,4,7': SONORITIES.MAJOR,
    '0,3,7': SONORITIES.MINOR,
    '0,3,6': SONORITIES.DIMINISHED,
    '0,4,8': SONORITIES.AUGMENTED,

    // Seventh chords
    '0,3,6,9': SONORITIES.DIMINISHED_SEVENTH,
    '0,3,6,10': SONORITIES.HALF_DIMINISHED_SEVENTH,
    '0,3,10': SONORITIES.MINOR_SEVENTH,
    '0,3,7,10': SONORITIES.MINOR_SEVENTH,
    '0,3,11': SONORITIES.MINOR_MAJOR_SEVENTH,
    '0,3,7,11': SONORITIES.MINOR_MAJOR_SEVENTH,
    '0,4,10': SONORITIES.DOMINANT_SEVENTH,
    '0,4,7,10': SONORITIES.DOMINANT_SEVENTH,
    '0,4,11': SONORITIES.MAJOR_SEVENTH,
    '0,4,7,11': SONORITIES.MAJOR_SEVENTH,

    // Ninth chords
    '0,1,4,10': SONORITIES.MINOR_NINTH,
    '0,1,4,7,10': SONORITIES.MINOR_NINTH,
    '0,2,3,10': SONORITIES.DOMINANT_MINOR_NINTH,
    '0,2,3,7,10': SONORITIES.DOMINANT_MINOR_NINTH,
    '0,2,4,10': SONORITIES.DOMINANT_NINTH,
    '0,2,4,7,10': SONORITIES.DOMINANT_NINTH,
    '0,2,4,11': SONORITIES.MAJOR_NINTH,
    '0,2,4,7,11': SONORITIES.MAJOR_NINTH,

    // Suspended chords
    '0,2,7': SONORITIES.SUSPENDED_SECOND,
    '0,5,7': SONORITIES.SUSPENDED_FORTH,
};

export const SONORITY_ALIASES_ACADEMIC: StringMap = <const>{
    // Triads
    [SONORITIES.DIMINISHED]: 'd',
    [SONORITIES.MINOR]: 'm',
    [SONORITIES.MAJOR]: 'M',
    [SONORITIES.AUGMENTED]: 'A',

    // Seventh chords
    [SONORITIES.DIMINISHED_SEVENTH]: 'd7',
    [SONORITIES.HALF_DIMINISHED_SEVENTH]: 'hd7',
    [SONORITIES.MINOR_SEVENTH]: 'm7',
    [SONORITIES.MINOR_MAJOR_SEVENTH]: 'mM7',
    [SONORITIES.DOMINANT_SEVENTH]: '7',
    [SONORITIES.MAJOR_SEVENTH]: 'M7',

    // Ninth chords
    [SONORITIES.MINOR_NINTH]: 'm9',
    [SONORITIES.DOMINANT_MINOR_NINTH]: 'C7♭9',
    [SONORITIES.DOMINANT_NINTH]: 'C9',
    [SONORITIES.MAJOR_NINTH]: 'CM9',

    // Suspended chords
    [SONORITIES.SUSPENDED_SECOND]: 'sus2',
    [SONORITIES.SUSPENDED_FORTH]: 'sus4',
};

export const SONORITY_ALIASES_LONG: StringMap = <const>{
    // Triads
    [SONORITIES.DIMINISHED]: 'diminished',
    [SONORITIES.MINOR]: 'minor',
    [SONORITIES.MAJOR]: 'major',
    [SONORITIES.AUGMENTED]: 'augmented',

    // Seventh chords
    [SONORITIES.DIMINISHED_SEVENTH]: 'diminished seventh',
    [SONORITIES.HALF_DIMINISHED_SEVENTH]: 'half-diminished seventh',
    [SONORITIES.MINOR_SEVENTH]: 'minor seventh',
    [SONORITIES.MINOR_MAJOR_SEVENTH]: 'minor major seventh',
    [SONORITIES.DOMINANT_SEVENTH]: 'dominant seventh',
    [SONORITIES.MAJOR_SEVENTH]: 'major seventh',

    // Ninth chords
    [SONORITIES.MINOR_NINTH]: 'minor ninth',
    [SONORITIES.DOMINANT_MINOR_NINTH]: 'dominant minor ninth',
    [SONORITIES.DOMINANT_NINTH]: 'dominant ninth',
    [SONORITIES.MAJOR_NINTH]: 'major ninth',

    // Suspended chords
    [SONORITIES.SUSPENDED_SECOND]: 'suspended second',
    [SONORITIES.SUSPENDED_FORTH]: 'suspended forth',
};
