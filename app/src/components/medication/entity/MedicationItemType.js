export const buildFhirFreeText = function (uuid, medicationText) {
    return {
      fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
      resource: {
        resourceType: 'Medication',
        id: uuid,
        meta: {profile: ['https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_FreeText|1.0.2']},
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
}

export const buildFhirPzn = function (uuid, normgroesseCode, pznCode, pznText, dformCode) {
  return {
    fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
    resource: {
      resourceType: 'Medication',
      id: uuid,
      meta: {profile: ['https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_PZN|1.0.2']},
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
}

buildFhirIngredient('255b49de-6cd5-4ac1-b6fb-c8d0128cf1b3', 'N3', 'Tabletten',
                    [{itemCode:'23816',itemText:'Simvastatin',numeratorValue:20,numeratorUnit:'mg',denominatorValue:1}]
);

export const buildFhirIngredient = function (uuid, normgroesseCode, formText, ingredients) {
  let ingredientsFHIR = ingredients.map(i => {
    let { itemCode, itemText, numeratorValue, numeratorUnit, denominatorValue } = i;
    return {
      itemCodeableConcept: {
        coding: [{ system: 'http://fhir.de/CodeSystem/ask', code: itemCode }],
        text: itemText
      },
      strength: {
        numerator: { value: numeratorValue, unit: numeratorUnit },
        denominator: { value: denominatorValue }
      }
    };
  });

  return {
    fullUrl: 'http://pvs.praxis.local/fhir/Medication/'+uuid,
    resource: {
      resourceType: 'Medication',
      id: uuid,
      meta: { profile: ['https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_Ingredient|1.0.1'] },
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
      ingredient: ingredientsFHIR
    }
  }
}