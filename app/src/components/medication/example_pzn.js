let pzn=
{
  fullUrl: 'http://pvs.praxis.local/fhir/Medication/f568397d-7ba2-46ac-904b-02caec933b42',
  resource: {
    resourceType: 'Medication',
    id: 'f568397d-7ba2-46ac-904b-02caec933b42',
    meta: {
        profile: ['https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_PZN|1.0.2']
    },
    extension: [
      {
        url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Category',
        valueCoding: {
          system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Category',
          code: '00'
        }
      },
      {
        url: 'https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Vaccine',
        valueBoolean: false
      },
      {
        url: 'http://fhir.de/StructureDefinition/normgroesse',
        valueCode: 'N1'
      }
    ],
    code: {
      coding: [{system: 'http://fhir.de/CodeSystem/ifa/pzn', code: '08585997'}],
      text: 'Prospan® Hustensaft 100ml N1'
    },
    form: {
      coding: [{system: 'https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_DARREICHUNGSFORM', code: 'FLE'}]
    }
  }
}