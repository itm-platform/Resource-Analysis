import { FilterConstructor } from './filterConstructor.js';
import { ViewSelector } from './flexiViewSelector.js';
import { FlexiTable } from './flexiTable.js';
import { FlexiRowSelector } from './flexiRowSelector.js';
import { EffortTransformer } from './effortTransformer.js';


const VALID_ANALYSIS_MODES = { intervals: 'intervals', totals: 'totals' };
const VALID_VIEW_CONFIGS = { entityWorkItem: 'entity-workItem', entityUser: 'entity-user', user: 'user' };
export class ResourceAnalysis {
    constructor(filterDivId, rowSelectorDivId, tableContainerDivId) {
        this.filterDivId = filterDivId;
        this.rowSelectorDivId = rowSelectorDivId;
        this.tableContainerDivId = tableContainerDivId;

        // Declare component properties
        this.filterConstructor = null;
        this.viewSelector = null;
        this.flexiRowSelector = null;
        this.flexiTable = null;

        // Initialize state
        this.state = {
            filters: {},
            analysisMode: VALID_ANALYSIS_MODES.intervals, // Default analysis mode
            viewConfig: VALID_VIEW_CONFIGS.entityWorkItem, // Default view configuration
            responseData: null // Data received from the server
        };

        this.#initComponents();
        this.#addEventListeners();
    }

    async #initComponents() {
        this.filterConstructor = new FilterConstructor(this.state.analysisMode, this.state.filters, [], this.filterDivId);
        this.flexiRowSelector = new FlexiRowSelector('rowSelectorDiv', {
            project: true, workItem: true, user: true // make dynamic
        });
        this.viewSelector = new ViewSelector([
            { name: VALID_VIEW_CONFIGS.entityWorkItem, tooltip: 'Entity - Work Item', svg: this.getSVG(VALID_VIEW_CONFIGS.entityWorkItem) },
            { name: VALID_VIEW_CONFIGS.entityUser, tooltip: 'Entity - User', svg: this.getSVG(VALID_VIEW_CONFIGS.entityUser) },
            { name: VALID_VIEW_CONFIGS.user, tooltip: 'User', svg: this.getSVG(VALID_VIEW_CONFIGS.user) }
        ]);
    
        this.#fetchEffortData().then(data => {
            this.flexiTable = new FlexiTable(this.tableContainerDivId, data, this.flexiRowSelector.getRows(), this.viewSelector);
        }).catch(error => console.error('Error initializing components:', error));
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
            return this.#transformData(this.state.responseData, this.state.analysisMode, this.state.viewConfig);
        } catch (err) {
            console.error('Error fetching data:', err);
            throw err;
        }
    }

    #addEventListeners() {
        document.addEventListener('filterUpdated', event => {
            // Update filters and fetch data
            this.#setState({
                filters: event.detail.filter,
                analysisMode: event.detail.analysisMode
            });
            this.#fetchEffortData();
        });

        document.addEventListener('optionSelected', event => {
            // Update view configuration and re-render table
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
            'entity-workItem': '<svg height="14" width="14" xmlns="http://www.w3.org/2000/svg"><circle r="6.3" cx="7" cy="7" fill="red" /></svg>',
            'entity-user': '<svg width="14" height="8" xmlns="http://www.w3.org/2000/svg"><rect width="7" height="7" x="0.7" y="0.5" style="fill:blue" /></svg>',
            'user': '<svg height="4" width="14" xmlns="http://www.w3.org/2000/svg"><ellipse cx="8.4" cy="2.8" rx="7" ry="3.5" style="fill:yellow" /></svg>'
        };
        return svgMap[name] || '';
    }
}

