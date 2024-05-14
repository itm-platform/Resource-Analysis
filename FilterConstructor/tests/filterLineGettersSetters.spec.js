import { describe, expect, test } from 'vitest';
import filterLineGettersSetters from '../filterLineGettersSetters';  // Adjust the import path as necessary

describe("filterHandler", () => {
  test("addGettersSetters should correctly initialize an empty filterLine object", () => {
    const filterLine = {};
    filterLineGettersSetters.addGettersSetters(filterLine);
    expect(filterLine.tableName).toBeUndefined();
    expect(filterLine.fieldName).toBeUndefined();
    expect(filterLine.operator).toBeNull();
    expect(filterLine.value).toBeUndefined();
  });

  test("set tableName should add a new table when none exists", () => {
    const filterLine = {};
    filterLineGettersSetters.addGettersSetters(filterLine);
    filterLine.tableName = "projects";
    expect(filterLine.tableName).toBe("projects");
  });

  test("change tableName should rename the table property", () => {
    const filterLine = { projects: {} };
    filterLineGettersSetters.addGettersSetters(filterLine);
    filterLine.tableName = "tasks";
    expect(filterLine.tableName).toBe("tasks");
    expect(filterLine.projects).toBeUndefined();
    expect(filterLine.tasks).toBeDefined();
  });

  test("set fieldName should add a new field when none exists in the defined table", () => {
    const filterLine = {};
    filterLineGettersSetters.addGettersSetters(filterLine);
    filterLine.tableName = "projects";
    filterLine.fieldName = "Program";
    expect(filterLine.fieldName).toBe("Program");
  });

  test("change fieldName should rename the field property within the table", () => {
    const filterLine = { projects: { Program: {} } };
    filterLineGettersSetters.addGettersSetters(filterLine);
    filterLine.fieldName = "Task";
    expect(filterLine.fieldName).toBe("Task");
    expect(filterLine.projects.Program).toBeUndefined();
    expect(filterLine.projects.Task).toBeDefined();
  });

  test("operator and value properties set and get correctly", () => {
    const filterLine = { projects: { Program: { $eq: 233 } } };
    filterLineGettersSetters.addGettersSetters(filterLine);
    expect(filterLine.operator).toBe("$eq");
    expect(filterLine.value).toBe(233);
    filterLine.operator = "$gt";
    filterLine.value = 300;
    expect(filterLine.projects.Program.$eq).toBeUndefined();
    expect(filterLine.projects.Program.$gt).toBe(300);
  });

  test("value properties handle direct and operator-based assignments correctly", () => {
    const filterLine = {};
    filterLineGettersSetters.addGettersSetters(filterLine);
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

  test("isValidLine returns true for a valid filterLine object", () => {
    const filterLine = { projects: { Program: { $eq: 233 } } };
    filterLineGettersSetters.addGettersSetters(filterLine);
    expect(filterLineGettersSetters.isValidLine(filterLine)).toBeTruthy();
  });

  test("isValidLine returns true for a valid filterLine object with direct equality", () => {
    const filterLine = {};
    filterLineGettersSetters.addGettersSetters(filterLine);
    filterLine.tableName = "projects";
    filterLine.fieldName = "Program";
    filterLine.value = 233; // Directly set the value without an operator
    expect(filterLineGettersSetters.isValidLine(filterLine)).toBeTruthy();
});


test("isValidLine returns false for an invalid filterLine object", () => {
    const filterLine = { projects: { Program: {} } }; // Program has no value or operator
    filterLineGettersSetters.addGettersSetters(filterLine);
    filterLine.tableName = "projects";
    filterLine.fieldName = "Program";
    expect(filterLineGettersSetters.isValidLine(filterLine)).toBeFalsy();
});


  test("isValidLine handles error by returning false", () => {
    const filterLine = null;  // Invalid input that should cause the method to throw
    expect(filterLineGettersSetters.isValidLine(filterLine)).toBeFalsy();
  });
});
