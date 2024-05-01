import { describe, test, expect } from 'vitest';
import { EffortTransformer } from '../effortTransformer1.js';
import responseResourceAnalysisIntervals from './dataSamples/responseResourceAnalysisIntervals.js';
import responseResourceAnalysisTotals from './dataSamples/responseResourceAnalysisTotals.js';
import intervalsByEntity from './dataSamples/intervalsByEntity.js';
import intervalsByUser from './dataSamples/intervalsByUser.js';
import totalsByEntity from './dataSamples/totalsByEntity.js';
import totalsByUser from './dataSamples/totalsByUser.js';
import fs from 'fs';
import path from 'path';

//const earlyJSON=JSON.stringify(responseResourceAnalysis, null, 2); // This will print the data to be validated
// Define the directory path relative to the current script
const resultsDirPath = path.join(__dirname, 'results');

// Ensure the directory exists
if (!fs.existsSync(resultsDirPath)) {
    fs.mkdirSync(resultsDirPath, { recursive: true });
}

describe('effortTransformer', () => {
    //const effortTransformer = new EffortTransformer(responseResourceAnalysisFull);
    test('transformToIntervalsByEntity and workItem', () => {
        const effortTransformer = new EffortTransformer(responseResourceAnalysisIntervals);
        const result = effortTransformer.transformToIntervals('entity');
        const filePath = path.join(resultsDirPath, 'intervalsByEntityAndWorkItemTestResult.json');
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
        expect(result).toEqual(intervalsByEntity);
    });

    test('transformToIntervalsByEntity and user', () => {
        const effortTransformer = new EffortTransformer(responseResourceAnalysisIntervals);
        const result = effortTransformer.transformToIntervals('entity', 'user');
        const filePath = path.join(resultsDirPath, 'intervalsByEntityAndUserTestResult.json');
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
        expect(result).toEqual(intervalsByEntity);
    });

    test('transformToIntervalsByUser', () => {
        const effortTransformer = new EffortTransformer(responseResourceAnalysisIntervals);
        const result = effortTransformer.transformToIntervals('user');
        const filePath = path.join(resultsDirPath, 'intervalsByUserTestResult.json');
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
        expect(result).toEqual(intervalsByUser);
    });
 
    test('transformToTotalsByEntity and workItem', () => {
        const effortTransformer = new EffortTransformer(responseResourceAnalysisTotals);
        const result = effortTransformer.transformToTotals('entity');
        const filePath = path.join(resultsDirPath, 'totalsByEntityTestResult.json');
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
        expect(result).toEqual(totalsByEntity);
    });

    test('transformToTotalsByEntity and user', () => {
        const effortTransformer = new EffortTransformer(responseResourceAnalysisTotals);
        const result = effortTransformer.transformToTotals('entity', 'user');
        const filePath = path.join(resultsDirPath, 'totalsByEntityAndUserTestResult.json');
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
        expect(result).toEqual(totalsByEntity);
    });
    test('transformToTotalsByUser', () => {
        const effortTransformer = new EffortTransformer(responseResourceAnalysisTotals);
        const result = effortTransformer.transformToTotals('user');
        const filePath = path.join(resultsDirPath, 'totalsByUserTestResult.json');
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
        expect(result).toEqual(totalsByUser);
    });


});

