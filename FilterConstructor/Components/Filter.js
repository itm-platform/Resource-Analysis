//Filter/Filter.js
import filterLineModel from '../Models/filterLineModel.js';
import {FilterLine} from './FilterLine.js';
export class Filter {
    constructor(queryFilter, dataServiceModel, parentDivId) {
        this.queryFilter = queryFilter || {};
        this.dataServiceModel = dataServiceModel;
        this.parentDivId = parentDivId;
        this.filterLines = [];
        this.#init();
    }

    #init() {
        this._breakFilterInLines();
        this.render();
        document.getElementById('buttonAddFilterLine').addEventListener('click', () => {
            this.addFilterLine();
        });
    }

    _breakFilterInLines() {
        this.filterLines = filterLineModel.breakFilterInLines(this.queryFilter);
    }
    

    render() {
        const parentDiv = document.getElementById(this.parentDivId);
    
        // Create the main container for filter constructor
        const filterConstructor = document.createElement('div');
        filterConstructor.id = 'filterConstructor';
    
        // Create the container for filter lines
        const filterLinesDiv = document.createElement('div');
        filterLinesDiv.id = 'filterLines';
    
        // Create the button to add new filter lines
        const buttonAddFilterLine = document.createElement('button');
        buttonAddFilterLine.id = 'buttonAddFilterLine';
        buttonAddFilterLine.textContent = '+';
    
        // Append the filter lines div and button to the main filter constructor div
        filterConstructor.appendChild(filterLinesDiv);
        filterConstructor.appendChild(buttonAddFilterLine);
    
        // Append the main filter constructor div to the parent div
        parentDiv.appendChild(filterConstructor);
    
        // Render each filter line
        this.filterLines.forEach((line, index) => {
            this.renderFilterLine(line, index, filterLinesDiv);
        });
    }
    
    renderFilterLine(line, index, filterLinesDiv) {
        const filterLine = new FilterLine(line, index, this.dataServiceModel);
        filterLinesDiv.appendChild(filterLine.element);
    }
    

    addFilterLine() {
        const newFilterLine = {};
        this.filterLines.push(newFilterLine);
        this.renderFilterLine(newFilterLine, this.filterLines.length - 1);
    }

    updateFilterWithLine(index, event) {
        // Update logic to modify filterLines and recompose queryFilter
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
}
