import { FilterConstructor } from './filterConstructor.js';
import { ViewSelector } from './flexiViewSelector.js';
import { FlexiTable } from './flexiTable.js';
import { FlexiRowSelector } from './flexiRowSelector.js';
import { EffortTransformer } from './effortTransformer.js';


const VALID_ANALYSIS_MODES = { intervals: 'intervals', totals: 'totals' };
const VALID_VIEW_CONFIGS = { entityWorkItem: 'entity-workItem', entityUser: 'entity-user', user: 'user' };
export class ResourceAnalysis {
    constructor(parentDivIds) {
        this.filterDivId = parentDivIds.filterContainer;
        this.rowSelectorDivId = parentDivIds.rowSelectorContainer;
        this.tableContainerDivId = parentDivIds.tableContainer;

        // Declare component properties
        this.filterConstructor = null;
        this.viewSelector = null;
        this.flexiRowSelector = null;
        this.flexiTable = null;

        // Initialize state
        this.state = {
            filters: {},
            analysisMode: VALID_ANALYSIS_MODES.intervals, // Default analysis mode
            viewConfig: VALID_VIEW_CONFIGS.entityUser, // Default view configuration
            responseData: null, // Data received from the server
            transformedData: null // Data transformed for the table
        };

        this.#initComponents();
        this.#addEventListeners();
    }

    async #initComponents() {
        this.filterConstructor = new FilterConstructor(this.state.analysisMode, this.state.filters, [], this.filterDivId);
        // TODO - B - Add selected: true to the default viewConfig, and apply the data transformation
        this.viewSelector = new ViewSelector([
            { name: VALID_VIEW_CONFIGS.entityWorkItem, tooltip: 'Entity - Work Item', svg: this.getSVG(VALID_VIEW_CONFIGS.entityWorkItem) },
            { name: VALID_VIEW_CONFIGS.entityUser, tooltip: 'Entity - User', svg: this.getSVG(VALID_VIEW_CONFIGS.entityUser)},
            { name: VALID_VIEW_CONFIGS.user, tooltip: 'User', svg: this.getSVG(VALID_VIEW_CONFIGS.user)}
        ]);
    
        this.#fetchEffortData().then(() => {
            this.#renderFlexiTable();
        }).catch(error => console.error('Error initializing components:', error));
    }
    
    #renderFlexiTable() {
        // empty the div
        document.getElementById(this.tableContainerDivId).innerHTML = '';
        this.flexiRowSelector = new FlexiRowSelector(this.rowSelectorDivId, {
            user: true, project: true, workItem: true // inject from tha parent HTML getting for the saved preferences for the user
        }, this.transformedData.rows);

        this.flexiTable = new FlexiTable(this.tableContainerDivId, this.transformedData, this.flexiRowSelector.getRows(), this.viewSelector);
    }

    async #fetchEffortData() {
        const { analysisMode } = this.state;
        let fileURL;
        if (analysisMode === VALID_ANALYSIS_MODES.intervals) {
            fileURL = './tests/dataSamples/responseResourceAnalysisIntervals.js';
        } else if (analysisMode === VALID_ANALYSIS_MODES.totals) {
            fileURL = './tests/dataSamples/responseResourceAnalysisTotals.js';
        }
    
        try {
            const module = await import(fileURL);
            this.#setState({ responseData: module.default });
            this.transformedData= this.#transformData(this.state.responseData, this.state.analysisMode, this.state.viewConfig);
        } catch (err) {
            console.error('Error fetching data:', err);
            throw err;
        }
    }

    #addEventListeners() {
        document.addEventListener('filterUpdated', event => {
            this.#setState({
                filters: event.detail.filter,
                analysisMode: event.detail.analysisMode
            });
            this.#fetchEffortData().then(() => {
                this.#renderFlexiTable();
            }).catch(error => console.error('Error updating data:', error));
        });

        document.addEventListener('optionSelected', event => {
            this.#setState({ viewConfig: event.detail });
            this.#loadEffortTable();
        });

        document.getElementById('loadAnalysisBtn').addEventListener('click', () => this.#fetchEffortData());
    }


    #loadEffortTable() {
        if (this.state.responseData) {
            const transformedData = this.#transformData(this.state.responseData, this.state.analysisMode, this.state.viewConfig);
            const event = new CustomEvent('dataUpdated', { detail: transformedData, bubbles: true });
            document.dispatchEvent(event);
        }
    }


    #transformData(responseData, analysisMode, viewConfig) {
        // Create an instance of EffortTransformer with the responseData
        const effortTransformer = new EffortTransformer(responseData);
        let data;

        // Check the analysisMode and viewConfig to decide which transformation method to use
        switch (analysisMode) {
            case VALID_ANALYSIS_MODES.intervals:
                switch (viewConfig) {
                    case VALID_VIEW_CONFIGS.entityWorkItem:
                        data = effortTransformer.transformToIntervals('entity', 'workItem');
                        break;
                    case VALID_VIEW_CONFIGS.entityUser:
                        data = effortTransformer.transformToIntervals('entity', 'user');
                        break;
                    case VALID_VIEW_CONFIGS.user:
                        data = effortTransformer.transformToIntervals('user');
                        break;
                    default:
                        throw new Error('Invalid viewConfig');
                }
                break;
            case VALID_ANALYSIS_MODES.totals:
                switch (viewConfig) {
                    case VALID_VIEW_CONFIGS.entityWorkItem:
                        data = effortTransformer.transformToTotals('entity', 'workItem');
                        break;
                    case VALID_VIEW_CONFIGS.entityUser:
                        data = effortTransformer.transformToTotals('entity', 'user');
                        break;
                    case VALID_VIEW_CONFIGS.user:
                        data = effortTransformer.transformToTotals('user');
                        break;
                    default:
                        throw new Error('Invalid viewConfig');
                }
                break;
            default:
                throw new Error('Invalid analysisMode');
        }

        return data;
    }

    #setState(newState) {
        Object.assign(this.state, newState);
    }

    getSVG(name) {
        const svgMap = {
            'entity-workItem': '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 3.375C0 2.13398 1.00898 1.125 2.25 1.125H15.75C16.991 1.125 18 2.13398 18 3.375V5.625C18 6.86602 16.991 7.875 15.75 7.875H5.34375V11.25C5.34375 12.027 5.97305 12.6562 6.75 12.6562H7.875V12.375C7.875 11.134 8.88398 10.125 10.125 10.125H15.75C16.991 10.125 18 11.134 18 12.375V14.625C18 15.866 16.991 16.875 15.75 16.875H10.125C8.88398 16.875 7.875 15.866 7.875 14.625V14.3438H6.75C5.04141 14.3438 3.65625 12.9586 3.65625 11.25V7.875H2.25C1.00898 7.875 0 6.86602 0 5.625V3.375ZM15.75 11.8125H10.125C9.81562 11.8125 9.5625 12.0656 9.5625 12.375V14.625C9.5625 14.9344 9.81562 15.1875 10.125 15.1875H15.75C16.0594 15.1875 16.3125 14.9344 16.3125 14.625V12.375C16.3125 12.0656 16.0594 11.8125 15.75 11.8125Z" fill="black"/></svg>',
            'entity-user': '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 3.75C0 2.50898 1.00898 1.5 2.25 1.5H15.75C16.991 1.5 18 2.50898 18 3.75V6C18 7.24102 16.991 8.25 15.75 8.25H5.34375V13.0312C5.34375 13.8082 5.97305 13.875 6.75 13.875H7.9588L7.875 14.5C7.875 13.259 8.75898 12.5 10 12.5H13C14.241 12.5 15 13.259 15 14.5V15.375C15 16.616 15.241 17.25 14 17.25H9C7.75898 17.25 7.875 17.378 7.875 16.1369V15.375H6.75C5.04141 15.375 3.65625 14.7398 3.65625 13.0312V8.25H2.25C1.00898 8.25 0 7.24102 0 6V3.75Z" fill="black"/><circle cx="11.5" cy="10.5" r="1.5" fill="black"/></svg>',
            'user': '<svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_335_4)"><path d="M8 9C9.21242 9 10.3752 8.52589 11.2325 7.68198C12.0898 6.83807 12.5714 5.69347 12.5714 4.5C12.5714 3.30653 12.0898 2.16193 11.2325 1.31802C10.3752 0.474106 9.21242 0 8 0C6.78758 0 5.62482 0.474106 4.76751 1.31802C3.9102 2.16193 3.42857 3.30653 3.42857 4.5C3.42857 5.69347 3.9102 6.83807 4.76751 7.68198C5.62482 8.52589 6.78758 9 8 9ZM6.36786 10.6875C2.85 10.6875 0 13.493 0 16.9559C0 17.5324 0.475 18 1.06071 18H14.9393C15.525 18 16 17.5324 16 16.9559C16 13.493 13.15 10.6875 9.63214 10.6875H6.36786Z" fill="black"/></g><defs><clipPath id="clip0_335_4"><rect width="16" height="18" fill="white"/></clipPath></defs></svg>'
        };
        return svgMap[name] || '';
    }
}

