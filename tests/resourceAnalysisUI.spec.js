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