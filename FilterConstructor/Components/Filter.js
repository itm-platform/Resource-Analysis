import { FilterLine } from './FilterLine.js';
import filterLineModel from '../Models/filterLineModel.js';
import DataServiceModel from '../Models/DataServiceModel.js';
import { setLang } from './globalState.js';
import { css } from '../Modules/helperFunctions.js';

export class Filter {
    /**
     * 
     * @param {*} queryFilter 
     * @param {*} dataServiceModelJSON 
     * @param {*} parentDivId 
     * @param {Array} [tablesAllowed] If not provided, all tables are allowed
     * @param {*} lang 
     */
    constructor(queryFilter, dataServiceModelJSON, parentDivId, tablesAllowed, lang = "es") {
        this.queryFilter = queryFilter || {};

        this.dataServiceModel = new DataServiceModel(dataServiceModelJSON);
        this.parentDivId = parentDivId;
        this.tablesAllowed = tablesAllowed;
        this.lang = lang;
        this.filterLines = [];
        this.filterLines = this._filterLines;  // Use setter to initialize and wrap

        this.elements = {};

        this.#init();
        this.element = this.#createElement();
        this.#applyStyles();
        this.#setupEventListeners();
        this.render();
    }

    #init() {
        setLang(this.lang);
        this.dataServiceModel.keepOnlyTables(this.tablesAllowed);
        this.filterLines = filterLineModel.breakFilterInLines(this.queryFilter);
    }
    #proxyWrapFilterLines() {
        this._filterLines = new Proxy(this._filterLines, {
            set: (target, property, value) => {
                target[property] = value;
                this.#updateButtonLabel();
                return true;
            },
            deleteProperty: (target, property) => {
                delete target[property];
                this.#updateButtonLabel();
                return true;
            },
            apply: (target, thisArg, argumentsList) => {
                const result = target.apply(thisArg, argumentsList);
                this.#updateButtonLabel();
                return result;
            }
        });
    }

    set filterLines(newFilterLines) {
        this._filterLines = newFilterLines;
        this.#proxyWrapFilterLines();
        this.#updateButtonLabel();
    }

    get filterLines() {
        return this._filterLines;
    }
    #createElement() {
        const filterConstructor = document.createElement('div');
        filterConstructor.id = 'filterConstructor';
        filterConstructor.className = 'filter-class';
        this.elements.filterConstructor = filterConstructor;

        const filterLinesDiv = document.createElement('div');
        filterLinesDiv.id = 'filterLines';
        this.elements.filterLinesDiv = filterLinesDiv;

        let buttonAddFilterLine;
        //if (customElements.get('itm-button')) {
        if (true) {
            buttonAddFilterLine = document.createElement('itm-button');
            buttonAddFilterLine.type = "secondary";
            buttonAddFilterLine.size = "small";
        }
        else {
            buttonAddFilterLine = document.createElement('button');
        }


        buttonAddFilterLine.id = 'buttonAddFilterLine';
        this.elements.buttonAddFilterLine = buttonAddFilterLine;

        filterConstructor.appendChild(filterLinesDiv);
        filterConstructor.appendChild(buttonAddFilterLine);

        const parentDiv = document.getElementById(this.parentDivId);
        parentDiv.appendChild(filterConstructor);

        this.#updateButtonLabel();

        return filterConstructor;
    }
    #updateButtonLabel() {
        if (this.elements?.buttonAddFilterLine) {
            this.elements.buttonAddFilterLine.textContent = this.filterLines.length === 0 ? 'Add Filter' : '+';
        }
    }

    #applyStyles() {
        const style = document.createElement('style');
        style.textContent = this.#getStyles();
        this.element.appendChild(style);
    }

    #setupEventListeners() {
        this.elements.buttonAddFilterLine.addEventListener('click', () => {
            this.addFilterLine();
        });
    }

    render() {
        this.elements.filterLinesDiv.innerHTML = '';
        this.filterLines.forEach((filterLine, index) => {
            this.renderFilterLine(filterLine, index);
        });
        this.#updateButtonLabel();
    }

    renderFilterLine(line, index) {
        const filterLineElement = new FilterLine(line, index, this.dataServiceModel);
        filterLineElement.element.addEventListener('filterLineUpdated', (event) => {
            this.updateFilterWithLine(index, event);
        });
        filterLineElement.element.addEventListener('removeFilterLine', () => {
            this.removeFilterLine(index);
        });
        this.elements.filterLinesDiv.appendChild(filterLineElement.element);
    }

    addFilterLine() {
        const newFilterLine = {};
        this.filterLines.push(newFilterLine);
        this.renderFilterLine(newFilterLine, this.filterLines.length - 1);
    }
    removeFilterLine(index) {
        this.filterLines.splice(index, 1);
        this.render();
        this.recomposeFilterFromLines();
        this.dispatchFilterUpdated();
    }
    updateFilterWithLine(index, event) {
        this.filterLines[index] = event.detail;
        this.recomposeFilterFromLines();
        this.dispatchFilterUpdated();
    }

    recomposeFilterFromLines() {
        this.queryFilter = filterLineModel.recomposeFilterFromLines(this.filterLines);
    }

    dispatchFilterUpdated() {
        const event = new CustomEvent('filterUpdated', {
            detail: this.queryFilter,
            bubbles: true
        });
        this.element.dispatchEvent(event);
    }

    #getStyles() {
        return css`
            .filter-class {
                display: flex;
                flex-direction: column;
                padding-bottom: 1px; 
            }
            #filterLines {
                margin-bottom: 10px;
            }
            #buttonAddFilterLine {
                align-self: flex-start;
            }
        `;
    }
}
