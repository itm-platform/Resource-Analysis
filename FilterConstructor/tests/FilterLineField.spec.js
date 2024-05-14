import { describe, expect, test, vi } from 'vitest';
import { FilterLineTable } from '../FilterLineField';

describe('FilterLineTable', () => {
    test('should initialize with given fields and selected field', () => {
        const fields = [
            { value: 'Id', text: 'Id' },
            { value: 'IsActive', text: 'Active' }
        ];
        const fieldSelected = 'Id';
        const component = new FilterLineTable(fields, fieldSelected);

        expect(component.fields).toEqual(fields);
        expect(component.fieldSelected).toBe(fieldSelected);
    });

    test('should render a select element with options based on provided fields', () => {
        const fields = [
            { value: 'Id', text: 'Id' },
            { value: 'IsActive', text: 'Active' }
        ];
        const fieldSelected = 'Id';
        const component = new FilterLineTable(fields, fieldSelected);
        const selectElement = component.element.querySelector('select');

        expect(selectElement.children.length).toBe(2);
        expect(selectElement.children[0].value).toBe('Id');
        expect(selectElement.children[0].selected).toBe(true);
        expect(selectElement.children[1].value).toBe('IsActive');
        expect(selectElement.children[1].selected).toBe(false);
    });

    test('should update fieldSelected when different option is selected', () => {
        const fields = [
            { value: 'Id', text: 'Id' },
            { value: 'IsActive', text: 'Active' }
        ];
        const fieldSelected = 'Id';
        const component = new FilterLineTable(fields, fieldSelected);
        const selectElement = component.element.querySelector('select');

        // Simulate changing selection to 'IsActive'
        selectElement.value = 'IsActive';
        selectElement.dispatchEvent(new Event('change'));

        expect(component.fieldSelected).toBe('IsActive');
    });

    test('should emit `filterFieldUpdated` event on select change', () => {
        const fields = [
            { value: 'Id', text: 'Id' },
            { value: 'IsActive', text: 'Active' }
        ];
        const fieldSelected = 'Id';
        const component = new FilterLineTable(fields, fieldSelected);
        const selectElement = component.element.querySelector('select');
        const mockHandler = vi.fn();

        component.element.addEventListener('filterFieldUpdated', mockHandler);

        // Simulate changing selection to 'IsActive'
        selectElement.value = 'IsActive';
        selectElement.dispatchEvent(new Event('change'));

        expect(mockHandler).toHaveBeenCalled();
        expect(mockHandler.mock.calls[0][0].detail).toBe('IsActive');
    });
});
