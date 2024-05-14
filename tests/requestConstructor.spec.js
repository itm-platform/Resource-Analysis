import { describe, test, expect, beforeEach, beforeAll, vi } from 'vitest';
import { RequestConstructor } from '../requestConstructor'; // Adjust the path as necessary
async function mockGeneralJS() {
    const diContainer = (function () {
        const _services = {};

        function register(name, service) {
            _services[name] = service;
        }

        function get(name) {
            const service = _services[name];
            if (!service) {
                throw new Error(`Service not found: ${name}`);
            }
            return service;
        }

        function getServices() {
            return _services;
        }

        return { register, get, getServices };
    })();

    global.window.diContainer = diContainer;

    const errorHandler = { logFrontEndError: vi.fn() };
    const languageLoader = {
        getTranslations: vi.fn().mockResolvedValue({
            t: vi.fn((key) => `Translated: ${key}`)  // Mocks translation function t
        })
    };

    diContainer.register('logFrontEndError', errorHandler.logFrontEndError);
    diContainer.register('getTranslations', async () => await languageLoader.getTranslations());

    global.window.diContainerReady = true;
    global.window.dispatchEvent(new CustomEvent('diContainerReady'));

    global.window.itmGlobal = {
        ensureDiContainerReady: function () {
            return new Promise((resolve) => {
                if (window.diContainerReady) {
                    resolve();
                } else {
                    window.addEventListener('diContainerReady', resolve);
                }
            });
        }
    };

    global.window.getJSVersion = function () {
        const today = new Date();
        return today.toISOString().substring(0, 10); // Formats the date as YYYY-MM-DD
    };
}


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

        beforeEach(() => {
            // Reset the document body and setup the initial environment
            document.body.innerHTML = '';
            parentDivId = 'filterDiv';
            parentDiv = document.createElement('div');
            parentDiv.id = parentDivId;
            document.body.appendChild(parentDiv);

            // Setting up initial states
            requestObject.analysisMode = 'intervals';
            requestObject.filter = {
                project: { "Program.Id": { $in: [12, 23] } },
                service: { "Program.Id": { $in: [12, 23] } }
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
        });

        test.skip('should dispatch "requestUpdated" event with filter details when the button is clicked', async () => {
            const spy = vi.fn();
            document.addEventListener('requestUpdated', spy);

            // Ensure the constructor's async operations are completed
            await requestConstructor._initPromise;

            const button = parentDiv.querySelector('button');
            button.click();

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(expect.objectContaining({
                detail: {
                    analysisMode: requestObject.analysisMode,
                    filter: requestObject.filter
                }
            }));
        });

    });
});

