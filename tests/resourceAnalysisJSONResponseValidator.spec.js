import { describe, test, expect } from 'vitest';
import resourceAnalysisJSONResponseValidator from '../resourceAnalysisJSONResponseValidator';
//import responseResourceAnalysisIntervals from './dataSamples/responseResourceAnalysisIntervals.js';
import responseResourceAnalysisIntervals from './dataSamples/responseResourceAnalysisIntervals.js';
import responseResourceAnalysisTotals from './dataSamples/responseResourceAnalysisTotals.js';
describe('ResponseResourceAnalysis validation', () => {
    test('Intervals validation', () => {
        expect(() => {
            resourceAnalysisJSONResponseValidator.validate(responseResourceAnalysisIntervals);
        }).not.toThrow();
    });
    test('Totals validation', () => {
        expect(() => {
            resourceAnalysisJSONResponseValidator.validate(responseResourceAnalysisTotals);
        }).not.toThrow();
    });
});

