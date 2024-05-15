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
        if (field.type === undefined || typesArray === 'all' || typesArray.includes(field.type)) {
            const { labels, name, type, ...otherAttributes } = field;
            return {
                "text": labels[lang],
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
        if (tablesArray === 'all' || tablesArray.includes(table)) {
            this.tables[table].fields.forEach(field => {
                const filteredField = filterFields(field, table);
                if (filteredField) fields.push(filteredField);
            });
        }
    }
    return fields;
}


}
