import { 
  FIELD_PZN_TYPE 
} from "./fieldselectoptions.js";

// MedicationItemType
export const MedicationItemType = {
  urlNormgroesse : 'http://fhir.de/StructureDefinition/normgroesse',
  urlPackaging:    'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Packaging',
  
  getType: (profile) => {
    switch (profile){
      case MedicationItemTypeFreeText.urlProfile:
          return MedicationItemTypeFreeText;
      case MedicationItemTypePZN.urlProfile:
          return MedicationItemTypePZN;
      case MedicationItemTypeIngredient.urlProfile:
          return MedicationItemTypeIngredient;
      case MedicationItemTypeCompounding.urlProfile:
          return MedicationItemTypeCompounding;
      default:
    }
  },

  buildEmpty: (profile, uuid) => {
    let medicationItemType = MedicationItemType.getType(profile);
    if (medicationItemType) 
        return medicationItemType?.buildEmpty(uuid);
    return {};
  },

  buildEmptyFHIR: (profile, uuid) => {
    let medicationItemType = MedicationItemType.getType(profile);
    if (medicationItemType) 
        return medicationItemType?.buildEmptyFHIR(uuid);
    return {};
  },

  buildFHIR: (medicationItem) => {
    let medicationItemType = MedicationItemType.getType(medicationItem?.profile);
    if (medicationItemType) 
        return medicationItemType.buildFHIR(medicationItem);
    return {};
  },

  getProfileFromFHIR: (medicationItemFHIR) => {
    return medicationItemFHIR?.resource?.meta?.profile?.[0];
  },
  getUUIDfromFHIR: (medicationItemFHIR) => {
    return medicationItemFHIR?.resource?.id;
  },

  getValuesFromFHIR: (medicationItemFHIR) =>{
    let profile = MedicationItemType.getProfileFromFHIR(medicationItemFHIR);
    let medicationItemType = MedicationItemType.getType(profile);
    if (medicationItemType) 
        return medicationItemType.getValuesFromFHIR(medicationItemFHIR);
    return {};
  },

  setObjectAttribute: (object,path,value) => {
    let parts = path.split(/\./);
    for (let i=0; i<parts.length; i++){
        let actualElement = parts[i];
        if (Number.isInteger(actualElement)) actualElement = Number.parseInt(actualElement);
        if (i<parts.length-1)
            object = object?.[actualElement];
        else {
            object[actualElement] = value;
            switch (actualElement){
              case 'pznCode':
                let pznText = FIELD_PZN_TYPE.filter(pznRow=>pznRow.value===value)?.[0]?.label;
                if (pznText) object['pznText'] = pznText;
                break;
              case 'pznText':
                let pznCode = FIELD_PZN_TYPE.filter(pznRow=>pznRow.label===value)?.[0]?.value;
                if (pznCode) object['pznCode'] = pznCode;
                break;
            }
        }
    }
  },

}

// PZN: https://simplifier.net/erezept/kbvprerpmedicationpzn
export const MedicationItemTypePZN = {
  urlProfile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_PZN|1.0.2',

  getValuesFromFHIR: (medicationItemFHIR) =>{
    return {
      profile:         MedicationItemType.getProfileFromFHIR(medicationItemFHIR),
      uuid:            MedicationItemType.getUUIDfromFHIR(medicationItemFHIR),
      normgroesseCode: medicationItemFHIR?.resource?.extension
                        ?.filter(object=>object.url==MedicationItemType.urlNormgroesse)
                        ?.[0]
                        ?.valueCode,
      pznText:         medicationItemFHIR?.resource?.code?.text,
      pznCode:         medicationItemFHIR?.resource?.code?.coding?.[0]?.code,
      dformCode:       medicationItemFHIR?.resource?.form?.coding?.[0]?.code,
    }
  },

  buildEmpty: (uuid) => {
    return {
      profile:         MedicationItemTypePZN.urlProfile,    
      uuid:            uuid, 
      normgroesseCode: '',
      pznCode:         '',
      pznText:         '',
      dformCode:       '',
    };
  },

  buildEmptyFHIR: (uuid) => MedicationItemTypePZN.buildFHIR(
    MedicationItemTypePZN.buildEmpty(uuid)
  ),

  buildFHIR : ({uuid, normgroesseCode, pznCode, pznText, dformCode}) => {
    return {
      fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
      resource: {
        resourceType: 'Medication',
        id: uuid,
        meta: {profile: [MedicationItemTypePZN.urlProfile]},
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

}

// FREETEXT: https://simplifier.net/erezept/kbvprerpmedicationfreetext
export const MedicationItemTypeFreeText = {
  urlProfile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_FreeText|1.0.2',

  getValuesFromFHIR: (medicationItemFHIR) =>{
    return {
      profile: MedicationItemType.getProfileFromFHIR(medicationItemFHIR),
      uuid: medicationItemFHIR?.resource?.id,
      medicationText: medicationItemFHIR?.resource?.code?.text,
    }
  },

  buildEmpty: (uuid) => {
    return {
      profile:        MedicationItemTypeFreeText.urlProfile,      
      uuid:           uuid, 
      medicationText: '',
    };
  }, 

  buildEmptyFHIR: (uuid) => MedicationItemTypeFreeText.buildFHIR(
    MedicationItemTypeFreeText.buildEmpty(uuid)
  ),

  buildFHIR : function ({uuid, medicationText}) {
    return {
      fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
      resource: {
        resourceType: 'Medication',
        id: uuid,
        meta: {profile: [this.urlProfile]},
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
}

// INGREDIENT: https://simplifier.net/erezept/kbvprerpmedicationingredient
export const MedicationItemTypeIngredient = {
  urlProfile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_Ingredient|1.0.2',

  getValuesFromFHIR: (medicationItemFHIR) =>{
    return {
      profile:         MedicationItemType.getProfileFromFHIR(medicationItemFHIR),
      uuid:            MedicationItemType.getUUIDfromFHIR(medicationItemFHIR),
      normgroesseCode: medicationItemFHIR?.resource?.extension
                        ?.filter(object=>object.url==MedicationItemType.urlNormgroesse)?.[0]
                        ?.valueCode,
      formText:        medicationItemFHIR?.resource?.form?.text,
      ingredients:     Ingredients.getValuesFromFHIR(medicationItemFHIR?.resource?.ingredient),
    }
  },

  buildEmpty: (uuid) => {
    return {
      profile:         MedicationItemTypeIngredient.urlProfile,
      uuid:            uuid, 
      normgroesseCode: '',
      formText:        '',
      ingredients: [{itemCode:'', itemText:'', ingredientForm:'', strengthText:'', numeratorValue:1, numeratorUnit:'', denominatorValue:1}]
    };
  },

  buildEmptyFHIR: (uuid) => MedicationItemTypeIngredient.buildFHIR(
    MedicationItemTypeIngredient.buildEmpty(uuid)
  ),

  buildFHIR : ({uuid, normgroesseCode, formText, ingredients}) => {
    return {
      fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
      resource: {
        resourceType: 'Medication',
        id: uuid,
        meta: { profile: [MedicationItemTypeIngredient.urlProfile] },
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

}

// COMPOUNDING: https://simplifier.net/erezept/kbvprerpmedicationcompounding
export const MedicationItemTypeCompounding = {
  urlProfile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_Compounding|1.0.2',

  getValuesFromFHIR: (medicationItemFHIR) =>{
    return {
      profile:       MedicationItemType.getProfileFromFHIR(medicationItemFHIR),
      uuid:          MedicationItemType.getUUIDfromFHIR(medicationItemFHIR),
      packagingText: medicationItemFHIR?.resource?.extension
                      ?.filter(object=>object.url==MedicationItemType.urlPackaging)?.[0]
                      ?.valueString,
      typeText:      medicationItemFHIR?.resource?.code?.text,
      formText:      medicationItemFHIR?.resource?.form?.text,
      amountNumeratorValue:   medicationItemFHIR?.resource?.amount?.numerator.value,
      amountNumeratorUnit:    medicationItemFHIR?.resource?.amount?.numerator.unit,
      amountDenominatorValue: medicationItemFHIR?.resource?.amount?.denominator.value,       
      ingredients:   Ingredients.getValuesFromFHIR(medicationItemFHIR?.resource?.ingredient),
    }
  },

  buildEmpty: (uuid) => {
    return {
      profile:       MedicationItemTypeCompounding.urlProfile,
      uuid:          uuid, 
      packagingText: '',
      typeText:      '',
      formText:      '',
      amountNumeratorValue: 1,
      amountNumeratorUnit:  '',
      amountDenominatorValue: 1,
      ingredients: [{itemCode:'', itemText:'', formText:'', strengthText:'', numeratorValue:1, numeratorUnit:'', denominatorValue:1}]
    }
  },

  buildEmptyFHIR: (uuid) => MedicationItemTypeCompounding.buildFHIR(
    MedicationItemTypeCompounding.buildEmpty(uuid)
  ),

  buildFHIR : ({uuid, packagingText, typeText, formText, 
                amountNumeratorValue, amountNumeratorUnit, amountDenominatorValue,
                ingredients}) => {
    return {
      fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
      resource: {
        resourceType: 'Medication',
        id: uuid,
        meta: { profile: [MedicationItemTypeCompounding.urlProfile] },
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
          { url: MedicationItemType.urlPackaging,
            valueString: packagingText
          }
        ],
        code: {
          coding: [{ system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Type', 
                     code: 'rezeptur' }],
          text: typeText
        },
        form: { text: formText },
        amount: Amount.buildFHIR('', amountNumeratorValue, amountNumeratorUnit, amountDenominatorValue),
        ingredient: Ingredients.buildFHIR(ingredients)
      }
    }
  },
}

const Ingredients = {
  getValuesFromFHIR : (ingredientsFHIR) => ingredientsFHIR.map(ingredientFHIR=>Ingredient.getValuesFromFHIR(ingredientFHIR)),
  buildFHIR : (ingredients) => ingredients.map(ingredientItem => Ingredient.buildFHIR(ingredientItem))
}

const Ingredient = {
  getValuesFromFHIR : (ingredientFHIR) => {
    return {
      itemCode:         ingredientFHIR?.itemCodeableConcept?.coding?.[0]?.code,
      itemText:         ingredientFHIR?.itemCodeableConcept?.text,
      formText:         ingredientFHIR?.extension?.[0]?.valueString,
      strengthText:     ingredientFHIR?.strength?.extension?.[0]?.valueString,
      numeratorValue:   ingredientFHIR?.strength?.numerator?.value,
      numeratorUnit:    ingredientFHIR?.strength?.numerator?.unit,
      denominatorValue: ingredientFHIR?.strength?.denominator?.value,      
    };
  },

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

// MedicationRequest.PRESCRIPTION: https://simplifier.net/erezept/kbvprerpprescription
export const MedicationRequestPrescription = {
  urlProfile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_Compounding|1.0.2',

  getValuesFromFHIR: (medicationRequestFHIR) =>{
    return {
      profile:       MedicationItemType.getProfileFromFHIR(medicationRequestFHIR),
      uuid:          MedicationItemType.getUUIDfromFHIR(medicationRequestFHIR),
   }
  },

  buildEmpty: (uuid) => {
    return {
      profile:       MedicationRequestPrescription.urlProfile,
      uuid:          uuid, 
    }
  },

  buildEmptyFHIR: (uuid) => MedicationRequestPrescription.buildFHIR(
    MedicationRequestPrescription.buildEmpty(uuid)
  ),

  buildFHIR : ({uuid, }) => {
    return {

    }
  },
}
