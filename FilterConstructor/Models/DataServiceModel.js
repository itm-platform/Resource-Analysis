// TODO - B - DataServiceModel.js should not be in filters, but be independent or
// server with the main service /dataservicemodel that profides the JSON.

import { findItemInArrayOfObjects } from "../Modules/helperFunctions.js";
/**
 * @returns {Object} {tables:{}, relationships:{}}
 */
export default class DataServiceModel {
    constructor(dataServiceModelJSON) {
        if (!dataServiceModelJSON) {
            this.tables = {};
            this.relationships = {};
        }
        else {
            for (const [key, value] of Object.entries(dataServiceModelJSON)) {
                this[key] = value;
            }
        }
    }
    foreignTables(primaryTable) {
        if (primaryTable == undefined || this.relationships == undefined || this.relationships[primaryTable] == undefined) {
            return [];
        }
        return Object.keys(this.relationships[primaryTable]);
    }
    /**@returns {Object} {table:primaryKey}*/
    getPrimaryKeys() {
        let primaryKeys = {};
        let primaryKey;
        for (const [tableName, table] of Object.entries(this.tables)) {
            primaryKey = findItemInArrayOfObjects(table.fields, 'name', 'primaryKey', true);
            if (primaryKey)
                primaryKeys[tableName] = primaryKey;
        }
        return primaryKeys;
    }
    /** Gets the first foreign key per table. 
     * If in the future there is more than one, we will have to deal with it.
     * @returns {Object} {table: foreignKey}*/
    getForeignKeys() {
        let foreignKeys = {};
        let foreignKey;
        for (const [tableName, table] of Object.entries(this.tables)) {
            foreignKey = findItemInArrayOfObjects(table.fields, 'name', 'foreignKey', true);
            if (foreignKey)
                foreignKeys[tableName] = foreignKey;
        }
        return foreignKeys;
    }
    getRelationships() {
        if (this.relationships)
            return this.relationships;
        else
            return {};
    }

    tableNames() {
        return Object.keys(this.tables);
    }

    getTable(tableName) {
        ;
        return this.tables[tableName];
    }
    getFields(tableName) {
        // Not clean or consistent. Fields is an array,
        // it should be an object since all fields are unique
        // An array forces to use cumbersome functions to search, etc.
        if (tableName)
            return this.tables[tableName].fields;
        else return [];
    }

    getFieldType(tableName, fieldName) {
        if (tableName && fieldName && this.tables[tableName]) {
            let field = this.tables[tableName].fields.find(field => field.name === fieldName);
            if (field) return field.type;
        }
        return null;
    }
    

    /** Remove all non explicity included tables from the model
     * @param {Array} remainingTables Array of tables to keep. 
     * Each item can be a string or an object. 
     * remainingTables: ['projects', 'tasks']
     * remainingTables: [{ tasks: ['Id', 'Status.Name'] }]   
     */
    keepOnlyTables(tables) {
        if (!Array.isArray(tables)) {
            return;
        }

        const validateTables = (tables) => {
            if (!Array.isArray(tables)) {
                throw new Error('Invalid parameter format');
            }
            tables.forEach(table => {
                if (typeof table === 'object') {
                    for (const [tableName, fields] of Object.entries(table)) {
                        if (!Array.isArray(fields)) {
                            throw new Error(`Fields for table ${tableName} should be an array`);
                        }
                    }
                } else if (typeof table !== 'string') {
                    throw new Error('Each item in the array should be either a string or an object');
                }
            });
        };

        // Validate the tables parameter
        validateTables(tables);

        let newTables = {};

        tables.forEach((table) => {
            if (typeof table === 'string') {
                if (this.tables[table]) {
                    newTables[table] = this.tables[table];
                }
            } else if (typeof table === 'object') {
                for (const [tableName, fields] of Object.entries(table)) {
                    if (this.tables[tableName] && Array.isArray(fields)) {
                        newTables[tableName] = { ...this.tables[tableName], fields: [] };
                        const existingFields = this.tables[tableName].fields;
                        fields.forEach((field) => {
                            const fieldToKeep = existingFields.find(f => f.name === field || f.location === field);
                            if (fieldToKeep) {
                                newTables[tableName].fields.push({ ...fieldToKeep });
                            }
                        });
                    }
                }
            }
        });

        this.tables = newTables;
    }

    tableListLanguage(lang = "en") {
        let tableList = [];
        for (const table in this.tables) {
            let labelText = this.tables[table].labels?.[lang] ?? table;
            tableList.push({
                "text": labelText,
                "value": table
            });
        }
        return tableList;
    }
    

/**
 * Retrieves fields filtering by table and type. 
 * @param {object} options tables, types and lang. All optional.
 * @param {String[]|String} options.tables Tables.
 * @param {String[]|String} options.types Types.
 * @param {String} options.lang Language.
 * @returns {Object [] { "text": field.labels[lang], "value": field.name, "type": field.type, "table": table, ...otherAttributes }}
 */
reshapeAndTranslateFieldsByTableAndType(options = {}) {
    const { tables = 'all', types = 'all', lang = 'en' } = options;

    const toArray = (item) => (Array.isArray(item) ? item : item ? [item] : []);
    const tablesArray = toArray(tables);
    const typesArray = toArray(types);

    const filterFields = (field, table) => {
        if (field.type === undefined || types === 'all' || typesArray.includes(field.type)) {
            const { labels, name, type, ...otherAttributes } = field;
            return {
                "text": labels?.[lang] ?? name,
                "value": name,
                "type": type,
                "table": table,
                ...otherAttributes
            };
        }
        return null;
    };
    

    const fields = [];
    for (const table in this.tables) {
        if (tables === 'all' || tablesArray.includes(table)) {
            this.tables[table].fields.forEach(field => {
                const filteredField = filterFields(field, table);
                if (filteredField) fields.push(filteredField);
            });
        }
    }
    return fields;
}



}
