import { describe, test, expect, beforeEach, vi } from 'vitest';
import { FilterConstructor } from '../filterConstructor'; // Adjust the path as necessary

describe('FilterConstructor basics', () => {
    let filterConstructor;
    let parentDivId;
    let analysisMode;
    let queryFilter;
    let dataServiceModel;
    let parentDiv;

    beforeEach(() => {
        // Reset the document body and setup the initial environment
        document.body.innerHTML = '';
        parentDivId = 'filterDiv';
        parentDiv = document.createElement('div');
        parentDiv.id = parentDivId;
        document.body.appendChild(parentDiv);

        // Setting up initial states
        analysisMode = 'intervals';
        queryFilter = {
            project: { "Program.Id": { $in: [12, 23] } },
            service: { "Program.Id": { $in: [12, 23] } }
        };
        dataServiceModel = {
            tables: {
                tableName: {
                    labels: {},
                    fields: [{
                        name: "Id",
                        labels: { en: "Id", es: "Id", pt: "Id" },
                        type: "Number | String | Date",
                        primaryKey: true
                    }]
                }
            },
            relationships: {
                tableName1: {
                    tableName2: { foreignKey: "ProjectId" },
                    risks: { foreignKey: "ProjectId" }
                }
            }
        };

        filterConstructor = new FilterConstructor(analysisMode, queryFilter, dataServiceModel, parentDivId);
    });

    test('should dispatch "filterUpdated" event with filter details when the button is clicked', () => {
        const spy = vi.fn();
        document.addEventListener('filterUpdated', spy);

        const button = parentDiv.querySelector('button');
        button.click();

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
            detail: {
                analysisMode: analysisMode,
                filter: queryFilter
            }
        }));
    });
});
