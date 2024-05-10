import resourceAnalysisValidator  from './resourceAnalysisValidator.js';

const VALID_ANALYSIS_MODES = { intervals: 'intervals', totals: 'totals' };
export class RequestConstructor {
    /** requestConstructor.js
    * @param {Object} requestObject - The request object. Example {analysisMode: "intervals", filter: {ProjectId: 1}, intervals: [1, 2, 3]}.    
    * @param {Array} dataServiceModel - The filter values. Example {tables:{tableName:{labels:{},fields:[{name:"Id",labels:{en:"Id",es:"Id",pt:"Id"},type:"Number | String | Date",primaryKey:!0}]}},relationships:{tableName1:{tableName2:{foreignKey:"ProjectId"},risks:{foreignKey:"ProjectId"}}}};
    * @param {string} parentDivId - The parent div ID to attach the filter UI to
    */
    constructor(requestObject, dataServiceModel, parentDivId) {
        resourceAnalysisValidator.validateRequest(requestObject);
        this.requestAnalysisMode = requestObject.analysisMode;
        this.requestFilter = requestObject.filter;
        this.requestIntervals = requestObject.intervals;
        this.dataServiceModel = dataServiceModel;
        this.parentDivId = parentDivId;
        this.initUI();
    }

    initUI() {
        // Find the div by its ID
        const div = document.getElementById(this.parentDivId);

        // Create a form to hold the radio buttons
        const form = document.createElement('form');
        form.id = 'analysisModeForm';

        Object.keys(VALID_ANALYSIS_MODES).forEach(mode => {
            // Create radio input for each mode
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.id = mode;
            radioInput.name = 'analysisMode';
            radioInput.value = mode;
            if (mode === this.requestAnalysisMode) {
                radioInput.checked = true;
            }

            // Create label for the radio input
            const label = document.createElement('label');
            label.htmlFor = mode;
            label.textContent = mode.charAt(0).toUpperCase() + mode.slice(1); // Capitalize first letter

            // Append radio input and label to the form
            form.appendChild(radioInput);
            form.appendChild(label);
        });

        // Append the form to the div
        div.appendChild(form);

        // Create a button element for updating the filter
        const updateButton = document.createElement('button');
        updateButton.textContent = "Change Filter";
        updateButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent form submission
            this.updateFilter();
        });
        div.appendChild(updateButton);
    }

    updateFilter() {
        // Find the selected radio button
        const selectedMode = document.querySelector('input[name="analysisMode"]:checked').value;
        this.requestAnalysisMode = selectedMode;
        console.log('Selected analysis mode:', selectedMode);
        // Dispatch the requestUpdated event with queryFilter as detail
        const event = new CustomEvent('requestUpdated', {
            detail: { analysisMode: this.requestAnalysisMode, filter: this.requestFilter },
            bubbles: true
        });
        document.dispatchEvent(event);
    }
}
