// load KBV eRP v1.1.0 examples into the app issuing this command into the browser's console:
// > window.__socket.send(JSON.stringify({"type": "AllKBVExamples", "folder": "../KBV_FHIR_eRP_V1_1_0/examples"}))

// MedicationRequest.Prescription: https://simplifier.net/erezept/kbvprerpprescription
export const MedicationRequestPrescription = {
  profile: 'Prescription',
  urlProfile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Prescription|1.1.0',

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
    // 1..1 dispenseRequest
    //   1..1 dispenseQuantity
    const dispenseQuantityFHIR = medicationRequestFHIR?.resource?.dispenseRequest?.quantity;
    if (dispenseQuantityFHIR) 
      dispenseQuantityFHIR.value = Number(dispenseQuantity);

    // 0..1 dosageInstruction
    const dosageFHIR = medicationRequestFHIR?.resource?.dosageInstruction?.[0];
    if (dosageFHIR===undefined) {
      if (dosageInstruction) {
        Object.assign(medicationRequestFHIR?.resource, { dosageInstruction: [{text:dosageInstruction}]});
      }
    }
    else {
      // 0..1 patientInstruction
      let propertyName = 'patientInstruction';
      // 0..1 text
      if (! (propertyName in dosageFHIR)) 
        propertyName = 'text';
      if (dosageInstruction) 
        dosageFHIR[propertyName] = dosageInstruction;
      else
        delete dosageFHIR[propertyName];
      // 0..1 dosierungskennzeichen
      const dosageFlagFHIR = dosageFHIR?.extension?.filter(row=>row.url===MedicamentProfile.urlDosageFlag)?.[0];
      if (dosageFlagFHIR!==undefined)
        dosageFlagFHIR.valueBoolean = Boolean(dosageInstruction);
    };
  },
}

// PZN: https://simplifier.net/erezept/kbvprerpmedicationpzn
export const MedicamentProfilePZN = {
  profile: 'PZN',
  label:   'PZN',
  urlProfile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_PZN|1.1.0',

  getValuesFromFHIR: (medicationFHIR) =>{
    const values = {
      pznText:         medicationFHIR?.resource?.code?.text ?? '',
      pznCode:         medicationFHIR?.resource?.code?.coding?.[0]?.code ?? '',
      normgroesseCode: medicationFHIR?.resource?.extension
                        ?.filter(object=>object.url==MedicamentProfile.urlNormgroesse)
                        ?.[0]
                        ?.valueCode ?? '',
      dformCode:       medicationFHIR?.resource?.form?.coding?.[0]?.code ?? '',
      medCatCode:      medicationFHIR?.resource?.extension
                        ?.filter(object=>object.url==MedicamentProfile.urlMedicationCategory)
                        ?.[0]
                        ?.valueCoding
                        ?.code ?? '00',
      isVaccine:       medicationFHIR?.resource?.extension
                        ?.filter(object=>object.url==MedicamentProfile.urlVaccine)
                        ?.[0]
                        ?.valueBoolean ?? false,
    };
    Object.assign(values, Amount.getValuesFromFHIR(medicationFHIR?.resource?.amount));
    return values;
  },

  buildEmpty: () => MedicamentProfilePZN.getValuesFromFHIR({}),

  buildFHIR : ({uuid, pznText, pznCode, normgroesseCode,  dformCode, medCatCode, isVaccine,
               amountNumeratorValue, amountNumeratorUnit, amountNumUnitCode, amountDenominatorValue }) => {
    const fhir = {
      fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
      resource: {
        resourceType: 'Medication',
        id: uuid,
        meta: {profile: [MedicamentProfilePZN.urlProfile]},
        extension: [{
            "url": "https://fhir.kbv.de/StructureDefinition/KBV_EX_Base_Medication_Type",
            "valueCodeableConcept": {
              "coding": [ {
                "system": "http://snomed.info/sct",
                "version": "http://snomed.info/sct/900000000000207008/version/20220331",
                "code": "763158003",
                "display": "Medicinal product (product)"
              } ]
            }
          },
          // 1..1 Medication Category
          { url: MedicamentProfile.urlMedicationCategory,
            valueCoding: {
              system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Category',
              code: medCatCode ?? '00',
            }
          },
          // 1..1 Vaccine
          { url: MedicamentProfile.urlVaccine,
            valueBoolean: isVaccine
          },
          // 0..1 normgroesseCode - see below
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
    // 0..1 resource.extension.normgroesseCode
    if (normgroesseCode) {
      fhir.resource.extension.push(
        { url: 'http://fhir.de/StructureDefinition/normgroesse',
          valueCode: normgroesseCode
        }
      );
    }    
    // 0..1 resource.amount
    if (Number(amountNumeratorValue)>0) {
      const amount = Amount.buildFHIR({amountNumeratorValue, amountNumeratorUnit, amountNumUnitCode, amountDenominatorValue});
      Object.assign(fhir.resource, {amount});
    }
    return fhir;    
  },

}
  
// FREETEXT: https://simplifier.net/erezept/kbvprerpmedicationfreetext
export const MedicamentProfileFreeText = {
  profile: 'FreeText',
  label:   'Freitext',
  urlProfile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_FreeText|1.1.0',

  getValuesFromFHIR: (medicationFHIR) =>{
    return {
      medicationText: medicationFHIR?.resource?.code?.text ?? '',
      medCatCode:     medicationFHIR?.resource?.extension
                        ?.filter(object=>object.url==MedicamentProfile.urlMedicationCategory)
                        ?.[0]
                        ?.valueCoding
                        ?.code ?? '00',
      isVaccine:      medicationFHIR?.resource?.extension
                        ?.filter(object=>object.url==MedicamentProfile.urlVaccine)
                        ?.[0]
                        ?.valueBoolean ?? false,
    }
  },

  buildEmpty: () => MedicamentProfileFreeText.getValuesFromFHIR({}), 

  buildFHIR : function ({uuid, medicationText, medCatCode, isVaccine}) {
    return {
      fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
      resource: {
        resourceType: 'Medication',
        id: uuid,
        meta: {profile: [MedicamentProfileFreeText.urlProfile]},
        // 0..1
        extension: [
          // 1..1 Medication Category
          { url: MedicamentProfile.urlMedicationCategory,
            valueCoding: {
              system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Category',
              code: medCatCode ?? '00',
            }
          },
          // 1..1 Vaccine
          { url: MedicamentProfile.urlVaccine,
            valueBoolean: isVaccine
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
  urlProfile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_Ingredient|1.1.0',

  getValuesFromFHIR: (medicationFHIR) =>{
    const values = {
      normgroesseCode: medicationFHIR?.resource?.extension
                        ?.filter(object=>object.url==MedicamentProfile.urlNormgroesse)
                        ?.[0]
                        ?.valueCode ?? '',
      dformText:       medicationFHIR?.resource?.form?.text ?? '',
      medCatCode:      medicationFHIR?.resource?.extension
                        ?.filter(object=>object.url==MedicamentProfile.urlMedicationCategory)
                        ?.[0]
                        ?.valueCoding
                        ?.code ?? '00',
      isVaccine:       medicationFHIR?.resource?.extension
                        ?.filter(object=>object.url==MedicamentProfile.urlVaccine)
                        ?.[0]
                        ?.valueBoolean ?? false,
      ingredients:     medicationFHIR?.resource?.ingredient
                        ?.map(ingredientFHIR=>IngredientIngredientItem.getValuesFromFHIR(ingredientFHIR)) 
                                              ?? [IngredientIngredientItem.buildEmpty()],
    };
    Object.assign(values, Amount.getValuesFromFHIR(medicationFHIR?.resource?.amount));
    return values;
  },

  buildEmpty: () => MedicamentProfileIngredient.getValuesFromFHIR({}),

  buildFHIR : ({uuid, normgroesseCode, dformText, medCatCode, isVaccine,
                amountNumeratorValue, amountNumeratorUnit, amountNumUnitCode, amountDenominatorValue,
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
          // 1..1 Medication Category
          { url: MedicamentProfile.urlMedicationCategory,
            valueCoding: {
              system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Category',
              code: medCatCode ?? '00',
            }
          },
          // 1..1 Vaccine
          { url: MedicamentProfile.urlVaccine,
            valueBoolean: isVaccine
          },
          // 0..1 normgroesseCode - see below
        ],
        // 1..1 code
        code: {
          coding: [{ system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Type', 
                     code: 'wirkstoff' }]
        },
        // 1..1 form
        form: { text: dformText },

        // 0..1 amount - see below

        // 1..1 ingredient
        ingredient: ingredients?.map(ingredient => IngredientIngredientItem.buildFHIR(ingredient)) 
                    ?? [],
      }
    };
    // 0..1 resource.extension.normgroesseCode
    if (normgroesseCode) {
      fhir.resource.extension.push(
        { url: 'http://fhir.de/StructureDefinition/normgroesse',
          valueCode: normgroesseCode
        }
      );
    }
    // 0..1 resource.amount
    if (Number(amountNumeratorValue)>0) {
      const amount = Amount.buildFHIR({amountNumeratorValue, amountNumeratorUnit, amountNumUnitCode, amountDenominatorValue});
      Object.assign(fhir.resource, {amount});
    }
    return fhir;
  },
}

// INGREDIENT.INGREDIENT ITEM
const IngredientIngredientItem = {
  getValuesFromFHIR : (ingredientFHIR) => {
    const values = {};
    Object.assign(values, IngredientIngredientItemCodeableConcept.getValuesFromFHIR(ingredientFHIR?.itemCodeableConcept));
    Object.assign(values, Strength.getValuesFromFHIR(ingredientFHIR?.strength));
    return values;
  },

  buildEmpty: () => IngredientIngredientItem.getValuesFromFHIR({}),

  buildFHIR : ({askCode, askText, strengthNumeratorValue, strengthNumeratorUnit, strengthDenominatorValue}) => {
    return {
      // 1..1
      itemCodeableConcept: IngredientIngredientItemCodeableConcept.buildFHIR({askCode, askText}),
      // 1..1
      strength: Strength.buildFHIR({strengthNumeratorValue, strengthNumeratorUnit, strengthDenominatorValue}),
    };
  }
}

// INGREDIENT.INGREDIENT ITEM CODEABLE CONCEPT
const IngredientIngredientItemCodeableConcept = {
  getValuesFromFHIR : (itemCodeableConceptFHIR) => {
    return {
      askCode: itemCodeableConceptFHIR?.coding?.[0]?.code ?? '',
      askText: itemCodeableConceptFHIR?.text ?? '',
    };
  },

  buildEmpty: () => IngredientIngredientItemCodeableConcept.getValuesFromFHIR({}),

  buildFHIR : ({askCode, askText}) => {
    const fhir = {};
    if (askCode) {
      // 0..1 coding
      const coding = [{ system: 'http://fhir.de/CodeSystem/ask', code: askCode }];
      Object.assign(fhir, {coding});
    }
    // 1..1 text
    const text = askText;
    Object.assign(fhir, {text});
    return fhir;
  }
}
  
// COMPOUNDING: https://simplifier.net/erezept/kbvprerpmedicationcompounding
export const MedicamentProfileCompounding = {
  profile: 'Compounding',
  label:   'Rezeptur',
  urlProfile : 'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_Compounding|1.1.0',

  getValuesFromFHIR: (medicationFHIR) =>{
    const values = {
      medicationText:         medicationFHIR?.resource?.code?.text ?? '',
      packagingText:          medicationFHIR?.resource?.extension
                                ?.filter(object=>object.url==MedicamentProfile.urlPackaging)
                                ?.[0]
                                ?.valueString ?? '',
      dformText:              medicationFHIR?.resource?.form?.text ?? '',
      medCatCode:             medicationFHIR?.resource?.extension
                                ?.filter(object=>object.url==MedicamentProfile.urlMedicationCategory)
                                ?.[0]
                                ?.valueCoding
                                ?.code ?? '00',
      isVaccine:              medicationFHIR?.resource?.extension
                                ?.filter(object=>object.url==MedicamentProfile.urlVaccine)
                                ?.[0]
                                ?.valueBoolean ?? false,
      ingredients:            medicationFHIR?.resource?.ingredient
                              ?.map(ingredientFHIR=>CompoundingIngredientItem.getValuesFromFHIR(ingredientFHIR)) 
                              ?? [CompoundingIngredientItem.buildEmpty()],
    };
    Object.assign(values, Amount.getValuesFromFHIR(medicationFHIR?.resource?.amount));
    return values;
  },

  buildEmpty: () => MedicamentProfileCompounding.getValuesFromFHIR({}),

  buildFHIR : ({uuid, medicationText, packagingText, dformText, medCatCode, isVaccine,
                amountNumeratorValue, amountNumeratorUnit, amountNumUnitCode, amountDenominatorValue,
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
          // 1..1 Medication Category
          { url: MedicamentProfile.urlMedicationCategory,
            valueCoding: {
              system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Category',
              code: medCatCode ?? '00',
            }
          },
          // 1..1 Vaccine
          { url: MedicamentProfile.urlVaccine,
            valueBoolean: isVaccine
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
        amount: Amount.buildFHIR({amountNumeratorValue, amountNumeratorUnit, amountNumUnitCode, amountDenominatorValue}),
        // 1..* ingredient
        ingredient: ingredients?.filter(_=>_!==null)
                    ?.map(ingredientItem => CompoundingIngredientItem.buildFHIR(ingredientItem)) 
                    ?? [],
      }
    };
    // 0..1 resource.extension.verpackung
    if (packagingText) {
      fhir.resource.extension.push({
        url: MedicamentProfile.urlPackaging,
        valueString: packagingText
      });
    }
    // 0..1 resource.code.text
    if (medicationText) {
      const text = medicationText;
      Object.assign(fhir.resource.code, {text});
    }
    return fhir;
  },
}

// COMPOUNDING.INGREDIENT ITEM
export const CompoundingIngredientItem = {
  getValuesFromFHIR : (ingredientFHIR) => {
    const values = {};
    Object.assign(values, IngredientExtension.getValuesFromFHIR(ingredientFHIR?.extension));
    Object.assign(values, CompoundingIngredientItemCodeableConcept.getValuesFromFHIR(ingredientFHIR?.itemCodeableConcept));
    Object.assign(values, Strength.getValuesFromFHIR(ingredientFHIR?.strength));
    return values;
  },

  buildEmpty: () => CompoundingIngredientItem.getValuesFromFHIR({}),

  buildFHIR : ({pznCode, pznText, dformText, 
                strengthText, strengthNumeratorValue, 
                strengthNumeratorUnit, strengthDenominatorValue}) => {
    const fhir = {};
    if (dformText) {
      const extension = IngredientExtension.buildFHIR({dformText});
      Object.assign(fhir, {extension}); 
    }
    // 1..1
    const itemCodeableConcept = CompoundingIngredientItemCodeableConcept.buildFHIR({pznCode, pznText});
    // 1..1
    const strength = Strength.buildFHIR({strengthText, strengthNumeratorValue, strengthNumeratorUnit, strengthDenominatorValue});
    Object.assign(fhir, {itemCodeableConcept, strength});
    return fhir;
  }
}

// COMPOUNDING.INGREDIENT ITEM CODEABLE CONCEPT
const CompoundingIngredientItemCodeableConcept = {
  getValuesFromFHIR : (itemCodeableConceptFHIR) => {
    return {
      pznCode: itemCodeableConceptFHIR?.coding?.[0]?.code ?? '',
      pznText: itemCodeableConceptFHIR?.text ?? '',
    };
  },

  buildEmpty: () => CompoundingIngredientItemCodeableConcept.getValuesFromFHIR({}),

  buildFHIR : ({pznCode, pznText}) => {
    const fhir = {};
    if (pznCode) {
      // 0..1 coding
      const coding = [{ system: 'http://fhir.de/CodeSystem/ifa/pzn', code: pznCode }];
      Object.assign(fhir, {coding});
    }
    // 1..1 text
    const text = pznText;
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
    const extension = [];
    if (dformText)
      extension.push(
        // 0..1 darreichungform
        { url: MedicamentProfile.urlIngredientForm,
          valueString: dformText,
        }
      );
    return extension;
  }
}

// AMOUNT
const Amount = {
  getValuesFromFHIR : (amountFHIR) => {
    return {
      amountNumeratorValue:   amountFHIR?.numerator?.extension[0]?.valueString ?? '',
      amountNumeratorUnit:    amountFHIR?.numerator?.unit ?? '',
      amountNumUnitCode:      amountFHIR?.numerator?.code ?? '',
      amountDenominatorValue: amountFHIR?.denominator?.value ?? 1,
    };
  },

  buildEmpty : () => Amount.getValuesFromFHIR({}),

  buildFHIR : ({amountNumeratorValue, amountNumeratorUnit, amountNumUnitCode, amountDenominatorValue}) => {
    const fhir = {
      // 1..1
      numerator:   {
        extension: [
          { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_PackagingSize',
            valueString: amountNumeratorValue.toString()}],
                     unit:  amountNumeratorUnit },
      // 1..1
      denominator: { value: Number(amountDenominatorValue) }
    }
    // 0..1 Amount unit system and code
    if (amountNumUnitCode)
      Object.assign(fhir.numerator, {
        system: 'http://unitsofmeasure.org',
        code: amountNumUnitCode,
      })
    return fhir;
  }
}

// STRENGTH
const Strength = {
  getValuesFromFHIR : (strengthFHIR) => {
    return {
      strengthText:             strengthFHIR?.extension?.[0]?.valueString ?? '',
      strengthNumeratorValue:   strengthFHIR?.numerator?.value ?? '',
      strengthNumeratorUnit:    strengthFHIR?.numerator?.unit ?? '',
      strengthNumUnitCode:      strengthFHIR?.numerator?.code ?? '',
      strengthDenominatorValue: strengthFHIR?.denominator?.value ?? 1,
    };
  },

  buildEmpty : () => Strength.getValuesFromFHIR({}),

  buildFHIR : ({strengthText, strengthNumeratorValue, strengthNumeratorUnit, strengthNumUnitCode, strengthDenominatorValue}) => {
    let fhir;
    if (strengthText)
      fhir = { 
        extension: [
          { url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Ingredient_Amount',
            valueString: strengthText }]}
    else {
      fhir = {
        numerator:   { value: Number(strengthNumeratorValue), 
                       unit:  strengthNumeratorUnit },
        denominator: { value: Number(strengthDenominatorValue) }
      }
      // 0..1 Strength unit system and code
      if (strengthNumUnitCode)
        Object.assign(fhir.numerator, {
          system: 'http://unitsofmeasure.org',
          code: strengthNumUnitCode,
        });
    }
    return fhir;
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
  urlNormgroesse :       'http://fhir.de/StructureDefinition/normgroesse',
  urlPackaging:          'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Packaging',
  urlDosageFlag:         'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_DosageFlag',
  urlIngredientForm:     'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Ingredient_Form',
  urlMedicationCategory: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Category',
  urlVaccine:            'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Vaccine',
  
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
