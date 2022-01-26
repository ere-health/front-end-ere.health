let freetext=
{
  fullUrl: 'http://pvs.praxis.local/fhir/Medication/0d93504e-c6a7-47c1-8ad5-b0c5cf1b8920',
  resource: {
    resourceType: 'Medication',
    id: '0d93504e-c6a7-47c1-8ad5-b0c5cf1b8920',
    meta: {
      profile: [
        'https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_FreeText|1.0.2'
      ]
    },
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
      coding: [
        { system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Type',
          code: 'freitext'
        }
      ],
      text: 'Metformin 850mg Tabletten N3'
    }
  }
}