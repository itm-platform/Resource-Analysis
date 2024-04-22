// filterManager.js
export class FilterManager {
    constructor(targetDivId, onFilterChangeCallback, initialFilters = {}) {
        this.targetDiv = document.getElementById(targetDivId);
        this.filters = initialFilters; // Initialize with provided filters
        this.onFilterChangeCallback = onFilterChangeCallback;
        this.initFiltersUI();
    }
    
    initFiltersUI() {
        const filterContainer = document.createElement('div');
        Object.keys(this.filters).forEach(type => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = type;
            checkbox.checked = this.filters[type];
            checkbox.addEventListener('change', () => {
                this.updateFilter(type, checkbox.checked);
                document.dispatchEvent(new CustomEvent('filtersUpdated', { detail: this.filters }));
            });
            label.appendChild(checkbox);
            label.append(` ${type}`);
            filterContainer.appendChild(label);
        });
        this.targetDiv.appendChild(filterContainer);
    }

    updateFilter(type, value) {
        this.filters[type] = value;
        this.onFilterChangeCallback(this.filters);
    }

    updateFilterCallback(newCallback) {
        this.onFilterChangeCallback = newCallback;
    }
}
