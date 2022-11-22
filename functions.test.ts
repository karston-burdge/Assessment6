const {shuffleArray} = require('./utils')
const {bots} = require('./data');

describe('shuffleArray should randomize the order of input array', () => {
    test('copy of array has same length', () => 
        expect(shuffleArray(bots)).toHaveLength(bots.length)
    );
    test('copy of array has same contents', () => 
        expect(shuffleArray(bots)).toContain(bots)
    );
})