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
      const propertyName = 'patientInstruction';
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
      ingredients:     Ingredients.getValuesFromFHIR(medicationFHIR?.resource?.ingredient),
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
        id: uuid,
        meta: { profile: [MedicamentProfileIngredient.urlProfile] },
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
        amount: Amount.buildFHIR('', amountNumeratorValue, amountNumeratorUnit, amountDenominatorValue),
        ingredient: Ingredients.buildFHIR(ingredients)
      }
    }
  },

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
      amountNumeratorValue:   medicationFHIR?.resource?.amount?.numerator?.value ?? 0,
      amountNumeratorUnit:    medicationFHIR?.resource?.amount?.numerator?.unit ?? '',
      amountDenominatorValue: medicationFHIR?.resource?.amount?.denominator?.value ?? 1,       
      ingredients:            Ingredients.getValuesFromFHIR(medicationFHIR?.resource?.ingredient),
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
        id: uuid,
        meta: { profile: [MedicamentProfileCompounding.urlProfile] },
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
        code: {
          coding: [{ system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Type', 
                      code: 'rezeptur' }],
          text: medicationText
        },
        form: { text: formText },
        amount: Amount.buildFHIR('', amountNumeratorValue, amountNumeratorUnit, amountDenominatorValue),
        ingredient: Ingredients.buildFHIR(ingredients),
      }
    }
  },
}

// INGREDIENTS
const Ingredients = {
  getValuesFromFHIR : (ingredientsFHIR) => ingredientsFHIR?.map(ingredientFHIR=>Ingredient.getValuesFromFHIR(ingredientFHIR)) ?? [],

  buildEmpty: () => [Ingredient.getValuesFromFHIR({})],

  buildFHIR : (ingredients) => ingredients?.map(ingredientItem => Ingredient.buildFHIR(ingredientItem)) ?? [],
}

// INGREDIENT
const Ingredient = {
  getValuesFromFHIR : (ingredientFHIR) => {
    const values = ItemCodeableConcept.getValuesFromFHIR(ingredientFHIR?.itemCodeableConcept);
    const formText = IngredientForm.getValuesFromFHIR(ingredientFHIR?.extension);
    Object.assign(values, formText);
    const strengthValues = Amount.getValuesFromFHIR(ingredientFHIR?.strength);
    Object.assign(values, strengthValues);
    return values;
  },

  buildEmpty: () => Ingredient.getValuesFromFHIR({}),

  buildFHIR : ({pznCode, medicationText, formText, amountText, amountNumeratorValue, amountNumeratorUnit, amountDenominatorValue}) => {
    const fhir = {
      itemCodeableConcept: ItemCodeableConcept.buildFHIR(pznCode, medicationText),
      strength:            Amount.buildFHIR(amountText, amountNumeratorValue, amountNumeratorUnit, amountDenominatorValue),
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
      amountText:       amountFHIR?.extension?.[0]?.valueString ?? '',
      numeratorValue:   amountFHIR?.numerator?.value ?? 0,
      numeratorUnit:    amountFHIR?.numerator?.unit ?? '',
      denominatorValue: amountFHIR?.denominator?.value ?? 1,
    };
  },

  buildEmpty : () => Amount.getValuesFromFHIR({}),

  buildFHIR : (amountText, numeratorValue, numeratorUnit, denominatorValue) => {
    if (amountText)
      return {
        extension: [
          { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Ingredient_Amount',
            valueString: amountText
          }
        ]
      }
    else
      return {
        numerator:   { value: numeratorValue, unit: numeratorUnit },
        denominator: { value: denominatorValue }
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
