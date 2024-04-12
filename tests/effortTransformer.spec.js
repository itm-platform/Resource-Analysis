import { describe, test, expect } from 'vitest';
import { EffortTransformer } from '../effortTransformer';
import responseResourceAnalysis from './dataSamples/responseResourceAnalysis.js';
import intervalsByEntity from './dataSamples/intervalsByEntity.js';
import intervalsByUser from './dataSamples/intervalsByUser.js';
import fs from 'fs';
import path from 'path';

// Define the directory path relative to the current script
const resultsDirPath = path.join(__dirname, 'results');

// Ensure the directory exists
if (!fs.existsSync(resultsDirPath)) {
    fs.mkdirSync(resultsDirPath, { recursive: true });
}

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

});