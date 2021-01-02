import sinon from 'sinon';
import {MidiChord} from '../src/Chord';

describe('MidiChord', () => {
    describe('#parse', () => {
        it('should calculate correct sonority and root', () => {
            expect(new MidiChord([2, 6, 9]).parse()).toEqual({sonority: 'M', root: 2});
            expect(new MidiChord([6, 10, 15]).parse()).toEqual({sonority: 'm', root: 15});
        });
    });

    describe('#pitches', () => {
        it('should parse chord if not already parsed', () => {
            const parseStub = sinon
                .stub(MidiChord.prototype, 'parse')
                .returns({sonority: 'M', root: 2});
            new MidiChord([2, 6, 9]).pitches();

            expect(parseStub.called);

            parseStub.restore();
        });
    });
});
