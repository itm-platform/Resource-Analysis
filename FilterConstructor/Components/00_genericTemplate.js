// Component/ComponentGenericTemplate.js
import { ChildComponent } from './ChildComponent.js';
import { css } from '../Modules/helperFunctions.js';

export class ComponentGenericTemplate {
    constructor(initialData, index, serviceModel) {
        this.initialData = initialData;
        this.index = index;
        this.serviceModel = serviceModel;
        this.elements = {};
        this.element = this.#createElement();
        this.#applyStyles();
        this.#setupEventListeners();
    }
    #init() {
        /**Purpose: To perform any setup or initialization tasks that need to happen after the DOM elements are created.

        What to include:

        State Initialization: Initialize any state variables that depend on the DOM being present.
        Data Binding: Bind data to the DOM elements if needed.
        Calling Methods: Call other methods to perform tasks like fetching data or setting up the initial state. */
    }

    #createElement() {
        /**Purpose: To create and assemble the DOM structure of the component.

        What to include:

        Element Creation: Create the main container and any child elements.
        Setting Attributes and Classes: Set IDs, classes, and other attributes on the elements.
        Appending Children: Append child elements to their respective parent elements.
        Initial Content: Set initial content or placeholder text. */
        const component = document.createElement('div');
        component.id = 'component-' + this.index;
        component.className = 'component-class';
        this.elements.component = component;

        const childComponentConfig = {};

        const childComponent = new ChildComponent(childComponentConfig);
        this.elements.childComponent = childComponent.element;
        component.appendChild(this.elements.childComponent);

        return component;
    }

    #applyStyles() {
        const style = document.createElement('style');
        style.textContent = this.#getStyles();
        this.element.appendChild(style);
    }

    #setupEventListeners() {
        this.elements.childComponent.addEventListener('part1Updated', (event) => {
            this.#updatePart1(event.detail);
        });

        this.elements.component.addEventListener('click', () => {
            console.log(`Component ${this.index} clicked`);
        });

    }

    #updatePart1(data) {
        console.log(`${this.index} part1 data: ${data}`);
    }

    #updatePart2(data) {
        console.log(`${this.index} part2 data: ${data}`);
    }

    #getStyles() {
        return css`
            .component-class {
                display: flex;
                // Additional styles
            }
        `;
    }
}
