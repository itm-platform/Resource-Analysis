import { describe, test, expect } from 'vitest';
import resourceAnalysisJSONResponseValidator from '../resourceAnalysisJSONResponseValidator';
import responseResourceAnalysis from './dataSamples/responseResourceAnalysis.js';
describe('ResponseResourceAnalysis validation', () => {
    test.only('validate', () => {
        const user1Task2Interval1 = responseResourceAnalysis.Entities.find(e => e.Id === "project1").WorkItems.find(w => w.Id === "task2").AssignedEfforts.find(a => a.UserId === "user1").Intervals.find(i => i.IntervalId === 1);
        console.log(user1Task2Interval1); // Log the problematic interval
        expect(user1Task2Interval1.Capacity).toBe(2400); // Assert expected capacity

        expect(() => {
            resourceAnalysisJSONResponseValidator.validate(responseResourceAnalysis);
        }).not.toThrow();
    });
});