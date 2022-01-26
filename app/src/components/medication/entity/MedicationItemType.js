export const buildFhirFreeText = function (uuid, medicationType, medicationText) {
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
          coding: [{
            system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Type', 
            code: medicationType
          }],
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
        coding: [{ system: 'http://fhir.de/CodeSystem/ifa/pzn', code: pznCode }],
        text: pznText
      },
      form: {
        coding: [{ system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_DARREICHUNGSFORM',
        code: dformCode }]
      }
    }
  }
}