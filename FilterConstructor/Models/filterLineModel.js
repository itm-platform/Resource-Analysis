/* TODO - 🟡 - Convert this into a class passing the line object as a parameter to the constructor.
And separate breakFilterInLines and recomposeFilterFromLines into a separate class.
*/

export default {
    /**
     * Adds getters and setters to the filterLine object: tableName, fieldName, operator, value. 
     * This way, the programmer doesn't have to worry about the structure of a filterLine, such as `{"projects":{"Program":{"$eq":233}}}`
     * In this example, filterLine.tableName = "projects", filterLine.fieldName = "Program", filterLine.operator = "$eq", filterLine.value = 233
     * @returns 
     */
    addGettersSetters(filterLine) {
        Object.defineProperty(filterLine, "tableName", {
            get: function () {
                if (Object.keys(this).length > 0)
                    return Object.keys(this)[0];
            },
            set: function (tableName) {
                if (this.tableName && typeof tableName == 'string') {
                    let oldTableName = this.tableName;
                    Object.defineProperty(
                        this,
                        tableName,
                        Object.getOwnPropertyDescriptor(this, oldTableName)
                    );
                    delete this[oldTableName];
                } else this[tableName] = {};
            },
        });
        Object.defineProperty(filterLine, "fieldName", {
            get: function () {
                let tableName = this.tableName;
                if (!tableName) return undefined
                else return Object.keys(this[tableName])[0];
            },
            set: function (fieldName) {
                if (this.tableName && typeof fieldName == 'string') {
                    if (this.fieldName) {
                        let oldFieldName = this.fieldName;
                        Object.defineProperty(
                            this[this.tableName],
                            fieldName,
                            Object.getOwnPropertyDescriptor(this[this.tableName], oldFieldName)
                        );
                        delete this[this.tableName][oldFieldName];
                    } else this[this.tableName][fieldName] = {};
                }
            },
        });

        Object.defineProperty(filterLine, "operator", {
            get: function () {
                let tableName = this.tableName;
                let fieldName = this.fieldName;
                if (!tableName || !fieldName) return null;
                if (typeof this[tableName][fieldName] === "object" && Object.keys(this[tableName][fieldName]).length > 0) {
                    return Object.keys(this[tableName][fieldName])[0];
                } else {
                    return null;
                }
            },
            set: function (operator) {
                let tableName = this.tableName;
                let fieldName = this.fieldName;
                if (tableName && fieldName) {
                    if (typeof operator === 'string') {
                        if (this.operator) {
                            let oldOperator = this.operator;
                            this[tableName][fieldName][operator] = this[tableName][fieldName][oldOperator];
                            delete this[tableName][fieldName][oldOperator];
                        } else {
                            this[tableName][fieldName] = { [operator]: this.value };
                        }
                    } else if (operator == null) {
                        // Handle undefined or null operator
                        let oldOperator = this.operator;
                        if (oldOperator) {
                            delete this[tableName][fieldName][oldOperator];
                        }
                    }
                }
            },
        });
        
        
        
        Object.defineProperty(filterLine, "value", {
            get: function () {
                let tableName = this.tableName;
                let fieldName = this.fieldName;
                if (!tableName || !fieldName) return undefined;
                let operator = this.operator;
                if (operator) {
                    return this[tableName][fieldName][operator];
                } else {
                    return this[tableName][fieldName];
                }
            },
            set: function (value) {
                let tableName = this.tableName;
                let fieldName = this.fieldName;
                let operator = this.operator;
                if (tableName && fieldName) {
                    if (operator) {
                        if (this[tableName][fieldName][operator] !== undefined) {
                            this[tableName][fieldName][operator] = value;
                        } else {
                            // Create new object if operator is set but doesn't exist yet
                            this[tableName][fieldName] = {[operator]: value};
                        }
                    } else {
                        // If no operator is set, directly set the value
                        this[tableName][fieldName] = value;
                    }
                }
            },
        });
        
        return filterLine
    },
    isValidLine(line, fieldType) {
        try {
            // Apply getters and setters if they aren't already applied
            if (!line.tableName && !line.fieldName && line.value === undefined) {
                line = this.addGettersSetters(line);
            }
    
            // Check for the presence and non-emptiness of table, field, and value
            const tableFieldValue = (
                line.tableName &&
                line.fieldName &&
                line.value !== undefined && line.value !== null
            );
    
            // If there is an operator, the corresponding field must contain an object or a direct value
            const operatorFieldIsValid = (
                line.operator === undefined ||
                (line.operator && typeof line[line.tableName][line.fieldName] === 'object') ||
                line.value === line[line.tableName][line.fieldName] // Checks for direct value assignment
            );
    
            // value should not be empty
            const valueIsValid = line.value !== undefined && line.value !== null && line.value !== '';
    
            // Check if fieldType is 'Date' and validate the date
            const isDateValid = (
                fieldType !== 'Date' ||
                (fieldType === 'Date' && typeof line.value === 'string' && !isNaN(Date.parse(line.value)) && isNaN(Number(line.value)))
            );
    
            return tableFieldValue && operatorFieldIsValid && valueIsValid && isDateValid;
        } catch (error) {
            return false;
        }
    }
    ,
    breakFilterInLines(queryFilter) {
        if (!queryFilter) return [];
        let lines = [];
        let tables = Object.keys(queryFilter);
    
        tables.forEach((table) => {
            Object.keys(queryFilter[table]).forEach((field) => {
                let line = this.addGettersSetters({});
                line.tableName = table; 
                line.fieldName = field; 
                line.value = queryFilter[table][field];
                lines.push(line);
            });
        });
    
        return lines;
    },
    
    recomposeFilterFromLines(filterLines) {
        if (!filterLines) return {};
        let queryFilter = {};
    
        filterLines.forEach((line) => {
            Object.keys(line).forEach(table => {  // Get table name from object key
                if (!queryFilter[table]) {
                    queryFilter[table] = {};
                }
                Object.keys(line[table]).forEach(field => {  // Get field name from object key
                    const operator = Object.keys(line[table][field])[0];  // Get operator from nested field object
                    queryFilter[table][field] = line[table][field];  // Set value for operator directly
                });
            });
        });
    
        return queryFilter;
    }
    
    
    
       
    
}
