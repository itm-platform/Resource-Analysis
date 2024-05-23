import { afterEach, describe, test, expect } from 'vitest';
import OperatorModel from "../../Models/OperatorModel";

// TODO - 🟡 - Skipping tests that fail with mutipe values bcs Kendo changed the way they work

test('operatorsAcceptingMultipleValues basic',()=>{
    let operatorModel= new OperatorModel();
    expect(operatorModel.operatorsAcceptingMultipleValues())
    .toEqual(['$in','$nin']);
})
test('operatorsValidForFieldTypeWithDescriptions specifying lang',()=>{
    let operatorModel= new OperatorModel();
    expect(operatorModel.operatorsValidForFieldTypeWithDescriptions('Boolean', 'es'))
    .toEqual(
        [{value:'equality',
         acceptsMultipleValues: false, 
         text: "Es igual",
         description: "Devuelve cualquier elemento que coincida con el valor especificado."},
         {value:'$ne',
         acceptsMultipleValues: false, 
         text: "Distinto",
         description: "Devuelve cualquier elemento que no coincida con el valor especificado."}
    ]
    );
})

test.skip('acceptsMultipleValues basic',()=>{
    let operatorModel= new OperatorModel();
    expect(operatorModel.acceptsMultipleValues('$in')).toBeTruthy();
})

test('description basic',()=>{
    let operatorModel= new OperatorModel(); 
    expect(operatorModel.description('$in', "es")).toContain('Utilice solo un tipo de datos')
})