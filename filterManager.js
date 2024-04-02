// filterManager.js
export class FilterManager {
    constructor(targetDivId, onFilterChangeCallback) {
        this.targetDiv = document.getElementById(targetDivId);
        if (!this.targetDiv) {
            console.error(`The target div with ID '${targetDivId}' was not found.`);
            return;
        }
        this.filters = {
            Program: true,
            Project: true,
            Task: true
        };
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
            checkbox.addEventListener('change', () => this.updateFilter(type, checkbox.checked));
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
}
