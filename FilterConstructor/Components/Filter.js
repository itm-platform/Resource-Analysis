// Filter/Filter.js
import { FilterLine } from './FilterLine.js';
import filterLineModel from '../Models/filterLineModel.js';
import DataServiceModel from '../Models/DataServiceModel.js';
import { css } from '../Modules/helperFunctions.js';

export class Filter {
    constructor(queryFilter, dataServiceModelJSON, parentDivId, tablesAllowed = [], lang = "en") {
        this.queryFilter = queryFilter || {};
        this.dataServiceModel = new DataServiceModel(dataServiceModelJSON);
        this.parentDivId = parentDivId;
        this.tablesAllowed = tablesAllowed;
        this.lang = lang;
        this.filterLines = [];
        this.elements = {};
        this.element = this.#createElement();
        this.#applyStyles();
        this.#setupEventListeners();
        this.#init();
    }

    #init() {
        this.dataServiceModel.keepOnlyTables(this.tablesAllowed);
        this.#breakFilterInLines();
        this.render();
    }

    #createElement() {
        const filterConstructor = document.createElement('div');
        filterConstructor.id = 'filterConstructor';
        filterConstructor.className = 'filter-class';
        this.elements.filterConstructor = filterConstructor;

        const filterLinesDiv = document.createElement('div');
        filterLinesDiv.id = 'filterLines';
        this.elements.filterLinesDiv = filterLinesDiv;

        const buttonAddFilterLine = document.createElement('button');
        buttonAddFilterLine.id = 'buttonAddFilterLine';
        buttonAddFilterLine.textContent = '+';
        this.elements.buttonAddFilterLine = buttonAddFilterLine;

        filterConstructor.appendChild(filterLinesDiv);
        filterConstructor.appendChild(buttonAddFilterLine);

        const parentDiv = document.getElementById(this.parentDivId);
        parentDiv.appendChild(filterConstructor);

        return filterConstructor;
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

    #breakFilterInLines() {
        this.filterLines = filterLineModel.breakFilterInLines(this.queryFilter);
    }

    render() {
        this.elements.filterLinesDiv.innerHTML = '';
        this.filterLines.forEach((line, index) => {
            this.renderFilterLine(line, index);
        });
    }

    renderFilterLine(line, index) {
        const filterLine = new FilterLine(line, index, this.dataServiceModel);
        this.filterLines.push(filterLine);
        this.elements.filterLinesDiv.appendChild(filterLine.element);
    }

    addFilterLine() {
        const newFilterLine = {};
        this.filterLines.push(newFilterLine);
        this.renderFilterLine(newFilterLine, this.filterLines.length - 1);
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
        const event = new CustomEvent('filterUpdated', { detail: this.queryFilter });
        document.dispatchEvent(event);
    }

    #getStyles() {
        return css`
            .filter-class {
                display: flex;
                flex-direction: column;
                // Additional styles
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
