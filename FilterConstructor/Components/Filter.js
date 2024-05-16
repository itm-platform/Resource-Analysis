import { FilterLine } from './FilterLine.js';
import filterLineModel from '../Models/filterLineModel.js';
import DataServiceModel from '../Models/DataServiceModel.js';
import { setLang } from './globalState.js';
import { css } from '../Modules/helperFunctions.js';

export class Filter {
    constructor(queryFilter, dataServiceModelJSON, parentDivId, tablesAllowed = [], lang = "es") {
        this.queryFilter = queryFilter || {};
        this.dataServiceModel = new DataServiceModel(dataServiceModelJSON);
        this.parentDivId = parentDivId;
        this.tablesAllowed = tablesAllowed;
        this.lang = lang;
        this.filterLines = [];
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

    render() {
        this.elements.filterLinesDiv.innerHTML = '';
        this.filterLines.forEach((filterLine, index) => {
            this.renderFilterLine(filterLine, index);

        });
        console.log(`render with filterLines: ${JSON.stringify(this.filterLines, null, 2)}`);
    }

    renderFilterLine(line, index) {
        const filterLineElement = new FilterLine(line, index, this.dataServiceModel);
        filterLineElement.element.addEventListener('filterLineUpdated', (event) => {
            this.updateFilterWithLine(index, event);
        });
        this.elements.filterLinesDiv.appendChild(filterLineElement.element);
    }

    addFilterLine() {
        const newFilterLine = {};
        this.filterLines.push(newFilterLine);
        this.renderFilterLine(newFilterLine, this.filterLines.length - 1);
    }

    updateFilterWithLine(index, event) {
        console.log(`filterLines before: ${JSON.stringify(this.filterLines, null, 2)}`);
        this.filterLines[index] = event.detail;
        console.log(`Filter line ${index} updated with ${JSON.stringify(event.detail, null, 2)}`);
        console.log(`filterLines after: ${JSON.stringify(this.filterLines, null, 2)}`);
        this.recomposeFilterFromLines();
        this.dispatchFilterUpdated();
    }

    recomposeFilterFromLines() {
        this.queryFilter = filterLineModel.recomposeFilterFromLines(this.filterLines);
    }

    dispatchFilterUpdated() {
        const event = new CustomEvent('filterUpdated', { detail: this.queryFilter });
        //console.log(`New filter: ${JSON.stringify(this.queryFilter, null, 2)}`);
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
