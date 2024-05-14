import { describe, expect, test, vi } from 'vitest';
import { FilterLineTable } from '../FilterLineTable';

describe('FilterLineTable', () => {
    test('should initialize with given tables and selected table', () => {
        const tables = [{ value: 'projects', text: 'Projects' }, { value: 'services', text: 'Services' }];
        const tableSelected = 'projects';
        const component = new FilterLineTable(tables, tableSelected);

        expect(component.tables).toEqual(tables);
        expect(component.tableSelected).toBe(tableSelected);
    });

    test('should render a select element with options based on provided tables', () => {
        const tables = [{ value: 'projects', text: 'Projects' }, { value: 'services', text: 'Services' }];
        const tableSelected = 'projects';
        const component = new FilterLineTable(tables, tableSelected);
        const selectElement = component.element.querySelector('select');

        expect(selectElement.children.length).toBe(2);
        expect(selectElement.children[0].value).toBe('projects');
        expect(selectElement.children[0].selected).toBe(true);
        expect(selectElement.children[1].value).toBe('services');
        expect(selectElement.children[1].selected).toBe(false);
    });

    test('should update tableSelected when different option is selected', () => {
        const tables = [{ value: 'projects', text: 'Projects' }, { value: 'services', text: 'Services' }];
        const tableSelected = 'projects';
        const component = new FilterLineTable(tables, tableSelected);
        const selectElement = component.element.querySelector('select');

        // Simulate changing selection to 'services'
        selectElement.value = 'services';
        selectElement.dispatchEvent(new Event('change'));

        expect(component.tableSelected).toBe('services');
    });

    test('should emit `filterTableUpdated` event on select change', () => {
        const tables = [{ value: 'projects', text: 'Projects' }, { value: 'services', text: 'Services' }];
        const tableSelected = 'projects';
        const component = new FilterLineTable(tables, tableSelected);
        const selectElement = component.element.querySelector('select');
        const mockHandler = vi.fn();

        component.element.addEventListener('filterTableUpdated', mockHandler);

        // Simulate changing selection to 'services'
        selectElement.value = 'services';
        selectElement.dispatchEvent(new Event('change'));

        expect(mockHandler).toHaveBeenCalled();
        expect(mockHandler.mock.calls[0][0].detail).toBe('services');
    });
});
