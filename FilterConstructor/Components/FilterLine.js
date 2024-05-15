// Filter/FilterLine.js
import {FilterLineTable} from './FilterLineTable.js';
import {FilterLineField} from './FilterLineField.js';
import {css} from '../Modules/helperFunctions.js';
import { getLang } from './globalState.js'; 
export class FilterLine {
    constructor(
        filterLine, 
        indexInFilterLines,
        dataServiceModel,
        ) 
        {
        this.filterLine = filterLine;
        this.index = indexInFilterLines;
        this.dataServiceModel = dataServiceModel;
        this.tables = [];
        
        this.elements = {};
        this.#init();
        this.element = this.#createElement();
        this.#applyStyles();
        this.#setupEventListeners();
    }

    #init() {
        this.tables =this.dataServiceModel.tableListLanguage(getLang());
        console.log(this.tables);
    }
    #createElement() {
        const filterLine = document.createElement('div');
        filterLine.id = 'filter-line-' + this.index;
        filterLine.className = 'filter-line';
        this.elements.filterLine = filterLine;

        const tables = [
            {value: "projects", text: "Projects"},
            {value: "services", text: "Services"}
        ];
        const tableSelected = "projects";

        const fields=[
            {
                "text": "Status Name",
                "value": "Status",
                "location": "Status.Name",
                "type": "String",
                "table": "projects"
            }, 
            {
                "text": "Id",
                "value": "Id",
                "type": "Number",
                "table": "projects"
                
            }];
            const fieldSelected = "Id";

        const filterLineTable = new FilterLineTable(this.tables, tableSelected);
        this.elements.filterLineTable = filterLineTable.element;
        filterLine.appendChild(this.elements.filterLineTable);

        const filterLineField = new FilterLineField(fields, fieldSelected);
        this.elements.filterLineField = filterLineField.element;
        filterLine.appendChild(this.elements.filterLineField);

        return filterLine;
    }

    #applyStyles() {
        const style = document.createElement('style');
        style.textContent = this.#getStyles();
        this.element.appendChild(style);
    }


    #setupEventListeners() {
        this.elements.filterLineTable.addEventListener('filterTableUpdated', (event) => {
            this.#updateFilterTable(event.detail);
        });

        this.elements.filterLineField.addEventListener('filterFieldUpdated', (event) => {
            this.#updateFilterField(event.detail);
        });

        this.elements.filterLine.addEventListener('click', (event) => {
            console.log(`FilterLine ${this.index} clicked`);
        });

        // Add any additional event listeners here
    }

    #updateFilterTable(tableName) {
        console.log(`${this.index} tableName: ${tableName}`);
    }

    #updateFilterField(fieldName) {
        console.log(`${this.index} fieldName: ${fieldName}`);
    }
    
    #getStyles() {
        return css`
            .filter-line {
                display: flex;
            }
        `;
    }
}
