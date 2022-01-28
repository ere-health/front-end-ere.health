// MedicationItemType
export const MedicationItemType = {

  buildEmptyFHIR: (profile, uuid) => {
    switch (profile){
      case MedicationItemTypeFreeText.profile:
          return MedicationItemTypeFreeText.buildEmptyFHIR(uuid);
      case MedicationItemTypePZN.profile:
          return MedicationItemTypePZN.buildEmptyFHIR(uuid);
      case MedicationItemTypeIngredient.profile:
          return MedicationItemTypeIngredient.buildEmptyFHIR(uuid);
      case MedicationItemTypeCompounding.profile:
          return MedicationItemTypeCompounding.buildEmptyFHIR(uuid);
      default:
    }
  },

  setObjectAttribute: (object,path,value) => {
    let parts = path.split(/\./);
    for (let i=0; i<parts.length; i++){
        let actualElement = parts[i];
        if (Number.isInteger(actualElement)) actualElement = Number.parseInt(actualElement);
        if (i<parts.length-1)
            object = object[actualElement];
        else
            object[actualElement] = value;
    }
  },

  loadPznRecords: (filePath, delimiter)=>{
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
      const str = xmlhttp.responseText;
      // const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
      const rows = str.slice(str.indexOf("\n") + 1).split("\n");
      result = rows.reduce((rowMap,row,_) => {
          const values = row.split(delimiter);
          const pznText = values[1];
          rowMap[pznText] = [values[0], ...values.slice(2)];
          return rowMap;
      }, {});  
    }
    return result;
  },
}

// PZN
export const MedicationItemTypePZN = {
  profile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_PZN|1.0.2',

  buildFHIR : function ({uuid, normgroesseCode, pznCode, pznText, dformCode}) {
    return {
      fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
      resource: {
        resourceType: 'Medication',
        id: uuid,
        meta: {profile: [this.profile]},
        extension: [
          { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Category',
            valueCoding: {
              system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Category',
              code: '00'
            }
          },
          { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Vaccine',
            valueBoolean: false
          },
          { url: 'http://fhir.de/StructureDefinition/normgroesse',
            valueCode: normgroesseCode
          }
        ],
        code: {
          coding: [{ system: 'http://fhir.de/CodeSystem/ifa/pzn', 
                     code: pznCode }],
          text: pznText
        },
        form: {
          coding: [{ system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_DARREICHUNGSFORM',
          code: dformCode }]
        }
      }
    }
  },

  buildEmptyFHIR: (uuid) => {
    return MedicationItemTypePZN.buildFHIR({
      uuid:            uuid, 
      normgroesseCode: '',
      pznCode:         '',
      pznText:         '',
      dformCode:       '',
    })
  }    
}

// FREETEXT
export const MedicationItemTypeFreeText = {
  profile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_FreeText|1.0.2',

  buildFHIR : function ({uuid, medicationText}) {
    return {
      fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
      resource: {
        resourceType: 'Medication',
        id: uuid,
        meta: {profile: [this.profile]},
        extension: [
          { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Category',
            valueCoding: {
              system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Category',
              code: '00'
            }
          },
          { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Vaccine',
            valueBoolean: false
          }
        ],
        code: {
          coding: [{ system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Type', 
                     code: 'freitext' }],
          text: medicationText
        }
      }
    }
  },

  buildEmptyFHIR: (uuid) => {
    return MedicationItemTypeFreeText.buildFHIR({
      uuid:            uuid, 
      medicationText: '',
    })
  }  
}

// INGREDIENT
export const MedicationItemTypeIngredient = {
  profile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_Ingredient|1.0.2',

  buildFHIR : function ({uuid, normgroesseCode, formText, ingredients}){
    return {
      fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
      resource: {
        resourceType: 'Medication',
        id: uuid,
        meta: { profile: [this.profile] },
        extension: [
          { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Category',
            valueCoding: {
              system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Category',
              code: '00'
            }
          },
          { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Vaccine',
            valueBoolean: false
          },
          { url: 'http://fhir.de/StructureDefinition/normgroesse',
            valueCode: normgroesseCode
          }
        ],
        code: {
          coding: [{ system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Type', 
                     code: 'wirkstoff' }]
        },
        form: { text: formText },
        ingredient: Ingredients.buildFHIR(ingredients)
      }
    }
  },

  buildEmptyFHIR: (uuid) => {
    return MedicationItemTypeIngredient.buildFHIR({
      uuid:            uuid, 
      normgroesseCode: '',
      formText:        '',
      ingredients: [{itemCode:'', itemText:'', ingredientForm:'', strengthText:'', numeratorValue:1, numeratorUnit:'', denominatorValue:1}]
    })
  }
}

// COMPOUNDING
export const MedicationItemTypeCompounding = {
  profile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_Compounding|1.0.2',

  buildFHIR : function ({uuid, packagingText, typeText, formText, 
                         amountNumeratorValue, amountNumeratorUnit, amountDenominatorValue,
                         ingredients}) {
    return {
      fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
      resource: {
        resourceType: 'Medication',
        id: uuid,
        meta: { profile: [this.profile] },
        extension: [
          { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Category',
            valueCoding: {
              system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Category',
              code: '00'
            }
          },
          { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Vaccine',
            valueBoolean: false
          },
          { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Packaging',
            valueString: packagingText
          }
        ],
        code: {
          coding: [{ system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Type', code: 'rezeptur' }],
          text: typeText
        },
        form: { text: formText },
        amount: Amount.buildFHIR('', amountNumeratorValue, amountNumeratorUnit, amountDenominatorValue),
        ingredient: Ingredients.buildFHIR(ingredients)
      }
    }
  },

  buildEmptyFHIR: (uuid) => {
    return MedicationItemTypeCompounding.buildFHIR({
      uuid:          uuid, 
      packagingText: '',
      typeText:      '',
      formText:      '',
      amountNumeratorValue: 1,
      amountNumeratorUnit:  '',
      amountDenominatorValue: 1,
      ingredients: [{itemCode:'', itemText:'', formText:'', strengthText:'', numeratorValue:1, numeratorUnit:'', denominatorValue:1}]
    })
  }
}

const Ingredients = {
  buildFHIR : (ingredients) => ingredients.map(ingredientItem => Ingredient.buildFHIR(ingredientItem))
}

const Ingredient = {
  buildFHIR : ({itemCode, itemText, formText, strengthText, numeratorValue, numeratorUnit, denominatorValue}) => {
    let fhir = {
      itemCodeableConcept: ItemCodeableConcept.buildFHIR(itemCode, itemText),
      strength: Amount.buildFHIR(strengthText, numeratorValue, numeratorUnit, denominatorValue),
    };
    if (formText)
      fhir["extension"] = IngredientForm.buildFHIR(formText);
    return fhir;
  }
}

const ItemCodeableConcept = {
  buildFHIR : (itemCode, itemText) => {
    if (itemCode)
      return {
        coding: [{ system: 'http://fhir.de/CodeSystem/ask', code: itemCode }],
        text: itemText
      }
    else
      return { text: itemText }
  }
}

const IngredientForm = {
  buildFHIR : (formText) => {
    return [
      { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Ingredient_Form',
        valueString: formText
      }
    ]
  }
}

const Amount = {
  buildFHIR : (amountText, numeratorValue, numeratorUnit, denominatorValue) => {
    if (amountText)
      return {
        extension: [{ url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Ingredient_Amount',
                      valueString: amountText
                    }]
      }
    else
      return {
        numerator:   { value: numeratorValue, unit: numeratorUnit },
        denominator: { value: denominatorValue }
      }
  }
}