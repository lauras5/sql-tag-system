import * as mediaQueryManager from '../src';

describe('rhythmic-breakpoints', () => {
    it('Has Correct API', () => {
        const keys = Object.keys(mediaQueryManager);
        expect(keys.length).toBe(6);
        expect(keys).toMatchSnapshot();
    });
});
