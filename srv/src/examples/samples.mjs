export const validBundle = {
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
                "value": "$DEVICE_ID"
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
                "code": "$STATUS_CO_PAYMENT"
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
          "authoredOn": "$AUTHORED_ON",
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
              "text": "$DOSAGE_QUANTITY"
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
            "allowedBoolean": true
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
              "valueCode": "N1"
            }
          ],
          "code": {
            "coding": [
              {
                "system": "http://fhir.de/CodeSystem/ifa/pzn",
                "code": "$PZN"
              }
            ],
            "text": "$MEDICATION_NAME"
          },
          "form": {
            "coding": [
              {
                "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_DARREICHUNGSFORM",
                "code": "FLE"
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
              "value": "$KVID_10"
            }
          ],
          "name": [
            {
              "use": "official",
              "family": "$PATIENT_NAME_FAMILY",
              "given": [
                "$PATIENT_NAME_FIRST"
              ],
              "prefix": [
                "$PATIENT_NAME_PREFIX"
              ]
            }
          ],
          "birthDate": "$PATIENT_BIRTH_DATE",
          "address": [
            {
              "type": "both",
              "line": [
                "$PATIENT_ADDRESS_STREET_NUMBER $PATIENT_ADDRESS_STREET_NAME"
              ],
              "_line": [
                {
                  "extension": [
                    {
                      "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-houseNumber",
                      "valueString": "$PATIENT_ADDRESS_STREET_NUMBER"
                    },
                    {
                      "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-streetName",
                      "valueString": "$PATIENT_ADDRESS_STREET_NAME"
                    }
                  ]
                }
              ],
              "city": "$PATIENT_ADDRESS_CITY",
              "postalCode": "$PATIENT_ADDRESS_POSTAL_CODE",
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
              "value": "456456534"
            }
          ],
          "name": [
            {
              "use": "official",
              "family": "$PRACTITIONER_NAME_FAMILY",
              "_family": {
                "extension": [
                  {
                    "url": "http://hl7.org/fhir/StructureDefinition/humanname-own-name",
                    "valueString": "$PRACTITIONER_NAME_FAMILY"
                  }
                ]
              },
              "given": [
                "$PRACTITIONER_NAME_FIRST"
              ],
              "prefix": [
                "$PRACTITIONER_NAME_PREFIX"
              ],
              "_prefix": [
                {
                  "extension": [
                    {
                      "url": "http://hl7.org/fhir/StructureDefinition/iso21090-EN-qualifier",
                      "valueCode": "AC"
                    }
                  ]
                }
              ]
            }
          ],
          "qualification": [
            {
              "code": {
                "coding": [
                  {
                    "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_FOR_Qualification_Type",
                    "code": "00"
                  }
                ]
              }
            },
            {
              "code": {
                "text": "Arzt-Hausarzt"
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
              "value": "$CLINIC_ID"
            }
          ],
          "name": "Kinderarztpraxis",
          "telecom": [
            {
              "system": "phone",
              "value": "$PRACTITIONER_PHONE"
            }
          ],
          "address": [
            {
              "type": "both",
              "line": [
                "$PRACTITIONER_ADDRESS_STREET_NAME $PRACTITIONER_ADDRESS_STREET_NUMBER"
              ],
              "_line": [
                {
                  "extension": [
                    {
                      "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-houseNumber",
                      "valueString": "$PRACTITIONER_ADDRESS_STREET_NUMBER"
                    },
                    {
                      "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-streetName",
                      "valueString": "$PRACTITIONER_ADDRESS_STREET_NAME"
                    }
                  ]
                }
              ],
              "city": "$PRACTITIONER_ADDRESS_CITY",
              "postalCode": "$PRACTITIONER_ADDRESS_POSTAL_CODE",
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
                "code": "72"
              }
            },
            {
              "url": "http://fhir.de/StructureDefinition/gkv/versichertenart",
              "valueCoding": {
                "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_VERSICHERTENSTATUS",
                "code": "3"
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
          "period": {
            "end": "$COVERAGE_PERIOD_END"
          },
          "payor": [
            {
              "identifier": {
                "system": "http://fhir.de/NamingSystem/arge-ik/iknr",
                "value": "$COVERAGE_ID"
              },
              "display": "$INSURANCE_NAME"
            }
          ]
        }
      }
    ]
  }
  ;

export const json01 = {
    "resourceType": "Bundle",
    "id": "14f3cff7-f921-429e-98ca-c65dcb367ba9",
    "meta": {
        "lastUpdated": "2021-04-06T08:30:00Z",
        "profile":  [
            "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Bundle|1.0.1"
        ]
    },
    "identifier": {
        "system": "https://gematik.de/fhir/NamingSystem/PrescriptionID",
        "value": "160.100.000.000.011.09"
    },
    "type": "document",
    "timestamp": "2021-04-06T08:30:00Z",
    "entry":  [
        {
            "fullUrl": "http://pvs.praxis.local/fhir/Composition/8068fd3c-6eed-4b58-9840-c0661e48b6a9",
            "resource": {
                "resourceType": "Composition",
                "id": "8068fd3c-6eed-4b58-9840-c0661e48b6a9",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Composition|1.0.1"
                    ]
                },
                "extension":  [
                    {
                        "url": "https://fhir.kbv.de/StructureDefinition/KBV_EX_FOR_Legal_basis",
                        "valueCoding": {
                            "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_STATUSKENNZEICHEN",
                            "code": "04"
                        }
                    }
                ],
                "status": "final",
                "type": {
                    "coding":  [
                        {
                            "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_FORMULAR_ART",
                            "code": "e16A"
                        }
                    ]
                },
                "subject": {
                    "reference": "Patient/c9e9eeb8-e397-4d62-a977-656a18027f90"
                },
                "date": "2021-04-06T08:00:00Z",
                "author":  [
                    {
                        "reference": "Practitioner/d8ac97db-249d-4f14-8c9b-861f8b93ca76",
                        "type": "Practitioner"
                    },
                    {
                        "type": "Device",
                        "identifier": {
                            "system": "https://fhir.kbv.de/NamingSystem/KBV_NS_FOR_Pruefnummer",
                            "value": "Y/410/2107/36/999"
                        }
                    }
                ],
                "title": "elektronische Arzneimittelverordnung",
                "custodian": {
                    "reference": "Organization/d55c6c01-057b-483d-a1eb-2bd1e182551f"
                },
                "section":  [
                    {
                        "code": {
                            "coding":  [
                                {
                                    "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Section_Type",
                                    "code": "Prescription"
                                }
                            ]
                        },
                        "entry":  [
                            {
                                "reference": "MedicationRequest/fe73acaf-c683-460d-9961-3ae6f87068f2"
                            }
                        ]
                    },
                    {
                        "code": {
                            "coding":  [
                                {
                                    "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Section_Type",
                                    "code": "Coverage"
                                }
                            ]
                        },
                        "entry":  [
                            {
                                "reference": "Coverage/914e46d1-95a2-44c7-b900-5ca4ee80b8d5"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "fullUrl": "http://pvs.praxis.local/fhir/MedicationRequest/fe73acaf-c683-460d-9961-3ae6f87068f2",
            "resource": {
                "resourceType": "MedicationRequest",
                "id": "fe73acaf-c683-460d-9961-3ae6f87068f2",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Prescription|1.0.1"
                    ]
                },
                "extension":  [
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
                        "extension":  [
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
                    "reference": "Medication/c1e7027e-3c5b-4e87-a10a-572676b92e22"
                },
                "subject": {
                    "reference": "Patient/c9e9eeb8-e397-4d62-a977-656a18027f90"
                },
                "authoredOn": "2021-04-03",
                "requester": {
                    "reference": "Practitioner/d8ac97db-249d-4f14-8c9b-861f8b93ca76"
                },
                "insurance":  [
                    {
                        "reference": "Coverage/914e46d1-95a2-44c7-b900-5ca4ee80b8d5"
                    }
                ],
                "dosageInstruction":  [
                    {
                        "extension":  [
                            {
                                "url": "https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_DosageFlag",
                                "valueBoolean": true
                            }
                        ],
                        "text": "1-0-0-0"
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
                    "allowedBoolean": true
                }
            }
        },
        {
            "fullUrl": "http://pvs.praxis.local/fhir/Medication/c1e7027e-3c5b-4e87-a10a-572676b92e22",
            "resource": {
                "resourceType": "Medication",
                "id": "c1e7027e-3c5b-4e87-a10a-572676b92e22",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_PZN|1.0.1"
                    ]
                },
                "extension":  [
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
                        "valueCode": "N1"
                    }
                ],
                "code": {
                    "coding":  [
                        {
                            "system": "http://fhir.de/CodeSystem/ifa/pzn",
                            "code": "04773414"
                        }
                    ],
                    "text": "Doxycyclin AL 200 T, 10 Tabletten N1"
                },
                "form": {
                    "coding":  [
                        {
                            "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_DARREICHUNGSFORM",
                            "code": "TAB"
                        }
                    ]
                },
                "amount": {
                    "numerator": {
                        "value": 10,
                        "unit": "Tabletten",
                        "system": "http://unitsofmeasure.org",
                        "code": "{tbl}"
                    },
                    "denominator": {
                        "value": 1
                    }
                }
            }
        },
        {
            "fullUrl": "http://pvs.praxis.local/fhir/Patient/c9e9eeb8-e397-4d62-a977-656a18027f90",
            "resource": {
                "resourceType": "Patient",
                "id": "c9e9eeb8-e397-4d62-a977-656a18027f90",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_FOR_Patient|1.0.3"
                    ]
                },
                "identifier":  [
                    {
                        "type": {
                            "coding":  [
                                {
                                    "system": "http://fhir.de/CodeSystem/identifier-type-de-basis",
                                    "code": "GKV"
                                }
                            ]
                        },
                        "system": "http://fhir.de/NamingSystem/gkv/kvid-10",
                        "value": "P223331975"
                    }
                ],
                "name":  [
                    {
                        "use": "official",
                        "family": "Pan",
                        "_family": {
                            "extension":  [
                                {
                                    "url": "http://hl7.org/fhir/StructureDefinition/humanname-own-name",
                                    "valueString": "Pan"
                                }
                            ]
                        },
                        "given":  [
                            "Peter"
                        ]
                    }
                ],
                "birthDate": "1972",
                "address":  [
                    {
                        "type": "both",
                        "line":  [
                            "Siebengebirgsstraße 59",
                            "33. Obergeschoss - Hinterhof, halbrechts"
                        ],
                        "_line":  [
                            {
                                "extension":  [
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-houseNumber",
                                        "valueString": "59"
                                    },
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-streetName",
                                        "valueString": "Siebengebirgsstraße"
                                    }
                                ]
                            },
                            {
                                "extension":  [
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-additionalLocator",
                                        "valueString": "33. Obergeschoss - Hinterhof, halbrechts"
                                    }
                                ]
                            }
                        ],
                        "city": "Königswinter",
                        "postalCode": "53639",
                        "country": "D"
                    }
                ]
            }
        },
        {
            "fullUrl": "http://pvs.praxis.local/fhir/Practitioner/d8ac97db-249d-4f14-8c9b-861f8b93ca76",
            "resource": {
                "resourceType": "Practitioner",
                "id": "d8ac97db-249d-4f14-8c9b-861f8b93ca76",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_FOR_Practitioner|1.0.3"
                    ]
                },
                "identifier":  [
                    {
                        "type": {
                            "coding":  [
                                {
                                    "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                    "code": "LANR"
                                }
                            ]
                        },
                        "system": "https://fhir.kbv.de/NamingSystem/KBV_NS_Base_ANR",
                        "value": "159753527"
                    }
                ],
                "name":  [
                    {
                        "use": "official",
                        "family": "Meyer",
                        "_family": {
                            "extension":  [
                                {
                                    "url": "http://hl7.org/fhir/StructureDefinition/humanname-own-name",
                                    "valueString": "Meyer"
                                }
                            ]
                        },
                        "given":  [
                            "Mia"
                        ],
                        "prefix":  [
                            "Dr."
                        ],
                        "_prefix":  [
                            {
                                "extension":  [
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-EN-qualifier",
                                        "valueCode": "AC"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "qualification":  [
                    {
                        "code": {
                            "coding":  [
                                {
                                    "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_FOR_Qualification_Type",
                                    "code": "00"
                                }
                            ]
                        }
                    },
                    {
                        "code": {
                            "text": "Fachärztin der Onkologie"
                        }
                    }
                ]
            }
        },
        {
            "fullUrl": "http://pvs.praxis.local/fhir/Organization/d55c6c01-057b-483d-a1eb-2bd1e182551f",
            "resource": {
                "resourceType": "Organization",
                "id": "d55c6c01-057b-483d-a1eb-2bd1e182551f",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_FOR_Organization|1.0.3"
                    ]
                },
                "identifier":  [
                    {
                        "type": {
                            "coding":  [
                                {
                                    "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                    "code": "BSNR"
                                }
                            ]
                        },
                        "system": "https://fhir.kbv.de/NamingSystem/KBV_NS_Base_BSNR",
                        "value": "757299999"
                    }
                ],
                "name": "Krankenhaus",
                "telecom":  [
                    {
                        "system": "phone",
                        "value": "0309876543"
                    },
                    {
                        "system": "email",
                        "value": "krankenhaus@e-mail.de"
                    }
                ],
                "address":  [
                    {
                        "type": "both",
                        "line":  [
                            "Wegelystraße 3"
                        ],
                        "_line":  [
                            {
                                "extension":  [
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-houseNumber",
                                        "valueString": "3"
                                    },
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-streetName",
                                        "valueString": "Wegelystraße"
                                    }
                                ]
                            }
                        ],
                        "city": "Berlin",
                        "postalCode": "10623",
                        "country": "D"
                    }
                ]
            }
        },
        {
            "fullUrl": "http://pvs.praxis.local/fhir/Coverage/914e46d1-95a2-44c7-b900-5ca4ee80b8d5",
            "resource": {
                "resourceType": "Coverage",
                "id": "914e46d1-95a2-44c7-b900-5ca4ee80b8d5",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_FOR_Coverage|1.0.3"
                    ]
                },
                "extension":  [
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
                            "code": "38"
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
                    "coding":  [
                        {
                            "system": "http://fhir.de/CodeSystem/versicherungsart-de-basis",
                            "code": "GKV"
                        }
                    ]
                },
                "beneficiary": {
                    "reference": "Patient/c9e9eeb8-e397-4d62-a977-656a18027f90"
                },
                "payor":  [
                    {
                        "identifier": {
                            "system": "http://fhir.de/NamingSystem/arge-ik/iknr",
                            "value": "101377508"
                        },
                        "display": "Techniker-Krankenkasse"
                    }
                ]
            }
        }
    ]
}

export const json02 = {
    "resourceType": "Bundle",
    "id": "0428d416-149e-48a4-977c-394887b3d85c",
    "meta": {
        "lastUpdated": "2021-04-06T08:30:00Z",
        "profile":  [
            "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Bundle|1.0.1"
        ]
    },
    "identifier": {
        "system": "https://gematik.de/fhir/NamingSystem/PrescriptionID",
        "value": "160.100.000.000.002.36"
    },
    "type": "document",
    "timestamp": "2021-04-06T08:30:00Z",
    "entry":  [
        {
            "fullUrl": "http://pvs.praxis.local/fhir/Composition/a054c2f3-0123-4d33-a0b3-bedec2f7d1ea",
            "resource": {
                "resourceType": "Composition",
                "id": "a054c2f3-0123-4d33-a0b3-bedec2f7d1ea",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Composition|1.0.1"
                    ]
                },
                "extension":  [
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
                    "coding":  [
                        {
                            "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_FORMULAR_ART",
                            "code": "e16A"
                        }
                    ]
                },
                "subject": {
                    "reference": "Patient/512ab5bc-a7ab-4fd7-81cc-16a594f747a6"
                },
                "date": "2021-04-05T08:00:00Z",
                "author":  [
                    {
                        "reference": "Practitioner/e33d2afd-44c8-462b-80e5-52dbe5ebf359",
                        "type": "Practitioner"
                    },
                    {
                        "type": "Device",
                        "identifier": {
                            "system": "https://fhir.kbv.de/NamingSystem/KBV_NS_FOR_Pruefnummer",
                            "value": "Y/410/2107/36/999"
                        }
                    }
                ],
                "title": "elektronische Arzneimittelverordnung",
                "custodian": {
                    "reference": "Organization/d2b30a70-9830-4968-ab97-688472b6f9a3"
                },
                "section":  [
                    {
                        "code": {
                            "coding":  [
                                {
                                    "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Section_Type",
                                    "code": "Prescription"
                                }
                            ]
                        },
                        "entry":  [
                            {
                                "reference": "MedicationRequest/06dc1594-509a-4f4c-ada7-dfd477a02d86"
                            }
                        ]
                    },
                    {
                        "code": {
                            "coding":  [
                                {
                                    "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Section_Type",
                                    "code": "Coverage"
                                }
                            ]
                        },
                        "entry":  [
                            {
                                "reference": "Coverage/df0f2536-97b9-4bae-99cc-83ba2e8371e4"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "fullUrl": "http://pvs.praxis.local/fhir/MedicationRequest/06dc1594-509a-4f4c-ada7-dfd477a02d86",
            "resource": {
                "resourceType": "MedicationRequest",
                "id": "06dc1594-509a-4f4c-ada7-dfd477a02d86",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Prescription|1.0.1"
                    ]
                },
                "extension":  [
                    {
                        "url": "https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_StatusCoPayment",
                        "valueCoding": {
                            "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_StatusCoPayment",
                            "code": "1"
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
                        "extension":  [
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
                    "reference": "Medication/f568397d-7ba2-46ac-904b-02caec933b42"
                },
                "subject": {
                    "reference": "Patient/512ab5bc-a7ab-4fd7-81cc-16a594f747a6"
                },
                "authoredOn": "2020-04-06",
                "requester": {
                    "reference": "Practitioner/e33d2afd-44c8-462b-80e5-52dbe5ebf359"
                },
                "insurance":  [
                    {
                        "reference": "Coverage/df0f2536-97b9-4bae-99cc-83ba2e8371e4"
                    }
                ],
                "dosageInstruction":  [
                    {
                        "extension":  [
                            {
                                "url": "https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_DosageFlag",
                                "valueBoolean": true
                            }
                        ],
                        "text": "2mal tägl. 5ml"
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
                    "allowedBoolean": true
                }
            }
        },
        {
            "fullUrl": "http://pvs.praxis.local/fhir/Medication/f568397d-7ba2-46ac-904b-02caec933b42",
            "resource": {
                "resourceType": "Medication",
                "id": "f568397d-7ba2-46ac-904b-02caec933b42",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_PZN|1.0.1"
                    ]
                },
                "extension":  [
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
                        "valueCode": "N1"
                    }
                ],
                "code": {
                    "coding":  [
                        {
                            "system": "http://fhir.de/CodeSystem/ifa/pzn",
                            "code": "08585997"
                        }
                    ],
                    "text": "Prospan® Hustensaft 100ml N1"
                },
                "form": {
                    "coding":  [
                        {
                            "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_DARREICHUNGSFORM",
                            "code": "FLE"
                        }
                    ]
                }
            }
        },
        {
            "fullUrl": "http://pvs.praxis.local/fhir/Patient/512ab5bc-a7ab-4fd7-81cc-16a594f747a6",
            "resource": {
                "resourceType": "Patient",
                "id": "512ab5bc-a7ab-4fd7-81cc-16a594f747a6",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_FOR_Patient|1.0.3"
                    ]
                },
                "identifier":  [
                    {
                        "type": {
                            "coding":  [
                                {
                                    "system": "http://fhir.de/CodeSystem/identifier-type-de-basis",
                                    "code": "GKV"
                                }
                            ]
                        },
                        "system": "http://fhir.de/NamingSystem/gkv/kvid-10",
                        "value": "M310119800"
                    }
                ],
                "name":  [
                    {
                        "use": "official",
                        "family": "Erbprinzessin",
                        "_family": {
                            "extension":  [
                                {
                                    "url": "http://fhir.de/StructureDefinition/humanname-namenszusatz",
                                    "valueString": "Erbprinzessin"
                                },
                                {
                                    "url": "http://hl7.org/fhir/StructureDefinition/humanname-own-prefix",
                                    "valueString": "von und zu der"
                                },
                                {
                                    "url": "http://hl7.org/fhir/StructureDefinition/humanname-own-name",
                                    "valueString": "Schimmelpfennig-Hammerschmidt Federmannssohn"
                                }
                            ]
                        },
                        "given":  [
                            "Ingrid"
                        ]
                    }
                ],
                "birthDate": "2010-01-31",
                "address":  [
                    {
                        "type": "both",
                        "line":  [
                            "Anneliese- und Georg-von-Groscurth-Plaetzchen 149-C",
                            "5. OG - Hinterhof"
                        ],
                        "_line":  [
                            {
                                "extension":  [
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-houseNumber",
                                        "valueString": "149-C"
                                    },
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-streetName",
                                        "valueString": "Anneliese- und Georg-von-Groscurth-Plaetzchen"
                                    }
                                ]
                            },
                            {
                                "extension":  [
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-additionalLocator",
                                        "valueString": "5. OG - Hinterhof"
                                    }
                                ]
                            }
                        ],
                        "city": "Bad Homburg",
                        "postalCode": "60437",
                        "country": "D"
                    }
                ]
            }
        },
        {
            "fullUrl": "http://pvs.praxis.local/fhir/Practitioner/e33d2afd-44c8-462b-80e5-52dbe5ebf359",
            "resource": {
                "resourceType": "Practitioner",
                "id": "e33d2afd-44c8-462b-80e5-52dbe5ebf359",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_FOR_Practitioner|1.0.3"
                    ]
                },
                "identifier":  [
                    {
                        "type": {
                            "coding":  [
                                {
                                    "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                    "code": "LANR"
                                }
                            ]
                        },
                        "system": "https://fhir.kbv.de/NamingSystem/KBV_NS_Base_ANR",
                        "value": "456456534"
                    }
                ],
                "name":  [
                    {
                        "use": "official",
                        "family": "Weber",
                        "_family": {
                            "extension":  [
                                {
                                    "url": "http://hl7.org/fhir/StructureDefinition/humanname-own-name",
                                    "valueString": "Weber"
                                }
                            ]
                        },
                        "given":  [
                            "Maximilian"
                        ],
                        "prefix":  [
                            "Dr."
                        ],
                        "_prefix":  [
                            {
                                "extension":  [
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-EN-qualifier",
                                        "valueCode": "AC"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "qualification":  [
                    {
                        "code": {
                            "coding":  [
                                {
                                    "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_FOR_Qualification_Type",
                                    "code": "00"
                                }
                            ]
                        }
                    },
                    {
                        "code": {
                            "text": "Facharzt für Kinder- und Jugendmedizin"
                        }
                    }
                ]
            }
        },
        {
            "fullUrl": "http://pvs.praxis.local/fhir/Organization/d2b30a70-9830-4968-ab97-688472b6f9a3",
            "resource": {
                "resourceType": "Organization",
                "id": "d2b30a70-9830-4968-ab97-688472b6f9a3",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_FOR_Organization|1.0.3"
                    ]
                },
                "identifier":  [
                    {
                        "type": {
                            "coding":  [
                                {
                                    "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                    "code": "BSNR"
                                }
                            ]
                        },
                        "system": "https://fhir.kbv.de/NamingSystem/KBV_NS_Base_BSNR",
                        "value": "687777700"
                    }
                ],
                "name": "Kinderarztpraxis",
                "telecom":  [
                    {
                        "system": "phone",
                        "value": "09411234567"
                    }
                ],
                "address":  [
                    {
                        "type": "both",
                        "line":  [
                            "Yorckstraße 15",
                            "Hinterhaus"
                        ],
                        "_line":  [
                            {
                                "extension":  [
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-houseNumber",
                                        "valueString": "15"
                                    },
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-streetName",
                                        "valueString": "Yorckstraße"
                                    }
                                ]
                            },
                            {
                                "extension":  [
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-additionalLocator",
                                        "valueString": "Hinterhaus"
                                    }
                                ]
                            }
                        ],
                        "city": "Regensburg",
                        "postalCode": "93049",
                        "country": "D"
                    }
                ]
            }
        },
        {
            "fullUrl": "http://pvs.praxis.local/fhir/Coverage/df0f2536-97b9-4bae-99cc-83ba2e8371e4",
            "resource": {
                "resourceType": "Coverage",
                "id": "df0f2536-97b9-4bae-99cc-83ba2e8371e4",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_FOR_Coverage|1.0.3"
                    ]
                },
                "extension":  [
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
                            "code": "72"
                        }
                    },
                    {
                        "url": "http://fhir.de/StructureDefinition/gkv/versichertenart",
                        "valueCoding": {
                            "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_VERSICHERTENSTATUS",
                            "code": "3"
                        }
                    }
                ],
                "status": "active",
                "type": {
                    "coding":  [
                        {
                            "system": "http://fhir.de/CodeSystem/versicherungsart-de-basis",
                            "code": "GKV"
                        }
                    ]
                },
                "beneficiary": {
                    "reference": "Patient/512ab5bc-a7ab-4fd7-81cc-16a594f747a6"
                },
                "period": {
                    "end": "2040-04-01"
                },
                "payor":  [
                    {
                        "identifier": {
                            "system": "http://fhir.de/NamingSystem/arge-ik/iknr",
                            "value": "108416214"
                        },
                        "display": "AOK Bayern"
                    }
                ]
            }
        }
    ]
}

export const json03 = {
    "resourceType": "Bundle",
    "id": "15da065c-5b75-4acf-a2ba-1355de821d6e",
    "meta": {
        "lastUpdated": "2021-04-06T08:30:00Z",
        "profile":  [
            "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Bundle|1.0.1"
        ]
    },
    "identifier": {
        "system": "https://gematik.de/fhir/NamingSystem/PrescriptionID",
        "value": "160.100.000.000.017.88"
    },
    "type": "document",
    "timestamp": "2021-04-06T08:30:00Z",
    "entry":  [
        {
            "fullUrl": "http://pvs.praxis.local/fhir/Composition/f62c91e7-e280-4d32-961b-b07168ab47d7",
            "resource": {
                "resourceType": "Composition",
                "id": "f62c91e7-e280-4d32-961b-b07168ab47d7",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Composition|1.0.1"
                    ]
                },
                "extension":  [
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
                    "coding":  [
                        {
                            "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_FORMULAR_ART",
                            "code": "e16A"
                        }
                    ]
                },
                "subject": {
                    "reference": "Patient/ce4104af-b86b-4664-afee-1b5fc3ac8acf"
                },
                "date": "2021-04-06T08:00:00Z",
                "author":  [
                    {
                        "reference": "Practitioner/667ffd79-42a3-4002-b7ca-6b9098f20ccb",
                        "type": "Practitioner"
                    },
                    {
                        "type": "Device",
                        "identifier": {
                            "system": "https://fhir.kbv.de/NamingSystem/KBV_NS_FOR_Pruefnummer",
                            "value": "Y/410/2107/36/999"
                        }
                    }
                ],
                "title": "elektronische Arzneimittelverordnung",
                "custodian": {
                    "reference": "Organization/5d3f4ac0-2b44-4d48-b363-e63efa72973b"
                },
                "section":  [
                    {
                        "code": {
                            "coding":  [
                                {
                                    "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Section_Type",
                                    "code": "Prescription"
                                }
                            ]
                        },
                        "entry":  [
                            {
                                "reference": "MedicationRequest/1e923204-6866-4030-a460-2ce5bd9db26b"
                            }
                        ]
                    },
                    {
                        "code": {
                            "coding":  [
                                {
                                    "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_ERP_Section_Type",
                                    "code": "Coverage"
                                }
                            ]
                        },
                        "entry":  [
                            {
                                "reference": "Coverage/da80211e-61ee-458e-a651-87370b6ec30c"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "fullUrl": "http://pvs.praxis.local/fhir/MedicationRequest/1e923204-6866-4030-a460-2ce5bd9db26b",
            "resource": {
                "resourceType": "MedicationRequest",
                "id": "1e923204-6866-4030-a460-2ce5bd9db26b",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Prescription|1.0.1"
                    ]
                },
                "extension":  [
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
                        "extension":  [
                            {
                                "url": "Kennzeichen",
                                "valueBoolean": true
                            },
                            {
                                "url": "Nummerierung",
                                "valueRatio": {
                                    "numerator": {
                                        "value": 4
                                    },
                                    "denominator": {
                                        "value": 4
                                    }
                                }
                            },
                            {
                                "url": "Zeitraum",
                                "valuePeriod": {
                                    "start": "2021-12-01",
                                    "end": "2022-03-31"
                                }
                            }
                        ]
                    }
                ],
                "status": "active",
                "intent": "order",
                "medicationReference": {
                    "reference": "Medication/07c10a67-2ece-4d5d-9394-633e07c9656d"
                },
                "subject": {
                    "reference": "Patient/ce4104af-b86b-4664-afee-1b5fc3ac8acf"
                },
                "authoredOn": "2021-04-01",
                "requester": {
                    "reference": "Practitioner/667ffd79-42a3-4002-b7ca-6b9098f20ccb"
                },
                "insurance":  [
                    {
                        "reference": "Coverage/da80211e-61ee-458e-a651-87370b6ec30c"
                    }
                ],
                "dosageInstruction":  [
                    {
                        "extension":  [
                            {
                                "url": "https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_DosageFlag",
                                "valueBoolean": false
                            }
                        ]
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
            "fullUrl": "http://pvs.praxis.local/fhir/Medication/07c10a67-2ece-4d5d-9394-633e07c9656d",
            "resource": {
                "resourceType": "Medication",
                "id": "07c10a67-2ece-4d5d-9394-633e07c9656d",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_PZN|1.0.1"
                    ]
                },
                "extension":  [
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
                        "valueCode": "N3"
                    }
                ],
                "code": {
                    "coding":  [
                        {
                            "system": "http://fhir.de/CodeSystem/ifa/pzn",
                            "code": "02532741"
                        }
                    ],
                    "text": "L-Thyroxin Henning 75 100 Tbl. N3"
                },
                "form": {
                    "coding":  [
                        {
                            "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_DARREICHUNGSFORM",
                            "code": "TAB"
                        }
                    ]
                }
            }
        },
        {
            "fullUrl": "http://pvs.praxis.local/fhir/Patient/ce4104af-b86b-4664-afee-1b5fc3ac8acf",
            "resource": {
                "resourceType": "Patient",
                "id": "ce4104af-b86b-4664-afee-1b5fc3ac8acf",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_FOR_Patient|1.0.3"
                    ]
                },
                "identifier":  [
                    {
                        "type": {
                            "coding":  [
                                {
                                    "system": "http://fhir.de/CodeSystem/identifier-type-de-basis",
                                    "code": "GKV"
                                }
                            ]
                        },
                        "system": "http://fhir.de/NamingSystem/gkv/kvid-10",
                        "value": "K030182229"
                    }
                ],
                "name":  [
                    {
                        "use": "official",
                        "family": "Kluge",
                        "_family": {
                            "extension":  [
                                {
                                    "url": "http://hl7.org/fhir/StructureDefinition/humanname-own-name",
                                    "valueString": "Kluge"
                                }
                            ]
                        },
                        "given":  [
                            "Eva"
                        ],
                        "prefix":  [
                            "Prof. Dr. Dr. med"
                        ],
                        "_prefix":  [
                            {
                                "extension":  [
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-EN-qualifier",
                                        "valueCode": "AC"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "birthDate": "1982-01-03",
                "address":  [
                    {
                        "type": "both",
                        "line":  [
                            "Pflasterhofweg 111B"
                        ],
                        "_line":  [
                            {
                                "extension":  [
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-houseNumber",
                                        "valueString": "111B"
                                    },
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-streetName",
                                        "valueString": "Pflasterhofweg"
                                    }
                                ]
                            }
                        ],
                        "city": "Köln",
                        "postalCode": "50999",
                        "country": "D"
                    }
                ]
            }
        },
        {
            "fullUrl": "http://pvs.praxis.local/fhir/Practitioner/667ffd79-42a3-4002-b7ca-6b9098f20ccb",
            "resource": {
                "resourceType": "Practitioner",
                "id": "667ffd79-42a3-4002-b7ca-6b9098f20ccb",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_FOR_Practitioner|1.0.3"
                    ]
                },
                "identifier":  [
                    {
                        "type": {
                            "coding":  [
                                {
                                    "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                    "code": "LANR"
                                }
                            ]
                        },
                        "system": "https://fhir.kbv.de/NamingSystem/KBV_NS_Base_ANR",
                        "value": "987654423"
                    }
                ],
                "name":  [
                    {
                        "use": "official",
                        "family": "Schneider",
                        "_family": {
                            "extension":  [
                                {
                                    "url": "http://hl7.org/fhir/StructureDefinition/humanname-own-name",
                                    "valueString": "Schneider"
                                }
                            ]
                        },
                        "given":  [
                            "Emma"
                        ],
                        "prefix":  [
                            "Dr. med."
                        ],
                        "_prefix":  [
                            {
                                "extension":  [
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-EN-qualifier",
                                        "valueCode": "AC"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "qualification":  [
                    {
                        "code": {
                            "coding":  [
                                {
                                    "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_FOR_Qualification_Type",
                                    "code": "00"
                                }
                            ]
                        }
                    },
                    {
                        "code": {
                            "text": "Fachärztin für Innere Medizin"
                        }
                    }
                ]
            }
        },
        {
            "fullUrl": "http://pvs.praxis.local/fhir/Organization/5d3f4ac0-2b44-4d48-b363-e63efa72973b",
            "resource": {
                "resourceType": "Organization",
                "id": "5d3f4ac0-2b44-4d48-b363-e63efa72973b",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_FOR_Organization|1.0.3"
                    ]
                },
                "identifier":  [
                    {
                        "type": {
                            "coding":  [
                                {
                                    "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                    "code": "BSNR"
                                }
                            ]
                        },
                        "system": "https://fhir.kbv.de/NamingSystem/KBV_NS_Base_BSNR",
                        "value": "721111100"
                    }
                ],
                "name": "MVZ",
                "telecom":  [
                    {
                        "system": "phone",
                        "value": "0301234567"
                    },
                    {
                        "system": "fax",
                        "value": "030123456789"
                    },
                    {
                        "system": "email",
                        "value": "mvz@e-mail.de"
                    }
                ],
                "address":  [
                    {
                        "type": "both",
                        "line":  [
                            "Herbert-Lewin-Platz 2"
                        ],
                        "_line":  [
                            {
                                "extension":  [
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-houseNumber",
                                        "valueString": "2"
                                    },
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-streetName",
                                        "valueString": "Herbert-Lewin-Platz"
                                    }
                                ]
                            }
                        ],
                        "city": "Berlin",
                        "postalCode": "10623",
                        "country": "D"
                    }
                ]
            }
        },
        {
            "fullUrl": "http://pvs.praxis.local/fhir/Coverage/da80211e-61ee-458e-a651-87370b6ec30c",
            "resource": {
                "resourceType": "Coverage",
                "id": "da80211e-61ee-458e-a651-87370b6ec30c",
                "meta": {
                    "profile":  [
                        "https://fhir.kbv.de/StructureDefinition/KBV_PR_FOR_Coverage|1.0.3"
                    ]
                },
                "extension":  [
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
                            "code": "38"
                        }
                    },
                    {
                        "url": "http://fhir.de/StructureDefinition/gkv/versichertenart",
                        "valueCoding": {
                            "system": "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_VERSICHERTENSTATUS",
                            "code": "3"
                        }
                    }
                ],
                "status": "active",
                "type": {
                    "coding":  [
                        {
                            "system": "http://fhir.de/CodeSystem/versicherungsart-de-basis",
                            "code": "GKV"
                        }
                    ]
                },
                "beneficiary": {
                    "reference": "Patient/ce4104af-b86b-4664-afee-1b5fc3ac8acf"
                },
                "payor":  [
                    {
                        "identifier": {
                            "system": "http://fhir.de/NamingSystem/arge-ik/iknr",
                            "value": "109777509"
                        },
                        "display": "Techniker-Krankenkasse"
                    }
                ]
            }
        }
    ]
}