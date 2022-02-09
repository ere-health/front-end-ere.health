// load KBV eRP v1.0.2 examples into the app issuing this command into the browser's console:
// > window.__socket.send(JSON.stringify({"type": "AllKBVExamples", "folder": "../KBV_FHIR_eRP_V1_0_2/examples"}))

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
      dformText:       medicationFHIR?.resource?.form?.text ?? '',
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
    const fhir = {
      fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
      resource: {
        resourceType: 'Medication',
        // 1..1 uuid
        id: uuid,
        // 1..1 meta
        meta: { profile: [MedicamentProfileIngredient.urlProfile] },
        // 0..* extension
        extension: [
          // 1..1 Category
          { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Category',
            valueCoding: {
              system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Category',
              code: '00'
            }
          },
          // 1..1 Vaccine
          { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Vaccine',
            valueBoolean: false
          },
        ],
        // 1..1 code
        code: {
          coding: [{ system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Type', 
                      code: 'wirkstoff' }]
        },
        // 1..1 form
        form: { text: formText },
        // 1..1 ingredient
        ingredient: ingredients?.map(ingredient => IngredientIngredientItem.buildFHIR(ingredient)) 
                    ?? [],
      }
    };

    // 0..1 extension.normgroesseCode
    if (normgroesseCode) {
      fhir.resource.extension.push(
        { url: 'http://fhir.de/StructureDefinition/normgroesse',
          valueCode: normgroesseCode
        }
      );
    }

    // 0..1 amount
    if (Number(amountNumeratorValue)>0) {
      const amount = Amount.buildFHIR(amountNumeratorValue, amountNumeratorUnit, amountDenominatorValue);
      Object.assign(fhir.resource, {amount});
    }
    return fhir;
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

  buildFHIR : ({pznCode, medicationText, strengthNumeratorValue, strengthNumeratorUnit, strengthDenominatorValue}) => {
    return {
      // 1..1
      itemCodeableConcept: ItemCodeableConcept.buildFHIR(pznCode, medicationText),
      // 1..1
      strength: Strength.buildFHIR({strengthText:'', strengthNumeratorValue, strengthNumeratorUnit, strengthDenominatorValue}),
    };
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
      dformText:              medicationFHIR?.resource?.form?.text ?? '',
      amountNumeratorValue:   medicationFHIR?.resource?.amount?.numerator?.value ?? 0,
      amountNumeratorUnit:    medicationFHIR?.resource?.amount?.numerator?.unit ?? '',
      amountDenominatorValue: medicationFHIR?.resource?.amount?.denominator?.value ?? 1,       
      ingredients:            medicationFHIR?.resource?.ingredient
                              ?.map(ingredientFHIR=>CompoundingIngredientItem.getValuesFromFHIR(ingredientFHIR)) 
                              ?? [CompoundingIngredientItem.buildEmpty()],
    }
  },

  buildEmpty: () => MedicamentProfileCompounding.getValuesFromFHIR({}),

  buildFHIR : ({uuid, medicationText, packagingText, dformText, 
                amountNumeratorValue, amountNumeratorUnit, amountDenominatorValue,
                ingredients}) => {
    const fhir = {
      fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
      resource: {
        resourceType: 'Medication',
        // 1..1 uuid
        id: uuid,
        // 1..1 meta
        meta: { profile: [MedicamentProfileCompounding.urlProfile] },
        // 0..* extension
        extension: [
          // 1..1
          { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Category',
            valueCoding: {
              system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Category',
              code: '00'
            }
          },
          // 1..1
          { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Vaccine',
            valueBoolean: false
          },
          // 0..1 verpackung - see below
        ],
        // 1..1 code
        code: {
          // 1..1 coding
          coding: [{ system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Type', 
                      code: 'rezeptur' }],
          // 0..1 text - see below
        },
        // 1..1 form
        form: { text: dformText },
        // 1..1 amount
        amount: Amount.buildFHIR(amountNumeratorValue, amountNumeratorUnit, amountDenominatorValue),
        // 1..* ingredient
        ingredient: ingredients?.map(ingredientItem => CompoundingIngredientItem.buildFHIR(ingredientItem)) 
                    ?? [],
      }
    };
    // 0..1 resource.extension.verpackung
    fhir.resource.extension.push({
      url: MedicamentProfile.urlPackaging,
      valueString: packagingText
    });
    // 0..1 resource.code.text
    const text = medicationText;
    Object.assign(fhir.resource.code, {text});    
    return fhir;
  },
}

// COMPOUNDING.INGREDIENT ITEM
const CompoundingIngredientItem = {
  getValuesFromFHIR : (ingredientFHIR) => {
    const values = {};
    Object.assign(values, IngredientExtension.getValuesFromFHIR(ingredientFHIR?.extension));
    Object.assign(values, ItemCodeableConcept.getValuesFromFHIR(ingredientFHIR?.itemCodeableConcept));
    Object.assign(values, Strength.getValuesFromFHIR(ingredientFHIR?.strength));
    return values;
  },

  buildEmpty: () => CompoundingIngredientItem.getValuesFromFHIR({}),

  buildFHIR : ({pznCode, medicationText, dformText, 
                strengthText, strengthNumeratorValue, 
                strengthNumeratorUnit, strengthDenominatorValue}) => {
    const fhir = {};
    if (dformText) {
      const extension = IngredientExtension.buildFHIR({dformText});
      Object.assign(fhir, {extension}); 
    }
    // 1..1
    const itemCodeableConcept = ItemCodeableConcept.buildFHIR(pznCode, medicationText);
    // 1..1
    const strength = Strength.buildFHIR({strengthText, strengthNumeratorValue, strengthNumeratorUnit, strengthDenominatorValue});
    Object.assign(fhir, {itemCodeableConcept, strength});
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
    const fhir = {};
    if (pznCode) {
      // 0..1 coding
      const coding = [{ system: 'http://fhir.de/CodeSystem/ask', code: pznCode }];
      Object.assign(fhir, {coding});
    }
    // 1..1 text
    const text = medicationText;
    Object.assign(fhir, {text});
    return fhir;
  }
}

// INGREDIENT EXTENSION
const IngredientExtension = {
  getValuesFromFHIR : (ingredientFHIRextension) => {
    const dformText = ingredientFHIRextension
                     ?.filter(row=>row.url===MedicamentProfile.urlIngredientForm)?.[0]
                     ?.valueString ?? '';
    return { dformText };
  },

  buildEmpty : () => IngredientExtension.getValuesFromFHIR({}),

  buildFHIR : ({dformText}) => {
    return [
      // 0..1 darreichungform
      { url: MedicamentProfile.urlIngredientForm,
        valueString: dformText,
      }
    ]
  }
}

// AMOUNT
const Amount = {
  getValuesFromFHIR : (amountFHIR) => {
    return {
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

  buildFHIR : ({strengthText, strengthNumeratorValue, strengthNumeratorUnit, strengthDenominatorValue}) => {
    if (strengthText)
      return { 
        extension: [
          { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Ingredient_strength',
            valueString: strengthText }]}
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
  urlNormgroesse :   'http://fhir.de/StructureDefinition/normgroesse',
  urlPackaging:      'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Packaging',
  urlDosageFlag:     'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_DosageFlag',
  urlIngredientForm: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Ingredient_Form',
  
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
          return null;
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
