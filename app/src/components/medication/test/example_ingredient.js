let ingredient =
{
  fullUrl: 'http://pvs.praxis.local/fhir/Medication/255b49de-6cd5-4ac1-b6fb-c8d0128cf1b3',
  resource: {
    resourceType: 'Medication',
    id: '255b49de-6cd5-4ac1-b6fb-c8d0128cf1b3',
    meta: {profile: ['https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_Ingredient|1.0.1']},
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
        valueCode: 'N3'
      }
    ],
    code: {
      coding: [{ system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Type', code: 'wirkstoff'}]
    },
    form: { text: 'Tabletten' },
    ingredient: [{
        itemCodeableConcept: {
          coding: [{ system: 'http://fhir.de/CodeSystem/ask', code: '23816' }],
          text: 'Simvastatin'
        },
        strength: {
          numerator: { value: 20, unit: 'mg'
          },
          denominator: { value: 1 }
        }
    }]
  }
}