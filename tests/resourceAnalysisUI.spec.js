import { describe, test, expect, beforeEach, beforeAll } from 'vitest';
import { ResourceAnalysis } from '../resourceAnalysis.js';
import mockGeneralJS from './mockGeneralJS';
const VALID_TOTALS_DATE_RANGE_MODES = { liveBetween: 'liveBetween', strictlyBetween: 'strictlyBetween' };
// Simulate local storage
global.localStorage = {
    storage: {},
    setItem: function (key, value) {
        this.storage[key] = value;
    },
    getItem: function (key) {
        return this.storage[key];
    },
    removeItem: function (key) {
        delete this.storage[key];
    },
    clear: function () {
        this.storage = {};
    }
};


describe('ResourceAnalysis Initialization', () => {
    beforeAll(async () => {
        await mockGeneralJS();
    });

    beforeEach(async () => {
        // Set item in local storage as required
        localStorage.setItem('testingResourceAnalysisWithLocalFiles', 'true');

        // Simulate the necessary DOM structure
        document.body.innerHTML = `
      <div id="requestConstructorContainer"></div>
      <div id="rowSelectorContainer"></div>
      <div id="tableContainer"></div>
      <button id="loadAnalysisBtn">Load Analysis</button>
    `;
    });
    global.parentDivIds = {
        requestConstructorContainer: 'requestConstructorContainer',
        rowSelectorContainer: 'rowSelectorContainer',
        tableContainer: 'tableContainer',
        loadAnalysisBtn: 'loadAnalysisBtn'
    };

    test('ResourceAnalysis should initialize without throwing', () => {
        expect(() => {

            const resourceAnalysis = new ResourceAnalysis(parentDivIds);
        }).not.toThrow();
    });
});

describe('ResourceAnalysis _convertTotalDatesToFilters', () => {
    beforeAll(async () => {
        await mockGeneralJS();
    });

    beforeEach(async () => {
        // Set item in local storage as required
        localStorage.setItem('testingResourceAnalysisWithLocalFiles', 'true');

        // Simulate the necessary DOM structure
        document.body.innerHTML = `
      <div id="requestConstructorContainer"></div>
      <div id="rowSelectorContainer"></div>
      <div id="tableContainer"></div>
      <button id="loadAnalysisBtn">Load Analysis</button>
    `;
        global.parentDivIds = {
            requestConstructorContainer: 'requestConstructorContainer',
            rowSelectorContainer: 'rowSelectorContainer',
            tableContainer: 'tableContainer',
            loadAnalysisBtn: 'loadAnalysisBtn'
        };
    });

    test("_convertTotalDatesToFilters should return correct filters for liveBetween", () => {
        const totals = {
            "dateRangeMode": "liveBetween",
            "startDate": "2024-04-21",
            "endDate": "2024-05-20"
        };
        const resourceAnalysis = new ResourceAnalysis(parentDivIds);
        const filterTotals = resourceAnalysis._convertTotalDatesToFilters(totals);
        expect(filterTotals).toEqual({
            projects: {
                StartDate: { '$lte': '2024-05-20' },
                EndDate: { '$gte': '2024-04-21' }
            },
            services: {
                StartDate: { '$lte': '2024-05-20' },
                EndDate: { '$gte': '2024-04-21' }
            }
        });
    });
    test("_convertTotalDatesToFilters should return correct filters for strictlyBetween", () => {
        const totals = {
            "dateRangeMode": "strictlyBetween",
            "startDate": "2024-04-21",
            "endDate": "2024-05-20"
        };
        const resourceAnalysis = new ResourceAnalysis(parentDivIds);
        const filterTotals = resourceAnalysis._convertTotalDatesToFilters(totals);
        expect(filterTotals).toEqual(
            {
                "projects":
                {
                    "StartDate": { "$bt": ["2024-04-21", "2024-05-20"] },
                    "EndDate": { "$bt": ["2024-04-21", "2024-05-20"] }
                },
                "services": {
                    "StartDate": { "$bt": ["2024-04-21", "2024-05-20"] },
                    "EndDate": { "$bt": ["2024-04-21", "2024-05-20"] }
                }
            }
        );

    });
});

describe('ResourceAnalysis _mixFiltersForRequest', () => {
    beforeAll(async () => {
        await mockGeneralJS();
    });

    beforeEach(async () => {
        // Set item in local storage as required
        localStorage.setItem('testingResourceAnalysisWithLocalFiles', 'true');

        // Simulate the necessary DOM structure
        document.body.innerHTML = `
      <div id="requestConstructorContainer"></div>
      <div id="rowSelectorContainer"></div>
      <div id="tableContainer"></div>
      <button id="loadAnalysisBtn">Load Analysis</button>
    `;
        global.parentDivIds = {
            requestConstructorContainer: 'requestConstructorContainer',
            rowSelectorContainer: 'rowSelectorContainer',
            tableContainer: 'tableContainer',
            loadAnalysisBtn: 'loadAnalysisBtn'
        };
    });

    test("Basic Merge with No Conflicts", () => {
        const resourceAnalysis = new ResourceAnalysis(parentDivIds);
        const preFilter = { "projects": { "Id": 12 } };
        let totalsFilter;
        const filter = {
            "projects": {
                "StartDate": { "$bt": ["2024-04-21", "2024-05-20"] },
                "EndDate": { "$bt": ["2024-04-21", "2024-05-20"] }
            }
        };
        const expectedFilter = {
            "projects": {
                "Id": 12,
                "StartDate": { "$bt": ["2024-04-21", "2024-05-20"] },
                "EndDate": { "$bt": ["2024-04-21", "2024-05-20"] }
            }
        };
        expect(resourceAnalysis._mixFiltersForRequest(preFilter, totalsFilter, filter)).toEqual(expectedFilter);

    });
    test("Merge with TotalsFilter", () => {
        const resourceAnalysis = new ResourceAnalysis(parentDivIds);
        const preFilter = { "projects": { "Id": 12 } };
        const totalsFilter = { "projects": { "Name": "Project X" } };
        const filter = {
            "projects": {
                "StartDate": { "$bt": ["2024-04-21", "2024-05-20"] },
                "EndDate": { "$bt": ["2024-04-21", "2024-05-20"] }
            }
        };
        const expectedFilter = {
            "projects": {
                "Id": 12,
                "Name": "Project X",
                "StartDate": { "$bt": ["2024-04-21", "2024-05-20"] },
                "EndDate": { "$bt": ["2024-04-21", "2024-05-20"] }
            }
        };
        expect(resourceAnalysis._mixFiltersForRequest(preFilter, totalsFilter, filter)).toEqual(expectedFilter);
    });
    test("Empty PreFilter and Filter", () => {
        const resourceAnalysis = new ResourceAnalysis(parentDivIds);
        const preFilter = {};
        const totalsFilter = { "projects": { "Name": "Project Y" } };
        const filter = {};
        const expectedFilter = { "projects": { "Name": "Project Y" } };
        expect(resourceAnalysis._mixFiltersForRequest(preFilter, totalsFilter, filter)).toEqual(expectedFilter);
    });
    test("Null TotalsFilter", () => {
        const resourceAnalysis = new ResourceAnalysis(parentDivIds);
        const preFilter = { "tasks": { "Id": 34 } };
        let totalsFilter = null;
        const filter = {
            "tasks": {
                "DueDate": { "$bt": ["2024-06-01", "2024-06-30"] }
            }
        };
        const expectedFilter = {
            "tasks": {
                "Id": 34,
                "DueDate": { "$bt": ["2024-06-01", "2024-06-30"] }
            }
        };
        expect(resourceAnalysis._mixFiltersForRequest(preFilter, totalsFilter, filter)).toEqual(expectedFilter);
    });
    test("Conflict between preFilter and totalsFilter", () => {
        const resourceAnalysis = new ResourceAnalysis(parentDivIds);
        const preFilter = { "users": { "Id": 78, "Name": "John" } };
        const totalsFilter = { "users": { "Name": "Doe" } };
        const filter = {
            "users": {
                "Age": { "$gt": 25 }
            }
        };
        const expectedFilter = {
            "users": {
                "Id": 78,
                "Name": "John",
                "Age": { "$gt": 25 }
            }
        };
        expect(resourceAnalysis._mixFiltersForRequest(preFilter, totalsFilter, filter)).toEqual(expectedFilter);
    });
    test("Conflict Between PreFilter and Filter", () => {
        const resourceAnalysis = new ResourceAnalysis(parentDivIds);
        const preFilter = { "users": { "Id": 78, "Name": "John" } };
        const totalsFilter = {};
        const filter = { "users": { "Name": "Doe" } };
        const expectedFilter = { "users": { "Id": 78, "Name": "John" } };
        expect(resourceAnalysis._mixFiltersForRequest(preFilter, totalsFilter, filter)).toEqual(expectedFilter);
    });
    test("Conflict Between TotalsFilter and Filter", () => {
        const resourceAnalysis = new ResourceAnalysis(parentDivIds);
        const preFilter = {};
        const totalsFilter = { "projects": { "Name": "Project Z" } };
        const filter = { "projects": { "Name": "Project Y" } };
        const expectedFilter = { "projects": { "Name": "Project Z" } };
        expect(resourceAnalysis._mixFiltersForRequest(preFilter, totalsFilter, filter)).toEqual(expectedFilter);
    });
    test("Conflict in All Filters", () => {
        const resourceAnalysis = new ResourceAnalysis(parentDivIds);
        const preFilter = { "tasks": { "Id": 1, "Priority": "High" } };
        const totalsFilter = { "tasks": { "Priority": "Medium" } };
        const filter = { "tasks": { "Priority": "Low" } };
        const expectedFilter = { "tasks": { "Id": 1, "Priority": "High" } };
        expect(resourceAnalysis._mixFiltersForRequest(preFilter, totalsFilter, filter)).toEqual(expectedFilter);
    });
    test("Multiple Nested Conflicts", () => {
        const resourceAnalysis = new ResourceAnalysis(parentDivIds);
        const preFilter = {
            "projects": {
                "Id": 100,
                "Details": { "Manager": "Alice" }
            }
        };
        const totalsFilter = {
            "projects": {
                "Details": { "Manager": "Bob", "Budget": 1000 }
            }
        };
        const filter = {
            "projects": {
                "Details": { "Manager": "Charlie", "Deadline": "2024-12-31" }
            }
        };
        const expectedFilter = {
            "projects": {
                "Id": 100,
                "Details": {
                    "Manager": "Alice",
                    "Budget": 1000,
                    "Deadline": "2024-12-31"
                }
            }
        };
        expect(resourceAnalysis._mixFiltersForRequest(preFilter, totalsFilter, filter)).toEqual(expectedFilter);
    });
    test("No Conflicts with Empty Nested Objects", () => {
        const resourceAnalysis = new ResourceAnalysis(parentDivIds);
        const preFilter = { "projects": {} };
        const totalsFilter = { "projects": {} };
        const filter = {
            "projects": {
                "StartDate": { "$bt": ["2024-04-21", "2024-05-20"] },
                "EndDate": { "$bt": ["2024-04-21", "2024-05-20"] }
            }
        };
        const expectedFilter = {
            "projects": {
                "StartDate": { "$bt": ["2024-04-21", "2024-05-20"] },
                "EndDate": { "$bt": ["2024-04-21", "2024-05-20"] }
            }
        };
        expect(resourceAnalysis._mixFiltersForRequest(preFilter, totalsFilter, filter)).toEqual(expectedFilter);
    });
    

});