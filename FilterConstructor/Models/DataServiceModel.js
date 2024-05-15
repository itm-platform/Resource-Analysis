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

    /** Removes all non explicity included tables from the model */
    keepOnlyTables(tables) {
        if (!Array.isArray(tables)) {return;};
        let newTables = {};
        for (const table in this.tables) {
            if (tables.includes(table)) {
                newTables[table] = this.tables[table];
            }
        }
        this.tables = newTables;
    }

    tableListLanguage(lang = "en") {
        let tableList = [];
        for (const table in this.tables) {
            tableList.push({
                "text": this.tables[table].labels[lang],
                "value": table
            });
        }
        return tableList;
    }
    /**  Retrieves fields filtering by table and type. 
 * @param {object} options tables, types and lang. All optional.
 * @param {String[]|String} options.tables Tables.
 * @param {String[]|String} options.types Types.
 * @param {String} options.lang Language.
 * @returns {Object [] { "text": field.labels[lang], "value": field.name, "type": field.type, "table": table }}
 */
    fieldNamesByType(options = {}) {
        let tables = 'all'; let types = 'all'; let lang = 'en';
        if (Array.isArray(options.tables)) tables = options.tables;
        else if (typeof options.tables == 'string') tables = [options.tables];
        if (Array.isArray(options.types)) types = options.types;
        else if (typeof options.types == 'string') types = [options.types];
        if (options.lang) lang = options.lang;
        let fields = [];
        let field;
        for (const table in this.tables) {
            if (tables == 'all' || tables.includes(table)) {
                for (var f = 0; f < this.tables[table].fields.length; f++) {
                    field = this.tables[table].fields[f];
                    if (field.type == undefined || types == 'all' || types.includes(field.type)) {
                        fields.push({
                            "text": field.labels[lang],
                            "value": field.name,
                            "type": field.type,
                            "table": table
                        });
                    }
                }
            }
        }
        return fields;

    }
}
