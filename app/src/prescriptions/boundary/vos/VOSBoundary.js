import {addPrescription} from "../../control/UnsignedPrescriptionControl.js";


export default function loadVosBundleAndConvertToPrescriptionBundle(url) {
    fetch(url).then(r => r.text()).then(fhirXml => {
        try {
            const fhir = new Fhir.Fhir();
            const vosBundle = JSON.parse(fhir.xmlToJson(fhirXml));
            const eRezeptBundle = convertVosBundleToERezeptBundle(vosBundle);
            addPrescription([eRezeptBundle]);
        } catch(e) {
            alert("Could not load bundle from PVS: "+e);
        }
    });
};
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function convertVosBundleToERezeptBundle(vosBundle) {
    const patientResource = vosBundle.entry.filter(o => o.resource.resourceType == "Patient")[0].resource;
    const practitionerResource = vosBundle.entry.filter(o => o.resource.resourceType == "Practitioner")[0].resource;
    const organizationResource = vosBundle.entry.filter(o => o.resource.resourceType == "Organization")[0].resource;
    const coverageResource = vosBundle.entry.filter(o => o.resource.resourceType == "Coverage")[0].resource;
    const deviceResource = vosBundle.entry.filter(o => o.resource.resourceType == "Device")[0].resource;

    const compositionId = uuidv4();
    const medicationRequestId = uuidv4();
    const medicationId = uuidv4();
    return {
        "resourceType": "Bundle",
        "id": uuidv4(),
        "meta": {
            "lastUpdated": new Date().toISOString(),
            "profile":  [
                "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Bundle|1.0.1"
            ]
        },
        "identifier": {
            "system": "https://gematik.de/fhir/NamingSystem/PrescriptionID",
            "value": "160.100.000.000.011.09"
        },
        "type": "document",
        "timestamp": new Date().toISOString(),
        "entry":  [
            {
                "fullUrl": "http://pvs.praxis.local/fhir/Composition/"+compositionId,
                "resource": {
                    "resourceType": "Composition",
                    "id": compositionId,
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
                        "reference": "Patient/"+patientResource.id
                    },
                    "date": "2021-04-06T08:00:00Z",
                    "author":  [
                        {
                            "reference": "Practitioner/"+practitionerResource.id,
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
                        "reference": "Organization/"+organizationResource.id
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
                                    "reference": "MedicationRequest/"+medicationRequestId
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
                                    "reference": "Coverage/"+coverageResource.id
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "fullUrl": "http://pvs.praxis.local/fhir/MedicationRequest/"+medicationRequestId,
                "resource": {
                    "resourceType": "MedicationRequest",
                    "id": medicationRequestId,
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
                        "reference": "Medication/"+medicationId
                    },
                    "subject": {
                        "reference": "Patient/"+patientResource.id
                    },
                    "authoredOn": new Date().toISOString().substring(0, 10),
                    "requester": {
                        "reference": "Practitioner/"+practitionerResource.id
                    },
                    "insurance":  [
                        {
                            "reference": "Coverage/"+coverageResource.id
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
                "fullUrl": "http://pvs.praxis.local/fhir/Medication/"+medicationId,
                "resource": {
                    "resourceType": "Medication",
                    "id": ""+medicationId,
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
                                "code": "0000000"
                            }
                        ],
                        "text": ""
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
                            "value": 0,
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
                "fullUrl": "http://pvs.praxis.local/fhir/Patient/"+patientResource.id,
                "resource": {
                    "resourceType": "Patient",
                    "id": ""+patientResource.id,
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
                            "value": "000000000"
                        }
                    ],
                    "name":  patientResource.name,
                    "birthDate": patientResource.birthDate,
                    "address":  patientResource.address
                }
            },
            {
                "fullUrl": "http://pvs.praxis.local/fhir/Practitioner/"+practitionerResource.id,
                "resource": {
                    "resourceType": "Practitioner",
                    "id": ""+practitionerResource.id,
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
                            "value": practitionerResource.identifier[0].value
                        }
                    ],
                    "name":  practitionerResource.name,
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
                                "text": "Arzt"
                            }
                        }
                    ]
                }
            },
            {
                "fullUrl": "http://pvs.praxis.local/fhir/Organization/"+organizationResource.id,
                "resource": {
                    "resourceType": "Organization",
                    "id": ""+organizationResource.id,
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
                            "value": organizationResource.identifier[0].value
                        }
                    ],
                    "name": organizationResource.name,
                    "telecom":  organizationResource.telecom,
                    "address":  organizationResource.address
                }
            },
            {
                "fullUrl": "http://pvs.praxis.local/fhir/Coverage/"+coverageResource.id,
                "resource": {
                    "resourceType": "Coverage",
                    "id": ""+coverageResource.id,
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
                        "reference": "Patient/"+patientResource.id
                    },
                    "payor":  coverageResource.payor
                }
            }
        ]
    }
};