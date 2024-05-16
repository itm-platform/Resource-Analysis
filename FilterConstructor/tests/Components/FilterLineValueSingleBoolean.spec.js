// FilterLineValueSingleBoolean.spec.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FilterLineValueSingleBoolean } from '../../Components/FilterLineValueSingleBoolean';

// Mock css function
vi.mock('../../Modules/helperFunctions.js', () => ({
    css: (strings) => strings.raw[0],
}));

// Mock getLang function
vi.mock('../../Components/globalState.js', () => ({
    getLang: vi.fn(),
}));

import { getLang } from '../../Components/globalState.js';

describe('FilterLineValueSingleBoolean', () => {
    beforeEach(() => {
        getLang.mockClear();
    });

    it('should create the correct DOM structure', () => {
        getLang.mockReturnValue('en');
        const component = new FilterLineValueSingleBoolean('true');

        expect(component.elements.component).toBeInstanceOf(HTMLElement);
        expect(component.elements.inputElement).toBeInstanceOf(HTMLSelectElement);
        expect(component.elements.inputElement.value).toBe('true');

        const options = component.elements.inputElement.options;
        expect(options.length).toBe(2);
        expect(options[0].value).toBe('true');
        expect(options[0].text).toBe('True');
        expect(options[1].value).toBe('false');
        expect(options[1].text).toBe('False');
    });

    it('should reflect the correct language', () => {
        getLang.mockReturnValue('es');
        const component = new FilterLineValueSingleBoolean('false');

        const options = component.elements.inputElement.options;
        expect(options[0].text).toBe('Verdadero');
        expect(options[1].text).toBe('Falso');
    });

    it('should update value on select change', () => {
        getLang.mockReturnValue('en');
        const component = new FilterLineValueSingleBoolean('true');

        const event = new Event('change');
        component.elements.inputElement.value = 'false';
        component.elements.inputElement.dispatchEvent(event);

        expect(component.value).toBe('false');
    });

    it('should dispatch custom event on value change', () => {
        getLang.mockReturnValue('en');
        const component = new FilterLineValueSingleBoolean('true');

        const eventListener = vi.fn();
        component.elements.component.addEventListener('filterValueUpdated', eventListener);

        const event = new Event('change');
        component.elements.inputElement.value = 'false';
        component.elements.inputElement.dispatchEvent(event);

        expect(eventListener).toHaveBeenCalledTimes(1);
        expect(eventListener.mock.calls[0][0].detail).toBe('false');
    });
});
