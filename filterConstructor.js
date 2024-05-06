/** filterConstructor.js
* receives an object `queryFilter`, and object `filterValues` and a div Id , that will hook itself onto. For now it will have a singe button "Update Filter" that will dispatch the event `filterUpdated` with the same `queryFilter` object it received
*/ 
export class FilterConstructor {
    constructor(analysisMode, queryFilter, filterValues, parentDivId) {
        this.analysisMode = analysisMode;
        this.queryFilter = queryFilter;
        this.filterValues = filterValues;
        this.parentDivId = parentDivId;
        this.initUI();
    }

    initUI() {
        // Find the div by its ID
        const div = document.getElementById(this.parentDivId);

        // Create a button element
        const button = document.createElement('button');
        button.textContent = "Update Filter";
        button.addEventListener('click', () => this.updateFilter());

        // Append the button to the div
        div.appendChild(button);
    }

    updateFilter() {
        // Dispatch the filterUpdated event with queryFilter as detail
        const event = new CustomEvent('filterUpdated', {
            detail: {analysisMode: this.analysisMode, filter:this.queryFilter}
        });
        document.dispatchEvent(event);
    }
}

