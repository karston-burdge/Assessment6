const {shuffleArray} = require('./utils')
const {bots} = require('./data');

describe('shuffleArray should randomize the order of input array', () => {
    test('copy of array is the same', () => 
        expect(shuffleArray(bots)).toContain(bots)
    );
    test('copy of array is the same length', () => 
        expect(shuffleArray(bots)).toHaveLength(bots.length)
    );
})