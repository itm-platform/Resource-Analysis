// flexiRowSelector.js
import { retrieveTypeOrder } from "./utils.js";
const css = (strings) => strings.raw[0];
export class FlexiRowSelector {
    constructor(targetDivId, initialRowSelection = {}, dataRows) {
        this.targetDiv = document.getElementById(targetDivId);
        this.dataRows = dataRows;
        this.rowSelectionOrder = this.#getRowSelectionOrder(dataRows, initialRowSelection);
        this.rowSelection = this.#reorderRowSelection(initialRowSelection);

        this._langTranslations = {};
        this._lang = typeof strLanguage !== 'undefined' ? strLanguage : 'en';

        this._initPromise = this.#initDependencies().then(() => {
            this.initRowSelectorUI();
            this.#applyStyles();
            this.#registerDataUpdatedListener(); // Register listener for data updates
        });
    }
    async #initDependencies() {
        await itmGlobal.ensureDiContainerReady();
        this.getTranslations = window.diContainer.get('getTranslations');
        await this.#loadTranslations();

    }
    async #loadTranslations() {
        this._langTranslations = await this.getTranslations('flexitable', this._lang);
    }
    #applyStyles() {
        const style = document.createElement('style');
        style.textContent = this.#getStyles();
        document.head.appendChild(style);
    }
    initRowSelectorUI() {
        this.rowSelectorContainer = this.targetDiv.querySelector('.row-selector-container') || document.createElement('div');
        this.rowSelectorContainer.className = 'row-selector-container';

        this.rowSelectorContainer.innerHTML = '';

        this.#createCheckboxes();

        this.targetDiv.appendChild(this.rowSelectorContainer);
        this.#manageCheckboxes(); // Initial setup for checkbox states
    }
    #createCheckboxes() {
        let isFirst = true;
        Object.keys(this.rowSelection).forEach(type => {
            const label = document.createElement('label');
            label.classList.add('ftbl-row-selector-label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = type;
            checkbox.checked = this.rowSelection[type];
            
            if (isFirst) {
                checkbox.checked = true;
                checkbox.disabled = true;
                isFirst = false;
            }

            checkbox.addEventListener('change', () => {
                this.updateFilter(type, checkbox.checked);
            });

            label.appendChild(checkbox);
            label.append(this._langTranslations.t(type));
            this.rowSelectorContainer.appendChild(label);
        });
    }
    #manageCheckboxes() {
        let firstUncheckedFound = false;
        let enableNext = false;
        Object.keys(this.rowSelection).forEach((type, index) => {
            const checkbox = document.getElementById(type);
            if (index === 0) {
                checkbox.checked = true;
                checkbox.disabled = true;
                return; // Skip the first checkbox
            }
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
    #getRowSelectionOrder(dataRows, initialFilters = {}) {
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

            // Ensure the first checkbox is always checked
            const firstType = this.rowSelectionOrder[0];
            reorderedFilters[firstType] = true;

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
        if (Object.keys(this.rowSelection).indexOf(type) === 0) {
            return; // Prevent changes to the first checkbox
        }
        this.rowSelection[type] = value;
        this.rowSelection = this.#setSubsequentFiltersFalse(this.rowSelection);
        this.initRowSelectorUI(); // Reinitialize UI to reflect changes
        document.dispatchEvent(new CustomEvent('resourceAnalysisRowSelectionUpdated', { detail: this.rowSelection, bubbles: true }));
    }
    #getStyles() {
        return css`
            .ftbl-row-selector-label {
                margin-right: .4em;
            }
            .ftbl-row-selector-label input {
                margin-right: .2em;
            }
            .ftbl-row-selector-main-label {
                font-weight: bold;
            }
        `;
    }

}
