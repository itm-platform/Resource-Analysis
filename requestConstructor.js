// TODO - 🟡 - make it accessible and tackle console issues
import resourceAnalysisValidator from './resourceAnalysisValidator.js';
/** 
 * The "noop css tag function" is a no-operation (noop) function 
 * that takes a tagged template literal and returns the raw string without modification. 
 * This allows you to use VSCode's CSS formatting features  */
export const css = (strings) => strings.raw[0];

const VALID_ANALYSIS_MODES = { intervals: 'intervals', totals: 'totals' };
const VALID_TOTALS_DATE_RANGE_MODES = { liveBetween: 'liveBetween', strictlyBetween: 'strictlyBetween' };
export class RequestConstructor {
    /** requestConstructor.js
* @param {Object} requestObject - The request object. Example {analysisMode: "intervals", filter: {projects: {Duration: 10}},  "intervals": {"startDate": "2024-01-01", "intervalType": "week", noOfIntervals": 5}.    
* @param {Array} dataServiceModel - The filter values. Example {tables:{tableName:{labels:{},fields:[{name:"Id",labels:{en:"Id",es:"Id",pt:"Id"},type:"Number | String | Date",primaryKey:!0}]}},relationships:{tableName1:{tableName2:{foreignKey:"ProjectId"},risks:{foreignKey:"ProjectId"}}}};
* @param {string} parentDivId - The parent div ID to attach the filter UI to
* @param {Object} [options={}] - The options object. 
* @param {boolean} [options.shouldFilterBeVisible=true]
* @param {Array} [options.tablesAllowed] - The tables allowed in the filter [{ tasks: ['Id', 'Status.Name'] }]
*/
    state = {
        analysisMode: '',
        filter: {},
        intervals: {},
        totals: {}
    };
    constructor(requestObject = {}, dataServiceModel, parentDivId, options = {}) {
        if (requestObject == {}) { resourceAnalysisValidator.validateRequest(requestObject); }

        this.state.analysisMode = requestObject.analysisMode || VALID_ANALYSIS_MODES.intervals;
        this.state.filter = requestObject.filter || {};
        this.state.intervals = requestObject.intervals || {};
        this.state.totals = requestObject.totals || {};


        this.dataServiceModel = dataServiceModel;
        this.parentDivId = parentDivId;

        this._langTranslations = {};
        this._lang = typeof strLanguage !== 'undefined' ? strLanguage : 'en';

        this.shouldFilterBeVisible = options?.shouldFilterBeVisible;
        this.tablesAllowed = options?.tablesAllowed;

        this._initPromise = this.#initDependencies().then(() => {
            this.initUI();
            this.#applyStyles();
            this.#toggleOptionsState();
        });
    }

    async #initDependencies() {
        await itmGlobal.ensureDiContainerReady();
        this.getTranslations = window.diContainer.get('getTranslations');
        await this.#loadTranslations();

        this.FilterConstructor = window.diContainer.get('FilterConstructor');
    }

    async #loadTranslations() {
        this._langTranslations = await this.getTranslations('requestConstructor', this._lang);
    }

    initUI() {
        const parentDiv = document.getElementById(this.parentDivId);

        // Helper function to create a wrapper div
        function createWrapper(id, className) {
            const wrapper = document.createElement('div');
            wrapper.id = id;
            wrapper.className = className;
            return wrapper;
        }

        // Helper function to create and append a button
        function createButton(id, text, onClick) {
            const button = document.createElement('button');
            button.id = id;
            button.textContent = text;
            button.addEventListener('click', onClick);
            return button;
        }

        const requestConstructorWrapper = createWrapper('req-constructor-wrapper', 'req-constructor-wrapper');
        const requestConstructorModesWrapper = createWrapper('req-constructor-modesWrapper', 'req-constructor-modesWrapper');

        // Append sections to modes wrapper
        const intervalsSection = this.#createIntervalsSection();
        const totalsSection = this.#createTotalsSection();
        requestConstructorModesWrapper.appendChild(intervalsSection);
        requestConstructorModesWrapper.appendChild(totalsSection);

        // Append modes wrapper to the main wrapper
        requestConstructorWrapper.appendChild(requestConstructorModesWrapper);

        // Create and configure the filter wrapper div
        const requestConstructorFilterWrapper = createWrapper('req-constructor-filterWrapper', 'req-constructor-filterWrapper');
        requestConstructorWrapper.appendChild(requestConstructorFilterWrapper);

        // Append the main wrapper to the parent div
        parentDiv.appendChild(requestConstructorWrapper);

        // Conditionally create and append the filter section
        if (this.shouldFilterBeVisible) {
            const filterSection = this.#createFilterSection(requestConstructorFilterWrapper.id);
            requestConstructorFilterWrapper.appendChild(filterSection);
        }

        // Create and configure the update button
        const updateButton = createButton('req-constructor-updateButton', 'Change Request', (event) => {
            event.preventDefault();
            this.#updateRequest();
        });

        // Append the update button to the parent div
        parentDiv.appendChild(updateButton);

        // Add collapse/expand features to the mode and filter sections
        const constructorModesWrapperInitiallyCollapsed = localStorage.getItem(requestConstructorModesWrapper.id + 'InitiallyCollapsed');
        const constructorFilterWrapperInitiallyCollapsed = localStorage.getItem(requestConstructorFilterWrapper.id + 'InitiallyCollapsed');
        this.#addToggleCollapseExpandFeatures(requestConstructorModesWrapper, 'Mode', constructorModesWrapperInitiallyCollapsed);
        this.#addToggleCollapseExpandFeatures(requestConstructorFilterWrapper, 'Filter', constructorFilterWrapperInitiallyCollapsed);

    }
    #applyStyles() {
        const style = document.createElement('style');
        style.textContent = this.#getStyles();
        // TODO - 🟢 - Add the style to this element to make the style scoped

        document.head.appendChild(style);
    }
    #createFilterSection(filterWrapperDivId) {
        const filterConstructor = new this.FilterConstructor(
            this.state.filter, this.dataServiceModel,
            filterWrapperDivId, this.tablesAllowed, this._lang);

        // TODO - 🟢 - Remove the following line making the filterConstructor a private variable
        window.filterConstructor = filterConstructor; // For testing purposes
        filterConstructor.element.addEventListener('filterUpdated', (event) => {
            this.state.filter = event.detail;
        });

        return filterConstructor.element; // Assuming this returns the constructed filter section
    }

    #createIntervalsSection() {
        const intervalsSection = document.createElement('div');
        intervalsSection.id = 'req-constructor-intervalsSection';
        intervalsSection.className = 'req-constructor-modeWrapper';

        const constructorModeRadio = document.createElement('div');
        constructorModeRadio.className = 'req-constructor-mode-radio';

        const intervalsRadio = document.createElement('input');
        intervalsRadio.type = 'radio';
        intervalsRadio.id = 'req-constructor-intervals';
        intervalsRadio.name = 'analysisMode';
        intervalsRadio.value = 'intervals';
        if (this.state.analysisMode === 'intervals') {
            intervalsRadio.checked = true;
        }
        intervalsRadio.addEventListener('change', () => {
            this.state.analysisMode = 'intervals';
            this.#toggleOptionsState();
        });

        const intervalsLabel = document.createElement('label');
        intervalsLabel.htmlFor = 'intervals';
        intervalsLabel.textContent = this._langTranslations.t('intervals');

        constructorModeRadio.appendChild(intervalsRadio);
        constructorModeRadio.appendChild(intervalsLabel);

        intervalsSection.appendChild(constructorModeRadio);

        const intervalOptionsWrapper = document.createElement('div');
        intervalOptionsWrapper.id = 'req-constructor-intervalOptionsWrapper';
        intervalOptionsWrapper.className = 'req-constructor-mode-options-wrapper';

        const intervalDropdown = document.createElement('select');
        intervalDropdown.id = 'req-constructor-intervalType';
        intervalDropdown.className = 'req-constructor-mode-item';
        ['day', 'week', 'month', 'quarter'].forEach(interval => {
            const option = document.createElement('option');
            option.value = interval;
            option.text = interval;
            intervalDropdown.appendChild(option);
        });
        intervalDropdown.value = this.state.intervals.intervalType || 'day';
        intervalDropdown.addEventListener('change', (event) => {
            this.state.intervals.intervalType = event.target.value;
        });
        intervalOptionsWrapper.appendChild(intervalDropdown);

        const numberInput = document.createElement('input');
        numberInput.id = 'req-constructor-noOfIntervals';
        numberInput.className = 'req-constructor-mode-item';
        numberInput.type = 'number';
        numberInput.min = '1';
        numberInput.max = '7';
        numberInput.placeholder = 'Number';
        numberInput.value = this.state.intervals.noOfIntervals || 1;
        numberInput.addEventListener('change', (event) => {
            this.state.intervals.noOfIntervals = event.target.value;
        });
        intervalOptionsWrapper.appendChild(numberInput);

        const dateInput = document.createElement('input');
        dateInput.id = 'req-constructor-interval-startDate';
        dateInput.className = 'req-constructor-mode-item';
        dateInput.type = 'date';
        dateInput.value = this.state.intervals.startDate || new Date().toISOString().split('T')[0];
        dateInput.addEventListener('change', (event) => {
            this.state.intervals.startDate = event.target.value;
        });
        intervalOptionsWrapper.appendChild(dateInput);
        intervalsSection.appendChild(intervalOptionsWrapper);

        return intervalsSection;
    }

    #createTotalsSection() {
        const totalsSection = document.createElement('div');
        totalsSection.id = 'req-constructor-totalsSection';
        totalsSection.className = 'req-constructor-modeWrapper';

        const constructorModeRadio = document.createElement('div');
        constructorModeRadio.className = 'req-constructor-mode-radio';

        const totalsRadio = document.createElement('input');
        totalsRadio.type = 'radio';
        totalsRadio.id = 'req-constructor-totals';
        totalsRadio.name = 'analysisMode';
        totalsRadio.value = 'totals';
        if (this.state.analysisMode === 'totals') {
            totalsRadio.checked = true;
        }
        totalsRadio.addEventListener('change', () => {
            this.state.analysisMode = 'totals';
            this.#updateFilterStateForTotals();
            this.#toggleOptionsState();
        });

        const totalsLabel = document.createElement('label');
        totalsLabel.htmlFor = 'totals';
        totalsLabel.textContent = this._langTranslations.t('totals');

        constructorModeRadio.appendChild(totalsRadio);
        constructorModeRadio.appendChild(totalsLabel);

        totalsSection.appendChild(constructorModeRadio);

        const totalOptionsWrapper = document.createElement('div');
        totalOptionsWrapper.id = 'req-constructor-totalOptionsWrapper';
        totalOptionsWrapper.className = 'req-constructor-mode-options-wrapper';

        const totalsDateRangeModeDropdown = document.createElement('select');
        totalsDateRangeModeDropdown.id = 'req-constructor-totalsDateRangeMode';
        totalsDateRangeModeDropdown.className = 'req-constructor-mode-item';
        Object.keys(VALID_TOTALS_DATE_RANGE_MODES).forEach(mode => {
            const option = document.createElement('option');
            option.value = mode;
            option.text = `${mode} i18n`;
            totalsDateRangeModeDropdown.appendChild(option);
        });

        const { totalsDateRangeMode, startDate, endDate } = this.#getTotalsDateRangeMode();
        totalsDateRangeModeDropdown.value = totalsDateRangeMode;

        totalsDateRangeModeDropdown.addEventListener('change', () => {
            this.#updateFilterStateForTotals();
        });
        totalOptionsWrapper.appendChild(totalsDateRangeModeDropdown);

        const startDatePicker = document.createElement('input');
        startDatePicker.id = 'req-constructor-totals-startDate';
        startDatePicker.className = 'req-constructor-mode-item';
        startDatePicker.type = 'date';
        startDatePicker.value = startDate;
        startDatePicker.addEventListener('change', () => {
            this.#updateFilterStateForTotals();
        });
        totalOptionsWrapper.appendChild(startDatePicker);

        const endDatePicker = document.createElement('input');
        endDatePicker.id = 'req-constructor-totals-endDate';
        endDatePicker.className = 'req-constructor-mode-item';
        endDatePicker.type = 'date';
        endDatePicker.value = endDate;
        endDatePicker.addEventListener('change', () => {
            this.#updateFilterStateForTotals();
        });
        totalOptionsWrapper.appendChild(endDatePicker);

        totalsSection.appendChild(totalOptionsWrapper);
        return totalsSection;
    }

    #toggleOptionsState() {
        const wrappers = document.querySelectorAll('.req-constructor-mode-options-wrapper');
        wrappers.forEach(wrapper => {
            const radio = wrapper.previousElementSibling.querySelector('input[type="radio"]');
            const disabled = !radio.checked;
            // if (disabled) {
            //     wrapper.style.display = 'none';
            // } else {
            //     wrapper.style.display = 'flex';
            // }
            Array.from(wrapper.children).forEach(child => {
                child.disabled = disabled;
            });
        });
    }

    #addToggleCollapseExpandFeatures(div, title, initialState = 'expanded') {
        // Create title element
        const titleElement = document.createElement('span');
        titleElement.className = 'req-constructor-title';
        titleElement.innerText = title;

        // Create caret element
        const caretElement = document.createElement('itm-caret-up-down');
        caretElement.className = 'req-constructor-caret';
        caretElement.value = initialState === 'collapsed' ? 'down' : 'up'; // set caret based on initialState
        caretElement.title = initialState === 'collapsed' ? 'Expand' : 'Collapse';

        // Append title and caret to the div
        div.appendChild(titleElement);
        div.appendChild(caretElement);

        // Wrap the content inside a content div for smooth collapsing
        const contentDiv = document.createElement('div');
        contentDiv.className = 'req-constructor-content';

        while (div.firstChild && div.firstChild !== titleElement && div.firstChild !== caretElement) {
            contentDiv.appendChild(div.firstChild);
        }

        div.appendChild(contentDiv);

        // Set initial state based on the parameter
        if (initialState === 'collapsed') {
            div.classList.add('collapsed');
            contentDiv.style.maxHeight = '0';
        } else {
            div.classList.remove('collapsed');
            contentDiv.style.maxHeight = contentDiv.scrollHeight + 'px';
        }

        // Add event listener for the caret
        caretElement.addEventListener('click', () => {
            if (div.classList.contains('collapsed')) {
                div.classList.remove('collapsed');
                caretElement.innerText = '▲';
                caretElement.title = 'Collapse';
                contentDiv.style.maxHeight = contentDiv.scrollHeight + 'px';
                localStorage.setItem(div.id + 'InitiallyCollapsed', 'expanded');
            } else {
                div.classList.add('collapsed');
                caretElement.innerText = '▼';
                caretElement.title = 'Expand';
                contentDiv.style.maxHeight = '0';
                localStorage.setItem(div.id + 'InitiallyCollapsed', 'collapsed');
            }
        });

        // Ensure the initial maxHeight is set correctly after the content is loaded
        setTimeout(() => {
            if (!div.classList.contains('collapsed')) {
                contentDiv.style.maxHeight = contentDiv.scrollHeight + 'px';
            }
        }, 0);

        // Mutation Observer to watch for content changes
        const observer = new MutationObserver(() => {
            if (!div.classList.contains('collapsed')) {
                contentDiv.style.maxHeight = contentDiv.scrollHeight + 'px';
            }
        });

        // Observe the content changes inside the content div
        observer.observe(contentDiv, { childList: true, subtree: true });
    }
    #updateFilterStateForTotals() {
        const totalsDateRangeMode = document.getElementById('req-constructor-totalsDateRangeMode').value;
        const startDate = document.getElementById('req-constructor-totals-startDate').value;
        const endDate = document.getElementById('req-constructor-totals-endDate').value;
        this.state.totals = { dateRangeMode: totalsDateRangeMode, startDate, endDate };
    }

    #getTotalsDateRangeMode() {
        const totalsDateRangeMode = this.state.totals.dateRangeMode || VALID_TOTALS_DATE_RANGE_MODES.liveBetween;
        const startDate = this.state.totals.startDate || new Date().toISOString().split('T')[0];
        const endDate = this.state.totals.endDate || new Date().toISOString().split('T')[0];
        return { totalsDateRangeMode, startDate, endDate };
    }
    /* LEFT OFF: 
    - Totals dates are already coming from the params, in state.totals. Add test cases (empty, filled)
    - Possibly improve the validator to check for the totals object, dates make sense, etc.
    - User selected totals must return in the event, so it saves in the template and retrieves data based on it
    - Mix preFilter, filter and totals in the request object (resourceAnalysis)
    */

    #updateRequest() {
        const newRequestObject = {
            analysisMode: this.state.analysisMode,
            filter: this.state.filter,
            intervals: this.state.intervals,
            totals: this.state.totals
        };
        const event = new CustomEvent('requestUpdated', {
            detail: newRequestObject,
            bubbles: true
        });
        document.dispatchEvent(event);
    }
    #getStyles() {
        return css`
            :root {
                --req-constructor-select-border-radius: 4px;
                --req-constructor-select-border-color: #999;
                --req-constructor-input-border-radius: 4px;
                --req-constructor-standard-select-width: 10em;
                --req-constructor-standard-input-width: 8em;

                --req-constructor-close-cross-fill: #6d7d8f;
                --req-constructor-close-cross-fill-hover: #3a4a5c;
            }
            .req-constructor-modesWrapper {
                border: 1px solid #ccc;
                border-radius: 3px;
                padding: 1.8em;
                position: relative;
                margin-bottom: 1em;
            }

            .req-constructor-filterWrapper {
                border: 1px solid #ccc;
                border-radius: 3px;
                padding: 1.8em;
                position: relative;
            }

            .req-constructor-title {
                position: absolute;
                top: -10px;
                left: 10px;
                background: white;
                padding: 0 5px;
            }

            .req-constructor-caret {
                position: absolute;
                top: -10px;
                right: 10px;
                cursor: pointer;
                background: white;
                padding: 0 5px;
            }

            .req-constructor-content {
                overflow: hidden;
                transition: max-height 0.3s ease-out;
            }

            .collapsed .req-constructor-content {
                max-height: 0;
            }

            .req-constructor-modeWrapper {
                display: flex;
                align-items: center;
                margin-bottom: 5px;
            }           
            .req-constructor-mode-options-wrapper {
                display: flex;
                align-items: center;
                margin-left: 10px;
            }

            .req-constructor-mode-radio{
                width: 10em;
            }
            .req-constructor-mode-options-wrapper {
                display: flex;
                align-items: center;
            }
            .req-constructor-mode-options-wrapper select {
                margin-right: .6em;
                padding: 3px;
                border-color: var(--req-constructor-select-border-color);
                border-radius: var(--req-constructor-select-border-radius);
            }
            .req-constructor-mode-options-wrapper input {
                margin-right: .6em;
                padding: 3px;
                border: 1px solid var(--filter-select-border-color);
                border-radius: var(--filter-input-border-radius);
            }
            `;
    }
}
