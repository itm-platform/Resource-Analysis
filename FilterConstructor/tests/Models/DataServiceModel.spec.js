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

describe('reshapeAndTranslateFieldsByTableAndType using mock file', () => {
    
    test('DataServiceModel reshapeAndTranslateFieldsByTableAndType filtered one type, one project', () => {
        let dataServiceModel = new DataServiceModel(dataServiceModelJSON);
        let options = { tables: 'projects', types: ['Date'], lang: 'es' };
        expect(dataServiceModel.reshapeAndTranslateFieldsByTableAndType(options))
            .toEqual([{
                table: "projects", text: "Fecha Reporte Progreso",
                type: "Date", value: "ProgressDate"
            }]);
    });

    test('DataServiceModel reshapeAndTranslateFieldsByTableAndType filtered one project in array, all types', () => {
        let dataServiceModel = new DataServiceModel(dataServiceModelJSON);
        let options = { "tables": ["projects"], "types": ['Date'], "lang": "es" };
        expect(dataServiceModel.reshapeAndTranslateFieldsByTableAndType(options))
            .toEqual([{
                table: "projects", text: "Fecha Reporte Progreso",
                type: "Date", value: "ProgressDate"
            }]);
    });
});


describe('DataServiceModel reshapeAndTranslateFieldsByTableAndType', () => {
    const dataServiceModelJSON = {
        tables: {
            projects: {
                fields: [
                    { name: "ProgressDate", type: "Date", labels: { en: "Progress Report Date", es: "Fecha Reporte Progreso" } },
                    { name: "ProjectName", type: "String", labels: { en: "Project Name", es: "Nombre del Proyecto" } }
                ]
            },
            tasks: {
                fields: [
                    { name: "TaskDate", type: "Date", labels: { en: "Task Date", es: "Fecha de Tarea" } },
                    { name: "TaskName", type: "String", labels: { en: "Task Name", es: "Nombre de Tarea" } }
                ]
            }
        }
    };
    const dataServiceModel = new DataServiceModel(dataServiceModelJSON);

    test('filters one type, one project', () => {
        const options = { tables: 'projects', types: ['Date'], lang: 'es' };
        expect(dataServiceModel.reshapeAndTranslateFieldsByTableAndType(options))
            .toEqual([{
                table: "projects", text: "Fecha Reporte Progreso",
                type: "Date", value: "ProgressDate"
            }]);
    });

    test('filters one project in array, all types', () => {
        const options = { tables: ["projects"], types: "all", lang: "es" };
        expect(dataServiceModel.reshapeAndTranslateFieldsByTableAndType(options))
            .toEqual([
                {
                    table: "projects", text: "Fecha Reporte Progreso",
                    type: "Date", value: "ProgressDate"
                },
                {
                    table: "projects", text: "Nombre del Proyecto",
                    type: "String", value: "ProjectName"
                }
            ]);
    });

    test('filters all tables, one type', () => {
        const options = { tables: "all", types: ["String"], lang: "en" };
        expect(dataServiceModel.reshapeAndTranslateFieldsByTableAndType(options))
            .toEqual([
                {
                    table: "projects", text: "Project Name",
                    type: "String", value: "ProjectName"
                },
                {
                    table: "tasks", text: "Task Name",
                    type: "String", value: "TaskName"
                }
            ]);
    });

    test('filters all tables, all types, Spanish language', () => {
        const options = { tables: "all", types: "all", lang: "es" };
        expect(dataServiceModel.reshapeAndTranslateFieldsByTableAndType(options))
            .toEqual([
                {
                    table: "projects", text: "Fecha Reporte Progreso",
                    type: "Date", value: "ProgressDate"
                },
                {
                    table: "projects", text: "Nombre del Proyecto",
                    type: "String", value: "ProjectName"
                },
                {
                    table: "tasks", text: "Fecha de Tarea",
                    type: "Date", value: "TaskDate"
                },
                {
                    table: "tasks", text: "Nombre de Tarea",
                    type: "String", value: "TaskName"
                }
            ]);
    });

    test('filters one table, one type, English language', () => {
        const options = { tables: ["tasks"], types: ["Date"], lang: "en" };
        expect(dataServiceModel.reshapeAndTranslateFieldsByTableAndType(options))
            .toEqual([{
                table: "tasks", text: "Task Date",
                type: "Date", value: "TaskDate"
            }]);
    });
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
    const dataServiceModelJSON = {
        "tables": {
            "projects": {
                "labels": {
                    "en": "Projects",
                    "es": "Proyectos",
                    "pt": "Projetos"
                }
            },
            "tasks": {
                "labels": {
                    "en": "Tasks",
                    "es": "Tareas",
                    "pt": "Tarefas"
                }
            }
        }
    };
    let dataServiceModel = new DataServiceModel(dataServiceModelJSON);
    expect(dataServiceModel.tableListLanguage('es'))
        .toEqual([
            { value: 'projects', text: 'Proyectos' },
            { value: 'tasks', text: 'Tareas' },
        ]);

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
        let tables;
        dataServiceModel.keepOnlyTables(tables);
        expect(dataServiceModel.tableNames())
            .toEqual(['projects', 'tasks', 'risks']);
    });

    test('should not break if a non-exisiting table is specified', () => {
        let dataServiceModel = new DataServiceModel(dataServiceModelJSON);
        let remainingTables = ['projects', 'tasks', 'non-existing'];
        dataServiceModel.keepOnlyTables(remainingTables);
        expect(dataServiceModel.tableNames())
            .toEqual(['projects', 'tasks']);
    });

});

describe('DataServiceModel getFieldType', () => {
    const dataServiceModelJSON = {
        tables: {
            projects: {
                fields: [
                    { name: "ProgressDate", type: "Date" },
                    { name: "ProjectName", type: "String" }
                ]
            },
            tasks: {
                fields: [
                    { name: "TaskDate", type: "Date" },
                    { name: "TaskName", type: "String" }
                ]
            }
        }
    };
    const dataServiceModel = new DataServiceModel(dataServiceModelJSON);

    test('returns correct field type for projects table', () => {
        expect(dataServiceModel.getFieldType('projects', 'ProgressDate')).toBe('Date');
        expect(dataServiceModel.getFieldType('projects', 'ProjectName')).toBe('String');
    });

    test('returns correct field type for tasks table', () => {
        expect(dataServiceModel.getFieldType('tasks', 'TaskDate')).toBe('Date');
        expect(dataServiceModel.getFieldType('tasks', 'TaskName')).toBe('String');
    });

    test('returns null for non-existent field', () => {
        expect(dataServiceModel.getFieldType('projects', 'NonExistentField')).toBe(null);
        expect(dataServiceModel.getFieldType('tasks', 'NonExistentField')).toBe(null);
    });

    test('returns null for non-existent table', () => {
        expect(dataServiceModel.getFieldType('nonExistentTable', 'ProjectName')).toBe(null);
    });

    test('returns null for missing tableName or fieldName', () => {
        expect(dataServiceModel.getFieldType(null, 'ProjectName')).toBe(null);
        expect(dataServiceModel.getFieldType('projects', null)).toBe(null);
        expect(dataServiceModel.getFieldType(null, null)).toBe(null);
    });
});

