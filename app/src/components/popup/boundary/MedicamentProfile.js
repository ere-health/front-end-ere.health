// MedicationRequest.Prescription: https://simplifier.net/erezept/kbvprerpprescription
export const MedicationRequestPrescription = {
  profile: 'Prescription',
  urlProfile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Prescription|1.0.2',

  getValuesFromFHIR: (medicationRequestFHIR) =>{
    return {
      dispenseQuantity:  medicationRequestFHIR?.resource?.dispenseRequest?.quantity?.value ?? 0,
      dosageInstruction: medicationRequestFHIR?.resource?.dosageInstruction?.[0]?.patientInstruction
                      ?? medicationRequestFHIR?.resource?.dosageInstruction?.[0]?.text
                      ?? '',
    }
  },

  buildEmpty: () => MedicationRequestPrescription.getValuesFromFHIR({}),

  modifyFHIR: (medicationRequestFHIR, {dosageInstruction, dispenseQuantity}) => {
    // dispenseQuantity
    const dispenseQuantityFHIR = medicationRequestFHIR?.resource?.dispenseRequest?.quantity;
    if (dispenseQuantityFHIR) dispenseQuantityFHIR.value = Number(dispenseQuantity);
    // dosageInstruction
    const dosageFHIR = medicationRequestFHIR?.resource?.dosageInstruction?.[0];
    if (dosageFHIR!==undefined){
      let propertyName = 'patientInstruction';
      if (! (propertyName in dosageFHIR)) propertyName = 'text';
      if (dosageInstruction) 
        dosageFHIR[propertyName] = dosageInstruction;
      else
        delete dosageFHIR[propertyName];
      // DosageFlag
      const dosageFlagFHIR = dosageFHIR?.extension?.filter(row=>row.url===MedicamentProfile.urlDosageFlag)?.[0];
      if (dosageFlagFHIR!==undefined)
        dosageFlagFHIR.valueBoolean = Boolean(dosageInstruction);
    }
  },
}

// PZN: https://simplifier.net/erezept/kbvprerpmedicationpzn
export const MedicamentProfilePZN = {
  profile: 'PZN',
  label:   'PZN',
  urlProfile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_PZN|1.0.2',

  getValuesFromFHIR: (medicationFHIR) =>{
    return {
      medicationText:  medicationFHIR?.resource?.code?.text ?? '',
      pznCode:         medicationFHIR?.resource?.code?.coding?.[0]?.code ?? '',
      normgroesseCode: medicationFHIR?.resource?.extension
                        ?.filter(object=>object.url==MedicamentProfile.urlNormgroesse)
                        ?.[0]
                        ?.valueCode ?? '',
      dformCode:       medicationFHIR?.resource?.form?.coding?.[0]?.code ?? '',
    }
  },

  buildEmpty: () => MedicamentProfilePZN.getValuesFromFHIR({}),

  buildFHIR : ({uuid, medicationText, pznCode, normgroesseCode,  dformCode}) => {
    return {
      fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
      resource: {
        resourceType: 'Medication',
        id: uuid,
        meta: {profile: [MedicamentProfilePZN.urlProfile]},
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
          text: medicationText
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
export const MedicamentProfileFreeText = {
  profile: 'FreeText',
  label:   'Freitext',
  urlProfile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_FreeText|1.0.2',

  getValuesFromFHIR: (medicationFHIR) =>{
    return {
      medicationText: medicationFHIR?.resource?.code?.text ?? '',
    }
  },

  buildEmpty: () => MedicamentProfileFreeText.getValuesFromFHIR({}), 

  buildFHIR : function ({uuid, medicationText}) {
    return {
      fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
      resource: {
        resourceType: 'Medication',
        id: uuid,
        meta: {profile: [MedicamentProfileFreeText.urlProfile]},
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
export const MedicamentProfileIngredient = {
  profile: 'Ingredient',
  label:   'Wirkstoff',
  urlProfile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_Ingredient|1.0.2',

  getValuesFromFHIR: (medicationFHIR) =>{
    return {
      normgroesseCode: medicationFHIR?.resource?.extension
                        ?.filter(object=>object.url==MedicamentProfile.urlNormgroesse)
                        ?.[0]
                        ?.valueCode ?? '',
      formText:        medicationFHIR?.resource?.form?.text ?? '',
      amountNumeratorValue:   medicationFHIR?.resource?.amount?.numerator?.value ?? 0,
      amountNumeratorUnit:    medicationFHIR?.resource?.amount?.numerator?.unit ?? '',
      amountDenominatorValue: medicationFHIR?.resource?.amount?.denominator?.value ?? 1,       
      ingredients:            medicationFHIR?.resource?.ingredient
                              ?.map(ingredientFHIR=>IngredientIngredientItem.getValuesFromFHIR(ingredientFHIR)) 
                              ?? [IngredientIngredientItem.buildEmpty()],
    }
  },

  buildEmpty: () => MedicamentProfileIngredient.getValuesFromFHIR({}),

  buildFHIR : ({uuid, normgroesseCode, formText, 
                amountNumeratorValue, amountNumeratorUnit, amountDenominatorValue,
                ingredients}) => {
    return {
      fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
      resource: {
        resourceType: 'Medication',
        // 1..1
        id: uuid,
        // 1..1
        meta: { profile: [MedicamentProfileIngredient.urlProfile] },
        // 0..*
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
        // 1..1
        code: {
          coding: [{ system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Type', 
                      code: 'wirkstoff' }]
        },
        // 1..1
        form: { text: formText },
        // 0..1
        amount: Amount.buildFHIR('', amountNumeratorValue, amountNumeratorUnit, amountDenominatorValue),
        // 1..1
        ingredient: ingredients?.map(ingredient => IngredientIngredientItem.buildFHIR(ingredient)) 
                    ?? [],
      }
    }
  },
}

// INGREDIENT.INGREDIENT ITEM
const IngredientIngredientItem = {
  getValuesFromFHIR : (ingredientFHIR) => {
    const values = {};
    Object.assign(values, ItemCodeableConcept.getValuesFromFHIR(ingredientFHIR?.itemCodeableConcept));
    Object.assign(values, Strength.getValuesFromFHIR(ingredientFHIR?.strength));
    return values;
  },

  buildEmpty: () => IngredientIngredientItem.getValuesFromFHIR({}),

  buildFHIR : ({pznCode, medicationText, formText, strengthText, strengthNumeratorValue, strengthNumeratorUnit, strengthDenominatorValue}) => {
    const fhir = {
      itemCodeableConcept: ItemCodeableConcept.buildFHIR(pznCode, medicationText),
      strength:            Strength.buildFHIR(strengthText, strengthNumeratorValue, strengthNumeratorUnit, strengthDenominatorValue),
    };
    if (formText) {
      const extension = IngredientForm.buildFHIR(formText);
      Object.assign(fhir, {extension}); 
    }
    return fhir;
  }
}
  
// COMPOUNDING: https://simplifier.net/erezept/kbvprerpmedicationcompounding
export const MedicamentProfileCompounding = {
  profile: 'Compounding',
  label:   'Rezeptur',
  urlProfile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_Compounding|1.0.2',

  getValuesFromFHIR: (medicationFHIR) =>{
    return {
      medicationText:         medicationFHIR?.resource?.code?.text ?? '',
      packagingText:          medicationFHIR?.resource?.extension
                                ?.filter(object=>object.url==MedicamentProfile.urlPackaging)
                                ?.[0]
                                ?.valueString ?? '',
      formText:               medicationFHIR?.resource?.form?.text ?? '',
      strengthNumeratorValue:   medicationFHIR?.resource?.amount?.numerator?.value ?? 0,
      amountNumeratorUnit:    medicationFHIR?.resource?.amount?.numerator?.unit ?? '',
      amountDenominatorValue: medicationFHIR?.resource?.amount?.denominator?.value ?? 1,       
      ingredients:            medicationFHIR?.resource?.ingredient
                              ?.map(ingredientFHIR=>CompoundingIngredientItem.getValuesFromFHIR(ingredientFHIR)) 
                              ?? [CompoundingIngredientItem.buildEmpty()],
    }
  },

  buildEmpty: () => MedicamentProfileCompounding.getValuesFromFHIR({}),

  buildFHIR : ({uuid, medicationText, packagingText, formText, 
                amountNumeratorValue, amountNumeratorUnit, amountDenominatorValue,
                ingredients}) => {
    return {
      fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
      resource: {
        resourceType: 'Medication',
        // 1..1
        id: uuid,
        // 1..1
        meta: { profile: [MedicamentProfileCompounding.urlProfile] },
        // 0..*
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
          { url: MedicamentProfile.urlPackaging,
            valueString: packagingText
          }
        ],
        // 1..1
        code: {
          coding: [{ system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Type', 
                      code: 'rezeptur' }],
          text: medicationText
        },
        // 1..1
        form: { text: formText },
        // 1..1
        amount: Amount.buildFHIR('', amountNumeratorValue, amountNumeratorUnit, amountDenominatorValue),

        ingredient: ingredients?.map(ingredientItem => IngredientItem.buildFHIR(ingredientItem)) ?? [],
      }
    }
  },
}

// COMPOUNDING.INGREDIENT ITEM
const CompoundingIngredientItem = {
  getValuesFromFHIR : (ingredientFHIR) => {
    const values = {};
    Object.assign(values, IngredientForm.getValuesFromFHIR(ingredientFHIR?.extension));
    Object.assign(values, ItemCodeableConcept.getValuesFromFHIR(ingredientFHIR?.itemCodeableConcept));
    Object.assign(values, Strength.getValuesFromFHIR(ingredientFHIR?.strength));
    return values;
  },

  buildEmpty: () => CompoundingIngredientItem.getValuesFromFHIR({}),

  buildFHIR : ({pznCode, medicationText, formText, strengthText, strengthNumeratorValue, strengthNumeratorUnit, strengthDenominatorValue}) => {
    const fhir = {
      itemCodeableConcept: ItemCodeableConcept.buildFHIR(pznCode, medicationText),
      strength:            Strength.buildFHIR(strengthText, strengthNumeratorValue, strengthNumeratorUnit, strengthDenominatorValue),
    };
    if (formText) {
      const extension = IngredientForm.buildFHIR(formText);
      Object.assign(fhir, {extension}); 
    }
    return fhir;
  }
}

// ITEM CODEABLE CONCEPT
const ItemCodeableConcept = {
  getValuesFromFHIR : (itemCodeableConceptFHIR) => {
    return {
      pznCode: itemCodeableConceptFHIR?.coding?.[0]?.code ?? '',
      medicationText: itemCodeableConceptFHIR?.text ?? '',
    };
  },

  buildEmpty: () => ItemCodeableConcept.getValuesFromFHIR({}),

  buildFHIR : (pznCode, medicationText) => {
    if (pznCode)
      return {
        coding: [{ system: 'http://fhir.de/CodeSystem/ask', code: pznCode }],
        text: medicationText
      }
    else
      return { text: medicationText }
  }
}

// INGREDIENT FORM
const IngredientForm = {
  getValuesFromFHIR : (ingredientFHIRextension) => {
    const formText = ingredientFHIRextension?.[0]?.valueString ?? '';
    return { formText };
  },

  buildEmpty : () => IngredientForm.getValuesFromFHIR({}),

  buildFHIR : (formText) => {
    return [
      { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Ingredient_Form',
        valueString: formText
      }
    ]
  }
}

// AMOUNT
const Amount = {
  getValuesFromFHIR : (amountFHIR) => {
    return {
      amountText:             amountFHIR?.extension?.[0]?.valueString ?? '',
      amountNumeratorValue:   amountFHIR?.numerator?.value ?? 0,
      amountNumeratorUnit:    amountFHIR?.numerator?.unit ?? '',
      amountDenominatorValue: amountFHIR?.denominator?.value ?? 1,
    };
  },

  buildEmpty : () => Amount.getValuesFromFHIR({}),

  buildFHIR : (amountNumeratorValue, amountNumeratorUnit, amountDenominatorValue) => {
    return {
      numerator:   { value: amountNumeratorValue, 
                     unit:  amountNumeratorUnit },
      denominator: { value: amountDenominatorValue }
    }
  }
}

// STRENGTH
const Strength = {
  getValuesFromFHIR : (strengthFHIR) => {
    return {
      strengthText:             strengthFHIR?.extension?.[0]?.valueString ?? '',
      strengthNumeratorValue:   strengthFHIR?.numerator?.value ?? 0,
      strengthNumeratorUnit:    strengthFHIR?.numerator?.unit ?? '',
      strengthDenominatorValue: strengthFHIR?.denominator?.value ?? 1,
    };
  },

  buildEmpty : () => Strength.getValuesFromFHIR({}),

  buildFHIR : (strengthText, strengthNumeratorValue, strengthNumeratorUnit, strengthDenominatorValue) => {
    if (strengthText)
      return {
        extension: [
          { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Ingredient_strength',
            valueString: strengthText
          }
        ]
      }
    else
      return {
        numerator:   { value: strengthNumeratorValue, 
                       unit:  strengthNumeratorUnit },
        denominator: { value: strengthDenominatorValue }
      }
  }
}

// MedicamentProfile
export const MedicamentProfile = {
  profiles: [
    { value: MedicamentProfilePZN.profile,         label: MedicamentProfilePZN.label},
    { value: MedicamentProfileFreeText.profile,    label: MedicamentProfileFreeText.label},
    { value: MedicamentProfileIngredient.profile,  label: MedicamentProfileIngredient.label},
    { value: MedicamentProfileCompounding.profile, label: MedicamentProfileCompounding.label},
  ],
  urlNormgroesse : 'http://fhir.de/StructureDefinition/normgroesse',
  urlPackaging:    'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Packaging',
  urlDosageFlag:   'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_DosageFlag',
  
  getType: (profile) => {
    switch (profile){
      case MedicamentProfileFreeText.profile:
          return MedicamentProfileFreeText;
      case MedicamentProfilePZN.profile:
          return MedicamentProfilePZN;
      case MedicamentProfileIngredient.profile:
          return MedicamentProfileIngredient;
      case MedicamentProfileCompounding.profile:
          return MedicamentProfileCompounding;
      default:
    }
  },

  buildEmpty: (profile) => {
    const profileType = MedicamentProfile.getType(profile);
    return profileType?.getValuesFromFHIR({}) ?? {};
  },

  buildFHIR: (medication) => {
    const profileType = MedicamentProfile.getType(medication?.profile);
    return profileType.buildFHIR(medication) ?? {};
  },

  getProfileFromFHIR: (medicationFHIR) => {
    return medicationFHIR?.resource?.meta?.profile?.[0]?.split('|')?.[0]?.split('_')?.pop() ?? '';
  },

  getValuesFromFHIR: (medicationFHIR) =>{
    const uuid = medicationFHIR?.resource?.id;
    const profile = MedicamentProfile.getProfileFromFHIR(medicationFHIR);
    const profileType = MedicamentProfile.getType(profile);
    const values = {profile, uuid};
    Object.assign(values, profileType.getValuesFromFHIR(medicationFHIR));
    return values;
  },

  setObjectAttribute: (object,path,value) => {
    const parts = path.split(/\./);
    for (let i=0; i<parts.length; i++){
        let actualElement = parts[i];
        if (Number.isInteger(actualElement)) actualElement = Number.parseInt(actualElement);
        if (i<parts.length-1)
            object = object?.[actualElement];
        else {
            object[actualElement] = value;
        }
    }
  },
}
