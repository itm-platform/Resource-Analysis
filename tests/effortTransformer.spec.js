import { describe, test, expect } from 'vitest';
import { EffortTransformer } from '../effortTransformer.js';
import responseResourceAnalysisIntervals from './dataSamples/responseResourceAnalysisIntervals.js';
import responseResourceAnalysisTotals from './dataSamples/responseResourceAnalysisTotals.js';
import intervalsByEntityAndUser from './dataSamples/intervalsByEntityAndUser.json';
import intervalsByEntityAndWorkItem from './dataSamples/intervalsByEntityAndWorkItem.json';
import intervalsByUser from './dataSamples/intervalsByUser.js';
import totalsByEntityAndUser from './dataSamples/totalsByEntityAndUser.json';
import totalsByEntityAndWorkItem from './dataSamples/totalsByEntityAndWorkItem.json';
import totalsByUser from './dataSamples/totalsByUser.js';
import fs from 'fs';
import path from 'path';

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
        expect(result).toEqual(intervalsByEntityAndWorkItem);
    });

    test('transformToIntervalsByEntity and user', () => {
        const effortTransformer = new EffortTransformer(responseResourceAnalysisIntervals);
        const result = effortTransformer.transformToIntervals('entity', 'user');
        const filePath = path.join(resultsDirPath, 'intervalsByEntityAndUserTestResult.json');
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
        expect(result).toEqual(intervalsByEntityAndUser);
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
        const filePath = path.join(resultsDirPath, 'totalsByEntityAndWorkItemTestResult.json');
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
        expect(result).toEqual(totalsByEntityAndWorkItem);
    });

    test('transformToTotalsByEntity and user', () => {
        const effortTransformer = new EffortTransformer(responseResourceAnalysisTotals);
        const result = effortTransformer.transformToTotals('entity', 'user');
        const filePath = path.join(resultsDirPath, 'totalsByEntityAndUserTestResult.json');
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
        expect(result).toEqual(totalsByEntityAndUser);
    });
    test('transformToTotalsByUser', () => {
        const effortTransformer = new EffortTransformer(responseResourceAnalysisTotals);
        const result = effortTransformer.transformToTotals('user');
        const filePath = path.join(resultsDirPath, 'totalsByUserTestResult.json');
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
        expect(result).toEqual(totalsByUser);
    });


});

