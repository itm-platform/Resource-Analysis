import { describe, test, expect } from 'vitest';
import DataServiceModel from "../../Models/DataServiceModel";
import dataServiceModelJSON from "../mock-data/dataServiceModel.json";

describe('foreignTables', () => {
    test('foreignTables basic valid primary', () => {
        let dataServiceModel = new DataServiceModel(dataServiceModelJSON);
        expect(dataServiceModel.foreignTables('projects'))
            .toEqual(['tasks', 'risks']);

    });
    test('foreignTables undefined primary', () => {
        let dataServiceModel = new DataServiceModel(dataServiceModelJSON);
        expect(dataServiceModel.foreignTables())
            .toEqual([]);
    });
    test('foreignTables no foreign to primary', () => {
        let dataServiceModel = new DataServiceModel(dataServiceModelJSON);
        expect(dataServiceModel.foreignTables('risks'))
            .toEqual([]);
    });
});

test('getPrimaryKeys', () => {
    let dataServiceModel = new DataServiceModel(dataServiceModelJSON);
    expect(dataServiceModel.getPrimaryKeys())
        .toEqual({ projects: "Id", tasks: "Id", risks: "Id" });

});
test('getForeignKeys', () => {
    let dataServiceModel = new DataServiceModel(dataServiceModelJSON);
    expect(dataServiceModel.getForeignKeys())
        .toEqual({ tasks: "ProjectId", risks: "ProjectId" });

});

test('DataServiceModel fieldNamesByType filtered', () => {
    let dataServiceModel = new DataServiceModel(dataServiceModelJSON);
    let options = { tables: 'projects', types: ['Date'], lang: 'es' };
    expect(dataServiceModel.fieldNamesByType(options))
        .toEqual([{
            table: "projects", text: "Fecha Reporte Progreso",
            type: "Date", value: "ProgressDate"
        }]);
});

test('DataServiceModel init ', () => {
    let dataServiceModel = new DataServiceModel(dataServiceModelJSON);
    expect(dataServiceModel)
        .toEqual(dataServiceModelJSON);
});

test('DataServiceModel tableNames ', () => {
    let dataServiceModel = new DataServiceModel(dataServiceModelJSON);
    expect(dataServiceModel.tableNames())
        .toEqual(['projects', 'tasks', 'risks']);
});

test('DataServiceModel tableListLanguage ', () => {
    let dataServiceModel = new DataServiceModel(dataServiceModelJSON);
    expect(dataServiceModel.tableListLanguage('es'))
        .toEqual([
            { value: 'projects', text: 'Proyectos' },
            { value: 'tasks', text: 'Tareas' },
            {
                text: "Riesgos", value: "risks",
            }]);
});

describe('keepOnlyTables', () => {
    test('leave only the specified tables, removing all others from the model', () => {
        let dataServiceModel = new DataServiceModel(dataServiceModelJSON);
        let remainingTables = ['projects', 'tasks'];
        dataServiceModel.keepOnlyTables(remainingTables);
        expect(dataServiceModel.tableNames())
            .toEqual(['projects', 'tasks']);
    });

    test('should not change the model if no tables are specified', () => {
        let dataServiceModel = new DataServiceModel(dataServiceModelJSON);
        dataServiceModel.keepOnlyTables();
        expect(dataServiceModel.tableNames())
            .toEqual(['projects', 'tasks', 'risks']);
    });

    test ('should not break if a non-exisiting table is specified',() => {
        let dataServiceModel = new DataServiceModel(dataServiceModelJSON);
        let remainingTables = ['projects', 'tasks', 'non-existing'];
        dataServiceModel.keepOnlyTables(remainingTables);
        expect(dataServiceModel.tableNames())
            .toEqual(['projects', 'tasks']);
    });

});
