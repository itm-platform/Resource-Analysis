import { describe, test, expect } from 'vitest';
import { EffortTransformer } from '../effortTransformer';
import resourceAnalysisJSONResponseValidator from '../resourceAnalysisJSONResponseValidator';
import responseResourceAnalysis from './dataSamples/responseResourceAnalysis.js';
import intervalsByEntity from './dataSamples/intervalsByEntity.js';
import intervalsByUser from './dataSamples/intervalsByUser.js';
import totalsByEntity from './dataSamples/totalsByEntity.js';
import totalsByUser from './dataSamples/totalsByUser.js';
import fs from 'fs';
import path from 'path';

// Define the directory path relative to the current script
const resultsDirPath = path.join(__dirname, 'results');

// Ensure the directory exists
if (!fs.existsSync(resultsDirPath)) {
    fs.mkdirSync(resultsDirPath, { recursive: true });
}

describe('ResponseResourceAnalysis validation', () => {
    // test that the resourceAnalysisJSONResponseValidator.validate is not throwing any errors
    test('validate', () => {
        expect(() => {
            resourceAnalysisJSONResponseValidator.validate(responseResourceAnalysis);
        }).not.toThrow();
    });
});

describe('effortTransformer', () => {
    const effortTransformer = new EffortTransformer(responseResourceAnalysis);
    test('transformToIntervalsByEntity', () => {
        const result = effortTransformer.transformToIntervalsByEntity();
        const filePath = path.join(resultsDirPath, 'intervalsByEntityTestResult.json');
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
        expect(result).toEqual(intervalsByEntity);
    });

    test('transformToIntervalsByUser', () => {
        const result = effortTransformer.transformToIntervalsByUser();
        const filePath = path.join(resultsDirPath, 'intervalsByUserTestResult.json');
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
        expect(result).toEqual(intervalsByUser);
    });

    test('transformToTotalsByEntity', () => {
        const result = effortTransformer.transformToTotalsByEntity();
        const filePath = path.join(resultsDirPath, 'totalsByEntityTestResult.json');
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
        expect(result).toEqual(totalsByEntity);
    });
    test('transformToTotalsByUser', () => {
        const result = effortTransformer.transformToTotalsByUser();
        const filePath = path.join(resultsDirPath, 'totalsByUserTestResult.json');
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
        expect(result).toEqual(totalsByUser);
    });
           

});

