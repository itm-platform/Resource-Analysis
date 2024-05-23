import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Filter } from '../../Components/Filter';
import filterLineModel from '../../Models/filterLineModel';
import DataServiceModel from '../../Models/DataServiceModel';
import { setLang } from '../../Components/globalState';

// Mock dependencies
vi.mock('../../Modules/helperFunctions', () => ({
    css: (strings) => strings.raw[0],
}));

vi.mock('../../Components/globalState', () => ({
    setLang: vi.fn(),
    getLang: vi.fn().mockReturnValue('en'),
}));

vi.mock('../../Models/filterLineModel', () => {
    return {
        default: {
            breakFilterInLines: vi.fn().mockReturnValue([]),
            recomposeFilterFromLines: vi.fn().mockReturnValue({}),
            addGettersSetters: vi.fn().mockImplementation((filterLine) => filterLine), // Mock implementation
        },
    };
});



describe('Filter', () => {
    let filter;
    let dataServiceModelJSON;
    let parentDivId = 'parentDivId';
    let tablesAllowed = ['projects', 'tasks'];
    let initialFilter = {
        "projects": {
            "Duration": { "$gt": 10 }, "EndDate": { "$lte": "2023-11-30" },
            "Status.IsCompleted": true
        },
        "tasks": { "ProjectId": 21 }
    };

    beforeEach(() => {
        // Set up the DOM element
        document.body.innerHTML = `<div id="${parentDivId}"></div>`;
        dataServiceModelJSON = {
            "tables": {
                "projects": {"fields": [{"name": "CreatedDate"}, {"name": "Id"}]},
                "tasks": {"fields": [{"name": "Id"}, {"name": "Duration"}, {"name": "Status", "location": "Status.Name"}]},
                "risks": {"fields": [{"name": "Id"}, {"name": "Probability"}]}
            }
        };
        filter = new Filter(initialFilter, dataServiceModelJSON, parentDivId, tablesAllowed, 'es');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with correct properties', () => {
        expect(filter.queryFilter).toEqual(initialFilter);
        expect(filter.dataServiceModel).toBeInstanceOf(DataServiceModel);
        expect(filter.parentDivId).toBe(parentDivId);
        expect(filter.tablesAllowed).toEqual(tablesAllowed);
        expect(filter.lang).toBe('es');
        expect(setLang).toHaveBeenCalledWith('es');
        expect(filterLineModel.breakFilterInLines).toHaveBeenCalledWith(initialFilter);
    });

    it('should create and append elements correctly', () => {
        const filterConstructor = document.getElementById('filterConstructor');
        const filterLinesDiv = document.getElementById('filterLines');
        const buttonAddFilterLine = document.getElementById('buttonAddFilterLine');

        expect(filterConstructor).toBeTruthy();
        expect(filterLinesDiv).toBeTruthy();
        expect(buttonAddFilterLine).toBeTruthy();
        expect(buttonAddFilterLine.textContent).toBe('+');
    });

    it('should add a new filter line when the button is clicked', () => {
        const initialFilterLinesLength = filter.filterLines.length;
        const buttonAddFilterLine = document.getElementById('buttonAddFilterLine');
        buttonAddFilterLine.click();
        expect(filter.filterLines.length).toBe(initialFilterLinesLength + 1);
    });

    it('should add a new filter line element when the button is clicked', () => {
        const initialFilterLinesLength = filter.filterLines.length;
        const buttonAddFilterLine = document.getElementById('buttonAddFilterLine');
        buttonAddFilterLine.click();
    
        setTimeout(() => {
            expect(filter.filterLines.length).toBe(initialFilterLinesLength + 1);
    
            const filterLinesDiv = document.getElementById('filterLines');
            expect(filterLinesDiv.children.length).toBe(initialFilterLinesLength + 1);
        }, 100);
    });
    

    it('should update filter with line', () => {
        const newFilterLine = { detail: { "newField": { "$eq": 20 } } };
        filter.addFilterLine();
        filter.updateFilterWithLine(0, { detail: newFilterLine });
        expect(filter.filterLines[0]).toEqual(newFilterLine);
        expect(filterLineModel.recomposeFilterFromLines).toHaveBeenCalledWith(filter.filterLines);
    });

    it('should dispatch filterUpdated event', () => {
        const spyDispatchEvent = vi.spyOn(filter.element, 'dispatchEvent');
        filter.dispatchFilterUpdated();
        expect(spyDispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));
        const dispatchedEvent = spyDispatchEvent.mock.calls[0][0];
        expect(dispatchedEvent.type).toBe('filterUpdated');
        expect(dispatchedEvent.detail).toBe(filter.queryFilter);
    });

    it('should apply styles correctly', () => {
        const style = filter.element.querySelector('style');
        expect(style).toBeTruthy();
        expect(style.textContent).toContain('.filter-line-table');
    });
});
