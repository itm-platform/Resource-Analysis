import { describe, test, expect, beforeEach, beforeAll, vi } from 'vitest';
import { RequestConstructor } from '../requestConstructor';
import mockGeneralJS from './mockGeneralJS';

import './web-components/itm-common-components.min.js'


describe('RequestConstructor Initialization', () => {
    beforeAll(async () => {
        await mockGeneralJS();
    });
    describe('RequestConstructor basics', () => {
        let requestConstructor;
        let parentDivId;
        let requestObject = {};
        let dataServiceModel;
        let parentDiv;

        beforeEach(async () => {
            // Reset the document body and setup the initial environment
            document.body.innerHTML = '';
            parentDivId = 'req-constructor-parentDivId';
            parentDiv = document.createElement('div');
            parentDiv.id = parentDivId;
            document.body.appendChild(parentDiv);

            // Setting up initial states
            requestObject.analysisMode = 'intervals';
            requestObject.filter = {
                projects: { "Program.Id": { $in: [12, 23] } },
                services: { "Program.Id": { $in: [12, 23] } }
            };
            requestObject.intervals = {
                startDate: '2021-01-01',
                intervalType: 'quarter',
                noOfIntervals: 4
            };
            requestObject.totals = {
                "dateRangeMode":"liveBetween",
                "startDate":"2024-04-21",
                "endDate":"2024-05-20"
            };
            dataServiceModel = {
                tables: {
                    tableName: {
                        labels: {},
                        fields: [{
                            name: "Id",
                            labels: { en: "Id", es: "Id", pt: "Id" },
                            type: "Number | String | Date",
                            primaryKey: true
                        }]
                    }
                },
                relationships: {
                    tableName1: {
                        tableName2: { foreignKey: "ProjectId" },
                        risks: { foreignKey: "ProjectId" }
                    }
                }
            };

            requestConstructor = new RequestConstructor(
                { analysisMode: requestObject.analysisMode, 
                    filter: requestObject.filter, 
                    intervals: requestObject.intervals,
                    totals: requestObject.totals},
                dataServiceModel, parentDivId);
            await requestConstructor._initPromise; // Wait for the initialization to complete
        });

        test('should reflect in state.totals what came in requestObject.totals', async () => {
            expect(requestConstructor.state.analysisMode).toBe(requestObject.analysisMode);
            expect(requestConstructor.state.filter).toEqual(requestObject.filter);
            expect(requestConstructor.state.intervals).toEqual(requestObject.intervals);
            expect(requestConstructor.state.totals).toEqual(requestObject.totals);


        });

        test('should dispatch "resourceAnalysisRequestUpdated" event with filter details when the button is clicked', async () => {
            await requestConstructor._initPromise
            const updateRequestButton = document.getElementById('req-constructor-updateButton');
            const eventListener = vi.fn();
            document.addEventListener('resourceAnalysisRequestUpdated', eventListener);

            updateRequestButton.click();

            expect(eventListener).toHaveBeenCalled();
            expect(eventListener.mock.calls[0][0].detail).toEqual(requestObject);
        });

    });
});

describe('RequestConstructor public methods', () => {
    beforeAll(async () => {
        await mockGeneralJS();
    });

    describe('RequestConstructor methods', () => {
        let requestConstructor;
        let parentDivId;
        let requestObject = {};
        let dataServiceModel;
        let parentDiv;

        beforeEach(async () => {
            document.body.innerHTML = '';
            parentDivId = 'req-constructor-parentDivId';
            parentDiv = document.createElement('div');
            parentDiv.id = parentDivId;
            document.body.appendChild(parentDiv);

            requestObject.analysisMode = 'intervals';
            requestObject.filter = {
                projects: { "Program.Id": { $in: [12, 23] } },
                services: { "Program.Id": { $in: [12, 23] } }
            };
            requestObject.intervals = {
                startDate: '2021-01-01',
                intervalType: 'quarter',
                noOfIntervals: 4
            };
            dataServiceModel = {
                tables: {
                    tableName: {
                        labels: {},
                        fields: [{
                            name: "Id",
                            labels: { en: "Id", es: "Id", pt: "Id" },
                            type: "Number | String | Date",
                            primaryKey: true
                        }]
                    }
                },
                relationships: {
                    tableName1: {
                        tableName2: { foreignKey: "ProjectId" },
                        risks: { foreignKey: "ProjectId" }
                    }
                }
            };

            requestConstructor = new RequestConstructor(
                { analysisMode: requestObject.analysisMode, filter: requestObject.filter, intervals: requestObject.intervals },
                dataServiceModel, parentDivId);
            await new Promise(r => setTimeout(r, 100));
        });

        test('should initialize with correct state', async () => {
            await requestConstructor._initPromise

            expect(requestConstructor.state.analysisMode).toBe(requestObject.analysisMode);
            expect(requestConstructor.state.filter).toEqual(requestObject.filter);
            expect(requestConstructor.state.intervals).toEqual(requestObject.intervals);
        });

        test('should update state on intervals change', () => {
            const intervalDropdown = document.getElementById('req-constructor-intervalType');
            const numberInput = document.getElementById('req-constructor-noOfIntervals');
            const dateInput = document.getElementById('req-constructor-interval-startDate');

            intervalDropdown.value = 'month';
            numberInput.value = '6';
            dateInput.value = '2022-01-01';

            intervalDropdown.dispatchEvent(new Event('change'));
            numberInput.dispatchEvent(new Event('change'));
            dateInput.dispatchEvent(new Event('change'));

            expect(requestConstructor.state.intervals.intervalType).toBe('month');
            expect(requestConstructor.state.intervals.noOfIntervals).toBe('6');
            expect(requestConstructor.state.intervals.startDate).toBe('2022-01-01');
        });

        test('should update state on totals change', () => {
            const totalsRadio = document.getElementById('req-constructor-totals');
            const totalsDateRangeModeDropdown = document.getElementById('req-constructor-totalsDateRangeMode');
            const startDatePicker = document.getElementById('req-constructor-totals-startDate');
            const endDatePicker = document.getElementById('req-constructor-totals-endDate');

            totalsRadio.checked = true;
            totalsRadio.dispatchEvent(new Event('change'));

            totalsDateRangeModeDropdown.value = 'strictlyBetween';
            startDatePicker.value = '2022-01-01';
            endDatePicker.value = '2022-12-31';

            totalsDateRangeModeDropdown.dispatchEvent(new Event('change'));
            startDatePicker.dispatchEvent(new Event('change'));
            endDatePicker.dispatchEvent(new Event('change'));

            expect(requestConstructor.state.analysisMode).toBe('totals');
            expect(requestConstructor.state.totals.dateRangeMode).toBe('strictlyBetween');
            expect(requestConstructor.state.totals.startDate).toBe('2022-01-01');
            expect(requestConstructor.state.totals.endDate).toBe('2022-12-31');
        });

        test('should dispatch "resourceAnalysisRequestUpdated" event with totals details when the button is clicked', async () => {
            const totalsRadio = document.getElementById('req-constructor-totals');
            totalsRadio.checked = true;
            totalsRadio.dispatchEvent(new Event('change'));

            const totalsDateRangeModeDropdown = document.getElementById('req-constructor-totalsDateRangeMode');
            const startDatePicker = document.getElementById('req-constructor-totals-startDate');
            const endDatePicker = document.getElementById('req-constructor-totals-endDate');

            totalsDateRangeModeDropdown.value = 'strictlyBetween';
            startDatePicker.value = '2022-01-01';
            endDatePicker.value = '2022-12-31';

            totalsDateRangeModeDropdown.dispatchEvent(new Event('change'));
            startDatePicker.dispatchEvent(new Event('change'));
            endDatePicker.dispatchEvent(new Event('change'));

            const updateRequestButton = document.getElementById('req-constructor-updateButton');
            const eventListener = vi.fn();
            document.addEventListener('resourceAnalysisRequestUpdated', eventListener);

            updateRequestButton.click();

            const expectedRequestObject = {
                analysisMode: 'totals',
                filter: {
                    projects: { "Program.Id": { $in: [12, 23] } },
                    services: { "Program.Id": { $in: [12, 23] } }
                },
                intervals: {
                    startDate: '2021-01-01',
                    intervalType: 'quarter',
                    noOfIntervals: 4
                },
                totals: {
                    dateRangeMode: 'strictlyBetween',
                    startDate: '2022-01-01',
                    endDate: '2022-12-31'
                }
            };

            expect(eventListener).toHaveBeenCalled();
            expect(eventListener.mock.calls[0][0].detail).toEqual(expectedRequestObject);
        });
    });
});
