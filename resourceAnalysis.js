import resourceAnalysisValidator from './resourceAnalysisValidator.js';
import { RequestConstructor } from './requestConstructor.js';
import { PivotSelector } from './flexiPivotSelector.js';
import { FlexiTable } from './flexiTable.js';
import { FlexiRowSelector } from './flexiRowSelector.js';
import { EffortTransformer } from './effortTransformer.js';
import { mergeDeep } from './utils.js';
// TODO - A - Translations
// TODO - B - retrieve pivotConfig from the view template

const VALID_ANALYSIS_MODES = { intervals: 'intervals', totals: 'totals' };
const VALID_PIVOT_CONFIGS = { entityWorkItem: 'entity-workItem', entityUser: 'entity-user', user: 'user' };
export class ResourceAnalysis {
    /**
     * Creates an instance of ResourceAnalysis.
     * @param {string[]} parentDivIds - The IDs of the parent div elements.
     * @param {Object} [options={}] - Configuration options for the instance.
     * @param {Object} [options.prefilter] - prefilter to add to the filterConstructor.
     * @param {string} [options.viewTemplateId] - The view template ID if initializing with a view ID.
     */
    constructor(parentDivIds, options = {}) {
        this.requestConstructorDivId = parentDivIds.requestConstructorContainer;
        this.rowSelectorDivId = parentDivIds.rowSelectorContainer;
        this.tableContainerDivId = parentDivIds.tableContainer;

        this.viewTemplateId = options.viewTemplateId || null;

        this.requestConstructor = null;
        this.pivotSelector = null;
        this.flexiRowSelector = null;
        this.flexiTable = null;

        // Initialize state
        this.state = {
            request: {
                filter: {},
                analysisMode: null, // Default analysis mode
                intervals: null
            },
            pivotConfig: VALID_PIVOT_CONFIGS.entityWorkItem, // Default view configuration
            responseData: null, // Data received from the server
            transformedData: null // Data transformed for the table
        };

        this.#initComponents();
        this.#addEventListeners();
    }

    async #initComponents() {
        const dataServiceModel = []; //Dummy for now
        const viewTemplate = await this.#getViewTemplate(this.viewTemplateId);
        const requestObject = this.#extractRequestObject(viewTemplate);
        this.#setState({ request: requestObject });

        this.requestConstructor = new RequestConstructor(
            this.state.request,
            dataServiceModel, this.requestConstructorDivId);

        window.requestConstructor = this.requestConstructor; // For testing purposes

        // TODO - B - Add selected: true to the default pivotConfig, and apply the data transformation
        this.pivotSelector = new PivotSelector([
            { name: VALID_PIVOT_CONFIGS.entityWorkItem, tooltip: 'Entity - Work Item', svg: this.getSVG(VALID_PIVOT_CONFIGS.entityWorkItem) },
            { name: VALID_PIVOT_CONFIGS.entityUser, tooltip: 'Entity - User', svg: this.getSVG(VALID_PIVOT_CONFIGS.entityUser) },
            { name: VALID_PIVOT_CONFIGS.user, tooltip: 'User - Entity', svg: this.getSVG(VALID_PIVOT_CONFIGS.user) }
        ]);

        this.#fetchEffortData().then(() => {
            this.#renderFlexiTable();
        }).catch(error => console.error('Error initializing components:', error));
    }

    async #getViewTemplate(viewTemplateId) {

        const viewTemplate = await this.#fetchViewTemplate(viewTemplateId);
        if (!viewTemplate) {
            return this.#getDefaultViewTemplate();
        }
        return viewTemplate;
    }

    #fetchViewTemplate(viewTemplateId) {
        // For now, return a promise that resolves to null. 
        // The final version should call POST /retrieve Template with payload. If the viewTemplateId is null,
        // it will return the active template for the user. If there is no active template, 
        // it can either return null and we manage it in the frontend (as we do here now),
        // or it can return a default template.
        return Promise.resolve(null);

    }

    #getDefaultViewTemplate() {
        // We only need the `template` property from the view template, but we mock up the whole object
        // as definition for the templateManager we will build.
        const getDateAdjustedInDays = (days) => {
            const date = new Date(); // Current date and time
            date.setDate(date.getDate() + days); // Adjust the date by 'days'
            return date.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
        };
        return {
            viewTemplateId: 73173,
            name: 'Default View',
            description: 'Default view template',
            companyId: null,
            userId: null,
            isPrivateToUser: true,
            isActive: true,
            createdDate: new Date(),
            createdBy: null,
            lastUpdatedDate: new Date(),
            lastUpdatedBy: null,
            template: {
                analysisMode: VALID_ANALYSIS_MODES.intervals,
                intervals: {
                    startDate: getDateAdjustedInDays(-5), // 5 days ago
                    intervalType: 'day',
                    noOfIntervals: 5
                },
                filter: {},
                pivotConfig: VALID_PIVOT_CONFIGS.entityWorkItem
            }
        };
    }
    #extractRequestObject(viewTemplate) {
        // return an object with viewTemplate.template analysisMode, intervals, and filter properties
        return {
            analysisMode: viewTemplate.template.analysisMode,
            intervals: viewTemplate.template.intervals,
            filter: viewTemplate.template.filter,
        };
    }

    async #fetchEffortData() {
        const testingWithLocalFiles = localStorage.getItem('testingWithLocalFiles') === 'true';

        const { request } = this.state;
        const { analysisMode } = request;

        let responseData;

        if (testingWithLocalFiles) {
            let fileURL;
            if (analysisMode === VALID_ANALYSIS_MODES.intervals) {
                fileURL = './tests/dataSamples/responseResourceAnalysisIntervals.js';
            } else if (analysisMode === VALID_ANALYSIS_MODES.totals) {
                fileURL = './tests/dataSamples/responseResourceAnalysisTotals.js';
            }

            try {
                const module = await import(fileURL);
                responseData = module.default;
            } catch (err) {
                console.error('Error fetching data:', err);
                throw err;
            }
        } else {
            try {
                const response = await fetch('/resourceAnalysis/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(request)
                });
                responseData = await response.json();
            } catch (err) {
                console.error('Error fetching data from server:', err);
                throw err;
            }
        }

        // Common operations for handling response data
        try {
            this.#setState({ responseData });
            resourceAnalysisValidator.validateResponse(responseData);
            this.transformedData = this.#transformData(responseData, analysisMode, this.state.pivotConfig);
        } catch (err) {
            console.error('Error processing data:', err);
            throw err;
        }
    }

    #renderFlexiTable() {
        // empty the div
        document.getElementById(this.tableContainerDivId).innerHTML = '';
        this.flexiRowSelector = new FlexiRowSelector(this.rowSelectorDivId, {
            user: true, project: true, workItem: true // inject from tha parent HTML getting for the saved preferences for the user
        }, this.transformedData.rows);

        this.flexiTable = new FlexiTable(this.tableContainerDivId, this.transformedData, this.flexiRowSelector.getRows(), this.pivotSelector);
    }

    #addEventListeners() {
        document.addEventListener('requestUpdated', event => {
            console.log('Request updated:', event.detail);
            this.#setState({
                request: {
                    filter: event.detail.filter,
                    analysisMode: event.detail.analysisMode
                }
            });
            this.#fetchEffortData().then(() => {
                this.#renderFlexiTable();
            }).catch(error => console.error('Error updating data:', error));
        });

        document.addEventListener('optionSelected', event => {
            this.#setState({ pivotConfig: event.detail });
            this.#loadEffortTable();
        });

        document.getElementById('loadAnalysisBtn').addEventListener('click', () => this.#fetchEffortData());
    }


    #loadEffortTable() {
        if (this.state.responseData) {
            const transformedData = this.#transformData(this.state.responseData, this.state.request.analysisMode, this.state.pivotConfig);
            const event = new CustomEvent('dataUpdated', { detail: transformedData, bubbles: true });
            document.dispatchEvent(event);
        }
    }


    #transformData(responseData, analysisMode, pivotConfig) {
        // Create an instance of EffortTransformer with the responseData
        const effortTransformer = new EffortTransformer(responseData);
        let data;

        // Check the analysisMode and pivotConfig to decide which transformation method to use
        switch (analysisMode) {
            case VALID_ANALYSIS_MODES.intervals:
                switch (pivotConfig) {
                    case VALID_PIVOT_CONFIGS.entityWorkItem:
                        data = effortTransformer.transformToIntervals('entity', 'workItem');
                        break;
                    case VALID_PIVOT_CONFIGS.entityUser:
                        data = effortTransformer.transformToIntervals('entity', 'user');
                        break;
                    case VALID_PIVOT_CONFIGS.user:
                        data = effortTransformer.transformToIntervals('user');
                        break;
                    default:
                        throw new Error('Invalid pivotConfig');
                }
                break;
            case VALID_ANALYSIS_MODES.totals:
                switch (pivotConfig) {
                    case VALID_PIVOT_CONFIGS.entityWorkItem:
                        data = effortTransformer.transformToTotals('entity', 'workItem');
                        break;
                    case VALID_PIVOT_CONFIGS.entityUser:
                        data = effortTransformer.transformToTotals('entity', 'user');
                        break;
                    case VALID_PIVOT_CONFIGS.user:
                        data = effortTransformer.transformToTotals('user');
                        break;
                    default:
                        throw new Error('Invalid pivotConfig');
                }
                break;
            default:
                throw new Error('Invalid analysisMode');
        }

        return data;
    }

    #setState(newState) {
        mergeDeep(this.state, newState);
    }



    getSVG(name) {
        const svgMap = {
            'entity-workItem': '<svg width="18" height="18" viewBox="0 0 18 18"  xmlns="http://www.w3.org/2000/svg"><path d="M0 3.375C0 2.13398 1.00898 1.125 2.25 1.125H15.75C16.991 1.125 18 2.13398 18 3.375V5.625C18 6.86602 16.991 7.875 15.75 7.875H5.34375V11.25C5.34375 12.027 5.97305 12.6562 6.75 12.6562H7.875V12.375C7.875 11.134 8.88398 10.125 10.125 10.125H15.75C16.991 10.125 18 11.134 18 12.375V14.625C18 15.866 16.991 16.875 15.75 16.875H10.125C8.88398 16.875 7.875 15.866 7.875 14.625V14.3438H6.75C5.04141 14.3438 3.65625 12.9586 3.65625 11.25V7.875H2.25C1.00898 7.875 0 6.86602 0 5.625V3.375ZM15.75 11.8125H10.125C9.81562 11.8125 9.5625 12.0656 9.5625 12.375V14.625C9.5625 14.9344 9.81562 15.1875 10.125 15.1875H15.75C16.0594 15.1875 16.3125 14.9344 16.3125 14.625V12.375C16.3125 12.0656 16.0594 11.8125 15.75 11.8125Z" /></svg>',

            'entity-user': '<svg width="18" height="18" viewBox="0 0 18 18"  xmlns="http://www.w3.org/2000/svg"><path d="M0 3.75C0 2.50898 1.00898 1.5 2.25 1.5H15.75C16.991 1.5 18 2.50898 18 3.75V6C18 7.24102 16.991 8.25 15.75 8.25H5.34375V13.0312C5.34375 13.8082 5.97305 13.875 6.75 13.875H7.9588L7.875 14.5C7.875 13.259 8.75898 12.5 10 12.5H13C14.241 12.5 15 13.259 15 14.5V15.375C15 16.616 15.241 17.25 14 17.25H9C7.75898 17.25 7.875 17.378 7.875 16.1369V15.375H6.75C5.04141 15.375 3.65625 14.7398 3.65625 13.0312V8.25H2.25C1.00898 8.25 0 7.24102 0 6V3.75Z" /><circle cx="11.5" cy="10.5" r="1.5" /></svg>',

            'user': '<svg width="18" height="17" viewBox="0 0 18 17" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_345_11)"><path d="M0.125 6.5C0.125 5.25898 1.13398 4.5 2.375 4.5H8C9.24102 4.5 10 5.25898 10 6.5V9.34376C10 10.5848 9.61602 10.3438 8.375 10.3438H5.93674V12.2188C5.93674 12.9957 5.72305 13.5 6.5 13.5L7 13.5C7 12.259 7.25898 12.2188 8.5 12.2188H16C17.241 12.2188 17.75 12.259 17.75 13.5V15C17.75 16.241 17.241 16 16 16H8.5C7.25898 16 7 16.241 7 15V14.7188H5.875C4.16641 14.7188 4 13.9274 4 12.2188V10.3438H2.375C1.13398 10.3438 0.125 10.5848 0.125 9.34376V6.5Z"/><circle cx="5" cy="2" r="2"/></g><defs><clipPath id="clip0_345_11"><rect width="18" height="17" /></clipPath></defs></svg>'
        };
        return svgMap[name] || '';
    }
}

