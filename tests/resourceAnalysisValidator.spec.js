import { describe, test, expect } from 'vitest';
import resourceAnalysisValidator from '../resourceAnalysisValidator.js';
//import responseResourceAnalysisIntervals from './dataSamples/responseResourceAnalysisIntervals.js';
import responseResourceAnalysisIntervals from './dataSamples/responseResourceAnalysisIntervals.js';
import responseResourceAnalysisTotals from './dataSamples/responseResourceAnalysisTotals.js';
describe('ResponseResourceAnalysis validation', () => {
    test('Intervals validation', () => {
        expect(() => {
            resourceAnalysisValidator.validateResponse(responseResourceAnalysisIntervals);
        }).not.toThrow();
    });
    test('Totals validation', () => {
        expect(() => {
            resourceAnalysisValidator.validateResponse(responseResourceAnalysisTotals);
        }).not.toThrow();
    });
});

describe('validateRequest method', () => {

    test('basic request validation for intervals', () => {
        const request = {
            "analysisMode": "intervals",
            "intervals": {
                "startDate": "2024-01-01",
                "intervalType": "week",
                "noOfIntervals": 5
            },
            "filter": {
                "project": {
                    "Program.Id": { "$in": [12, 23] }
                },
                "service": {
                    "Program.Id": { "$in": [12, 23] }
                }
            }
        };
        expect(() => resourceAnalysisValidator.validateRequest(request)).not.toThrow();
    });

    test('basic request validation for totals', () => {
        const request = {
            "analysisMode": "totals",
            "filter": {
                "StartDate": { "$lte": "2023-11-30" },
                "EndDate": { "$gte": "2023-09-01" }
            }
        };
        expect(() => resourceAnalysisValidator.validateRequest(request)).not.toThrow();
    });

    test('should throw if analysisMode is missing or invalid', () => {
        expect(() => resourceAnalysisValidator.validateRequest({})).toThrow('Invalid analysisMode: must be either "intervals" or "totals".');
        expect(() => resourceAnalysisValidator.validateRequest({ analysisMode: 'average' })).toThrow('Invalid analysisMode: must be either "intervals" or "totals".');
    });

    test('should throw if intervals are required but missing', () => {
        expect(() => resourceAnalysisValidator.validateRequest({ analysisMode: 'intervals' })).toThrow('Intervals section is required for analysisMode "intervals".');
    });

    test('should throw if intervals.startDate is invalid or missing', () => {
        expect(() => resourceAnalysisValidator.validateRequest({ analysisMode: 'intervals', intervals: {} })).toThrow('Invalid or missing startDate in intervals.');
    });

    test('should throw if intervals.intervalType is invalid or missing', () => {
        expect(() => resourceAnalysisValidator.validateRequest({
            analysisMode: 'intervals',
            intervals: { startDate: '2023-01-01' }
        })).toThrow('Invalid or missing intervalType in intervals.');
    });

    test('should throw if intervals.intervalType is not one of the accepted values', () => {
        expect(() => resourceAnalysisValidator.validateRequest({
            analysisMode: 'intervals',
            intervals: { startDate: '2023-01-01', intervalType: 'year' }
        })).toThrow('Invalid intervalType in intervals. Must be one of: day, week, month, quarter.');
    });

    test('should throw if intervals.noOfIntervals is invalid or missing', () => {
        expect(() => resourceAnalysisValidator.validateRequest({
            analysisMode: 'intervals',
            intervals: { startDate: '2023-01-01', intervalType: 'day' }
        })).toThrow('Invalid or missing noOfIntervals in intervals.');
    });

    test('should validate correctly if all fields are provided correctly for intervals', () => {
        expect(() => resourceAnalysisValidator.validateRequest({
            analysisMode: 'intervals',
            intervals: {
                startDate: '2023-01-01',
                intervalType: 'day',
                noOfIntervals: 5
            }
        })).not.toThrow();
    });

    test('should throw if filter is provided but invalid', () => {
        expect(() => resourceAnalysisValidator.validateRequest({
            analysisMode: 'totals',
            filter: { project: 'incorrect type' }
        })).toThrow('Filter for project should be an object with valid query parameters.');
    });

    test('should not throw for valid totals request with no filters', () => {
        expect(() => resourceAnalysisValidator.validateRequest({
            analysisMode: 'totals'
        })).not.toThrow();
    });

    test('should not throw for valid totals request with correct filters', () => {
        expect(() => resourceAnalysisValidator.validateRequest({
            analysisMode: 'totals',
            filter: {
                project: { id: 123 }
            }
        })).not.toThrow();
    });
});
