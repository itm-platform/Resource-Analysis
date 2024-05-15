import { ChildComponent } from './ChildComponent.js';
import { css } from '../Modules/helperFunctions.js';

export class ComponentGenericTemplate {
    constructor(param) {
        this.param = param;
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

        // Add any additional event listeners here
    }

    /**    Purpose: To render the initial state of the component or re-render it if needed.
        What to include:
        - Rendering child components
        - Updating DOM elements with data */
    render() {
    
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
