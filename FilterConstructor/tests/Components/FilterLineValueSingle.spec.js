// FilterLineValueSingle.spec.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FilterLineValueSingle } from '../../Components/FilterLineValueSingle';

// Mock css function
vi.mock('../../Modules/helperFunctions.js', () => ({
    css: (strings) => strings.raw[0],
}));

describe('FilterLineValueSingle', () => {
    it('should create the correct DOM structure', () => {
        const component = new FilterLineValueSingle('test', 'String');

        expect(component.elements.component).toBeInstanceOf(HTMLElement);
        expect(component.elements.inputElement).toBeInstanceOf(HTMLInputElement);
        expect(component.elements.inputElement.value).toBe('test');
    });

    it('should update value on input change for String type', () => {
        const component = new FilterLineValueSingle('test', 'String');

        const event = new Event('change');
        component.elements.inputElement.value = 'updated';
        component.elements.inputElement.dispatchEvent(event);

        expect(component.value).toBe('updated');
    });

    it('should update value on input change for Number type', () => {
        const component = new FilterLineValueSingle('123', 'Number');

        const event = new Event('change');
        component.elements.inputElement.value = '456';
        component.elements.inputElement.dispatchEvent(event);

        expect(component.value).toBe(456);
    });

    it('should revert to previous value on invalid number input', () => {
        const component = new FilterLineValueSingle('123', 'Number');

        const event = new Event('change');
        component.elements.inputElement.value = 'invalid';
        component.elements.inputElement.dispatchEvent(event);

        expect(component.value).toBe('123');
        expect(component.elements.inputElement.value).toBe('123');
    });

    it('should dispatch custom event on value change for String type', () => {
        const component = new FilterLineValueSingle('test', 'String');

        const eventListener = vi.fn();
        component.elements.component.addEventListener('filterValueUpdated', eventListener);

        const event = new Event('change');
        component.elements.inputElement.value = 'updated';
        component.elements.inputElement.dispatchEvent(event);

        expect(eventListener).toHaveBeenCalledTimes(1);
        expect(eventListener.mock.calls[0][0].detail).toBe('updated');
    });

    it('should dispatch custom event on value change for Number type', () => {
        const component = new FilterLineValueSingle('123', 'Number');

        const eventListener = vi.fn();
        component.elements.component.addEventListener('filterValueUpdated', eventListener);

        const event = new Event('change');
        component.elements.inputElement.value = '456';
        component.elements.inputElement.dispatchEvent(event);

        expect(eventListener).toHaveBeenCalledTimes(1);
        expect(eventListener.mock.calls[0][0].detail).toBe(456);
    });
});
