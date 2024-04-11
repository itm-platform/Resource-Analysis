import { describe, test, expect } from 'vitest';
import { EffortTransformer } from '../effortTransformer';
import responseResourceAnalysis from '../responseResourceAnalysis.js';
import intervalsByEntity from '../dataSamples/intervalsByEntity.js';
// import fs
import fs from 'fs';
describe('effortTransformer', () => {
    const effortTransformer = new EffortTransformer(responseResourceAnalysis);
    test('transformToIntervalsByEntity', () => {
        const result = effortTransformer.transformToIntervalsByEntity();
        // write the result in a file
        fs.writeFileSync('intervalsByEntityTestResult.json', JSON.stringify(result, null, 2));
        expect(result).toEqual(intervalsByEntity);
    });

});