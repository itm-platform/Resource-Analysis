// flexiRowSelector.js
import { retrieveTypeOrder } from "./utils.js";
export class FlexiRowSelector {
    constructor(targetDivId, initialRowSelection = {}, dataRows) {
        this.targetDiv = document.getElementById(targetDivId);
        this.dataRows = dataRows;
        this.rowSelectionOrder = this.#getRowSelectionOrder(dataRows, initialRowSelection);
        this.rowSelection = this.#reorderRowSelection(initialRowSelection);
        this.initRowSelectorUI();
        this.#registerDataUpdatedListener(); // Register listener for data updates
    }

    initRowSelectorUI() {
        this.rowSelectorContainer = this.targetDiv.querySelector('.row-selector-container') || document.createElement('div');
        this.rowSelectorContainer.className = 'row-selector-container';
        this.rowSelectorContainer.innerHTML = ''; // Clear existing content

        this.#createCheckboxes();

        this.targetDiv.appendChild(this.rowSelectorContainer);
        this.#manageCheckboxes(); // Initial setup for checkbox states
    }
    #createCheckboxes() {
        Object.keys(this.rowSelection).forEach(type => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = type;
            checkbox.checked = this.rowSelection[type];

            checkbox.addEventListener('change', () => {
                this.updateFilter(type, checkbox.checked);
            });

            label.appendChild(checkbox);
            label.append(` ${type}`);
            this.rowSelectorContainer.appendChild(label);
        });
    }
    #manageCheckboxes() {
        let firstUncheckedFound = false;
        let enableNext = false;
        Object.keys(this.rowSelection).forEach(type => {
            const checkbox = document.getElementById(type);
            if (enableNext) {
                checkbox.disabled = false;
                enableNext = false;
            } else {
                checkbox.disabled = checkbox.checked ? false : firstUncheckedFound;
            }
            if (!checkbox.checked && !firstUncheckedFound) {
                firstUncheckedFound = true;
            } else if (checkbox.checked) {
                enableNext = true;
            }
        });
    }
    #getRowSelectionOrder(dataRows,  initialFilters = {}) {
        if (dataRows && dataRows.length > 0) {
            return retrieveTypeOrder(dataRows);
        } else {
            if (Object.keys(initialFilters).length > 0) {
                return Object.keys(initialFilters);
            } else {
                return undefined;
            }
        }
    };
    
    #reorderRowSelection(previousFilters) {
        if (this.rowSelectionOrder) {
        const reorderedFilters = {};
            this.rowSelectionOrder.forEach(type => {
                reorderedFilters[type] = type in previousFilters ? previousFilters[type] : false;
            });
            return this.#setSubsequentFiltersFalse(reorderedFilters);
        }
        return this.#setSubsequentFiltersFalse(previousFilters);
    }

    #setSubsequentFiltersFalse(filters) {
        let disableSubsequent = false;
        Object.keys(filters).forEach(key => {
            if (disableSubsequent) {
                filters[key] = false;
            } else if (filters[key] === false) {
                disableSubsequent = true;
            }
        });
        return filters;
    }

    #registerDataUpdatedListener() {
        document.addEventListener('resourceAnalysisDataUpdated', (event) => {
            this.#handleDataUpdated(event.detail.rows); 
        });
    }

    #handleDataUpdated(newDataRows) {
        this.dataRows = newDataRows; // Update dataRows with new data
        this.rowSelectionOrder = this.#getRowSelectionOrder(this.dataRows, this.rowSelection); // Re-compute the selection order based on new data
        this.rowSelection = this.#reorderRowSelection(this.rowSelection); // Reorder the row selection based on updated order
        this.initRowSelectorUI(); // Reinitialize the UI to reflect changes
    }
    getRows() {
        return this.rowSelection;
    }

    updateFilter(type, value) {
        this.rowSelection[type] = value;
        this.rowSelection = this.#setSubsequentFiltersFalse(this.rowSelection);
        this.initRowSelectorUI(); // Reinitialize UI to reflect changes
        document.dispatchEvent(new CustomEvent('rowSelectionUpdated', { detail: this.rowSelection, bubbles: true}));
    }

}
