import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FilterLine } from '../../Components/FilterLine';
import filterLineModel from '../../Models/filterLineModel';

// Mock dependencies
vi.mock('../../Modules/helperFunctions', () => ({
    css: (strings) => strings.raw[0],
}));
vi.mock('../../Models/OperatorModel', () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            operatorsValidForFieldTypeWithDescriptions: vi.fn().mockReturnValue([]),
        })),
    };
});
vi.mock('../../Components/globalState', () => ({
    getLang: vi.fn().mockReturnValue('en'),
}));

describe('FilterLine', () => {
    let filterLine;
    let dataServiceModel;

    beforeEach(() => {
        const initialFilterLine = filterLineModel.addGettersSetters ({"projects":{"Duration":{"$gt":10}}});
        const indexInFilterLines = 0;
        dataServiceModel = {
            tables: { projects: {fields:[{name:"Duration"}]}, tasks: {fields:[{name:"Duration"}]} },
            tableListLanguage: vi.fn().mockReturnValue(['projects', 'tasks']),
            reshapeAndTranslateFieldsByTableAndType: vi.fn().mockReturnValue([]),
            getFieldType: vi.fn().mockReturnValue('String'),
        };
        filterLine = new FilterLine(initialFilterLine, indexInFilterLines, dataServiceModel);
    });

    it('should initialize correctly', () => {
        expect(filterLine.filterLine).toBeDefined();
        expect(filterLine.index).toBe(0);
        expect(filterLine.dataServiceModel).toBe(dataServiceModel);
        // expect(filterLine.operatorModel).toBeInstanceOf(OperatorModel.default); // Ensure we check against OperatorModel.default
        expect(filterLine.tables).toEqual(['projects', 'tasks']);
        expect(filterLine.tableFields).toEqual([]);
        expect(filterLine.fieldOperators).toEqual([]);
        expect(filterLine.fieldType).toBe('String');
    });

    it('should create element with correct structure', () => {
        const element = filterLine.element;
        expect(element).toBeInstanceOf(HTMLElement);
        expect(element.id).toBe('filter-line-0');
        expect(element.className).toBe('filter-line');
        //expect(element.children).toHaveLength(4); // filterLineTable, filterLineField, filterLineOperator, filterLineValue
    });


    it('should update filter line on table change', () => {
        const newTable = 'tasks';
        const event = new CustomEvent('filterTableUpdated', { detail: newTable });
        filterLine.elements.filterLineTable.dispatchEvent(event);
        expect(filterLine.filterLine.tableName).toBe(newTable);
    });

    it('should update filter line on field change', () => {
        const newField = 'Duration';
        const event = new CustomEvent('filterFieldUpdated', { detail: newField });
        filterLine.elements.filterLineField.dispatchEvent(event);
        expect(filterLine.filterLine.fieldName).toBe(newField);
    });

    it('should update filter line on operator change', () => {
        const newOperator = '$lt';
        const event = new CustomEvent('filterOperatorUpdated', { detail: newOperator });
        filterLine.elements.filterLineOperator.dispatchEvent(event);
        expect(filterLine.filterLine.operator).toBe(newOperator);
    });

    it('should update filter line on value change', () => {
        const newValue = '20';
        const event = new CustomEvent('filterValueUpdated', { detail: newValue });
        filterLine.elements.filterLineValue.dispatchEvent(event);
        expect(filterLine.filterLine.value).toBe(newValue);
    });

    it('should validate and emit event when filter line is valid', () => {
        const eventSpy = vi.spyOn(filterLine.elements.filterLine, 'dispatchEvent');
        filterLine.elements.filterLineValue.dispatchEvent(new CustomEvent('filterValueUpdated', { detail: 30}));
        expect(eventSpy).toHaveBeenCalled();
        const event = eventSpy.mock.calls[0][0];
        expect(event.type).toBe('filterLineUpdated');
        expect(event.detail).toBe(filterLine.filterLine);
    }); 

    it('should not emit event when filter line is invalid', () => {
        const eventSpy = vi.spyOn(filterLine.elements.filterLine, 'dispatchEvent');
        filterLine.elements.filterLineValue.dispatchEvent(new CustomEvent('filterValueUpdated', { detail: null}));
        expect(eventSpy).not.toHaveBeenCalled();

    });

    it('should not validate the filterLine when the value is not valid', () => {
        filterLine.elements.filterLineValue.dispatchEvent(new CustomEvent('filterValueUpdated', { detail: null}));
        expect(filterLineModel.isValidLine(filterLine.isValid)).toBe(false);

    });

});
