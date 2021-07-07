export const NewPrescriptionTemplate = `
{
  "resourceType": "Bundle",
  "id": "$BUNDLE_ID",
  "meta": {
    "lastUpdated": "$LAST_UPDATED",
    "profile": [
      "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Bundle|1.0.1"
    ]
  },
  "identifier": {
    "system": "https://gematik.de/fhir/NamingSystem/PrescriptionID",
    "value": "$PRESCRIPTION_ID"
  },
  "type": "document",
  "timestamp": "$TIMESTAMP",
  "entry": [
    {
      "fullUrl": "http://pvs.praxis.local/fhir/Composition/$COMPOSITION_ID",
      "resource": {
        "resourceType": "Composition",
        "id": "$COMPOSITION_ID",
        "meta": {
          "profile": [
            "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Composition|1.0.1"
          ]
        },
        "extension": [
          {
            "url": "https://fhir.kbv.de/StructureDefinition/KBV_EX_FOR_Legal_basis",
            "valueCoding": {
              "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_STATUSKENNZEICHEN",
              "code": "00"
            }
          }
        ],
        "status": "final",
        "type": {
          "coding": [
            {
              "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_FORMULAR_ART",
              "code": "e16A"
            }
          ]
        },
        "subject": {
          "reference": "Patient/$PATIENT_ID"
        },
        "date": "$COMPOSITION_DATE",
        "author": [
          {
            "reference": "Practitioner/$PRACTITIONER_ID",
            "type": "Practitioner"
          },
          {
            "type": "Device",
            "identifier": {
              "system": "https://fhir.kbv.de/NamingSystem/KBV_NS_FOR_Pruefnummer",
              "value": "unused-device-id"
            }
          }
        ],
        "title": "elektronische Arzneimittelverordnung",
        "custodian": {
          "reference": "Organization/$ORGANIZATION_ID"
        },
        "section": [
          {
            "code": {
              "coding": [
                {
                  "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Section_Type",
                  "code": "Prescription"
                }
              ]
            },
            "entry": [
              {
                "reference": "MedicationRequest/$MEDICATION_REQUEST_ID"
              }
            ]
          },
          {
            "code": {
              "coding": [
                {
                  "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Section_Type",
                  "code": "Coverage"
                }
              ]
            },
            "entry": [
              {
                "reference": "Coverage/$COVERAGE_ID"
              }
            ]
          }
        ]
      }
    },
    {
      "fullUrl": "http://pvs.praxis.local/fhir/MedicationRequest/$MEDICATION_REQUEST_ID",
      "resource": {
        "resourceType": "MedicationRequest",
        "id": "$MEDICATION_REQUEST_ID",
        "meta": {
          "profile": [
            "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Prescription|1.0.1"
          ]
        },
        "extension": [
          {
            "url": "https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_StatusCoPayment",
            "valueCoding": {
              "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_StatusCoPayment",
              "code": "0"
            }
          },
          {
            "url": "https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_EmergencyServicesFee",
            "valueBoolean": false
          },
          {
            "url": "https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_BVG",
            "valueBoolean": false
          },
          {
            "url": "https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Multiple_Prescription",
            "extension": [
              {
                "url": "Kennzeichen",
                "valueBoolean": false
              }
            ]
          }
        ],
        "status": "active",
        "intent": "order",
        "medicationReference": {
          "reference": "Medication/$MEDICATION_ID"
        },
        "subject": {
          "reference": "Patient/$PATIENT_ID"
        },
        "authoredOn": "",
        "requester": {
          "reference": "Practitioner/$PRACTITIONER_ID"
        },
        "insurance": [
          {
            "reference": "Coverage/$COVERAGE_ID"
          }
        ],
        "dosageInstruction": [
          {
            "extension": [
              {
                "url": "https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_DosageFlag",
                "valueBoolean": true
              }
            ],
            "text": ""
          }
        ],
        "dispenseRequest": {
          "quantity": {
            "value": 1,
            "system": "http://unitsofmeasure.org",
            "code": "{Package}"
          }
        },
        "substitution": {
          "allowedBoolean": false
        }
      }
    },
    {
      "fullUrl": "http://pvs.praxis.local/fhir/Medication/$MEDICATION_ID",
      "resource": {
        "resourceType": "Medication",
        "id": "$MEDICATION_ID",
        "meta": {
          "profile": [
            "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_PZN|1.0.1"
          ]
        },
        "extension": [
          {
            "url": "https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Category",
            "valueCoding": {
              "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Medication_Category",
              "code": "00"
            }
          },
          {
            "url": "https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_Medication_Vaccine",
            "valueBoolean": false
          },
          {
            "url": "http://fhir.de/StructureDefinition/normgroesse",
            "valueCode": ""
          }
        ],
        "code": {
          "coding": [
            {
              "system": "http://fhir.de/CodeSystem/ifa/pzn",
              "code": ""
            }
          ],
          "text": ""
        },
        "form": {
          "coding": [
            {
              "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_DARREICHUNGSFORM",
              "code": "AEO"
            }
          ]
        }
      }
    },
    {
      "fullUrl": "http://pvs.praxis.local/fhir/Patient/$PATIENT_ID",
      "resource": {
        "resourceType": "Patient",
        "id": "$PATIENT_ID",
        "meta": {
          "profile": [
            "https://fhir.kbv.de/StructureDefinition/KBV_PR_FOR_Patient|1.0.3"
          ]
        },
        "identifier": [
          {
            "type": {
              "coding": [
                {
                  "system": "http://fhir.de/CodeSystem/identifier-type-de-basis",
                  "code": "GKV"
                }
              ]
            },
            "system": "http://fhir.de/NamingSystem/gkv/kvid-10",
            "value": ""
          }
        ],
        "name": [
          {
            "use": "official",
            "family": "",
            "given": [
              ""
            ]
          }
        ],
        "birthDate": "",
        "address": [
          {
            "type": "both",
            "_line": [
              {
                "extension": [
                  {
                    "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-houseNumber",
                    "valueString": ""
                  },
                  {
                    "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-streetName",
                    "valueString": ""
                  }
                ]
              }
            ],
            "city": "",
            "postalCode": "",
            "country": "D"
          }
        ]
      }
    },
    {
      "fullUrl": "http://pvs.praxis.local/fhir/Practitioner/$PRACTITIONER_ID",
      "resource": {
        "resourceType": "Practitioner",
        "id": "$PRACTITIONER_ID",
        "meta": {
          "profile": [
            "https://fhir.kbv.de/StructureDefinition/KBV_PR_FOR_Practitioner|1.0.3"
          ]
        },
        "identifier": [
          {
            "type": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                  "code": "LANR"
                }
              ]
            },
            "system": "https://fhir.kbv.de/NamingSystem/KBV_NS_Base_ANR",
            "value": ""
          }
        ],
        "name": [
          {
            "use": "official",
            "family": "",
            "_family": {
              "extension": [
                {
                  "url": "http://hl7.org/fhir/StructureDefinition/humanname-own-name",
                  "valueString": ""
                }
              ]
            },
            "given": [
              ""
            ]
          }
        ],
        "qualification": [
          {
            "code": {
              "text": "",
              "coding": [
                {
                  "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_FOR_Qualification_Type",
                  "code": "00"
                }
              ]
            }
          }
        ]
      }
    },
    {
      "fullUrl": "http://pvs.praxis.local/fhir/Organization/$ORGANIZATION_ID",
      "resource": {
        "resourceType": "Organization",
        "id": "$ORGANIZATION_ID",
        "meta": {
          "profile": [
            "https://fhir.kbv.de/StructureDefinition/KBV_PR_FOR_Organization|1.0.3"
          ]
        },
        "identifier": [
          {
            "type": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                  "code": "BSNR"
                }
              ]
            },
            "system": "https://fhir.kbv.de/NamingSystem/KBV_NS_Base_BSNR",
            "value": ""
          }
        ],
        "name": "",
        "telecom": [
          {
            "system": "phone",
            "value": ""
          }
        ],
        "address": [
          {
            "type": "both",
            "_line": [
              {
                "extension": [
                  {
                    "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-houseNumber",
                    "valueString": ""
                  },
                  {
                    "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-streetName",
                    "valueString": ""
                  }
                ]
              }
            ],
            "city": "",
            "postalCode": "",
            "country": "D"
          }
        ]
      }
    },
    {
      "fullUrl": "http://pvs.praxis.local/fhir/Coverage/$COVERAGE_ID",
      "resource": {
        "resourceType": "Coverage",
        "id": "$COVERAGE_ID",
        "meta": {
          "profile": [
            "https://fhir.kbv.de/StructureDefinition/KBV_PR_FOR_Coverage|1.0.3"
          ]
        },
        "extension": [
          {
            "url": "http://fhir.de/StructureDefinition/gkv/besondere-personengruppe",
            "valueCoding": {
              "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_PERSONENGRUPPE",
              "code": "00"
            }
          },
          {
            "url": "http://fhir.de/StructureDefinition/gkv/dmp-kennzeichen",
            "valueCoding": {
              "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_DMP",
              "code": "00"
            }
          },
          {
            "url": "http://fhir.de/StructureDefinition/gkv/wop",
            "valueCoding": {
              "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_ITA_WOP",
              "code": ""
            }
          },
          {
            "url": "http://fhir.de/StructureDefinition/gkv/versichertenart",
            "valueCoding": {
              "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_VERSICHERTENSTATUS",
              "code": "1"
            }
          }
        ],
        "status": "active",
        "type": {
          "coding": [
            {
              "system": "http://fhir.de/CodeSystem/versicherungsart-de-basis",
              "code": "GKV"
            }
          ]
        },
        "beneficiary": {
          "reference": "Patient/$PATIENT_ID"
        },
        "payor": [
          {
            "identifier": {
              "system": "http://fhir.de/NamingSystem/arge-ik/iknr",
              "value": ""
            },
            "display": ""
          }
        ]
      }
    }
  ]
}`;