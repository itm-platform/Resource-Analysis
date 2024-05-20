import { describe, test, expect, beforeEach, beforeAll, vi } from 'vitest';
import { RequestConstructor } from '../requestConstructor';
import mockGeneralJS from './mockGeneralJS';


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
            await new Promise(r => setTimeout(r, 100)); // Wait 100ms for the DOM to update
        });

        test('should dispatch "requestUpdated" event with filter details when the button is clicked', async () => {
            await new Promise(r => setTimeout(r, 100)); // Wait 100ms for the DOM to update
            const updateRequestButton = document.getElementById('req-constructor-updateButton');
            const eventListener = vi.fn();
            document.addEventListener('requestUpdated', eventListener);

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
            await new Promise(r => setTimeout(r, 100));

            expect(requestConstructor.state.requestAnalysisMode).toBe(requestObject.analysisMode);
            expect(requestConstructor.state.requestFilter).toEqual(requestObject.filter);
            expect(requestConstructor.state.requestIntervals).toEqual(requestObject.intervals);
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

            expect(requestConstructor.state.requestIntervals.intervalType).toBe('month');
            expect(requestConstructor.state.requestIntervals.noOfIntervals).toBe('6');
            expect(requestConstructor.state.requestIntervals.startDate).toBe('2022-01-01');
        });

        test('should update state on totals change', () => {
            const totalsRadio = document.getElementById('req-constructor-totals');
            const totalsDateRangeModeDropdown = document.getElementById('req-constructor-totalsDateRangeMode');
            const startDatePicker = document.getElementById('req-constructor-totals-startDate');
            const endDatePicker = document.getElementById('req-constructor-totals-endDate');

            totalsRadio.checked = true;
            totalsRadio.dispatchEvent(new Event('change'));

            totalsDateRangeModeDropdown.value = 'Strictly between';
            startDatePicker.value = '2022-01-01';
            endDatePicker.value = '2022-12-31';

            totalsDateRangeModeDropdown.dispatchEvent(new Event('change'));
            startDatePicker.dispatchEvent(new Event('change'));
            endDatePicker.dispatchEvent(new Event('change'));

            expect(requestConstructor.state.requestAnalysisMode).toBe('totals');
            console.log(`requestConstructor.state = ${JSON.stringify(requestConstructor.state)}   `);
            expect(requestConstructor.state.requestFilter.projects.StartDate.$bt).toEqual(['2022-01-01', '2022-12-31']);
            expect(requestConstructor.state.requestFilter.projects.EndDate.$bt).toEqual(['2022-01-01', '2022-12-31']);
        });

        test('should dispatch "requestUpdated" event with totals details when the button is clicked', async () => {
            const totalsRadio = document.getElementById('req-constructor-totals');
            totalsRadio.checked = true;
            totalsRadio.dispatchEvent(new Event('change'));

            const totalsDateRangeModeDropdown = document.getElementById('req-constructor-totalsDateRangeMode');
            const startDatePicker = document.getElementById('req-constructor-totals-startDate');
            const endDatePicker = document.getElementById('req-constructor-totals-endDate');

            totalsDateRangeModeDropdown.value = 'Strictly between';
            startDatePicker.value = '2022-01-01';
            endDatePicker.value = '2022-12-31';

            totalsDateRangeModeDropdown.dispatchEvent(new Event('change'));
            startDatePicker.dispatchEvent(new Event('change'));
            endDatePicker.dispatchEvent(new Event('change'));

            const updateRequestButton = document.getElementById('req-constructor-updateButton');
            const eventListener = vi.fn();
            document.addEventListener('requestUpdated', eventListener);

            updateRequestButton.click();

            const expectedRequestObject = {
                analysisMode: 'totals',
                filter: {
                    projects: {
                        StartDate: { $bt: ['2022-01-01', '2022-12-31'] },
                        EndDate: { $bt: ['2022-01-01', '2022-12-31'] }
                    },
                    services: { "Program.Id": { $in: [12, 23] } }
                }
            };

            expect(eventListener).toHaveBeenCalled();
            expect(eventListener.mock.calls[0][0].detail).toEqual(expectedRequestObject);
        });
    });
});
