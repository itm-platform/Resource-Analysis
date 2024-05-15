// Component/ComponentGenericTemplate.js
import {ChildComponent} from './ChildComponent.js';
import {css} from '../Modules/helperFunctions.js';

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
