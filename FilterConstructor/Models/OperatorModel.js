let operatorModel = {
    equality: {
        labels: { "en": "Equals", "es": "Es igual", "pt": "Equals" },
        fieldTypes: ["String", "Number", "Date", "Boolean"], acceptsMultipleValues: false, description: {
            es: "Devuelve cualquier elemento que coincida con el valor especificado.",
            pt: "Returns any items that match the specified value.",
            en: "Returns any items that match the specified value."
        }
    },
    $ne: {
        labels: { "en": "Doesn't equal", "es": "Distinto", "pt": "Equals" }, fieldTypes: ["String", "Number", "Date", "Boolean"], acceptsMultipleValues: false, description: {
            es: "Devuelve cualquier elemento que no coincida con el valor especificado.",
            pt: "Returns any items that match the specified value.",
            en: "Returns any items that do not match the specified value."
        }
    },
    $in: {
        labels: { "en": "Includes", "es": "Incluye", "pt": "Equals" },
        fieldTypes: ["String", "Number", "Date"], acceptsMultipleValues: true,
        description: {
            es: "Devuelve cualquier elemento que coincida con cualquiera de los valores especificados en el conjunto. Utilice solo un tipo de datos en los valores especificados.",
            pt: "Returns any items that match the specified value. It is also referred to as the equality comparator operator.",
            en: "Returns any items that match any of the specified values in the set. Use only one data type in the specified values."
        }
    },
    $nin: { 
        labels: { "en": "Doesn't include", "es": "No incluye", "pt": "Equals" }, 
        fieldTypes: ["String", "Number", "Date",], 
        acceptsMultipleValues: true, 
        description: { es: "Returns any items that match the specified value. It is also referred to as the equality comparator operator.", pt: "Returns any items that match the specified value. It is also referred to as the equality comparator operator.", en: "Returns any items that do not match any of the specified values in the set. It is also referred to as the not in comparison operator." } },
    $lt: { labels: { "en": "Less than", "es": "Menor que", "pt": "Equals" }, fieldTypes: ["Number", "Date",], acceptsMultipleValues: false, description: { es: "Returns any items that match the specified value. It is also referred to as the equality comparator operator.", pt: "Returns any items that match the specified value. It is also referred to as the equality comparator operator.", en: "Returns any items that have a value that is less than the specified value in the set. It is also referred to as the less than comparison operator." } },
    $lte: { labels: { "en": "Less or equal", "es": "Menor o igual", "pt": "Equals" }, fieldTypes: ["Number", "Date"], acceptsMultipleValues: false, description: { es: "Returns any items that match the specified value. It is also referred to as the equality comparator operator.", pt: "Returns any items that match the specified value. It is also referred to as the equality comparator operator.", en: "Returns any items that have a value that is less than or equal to the specified value in the set. It is also referred to as the less than or equals comparison operator." } },
    $gt: { labels: { "en": "Greater than", "es": "Mayor que", "pt": "Equals" }, fieldTypes: ["Number", "Date"], acceptsMultipleValues: false, description: { es: "Returns any items that match the specified value. It is also referred to as the equality comparator operator.", pt: "Returns any items that match the specified value. It is also referred to as the equality comparator operator.", en: "Returns any items that have a value that is greater than the specified value in the set. It is also referred to as the greater than comparison operator." } },
    $gte: { labels: { "en": "Greater or equal", "es": "Mayor o igual", "pt": "Equals" }, fieldTypes: ["Number", "Date"], acceptsMultipleValues: false, description: { es: "Returns any items that match the specified value. It is also referred to as the equality comparator operator.", pt: "Returns any items that match the specified value. It is also referred to as the equality comparator operator.", en: "Returns any items that have a value that is greater than or equal to the specified value in the set. It is also referred to as the greater than or equals comparison operator." } },
    $regex: { labels: { "en": "Regular expression", "es": "Expresión regular", "pt": "Equals" }, fieldTypes: ["String"], acceptsMultipleValues: false, description: { es: "Returns any items that match the specified value. It is also referred to as the equality comparator operator.", pt: "Returns any items that match the specified value. It is also referred to as the equality comparator operator.", en: "Returns any items that have an expression that matches a pattern of strings in the set. It is also referred to as the regular expression predicate." } },
}
export default class OperatorModel {
    constructor() {
        for (const [key, value] of Object.entries(operatorModel)) {
            this[key] = value
        }
    }
    acceptsMultipleValues(operator) {
        // TODO 🟢 Removed multiple value operators
        return false;
        // return this[operator].acceptsMultipleValues
    }
    operatorsAcceptingMultipleValues(){
        let operatorsAcceptingMultipleValues = []
        Object.keys(this).forEach(operator => {
            if (this[operator].acceptsMultipleValues)
                operatorsAcceptingMultipleValues.push(operator)
        })
        return operatorsAcceptingMultipleValues;        
    }  
    description(operator, lang) {
        return this[operator].description[lang]
    }
    operatorsValidForFieldTypeWithDescriptions(fieldType, lang = "en") {
        let operatorsValidForFieldType = []
        Object.keys(this).forEach(operator => {
            if (this[operator].fieldTypes.includes(fieldType))
                operatorsValidForFieldType.push({
                    value: operator,
                    text:this[operator].labels[lang],
                    acceptsMultipleValues: this[operator].acceptsMultipleValues,
                    description: this[operator].description[lang]
                })
        })
        return operatorsValidForFieldType;
    }
}
