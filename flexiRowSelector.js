// flexiRowSelector.js
import { retrieveTypeOrder } from "./utils.js";
export class FlexiRowSelector {
    constructor(targetDivId, initialFilters = {}, dataRows) {
        this.targetDiv = document.getElementById(targetDivId);
        this.dataRows = dataRows;
        this.filterOrder = this.#getFilterOrder(dataRows, initialFilters);
        this.filters = this.#reorderFilters(initialFilters);
        this.initFiltersUI();
    }

    initFiltersUI() {
        // Ensure the container is only created once
        this.filterContainer = this.targetDiv.querySelector('.filter-container') || document.createElement('div');
        this.filterContainer.className = 'filter-container';
        this.filterContainer.innerHTML = ''; // Clear existing content

        // Create and attach filters
        this.createCheckboxes();

        // Append or re-append to ensure updates are visible
        this.targetDiv.appendChild(this.filterContainer);
        this.manageCheckboxes(); // Initial setup for checkbox states
    }
    createCheckboxes() {
        Object.keys(this.filters).forEach(type => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = type;
            checkbox.checked = this.filters[type];

            checkbox.addEventListener('change', () => {
                this.updateFilter(type, checkbox.checked);
            });

            label.appendChild(checkbox);
            label.append(` ${type}`);
            this.filterContainer.appendChild(label);
        });
    }
    manageCheckboxes() {
        let firstUncheckedFound = false;
        let enableNext = false;
        Object.keys(this.filters).forEach(type => {
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
    #getFilterOrder(dataRows,  initialFilters = {}) {
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
    

    #reorderFilters(previousFilters) {
        if (this.filterOrder) {
        const reorderedFilters = {};
            this.filterOrder.forEach(type => {
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
    getFilters() {
        return this.filters;
    }

    setFilters(newFilters) {
        this.filters = this.#reorderFilters(newFilters, this.dataRows);
        document.dispatchEvent(new CustomEvent('filtersUpdated', { detail: this.filters }));
    }

    updateFilter(type, value) {
        this.filters[type] = value;
        this.filters = this.#setSubsequentFiltersFalse(this.filters);
        this.initFiltersUI(); // Reinitialize UI to reflect changes
        document.dispatchEvent(new CustomEvent('filtersUpdated', { detail: this.filters }));
    }

}
