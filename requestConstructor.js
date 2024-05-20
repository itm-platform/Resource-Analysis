import resourceAnalysisValidator from './resourceAnalysisValidator.js';
const VALID_ANALYSIS_MODES = { intervals: 'intervals', totals: 'totals' };
export class RequestConstructor {
    /** requestConstructor.js
* @param {Object} requestObject - The request object. Example {analysisMode: "intervals", filter: {projects: {Duration: 10}},  "intervals": {"startDate": "2024-01-01", "intervalType": "week", noOfIntervals": 5}.    
* @param {Array} dataServiceModel - The filter values. Example {tables:{tableName:{labels:{},fields:[{name:"Id",labels:{en:"Id",es:"Id",pt:"Id"},type:"Number | String | Date",primaryKey:!0}]}},relationships:{tableName1:{tableName2:{foreignKey:"ProjectId"},risks:{foreignKey:"ProjectId"}}}};
* @param {string} parentDivId - The parent div ID to attach the filter UI to
*/
    state = {
        requestAnalysisMode: '',
        requestFilter: {},
        requestIntervals: {}
    };
    constructor(requestObject = {}, dataServiceModel, parentDivId) {
        if (requestObject == {}) { resourceAnalysisValidator.validateRequest(requestObject); }
        this.state.requestAnalysisMode = requestObject.analysisMode || VALID_ANALYSIS_MODES.intervals;
        this.state.requestFilter = requestObject.filter || {};
        this.state.requestIntervals = requestObject.intervals || {};
        this.dataServiceModel = dataServiceModel;
        this.parentDivId = parentDivId;
        this._langTranslations = {};
        this._lang = typeof strLanguage !== 'undefined' ? strLanguage : 'es';
        this._initPromise = this.#initDependencies().then(() => {
            this.initUI();
        });
    }

    async #initDependencies() {
        await itmGlobal.ensureDiContainerReady();
        this.getTranslations = window.diContainer.get('getTranslations');
        await this.#loadTranslations();
    }

    async #loadTranslations() {
        this._langTranslations = await this.getTranslations('requestConstructor', this._lang);
    }

    initUI() {
        const parentDiv = document.getElementById(this.parentDivId);

        const requestConstructorWrapper = document.createElement('div');
        requestConstructorWrapper.id = 'req-constructor-wrapper';
        requestConstructorWrapper.className = 'req-constructor-wrapper';

        const requestConstructorModesWrapper = document.createElement('div');
        requestConstructorModesWrapper.id = 'req-constructor-modesWrapper';
        requestConstructorModesWrapper.className = 'req-constructor-modesWrapper';

        const intervalsSection = this.#createIntervalsSection();
        const totalsSection = this.#createTotalsSection();

        requestConstructorModesWrapper.appendChild(intervalsSection);
        requestConstructorModesWrapper.appendChild(totalsSection);

        requestConstructorWrapper.appendChild(requestConstructorModesWrapper);

        const requestConstructorFilterWrapper = document.createElement('div');
        requestConstructorFilterWrapper.id = 'req-constructor-filterWrapper';
        requestConstructorFilterWrapper.className = 'req-constructor-filterWrapper';
        

        parentDiv.appendChild(requestConstructorWrapper);

        const updateButton = document.createElement('button');
        updateButton.id = 'req-constructor-updateButton';
        updateButton.textContent = "Change Request";
        updateButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.#updateRequest();
        });
        parentDiv.appendChild(updateButton);
    }
    #createIntervalsSection() {
        const intervalsSection = document.createElement('div');
        intervalsSection.id = 'req-constructor-intervalsSection';
        intervalsSection.className = 'req-constructor-modeWrapper';

        const intervalsRadio = document.createElement('input');
        intervalsRadio.type = 'radio';
        intervalsRadio.id = 'req-constructor-intervals';
        intervalsRadio.name = 'analysisMode';
        intervalsRadio.value = 'intervals';
        if (this.state.requestAnalysisMode === 'intervals') {
            intervalsRadio.checked = true;
        }
        intervalsRadio.addEventListener('change', () => {
            this.state.requestAnalysisMode = 'intervals';
        });

        const intervalsLabel = document.createElement('label');
        intervalsLabel.htmlFor = 'intervals';
        intervalsLabel.textContent = this._langTranslations.t('intervals');
        intervalsSection.appendChild(intervalsRadio);
        intervalsSection.appendChild(intervalsLabel);

        const intervalOptionsWrapper = document.createElement('div');
        intervalOptionsWrapper.id = 'req-constructor-intervalOptionsWrapper';
        intervalOptionsWrapper.className = 'req-constructor-intervalOptionsWrapper';

        const intervalDropdown = document.createElement('select');
        intervalDropdown.id = 'req-constructor-intervalType';
        ['day', 'week', 'month', 'quarter'].forEach(interval => {
            const option = document.createElement('option');
            option.value = interval;
            option.text = interval;
            intervalDropdown.appendChild(option);
        });
        intervalDropdown.value = this.state.requestIntervals.intervalType || 'day';
        intervalDropdown.addEventListener('change', (event) => {
            this.state.requestIntervals.intervalType = event.target.value;
        });
        intervalOptionsWrapper.appendChild(intervalDropdown);

        const numberInput = document.createElement('input');
        numberInput.id = 'req-constructor-noOfIntervals';
        numberInput.type = 'number';
        numberInput.min = '1';
        numberInput.max = '7';
        numberInput.placeholder = 'Number';
        numberInput.value = this.state.requestIntervals.noOfIntervals || 1;
        numberInput.addEventListener('change', (event) => {
            this.state.requestIntervals.noOfIntervals = event.target.value;
        });
        intervalOptionsWrapper.appendChild(numberInput);

        const dateInput = document.createElement('input');
        dateInput.id = 'req-constructor-interval-startDate';
        dateInput.type = 'date';
        dateInput.value = this.state.requestIntervals.startDate || new Date().toISOString().split('T')[0];
        dateInput.addEventListener('change', (event) => {
            this.state.requestIntervals.startDate = event.target.value;
        });
        intervalOptionsWrapper.appendChild(dateInput);
        intervalsSection.appendChild(intervalOptionsWrapper);


        return intervalsSection;
    }
    #createTotalsSection() {
        const totalsSection = document.createElement('div');
        totalsSection.id = 'req-constructor-totalsSection';
        totalsSection.className = 'req-constructor-modeWrapper';

        const totalsRadio = document.createElement('input');
        totalsRadio.type = 'radio';
        totalsRadio.id = 'req-constructor-totals';
        totalsRadio.name = 'analysisMode';
        totalsRadio.value = 'totals';
        if (this.state.requestAnalysisMode === 'totals') {
            totalsRadio.checked = true;
        }
        totalsRadio.addEventListener('change', () => {
            this.state.requestAnalysisMode = 'totals';
            this.#updateFilterStateForTotals();
        });

        const totalsLabel = document.createElement('label');
        totalsLabel.htmlFor = 'totals';
        totalsLabel.textContent = this._langTranslations.t('totals');
        totalsSection.appendChild(totalsRadio);
        totalsSection.appendChild(totalsLabel);

        const totalOptionsWrapper = document.createElement('div');
        totalOptionsWrapper.id = 'req-constructor-totalOptionsWrapper';
        totalOptionsWrapper.className = 'req-constructor-totalOptionsWrapper';


        const totalsDateRangeModeDropdown = document.createElement('select');
        totalsDateRangeModeDropdown.id = 'req-constructor-totalsDateRangeMode';
        ['Live between', 'Strictly between'].forEach(mode => {
            const option = document.createElement('option');
            option.value = mode;
            option.text = mode;
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
        startDatePicker.type = 'date';
        startDatePicker.value = startDate;
        startDatePicker.addEventListener('change', () => {
            this.#updateFilterStateForTotals();
        });
        totalOptionsWrapper.appendChild(startDatePicker);

        const endDatePicker = document.createElement('input');
        endDatePicker.id = 'req-constructor-totals-endDate';
        endDatePicker.type = 'date';
        endDatePicker.value = endDate;
        endDatePicker.addEventListener('change', () => {
            this.#updateFilterStateForTotals();
        });
        totalOptionsWrapper.appendChild(endDatePicker);

        totalsSection.appendChild(totalOptionsWrapper);
        return totalsSection;
    }

    #updateFilterStateForTotals() {
        // TODO - A - We are only adding filter to 'project' object. 
        // Filters can apply to entities (`project`, `service`) and users (`user`). 
        const totalsDateRangeMode = document.getElementById('req-constructor-totalsDateRangeMode').value;
        const startDate = document.getElementById('req-constructor-totals-startDate').value;
        const endDate = document.getElementById('req-constructor-totals-endDate').value;
        const filter = { ...this.state.requestFilter };
        filter.project = {};
        if (totalsDateRangeMode === 'Live between') {
            filter.project.StartDate = { $lte: endDate };
            filter.project.EndDate = { $gte: startDate };
        } else {
            filter.project.StartDate = { $bt: [startDate, endDate] };
            filter.project.EndDate = { $bt: [startDate, endDate] };
        }
        this.state.requestFilter = filter;
    }

    #getTotalsDateRangeMode() {
        const filter = this.state.requestFilter;
        // const totalsDateRangeMode should be 'Live between' if filter.project.StartDate has the form { $lte:...}, and 
        // filter.project.StartDate has the form { $gte:...}. It should be 'Strictly between' if filter.project.StartDate has the form { $bt:...}
        // and filter.project.StartDate has the form { $bt:...}. Otherwise, it should be 'Live between'.
        const totalsDateRangeMode = (filter.project?.StartDate && filter.project?.StartDate.$bt) ? 'Strictly between' : 'Live between';
        const startDate = filter.project?.StartDate || new Date().toISOString().split('T')[0];
        const endDate = filter.project?.EndDate || new Date().toISOString().split('T')[0];
        return { totalsDateRangeMode, startDate, endDate };
    }

    #updateRequest() {
        const newRequestObject = {
            analysisMode: this.state.requestAnalysisMode,
            filter: this.state.requestFilter
        };
        if (this.state.requestAnalysisMode === 'intervals') {
            newRequestObject.intervals = this.state.requestIntervals;
        }

        const event = new CustomEvent('requestUpdated', {
            detail: newRequestObject,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

}
