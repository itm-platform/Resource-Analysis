import { describe, expect, test, beforeEach } from 'vitest';
import filterLineModel from '../../Models/filterLineModel';  // Adjust the import path as necessary

describe("Getters and Setters", () => {
    // Existing test cases
    test("addGettersSetters should correctly initialize an empty filterLine object", () => {
        const filterLine = {};
        filterLineModel.addGettersSetters(filterLine);
        expect(filterLine.tableName).toBeUndefined();
        expect(filterLine.fieldName).toBeUndefined();
        expect(filterLine.operator).toBeNull();
        expect(filterLine.value).toBeUndefined();
    });

    test("set tableName should add a new table when none exists", () => {
        const filterLine = {};
        filterLineModel.addGettersSetters(filterLine);
        filterLine.tableName = "projects";
        expect(filterLine.tableName).toBe("projects");
    });

    test("change tableName should rename the table property", () => {
        const filterLine = { projects: {} };
        filterLineModel.addGettersSetters(filterLine);
        filterLine.tableName = "tasks";
        expect(filterLine.tableName).toBe("tasks");
        expect(filterLine.projects).toBeUndefined();
        expect(filterLine.tasks).toBeDefined();
    });

    test("set fieldName should add a new field when none exists in the defined table", () => {
        const filterLine = {};
        filterLineModel.addGettersSetters(filterLine);
        filterLine.tableName = "projects";
        filterLine.fieldName = "Program";
        expect(filterLine.fieldName).toBe("Program");
    });

    test("change fieldName should rename the field property within the table", () => {
        const filterLine = { projects: { Program: {} } };
        filterLineModel.addGettersSetters(filterLine);
        filterLine.fieldName = "Task";
        expect(filterLine.fieldName).toBe("Task");
        expect(filterLine.projects.Program).toBeUndefined();
        expect(filterLine.projects.Task).toBeDefined();
    });

    test("operator and value properties set and get correctly", () => {
        const filterLine = { projects: { Program: { $eq: 233 } } };
        filterLineModel.addGettersSetters(filterLine);
        expect(filterLine.operator).toBe("$eq");
        expect(filterLine.value).toBe(233);
        filterLine.operator = "$gt";
        filterLine.value = 300;
        expect(filterLine.projects.Program.$eq).toBeUndefined();
        expect(filterLine.projects.Program.$gt).toBe(300);
    });

    test("value properties handle direct and operator-based assignments correctly", () => {
        const filterLine = {};
        filterLineModel.addGettersSetters(filterLine);
        filterLine.tableName = "projects";
        filterLine.fieldName = "Program";
        // Direct assignment without an operator
        filterLine.value = 100;
        expect(filterLine.value).toBe(100);

        // Setting an operator and changing the value
        filterLine.operator = "$eq";
        filterLine.value = 233;
        expect(filterLine.value).toBe(233);
        expect(filterLine.projects.Program.$eq).toBe(233);
    });

    // New test cases
    test("setting operator to undefined should remove the existing operator", () => {
        const filterLine = { projects: { Program: { $gt: 300 } } };
        filterLineModel.addGettersSetters(filterLine);
        expect(filterLine.operator).toBe("$gt");
        filterLine.operator = undefined;
        expect(filterLine.operator).toBeNull();
        expect(filterLine.projects.Program).toEqual({});
    });

    test("setting operator to null should remove the existing operator", () => {
        const filterLine = { projects: { Program: { $lt: 200 } } };
        filterLineModel.addGettersSetters(filterLine);
        expect(filterLine.operator).toBe("$lt");
        filterLine.operator = null;
        expect(filterLine.operator).toBeNull();
        expect(filterLine.projects.Program).toEqual({});
    });

    test("operator should not change if set to a non-string value", () => {
        const filterLine = { projects: { Program: { $eq: 100 } } };
        filterLineModel.addGettersSetters(filterLine);
        expect(filterLine.operator).toBe("$eq");
        filterLine.operator = 123; // non-string value
        expect(filterLine.operator).toBe("$eq");
        expect(filterLine.projects.Program.$eq).toBe(100);
    });

    test("operator should change to a valid string and set the new operator correctly", () => {
        const filterLine = { projects: { Program: { $neq: 50 } } };
        filterLineModel.addGettersSetters(filterLine);
        expect(filterLine.operator).toBe("$neq");
        filterLine.operator = "$lte";
        expect(filterLine.operator).toBe("$lte");
        expect(filterLine.projects.Program.$neq).toBeUndefined();
        expect(filterLine.projects.Program.$lte).toBe(50);
    });

    test("when operator changes, the value should remain unchanged", () => {
        const filterLine = { projects: { Program: { $eq: 100 } } };
        filterLineModel.addGettersSetters(filterLine);
        filterLine.operator = "$gt";
        expect(filterLine.operator).toBe("$gt");
        expect(filterLine.projects.Program.$eq).toBeUndefined();
        expect(filterLine.projects.Program.$gt).toBe(100);
    });

    test("when fieldName changes, the operator remain unchanged", () => {
        const filterLine = { projects: { Program: { $eq: 100 } } };
        filterLineModel.addGettersSetters(filterLine);
        filterLine.fieldName = "Task";
        expect(filterLine.fieldName).toBe("Task");
        expect(filterLine.projects.Program).toBeUndefined();
        expect(filterLine.projects.Task).toBeDefined();
        expect(filterLine.operator).toBe("$eq");
        expect(filterLine.projects.Task.$eq).toBe(100);
    });
    test("when tableName changes, the fieldName and operator remain unchanged", () => {
        const filterLine = { projects: { Program: { $eq: 100 } } };
        filterLineModel.addGettersSetters(filterLine);
        filterLine.tableName = "tasks";
        expect(filterLine.tableName).toBe("tasks");
        expect(filterLine.projects).toBeUndefined();
        expect(filterLine.tasks).toBeDefined();
        expect(filterLine.fieldName).toBe("Program");
        expect(filterLine.tasks.Program.$eq).toBe(100);
        expect(filterLine.operator).toBe("$eq");
        expect(filterLine.tasks.Program.$eq).toBe(100);
    });
});


describe("IsValid Line", () => {

    test("isValidLine returns true for a valid filterLine object", () => {
        const filterLine = { projects: { Program: { $eq: 233 } } };
        filterLineModel.addGettersSetters(filterLine);
        expect(filterLineModel.isValidLine(filterLine)).toBeTruthy();
    });

    test("isValidLine returns true for a valid filterLine object with direct equality", () => {
        const filterLine = {};
        filterLineModel.addGettersSetters(filterLine);
        filterLine.tableName = "projects";
        filterLine.fieldName = "Program";
        filterLine.value = 233; // Directly set the value without an operator
        expect(filterLineModel.isValidLine(filterLine)).toBeTruthy();
    });


    test("isValidLine returns false for an invalid filterLine object", () => {
        const filterLine = { projects: { Program: {} } }; // Program has no value or operator
        filterLineModel.addGettersSetters(filterLine);
        filterLine.tableName = "projects";
        filterLine.fieldName = "Program";
        expect(filterLineModel.isValidLine(filterLine)).toBeFalsy();
    });


    test("isValidLine handles error by returning false", () => {
        const filterLine = null;  // Invalid input that should cause the method to throw
        expect(filterLineModel.isValidLine(filterLine)).toBeFalsy();
    });

    test("returns false when the value is null", () => {
        const filterLine = { projects: { Program: { $eq: null } } };
        filterLineModel.addGettersSetters(filterLine);
        expect(filterLineModel.isValidLine(filterLine)).toBeFalsy();
    });

    test("returns false when the value is undefined", () => {
        const filterLine = { projects: { Program: { $eq: undefined } } };
        filterLineModel.addGettersSetters(filterLine);
        expect(filterLineModel.isValidLine(filterLine)).toBeFalsy();
    });

    test("returns false when the value is an empty string", () => {
        const filterLine = { projects: { Program: { $eq: "" } } };
        filterLineModel.addGettersSetters(filterLine);
        expect(filterLineModel.isValidLine(filterLine)).toBeFalsy();
    });
    describe("Date Validation", () => {
    
        test("returns true for a valid date when fieldType is 'Date'", () => {
            const filterLine = {
                projects: {
                    EndDate: {
                        $lte: "2023-11-30"
                    },
                    "Status.IsCompleted": true
                }
            };
            filterLineModel.addGettersSetters(filterLine);
            expect(filterLineModel.isValidLine(filterLine, 'Date')).toBeTruthy();
        });
    
        test("returns false for an invalid date -number- when fieldType is 'Date'", () => {
            const filterLine = {
                projects: {
                    CreatedDate: {
                        $gt: 10
                    },
                    "Status.IsCompleted": true
                }
            };
            filterLineModel.addGettersSetters(filterLine);
            expect(filterLineModel.isValidLine(filterLine, 'Date')).toBeFalsy();
        });

        test("returns false for an invalid date -string- when fieldType is 'Date'", () => {
            const filterLine = {
                projects: {
                    CreatedDate: {
                        $gt: "10"
                    },
                    "Status.IsCompleted": true
                }
            };
            filterLineModel.addGettersSetters(filterLine);
            expect(filterLineModel.isValidLine(filterLine, 'Date')).toBeFalsy();
        });
    
        test("returns true for a non-date value when fieldType is not 'Date'", () => {
            const filterLine = {
                projects: {
                    Status: "Active",
                    "Status.IsCompleted": true
                }
            };
            filterLineModel.addGettersSetters(filterLine);
            expect(filterLineModel.isValidLine(filterLine, 'String')).toBeTruthy();
        });
    
        test("returns false for a non-date value when fieldType is 'Date'", () => {
            const filterLine = {
                projects: {
                    CreatedDate: "Not a date",
                    "Status.IsCompleted": true
                }
            };
            filterLineModel.addGettersSetters(filterLine);
            expect(filterLineModel.isValidLine(filterLine, 'Date')).toBeFalsy();
        });
    });
    

});

describe("Break Filter In Lines", () => {
    test("breakFilterInLines should return an array of filterLine objects", () => {
        const queryFilter = {
            projects: { Program: { $eq: 233 } },
            tasks: { Task: { $gt: 100 } }
        };
        const filterLines = filterLineModel.breakFilterInLines(queryFilter);
        expect(filterLines.length).toBe(2);
        expect(filterLines[0].tableName).toBe("projects");
        expect(filterLines[0].fieldName).toBe("Program");
        expect(filterLines[0].operator).toBe("$eq");
        expect(filterLines[0].value).toBe(233);
        expect(filterLines[1].tableName).toBe("tasks");
        expect(filterLines[1].fieldName).toBe("Task");
        expect(filterLines[1].operator).toBe("$gt");
        expect(filterLines[1].value).toBe(100);
    });

    test("breakFilterInLines should return an empty array when queryFilter is empty", () => {
        const queryFilter = {};
        const filterLines = filterLineModel.breakFilterInLines(queryFilter);
        expect(filterLines.length).toBe(0);
    });

    test("breakFilterInLines should return an empty array when queryFilter is null", () => {
        const queryFilter = null;
        const filterLines = filterLineModel.breakFilterInLines(queryFilter);
        expect(filterLines.length).toBe(0);
    });
});

describe("recomposeFilterFromLines", () => {
    test("recomposeFilterFromLines should return a valid queryFilter object", () => {
        const filterLines = [
            { projects: { Program: { $eq: 233 } } },
            { tasks: { Task: { $gt: 100 } } }
        ];
        const queryFilter = filterLineModel.recomposeFilterFromLines(filterLines);
        expect(queryFilter.projects.Program.$eq).toBe(233);
        expect(queryFilter.tasks.Task.$gt).toBe(100);
    });

    test("recomposeFilterFromLines should return a valid queryFilter object 2", () => {
        const filterLines = [
            { "projects": { "Duration": { "$gt": 10 } } },
            { "projects": { "EndDate": { "$lte": "2023-11-30" } } },
            { "projects": { "Status.IsCompleted": false } },
            { "tasks": { "ProjectId": 21 } }];
        const queryFilter = filterLineModel.recomposeFilterFromLines(filterLines);
        expect(queryFilter.projects.Duration.$gt).toBe(10);
        expect(queryFilter.projects.EndDate.$lte).toBe("2023-11-30");
        expect(queryFilter.projects["Status.IsCompleted"]).toBe(false);
        expect(queryFilter.tasks.ProjectId).toBe(21);
    });

    test("recomposeFilterFromLines should return an empty object when filterLines is empty", () => {
        const filterLines = [];
        const queryFilter = filterLineModel.recomposeFilterFromLines(filterLines);
        expect(Object.keys(queryFilter).length).toBe(0);
    });

    test("recomposeFilterFromLines should return an empty object when filterLines is null", () => {
        const filterLines = null;
        const queryFilter = filterLineModel.recomposeFilterFromLines(filterLines);
        expect(Object.keys(queryFilter).length).toBe(0);
    });
});  
