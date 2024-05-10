import { describe, test, expect, beforeEach, vi } from 'vitest';
import { RequestConstructor } from '../requestConstructor'; // Adjust the path as necessary

describe('RequestConstructor basics', () => {
    let requestConstructor;
    let parentDivId;
    let requestObject ={};
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
        requestObject.analysisMode = 'intervals';
        requestObject.filter = {
            project: { "Program.Id": { $in: [12, 23] } },
            service: { "Program.Id": { $in: [12, 23] } }
        };
        requestObject.intervals = {
            startDate: '2021-01-01',
            intervalType: 'quarter',
            noOfIntervals: 4
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

        requestConstructor = new RequestConstructor(
            { analysisMode: requestObject.analysisMode, filter: requestObject.filter, intervals: requestObject.intervals },
            dataServiceModel, parentDivId);
    });

    test('should dispatch "requestUpdated" event with filter details when the button is clicked', () => {
        const spy = vi.fn();
        document.addEventListener('requestUpdated', spy);

        const button = parentDiv.querySelector('button');
        button.click();

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
            detail: {
                analysisMode: requestObject.analysisMode,
                filter: requestObject.filter
            }
        }));
    });
});
