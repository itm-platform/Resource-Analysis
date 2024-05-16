// FilterLineValueDate.spec.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FilterLineValueDate } from '../../Components/FilterLineValueDate';

// Mock css function
vi.mock('../../Modules/helperFunctions.js', () => ({
    css: (strings) => strings.raw[0],
}));

describe('FilterLineValueDate', () => {
    it('should create the correct DOM structure', () => {
        const component = new FilterLineValueDate('2024-05-15');

        expect(component.elements.component).toBeInstanceOf(HTMLElement);
        expect(component.elements.inputElement).toBeInstanceOf(HTMLInputElement);
        expect(component.elements.inputElement.type).toBe('date');
        expect(component.elements.inputElement.value).toBe('2024-05-15');
    });

    it('should update value on date change', () => {
        const component = new FilterLineValueDate('2024-05-15');

        const event = new Event('change');
        component.elements.inputElement.value = '2024-06-15';
        component.elements.inputElement.dispatchEvent(event);

        expect(component.value).toBe('2024-06-15');
    });

    it('should dispatch custom event on value change', () => {
        const component = new FilterLineValueDate('2024-05-15');

        const eventListener = vi.fn();
        component.elements.component.addEventListener('filterValueUpdated', eventListener);

        const event = new Event('change');
        component.elements.inputElement.value = '2024-06-15';
        component.elements.inputElement.dispatchEvent(event);

        expect(eventListener).toHaveBeenCalledTimes(1);
        expect(eventListener.mock.calls[0][0].detail).toBe('2024-06-15');
    });
});
