// FilterLineValueSingle.js
import { css } from '../Modules/helperFunctions.js';

export class FilterLineValueSingle {
    constructor(value, fieldType) {
        this.value = value;
        this.valueType = fieldType;
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

        const inputElement = document.createElement('input');
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
          let value = event.target.value;
      
          if (this.valueType === "Number") {
            value = Number(value);
            if (isNaN(value)) {
              console.warn(`The value ${value} is not a number. Reverting to previous value.`);
              this.elements.inputElement.value = this.value;
              return;
            }
          } else if (this.valueType === "String") {
            value = value.toString();
          }
      
          this.value = value;
      
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
        `;
    }
}
