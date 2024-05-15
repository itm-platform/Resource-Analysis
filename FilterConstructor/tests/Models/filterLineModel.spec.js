import { describe, expect, test } from 'vitest';
import filterLineModel from '../../Models/filterLineModel';  // Adjust the import path as necessary

describe("Getters and Setters", () => {
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

});

describe ("Break Filter In Lines", () => {
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
        { tasks: { Task: { $gt: 100 } }}
        ];
        const queryFilter = filterLineModel.recomposeFilterFromLines(filterLines);
        expect(queryFilter.projects.Program.$eq).toBe(233);
        expect(queryFilter.tasks.Task.$gt).toBe(100);
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
