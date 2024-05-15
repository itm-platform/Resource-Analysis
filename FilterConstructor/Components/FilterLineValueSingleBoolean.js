// FilterLineValueSingleBoolean.js
import { css } from '../Modules/helperFunctions.js';
import { getLang } from './globalState.js';
const boolLang = {
    "true": {
        "en": "True", "es": "Verdadero", "pt": "True"
    },
    "false": {
        "en": "False", "es": "Falso", "pt": "False"
    }
};
export class FilterLineValueSingleBoolean {
    constructor(value) {
        this.value = value;
        this.elements = {};

        this.#init();
        this.element = this.#createElement();
        this.#applyStyles();
        this.#setupEventListeners();
        this.render();
    }

    /** Perform any initialization logic that doesn't depend on DOM elements. */
    #init() {

    }

    /**Create and setup DOM elements*/
    #createElement() {

        const component = document.createElement('div');
        component.className = 'filter-line-value';
        this.elements.component = component;

        const inputElement = document.createElement('select');
        inputElement.innerHTML = `
            <option value="true">${boolLang.true[getLang()]}</option>
            <option value="false">${boolLang.false[getLang()]}</option>
        `;
        inputElement.value = this.value;
        this.elements.inputElement = inputElement;

        component.appendChild(inputElement);

        return component;
    }

    #applyStyles() {
        const style = document.createElement('style');
        style.textContent = this.#getStyles();
        this.element.appendChild(style);
    }

    #setupEventListeners() {
        this.elements.inputElement.addEventListener('change', (event) => {
            this.value = event.target.value;
            this.elements.component.dispatchEvent(new CustomEvent('filterValueUpdated', {
                detail: this.value,
                bubbles: true
            }));
        });
    }

    render() {

    }



    #getStyles() {
        return css`
            .filter-line-value {
                display: flex;
                // Additional styles
            }
        `;
    }
}
