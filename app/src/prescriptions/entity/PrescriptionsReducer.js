import { 
  showPopupEditClinicAction, 
  cancelPopupEditClinicAction, 
  savePopupEditClinicAction,
  showPopupEditOrgaAction, 
  cancelPopupEditOrgaAction, 
  savePopupEditOrgaAction, 
  showPopupEditPatientAction,
  cancelPopupEditPatientAction, 
  savePopupEditPatientAction, 
  showPopupEditPractIdAction,
  cancelPopupEditPractIdAction,
  savePopupEditPractIdAction, 
  showPopupEditMedikamentAction,
  changeProfilePopupEditMedikamentAction,
  updatePopupEditMedikamentAction,
  savePopupEditMedikamentAction, 
} from "../../components/popup/control/PopupControl.js";
import { 
  MedicamentProfile,
  MedicationRequestPrescription,
} from "../../components/popup/boundary/MedicamentProfile.js"
import { Mapper } from "../../libs/helper/Mapper.js";
import { createReducer } from "../../libs/redux-toolkit.esm.js"
import { settingsReducer }   from "../../components/settings/entity/SettingsReducer.js";
import serverWebSocketActionForwarder from "../../prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js";
import {
  addPrescription,
  addPrescriptionAction,
  showSignFormAction,
  signedPrescriptionAction,
  abortTasksAction,
  abortTasksStatusAction,
  updatePrescriptionAction,
  selectPrescriptionAction,
  signAndUploadBundlesActionWithParams,
  addSignedAction,
  deletePrescriptionAction,
  addValidationErrorForMainWindowAction,
  removeValidationErrorForMainWindowAction,
  createNewPrescriptionWithEgkAction,
  ValidateAllFieldsInMainWindowAction,
  showHTMLBundlesAction,
  sendToPharmacyAction,
  addMedicationLineAction,
  removeMedicationLineAction,
  showGetSignatureModeResponseAction,
  activateComfortSignatureAction,
  deactivateComfortSignatureAction,
  updateDirectAssignAction,
  searchVZDAndFillAutoSuggestionWithSettingsAction,
  updateVZDSearchSuggetionsAction
} from "../control/UnsignedPrescriptionControl.js";
import {
  MainWindowValidationRules,
  MainWindowErrorMessages
} from "../boundary/ValidationRules.js"
import { NewPrescriptionTemplate } from "../../../../template/NewPrescriptionTemplate.js";

const initialState = {
  list: [],
  signedList: [], // Demo Erixa
  selectedPrescription: {
    directAssign: {
      toKimAddress: "",
      noteForPharmacy: ""
    },
  },
  kimAddresses: [],
  isPrevious: false,
  currentValidationErrors: {},

  HTMLBundles : [],

  //Popups
  clinicPopup: {},
  PractIdPopup: {},
  MedikamentPopup: {},
  PatientPopup: {},
  OrgaPopup: {}
}

function setPrescriptionInState(state, prescription) {
  state.list.forEach((_) => {
    _.forEach((_2, idx) => {
      if (_2.id === prescription.id) {
        _[idx] = prescription;
      }
    });
  });
}

function addPrescriptionInState(state, prescription, newPrescription) {
  state.list.forEach((_) => {
    _.forEach((_2, idx) => {
      if (_2.id === prescription.id) {
        _.push(newPrescription);
      }
    });
  });
}
function removePrescriptionFromState(state, prescription) {
  state.list.forEach((_) => {
    _.forEach((_2, idx) => {
      if (_2.id === prescription.id) {
        _.splice(idx, 1);
      }
    });
  });
}

export const prescriptions = createReducer(initialState, (builder) => {
  //Add prescription to the unsigned list
  builder.addCase(addPrescriptionAction, (state, { payload: {prescription, settings} }) => {
    if (prescription.length == 0) {
      console.warn("Try to add prescriptions with empty array. Ignoring.");
      return;
    }
    // remove values without length property
    state.list = state.list.filter(p => ("length" in p));
    if (!state.list.filter(_ => _[0].id === prescription[0].id).length) {
      for(let p of prescription) {
        const psp = new Mapper(p);
        const practitioner = psp.read("entry[resource.resourceType=Practitioner].resource");
        if(!practitioner.identifier[0].value) {
          practitioner.identifier[0].value = settings["prefill.lanr"];
        }

        const organization = psp.read("entry[resource.resourceType=Organization].resource");
        if(!organization.identifier[0].value) {
          organization.identifier[0].value = settings["prefill.bsnr"];
        }
        if(!organization.telecom[0].value) {
          organization.telecom[0].value = settings["prefill.phone"];
        }
            
      }
      (state.list = [prescription].concat(state.list));
    }
  })
  builder.addCase(addSignedAction, (state, { payload: prescription }) => {
    state.signedList = prescription.concat(state.signedList);
    // This should be done automatically in app.js
    // save(state);
  })
    //Move a prescription to the signed list
    .addCase(signedPrescriptionAction, (state, { payload: prescriptions }) => {
      let currentPrescription = null;
      state.list = state.list.filter(_ => {
        if (_[0].id !== prescriptions[0].id) return true;
        currentPrescription = _;
        return false;
      });
      //state.signedList = state.signedList.concat([currentPrescription]);
    })
    // Define the current prescription
    .addCase(selectPrescriptionAction, (state, { payload: { prescriptions, isPrevious } }) => {
      state.selectedPrescription = { prescriptions: prescriptions };
      state.isPrevious = isPrevious;
      state.selectedPrescription.updatedProps = {}
    })
    .addCase(abortTasksAction, (state, { payload: { prescriptions } }) => {
      const abortTasksMessage = {
        type: "AbortTasks",
        payload: prescriptions.filter(p => p?.bundle?.identifier?.value).map(p => {
          return { accessCode: p.accessCode, id: p.bundle.identifier.value };
        })
      };
      serverWebSocketActionForwarder.send(abortTasksMessage);
    })
    .addCase(abortTasksStatusAction, (state, { payload: { abortTasksStatus } }) => {
      const abortedIds = abortTasksStatus.filter(o => o.status == "OK").map(o => o.abortTaskEntry.id);
      // filter our all tasks that are exceptions or that in the abortedIds
      state.signedList = state.signedList.map(bundles => {
        bundles.bundleWithAccessCodeOrThrowables = bundles.bundleWithAccessCodeOrThrowables
          .filter(b => b.bundle?.identifier && abortedIds.indexOf(b.bundle.identifier.value) == -1);
        return bundles;
      }).filter(bundles => bundles.bundleWithAccessCodeOrThrowables.length > 0);
    })
    // delete a prescription from the given prescriptions 
    .addCase(deletePrescriptionAction, (state, { payload: { id } }) => {
      state.list = state.list.filter(_ => {
        if (_[0].id !== id) return true;
        return false;
      });
    })
    //Create an empty prescription
    .addCase(createNewPrescriptionWithEgkAction, (state, {payload: {selectedCardEGK, selectedCardSMCB, selectedCardEHBA}}) => {
	  let id = uuidv4();
	  serverWebSocketActionForwarder.send({
        id: id,
        type: "PrefillBundle",
        egkHandle: selectedCardEGK,
        smcbHandle: selectedCardSMCB,
        hbaHandle: selectedCardEHBA
      });
      
      serverWebSocketActionForwarder.registerErrorHandlerForMessage(id, function(exceptionMessage) {
		  console.log("Error while prefilling bundle: ");
		  console.log(exceptionMessage);
	      let bundleTemplate = NewPrescriptionTemplate;
	
	      const currentDate = new Date().toISOString();
	      bundleTemplate = bundleTemplate.replaceAll('$LAST_UPDATED', currentDate);
	      bundleTemplate = bundleTemplate.replaceAll('$TIMESTAMP', currentDate);
	      bundleTemplate = bundleTemplate.replaceAll('$COMPOSITION_DATE', currentDate);
	
	      bundleTemplate = bundleTemplate.replaceAll('$BUNDLE_ID', uuidv4());
	      bundleTemplate = bundleTemplate.replaceAll('$PRESCRIPTION_ID', uuidv4());
	      bundleTemplate = bundleTemplate.replaceAll('$PATIENT_ID', uuidv4());
	      bundleTemplate = bundleTemplate.replaceAll('$PRACTITIONER_ID', uuidv4());
	      bundleTemplate = bundleTemplate.replaceAll('$ORGANIZATION_ID', uuidv4());
	      bundleTemplate = bundleTemplate.replaceAll('$MEDICATION_REQUEST_ID', uuidv4());
	      bundleTemplate = bundleTemplate.replaceAll('$COVERAGE_ID', uuidv4());
	      bundleTemplate = bundleTemplate.replaceAll('$COMPOSITION_ID', uuidv4());
	      bundleTemplate = bundleTemplate.replaceAll('$MEDICATION_ID', uuidv4());
	      
	      //Add prescription action, you need to inject a list of list
	      addPrescription([JSON.parse(bundleTemplate)]);
      });
    })
    .addCase(updatePrescriptionAction, (state, { payload: { name, value, key, statePath, index } }) => {
      // console.info("key:" + key + " with value:" + value + " with name:" + name + " with statePath:" + statePath + " with index:" + index);

      //Non-popup values
      if (statePath === undefined) {
        for (const prescription of state.selectedPrescription.prescriptions) {
          const psp = new Mapper(prescription);

          //Optional values with their own structure to add 
          if (name === 'wop') {
            setWop(psp, value);

          } else if(name === 'accident') {
            const medicationRequest = psp.read("entry[resource.resourceType?MedicationRequest].resource");
            // Remove accident extension
            medicationRequest.extension = medicationRequest.extension.filter(e => e.url != "https://fhir.kbv.de/StructureDefinition/KBV_EX_FOR_Accident");
            if(value) {
              medicationRequest.extension.push(value);
            }
            // Required values
          } else {
            if (key) {
              psp.write(key, value);
            }
          }
          //state.selectedPrescription.prescriptions[] = _psp.mapObject;
          setPrescriptionInState(state, prescription);
        }

      //Popup values, some code could be cleaned here
      } else {
        index = index ?? 0;
        if (statePath?.indexOf("prescriptions") === 0) {
          statePath = statePath.replace("prescriptions.", "");
        }

        // Clone object, Redux Toolkit does not support updateing object with Indexer.
        const _state = new Mapper(JSON.parse(JSON.stringify(state)));

        //StatusPopup to make sure all bundles of the prescription are updated
        if (statePath == "selectedPrescription.prescriptions[0]") {
          for (const prescription of state.selectedPrescription.prescriptions) {
            const psp = new Mapper(prescription);
            psp.write(key, value);
            //state.selectedPrescription.prescriptions[0] = _psp.mapObject;
            setPrescriptionInState(state, prescription);
          }
        } else {
          const _psp = new Mapper(_state.read(statePath ? statePath : "selectedPrescription.prescriptions[" + index + "]"));
          const prescription = _psp.mapObject;
          if (key) {
            _psp.write(key, value);
            Object.keys(_state.mapObject).forEach(k => {
              state[k] = _state.mapObject[k];
            })
          }
          //state.selectedPrescription.prescriptions[0] = _psp.mapObject;
          setPrescriptionInState(state, prescription);
        }
      }
    })
    .addCase(signAndUploadBundlesActionWithParams, (state, { payload: {bundles, directAssign, settings, selectedCardSMCB, selectedCardEHBA} }) => {
      // if bundles is already list of a list keep it, otherwise create one
      let payload = "length" in bundles[0] ? bundles : [bundles];
      payload = structuredClone(payload)

      for(let list of payload) {
        for(let prescription of list) {
          const medication = prescription.entry.filter(row=>row.resource.resourceType=='Medication')[0];
          const medicationRequest = prescription.entry.filter(row=>row.resource.resourceType=='MedicationRequest')[0];
          // delete substitution for ingredient prescriptions
          if(medication.resource.meta.profile[0].startsWith("https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_Ingredient")) {
            delete medicationRequest.resource.substitution;
          }
        }
      }

      let oMessage = {
        type: "SignAndUploadBundles",
        bearerToken: window.bearerToken,
        runtimeConfig: {},
        payload
      };
      if(selectedCardSMCB) {
        oMessage.runtimeConfig.SMCBHandle = selectedCardSMCB;
      }
      if(selectedCardEHBA) {
        oMessage.runtimeConfig.eHBAHandle = selectedCardEHBA;
      }
      if(directAssign) {
        oMessage.flowtype = "169";
        for(let p in directAssign) {
          oMessage[p] = directAssign[p];
        }
        oMessage.kimConfig = {};
        if(settings) {
          for(let p in settings) {
            let m = p.match(/^kim\.(.*)/);
            if(m) {
              oMessage.kimConfig[m[1]] = settings[p];
            }
          }
        }
      }
      
      // Send a list of a list of a list
      serverWebSocketActionForwarder.send(oMessage);
    })
    .addCase(searchVZDAndFillAutoSuggestionWithSettingsAction, (state, { payload: {search, settings} }) => {
      let oMessage = {
        type: "VZDSearch",
        "runtimeConfig": {
          "connector.base-url": settings["kim.vzd.base-url"],
          "connector.client-certificate": settings["kim.vzd.client-certificate"],
          "connector.client-certificate-password": settings["kim.vzd.client-certificate-password"]
        },
        search
      };
      // Send a list of a list of a list
      serverWebSocketActionForwarder.send(oMessage);
    })
    .addCase(updateVZDSearchSuggetionsAction, (state, { payload: {results} }) => {
      if(!state.kimAddresses) {
        state.kimAddresses = [];
      }
      state.kimAddresses.length = 0;
      state.kimAddresses.push(...results);
    })
    .addCase(showSignFormAction, (state, { payload: bundles }) => {
      // if bundles is already list of a list keep it, otherwise create one
      const payload = "length" in bundles[0] ? bundles : [bundles];
      // Send a list of a list of a list
      serverWebSocketActionForwarder.send({ type: "ReadyToSignBundles", bearerToken: window.bearerToken, payload });
    })
    .addCase(showHTMLBundlesAction, (state, { payload: bundles }) => {
      state.HTMLBundles = bundles; 
    })
    .addCase(showGetSignatureModeResponseAction, (state, { payload: showGetSignatureModeResponse }) => {
      if("sessionInfo" in showGetSignatureModeResponse) {
        state.GetSignatureModeResponse = showGetSignatureModeResponse; 
      } else {
        state.GetSignatureModeResponse = {};
      }
    });


  // Clinic Popup
  builder.addCase(showPopupEditClinicAction, (state) => {
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
    state.clinicPopup = {
      type: psp.read("entry[resource.resourceType?Organization].resource.identifier[0].type.coding[0].code"),
      value: psp.read("entry[resource.resourceType?Organization].resource.identifier[0].value")
    };
    resetErrorsInMainWindow(state);
  });
  builder.addCase(cancelPopupEditClinicAction, (state) => {
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
    state.clinicPopup = {
      type: psp.read("entry[resource.resourceType?Organization].resource.identifier[0].type.coding[0].code"),
      value: psp.read("entry[resource.resourceType?Organization].resource.identifier[0].value")
    }
  });
  builder.addCase(savePopupEditClinicAction, (state) => {
    const [_system, _typeCode, _typeSystem] = (() => {
      if (state.clinicPopup.type === "BSNR") {
        return [
          "https://fhir.kbv.de/NamingSystem/KBV_NS_Base_BSNR",
          "BSNR",
          "http://terminology.hl7.org/CodeSystem/v2-0203"
        ];
      }
      return [
        "http://fhir.de/NamingSystem/kzbv/zahnarztnummer",
        "ZANR",
        "http://fhir.de/CodeSystem/identifier-type-de-basis"
      ]
    })();

    for (const prescription of state.selectedPrescription.prescriptions) {
      const psp = new Mapper(prescription);
      const elt = psp.read("entry[resource.resourceType?Organization].resource.identifier[0]");
      elt.type.coding[0].code = _typeCode;
      elt.type.coding[0].system = _typeSystem;
      elt.system = _system;
      elt.value = state.clinicPopup.value;

      const selectedPrescriptionId = state.selectedPrescription.prescriptions[0].id;
      for (const prescriptionList of state.list) {
        if (selectedPrescriptionId == prescriptionList[0].id) {
          prescriptionList[0] = state.selectedPrescription.prescriptions[0];
        }
      }
    }
  });


  // PractId Popup
  builder.addCase(showPopupEditPractIdAction, (state) => {
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
    state.PractIdPopup = {
      type: psp.read("entry[resource.resourceType=Practitioner].resource.identifier[0].type.coding[0].code"),
      value: psp.read("entry[resource.resourceType=Practitioner].resource.identifier[0].value")
    };
    resetErrorsInMainWindow(state);
  });
  builder.addCase(cancelPopupEditPractIdAction, (state) => {
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
    state.PractIdPopup = {
      type: psp.read("entry[resource.resourceType=Practitioner].resource.identifier[0].type.coding[0].code"),
      value: psp.read("entry[resource.resourceType=Practitioner].resource.identifier[0].value")
    }
  });
  builder.addCase(savePopupEditPractIdAction, (state) => {
    const [_system, _typeCode, _typeSystem] = (() => {
      if (state.PractIdPopup.type === "LANR") {
        return [
          "https://fhir.kbv.de/NamingSystem/KBV_NS_Base_ANR",
          "LANR",
          "http://terminology.hl7.org/CodeSystem/v2-0203"
        ];
      }
      return [
        "http://fhir.de/NamingSystem/kzbv/zahnarztnummer",
        "ZANR",
        "http://fhir.de/CodeSystem/identifier-type-de-basis"
      ]
    })();

    for (const prescription of state.selectedPrescription.prescriptions) {
      const psp = new Mapper(prescription);
      try {
        const elt = psp.read("entry[resource.resourceType=Practitioner].resource.identifier[0]");
        elt.type.coding[0].code = _typeCode;
        elt.type.coding[0].system = _typeSystem;
        elt.system = _system;
        elt.value = state.PractIdPopup.value;
      } catch(e) {
        alert("Can't update Practitioner: "+e);
      }

      const selectedPrescriptionId = state.selectedPrescription.prescriptions[0].id;
      for (const prescriptionList of state.list) {
        if (selectedPrescriptionId == prescriptionList[0].id) {
          prescriptionList[0] = state.selectedPrescription.prescriptions[0];
        }
      }
    }
  });
  // Patient Popup
  builder.addCase(showPopupEditPatientAction, (state) => {
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
    const patientPrefix = psp.read("entry[resource.resourceType?Patient].resource.name[0].prefix[0]");
    const patientGiven = psp.read("entry[resource.resourceType?Patient].resource.name[0].given[0]");
    const patientFamily = psp.read("entry[resource.resourceType?Patient].resource.name[0].family");
    const patientStreetName = psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[0].extension[url?streetName].valueString");
    const patientStreetNumber = psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[0].extension[url?houseNumber].valueString");
    const patientStreetAdditional = psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[1].extension[url?additionalLocator].valueString", "");
    const patientPostalCode = psp.read("entry[resource.resourceType?Patient].resource.address[0].postalCode");
    const patientCity = psp.read("entry[resource.resourceType?Patient].resource.address[0].city")
    state.PatientPopup = {
      patientPrefix,
      patientGiven,
      patientFamily,
      patientStreetName,
      patientStreetNumber,
      patientStreetAdditional,
      patientPostalCode,
      patientCity
    };
    resetErrorsInMainWindow(state);
  });

  builder.addCase(cancelPopupEditPatientAction, (state) => {
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
    state.PatientPopup = {
      "patientPrefix": psp.read("entry[resource.resourceType?Patient].resource.name[0].prefix[0]"),
      "patientGiven": psp.read("entry[resource.resourceType?Patient].resource.name[0].given[0]"),
      "patientFamily": psp.read("entry[resource.resourceType?Patient].resource.name[0].family"),
      "patientStreetName": psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[0].extension[url?streetName].valueString"),
      "patientStreetNumber": psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[0].extension[url?houseNumber].valueString"),
      "patientStreetAdditional": psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[1].extension[url?additionalLocator].valueString", ""),
      "patientPostalCode": psp.read("entry[resource.resourceType?Patient].resource.address[0].postalCode"),
      "patientCity": psp.read("entry[resource.resourceType?Patient].resource.address[0].city")
    }
  });

  builder.addCase(savePopupEditPatientAction, (state) => {
    for (const prescription of state.selectedPrescription.prescriptions) {
      const psp = new Mapper(prescription);
      let writer = null;

      setPrefix(psp, "entry[resource.resourceType?Patient].resource.name[0]", state.PatientPopup.patientPrefix);
      psp.write("entry[resource.resourceType?Patient].resource.name[0].given[0]", state.PatientPopup.patientGiven);
      psp.write("entry[resource.resourceType?Patient].resource.name[0].family", state.PatientPopup.patientFamily);
      try {
        writer = psp.read("entry[resource.resourceType?Patient].resource.name[0]._family.extension[url?humanname-own-name][0]");
        writer.valueString = state.PatientPopup.patientFamily;
      } catch(e) {
        console.error(e);
      }

      writer = psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[0].extension[url?streetName]");
      writer.valueString = state.PatientPopup.patientStreetName;

      writer = psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[0].extension[url?houseNumber]");
      writer.valueString = state.PatientPopup.patientStreetNumber;

      writer = psp.read("entry[resource.resourceType?Patient].resource.address[0]");
      writer.line = [];
      writer.line.push(`${state.PatientPopup.patientStreetName} ${state.PatientPopup.patientStreetNumber}`);
      if(state.PatientPopup.patientStreetAdditional) {
        writer.line.push(`${state.PatientPopup.patientStreetAdditional}`);
        try {
          writer = psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?additionalLocator]].extension[url?additionalLocator]");
          writer.valueString = state.PatientPopup.patientStreetAdditional;
        } catch (ex) {
          /* Field not found in the bundle */
          writer = psp.read("entry[resource.resourceType?Patient].resource.address[0]");
          writer._line.push({
            extension: [{
              "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-additionalLocator",
              "valueString": state.PatientPopup.patientStreetAdditional
            }]
          });
        }
      } else {
        // remote additionalLocator extension
        writer._line = writer._line.filter(o => o.extension && o.extension[0].url != "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-additionalLocator");
      }


      psp.write("entry[resource.resourceType?Patient].resource.address[0].postalCode", state.PatientPopup.patientPostalCode);
      psp.write("entry[resource.resourceType?Patient].resource.address[0].city", state.PatientPopup.patientCity);

      const selectedPrescriptionId = state.selectedPrescription.prescriptions[0].id;
      for (const prescriptionList of state.list) {
        if (selectedPrescriptionId == prescriptionList[0].id) {
          prescriptionList[0] = state.selectedPrescription.prescriptions[0];
        }
      }
    }
  });



  // Orga Popup
  builder.addCase(showPopupEditOrgaAction, (state) => {
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
    state.OrgaPopup = {
      "practitionerPrefix": psp.read("entry[resource.resourceType=Practitioner].resource.name[0].prefix[0]", ""),
      "practitionerGiven": psp.read("entry[resource.resourceType=Practitioner].resource.name[0].given[0]", ""),
      "practitionerFamily": psp.read("entry[resource.resourceType=Practitioner].resource.name[0].family", ""),
      "qualifikation": psp.read("entry[resource.resourceType=Practitioner].resource.qualification[0].code.coding[system?Qualification_Type].code", ""),
      "berufsbezeichnung": psp.read("entry[resource.resourceType=Practitioner].resource.qualification[1].code.text", ""),
      "organizationName": psp.read("entry[resource.resourceType?Organization].resource.name", ""),
      "organizationStreetName": psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[0].extension[url?streetName].valueString", ""),
      "organizationStreetNumber": psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[0].extension[url?houseNumber].valueString", ""),
      "organizationStreetAdditional": psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[1].extension[url?additionalLocator].valueString", ""),
      "organizationPostalCode": psp.read("entry[resource.resourceType?Organization].resource.address[0].postalCode", ""),
      "organizationCity": psp.read("entry[resource.resourceType?Organization].resource.address[0].city", ""),
      "organizationPhone": psp.read("entry[resource.resourceType?Organization].resource.telecom[system?phone].value", ""),
    };
    resetErrorsInMainWindow(state);
  });

  builder.addCase(cancelPopupEditOrgaAction, (state) => {
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
    state.OrgaPopup = {
      "practitionerPrefix": psp.read("entry[resource.resourceType=Practitioner].resource.name[0].prefix[0]", ""),
      "practitionerGiven": psp.read("entry[resource.resourceType=Practitioner].resource.name[0].given[0]", ""),
      "practitionerFamily": psp.read("entry[resource.resourceType=Practitioner].resource.name[0].family", ""),
      "qualifikation": psp.read("entry[resource.resourceType=Practitioner].resource.qualification[0].code.coding[system?Qualification_Type].code", ""),
      "berufsbezeichnung": psp.read("entry[resource.resourceType=Practitioner].resource.qualification[1].code.text", ""),
      "organizationName": psp.read("entry[resource.resourceType?Organization].resource.name", ""),
      "organizationStreetName": psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[0].extension[url?streetName].valueString", ""),
      "organizationStreetNumber": psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[0].extension[url?houseNumber].valueString", ""),
      "organizationStreetAdditional": psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[1].extension[url?additionalLocator].valueString", ""),
      "organizationPostalCode": psp.read("entry[resource.resourceType?Organization].resource.address[0].postalCode", ""),
      "organizationCity": psp.read("entry[resource.resourceType?Organization].resource.address[0].city", ""),
      "organizationPhone": psp.read("entry[resource.resourceType?Organization].resource.telecom[system?phone].value", ""),
    }
  });

  builder.addCase(savePopupEditOrgaAction, (state) => {
    for (const prescription of state.selectedPrescription.prescriptions) {
      const psp = new Mapper(prescription);
      let writer = null;

      setPrefix(psp, "entry[resource.resourceType=Practitioner].resource.name[0]", state.OrgaPopup.practitionerPrefix);
      psp.write("entry[resource.resourceType=Practitioner].resource.name[0].given[0]", state.OrgaPopup.practitionerGiven);
      psp.write("entry[resource.resourceType=Practitioner].resource.name[0].family", state.OrgaPopup.practitionerFamily);
      try {
        writer = psp.read("entry[resource.resourceType=Practitioner].resource.name[0]._family.extension[url?humanname-own-name][0]");
        writer.valueString = state.OrgaPopup.practitionerFamily;
      } catch(e) {
        console.error(e);
      }
      psp.write("entry[resource.resourceType=Practitioner].resource.qualification[0].code.coding[system?Qualification_Type].code", state.OrgaPopup.qualifikation);
      psp.write("entry[resource.resourceType=Practitioner].resource.qualification[1].code.text", state.OrgaPopup.berufsbezeichnung);
      setOrganizationName(psp, state.OrgaPopup.organizationName);
      psp.write("entry[resource.resourceType?Organization].resource.address[0]._line[0].extension[url?streetName].valueString", state.OrgaPopup.organizationStreetName);
      psp.write("entry[resource.resourceType?Organization].resource.address[0]._line[0].extension[url?houseNumber].valueString", state.OrgaPopup.organizationStreetNumber);

      writer = psp.read("entry[resource.resourceType?Organization].resource.address[0]");
      if (!("line" in writer)) {
        writer.line = [];
      }
      while (writer.line.length) {
        writer.line.pop();
      }
      writer.line.push(`${state.OrgaPopup.organizationStreetName} ${state.OrgaPopup.organizationStreetNumber}`);
      if(state.OrgaPopup.organizationStreetAdditional) {
        writer.line.push(`${state.OrgaPopup.organizationStreetAdditional}`);
        try {
          writer = psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?additionalLocator]].extension[url?additionalLocator]");
          writer.valueString = state.OrgaPopup.organizationStreetAdditional;
        } catch (ex) {
          writer = psp.read("entry[resource.resourceType?Organization].resource.address[0]");
          writer._line.push({
            extension: [{
              "url": "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-additionalLocator",
              "valueString": state.OrgaPopup.organizationStreetAdditional
            }]
          });
        }
      } else {
        // remote additionalLocator extension
        writer._line = writer._line.filter(o => o.extension && o.extension[0].url != "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-additionalLocator");
      }
      psp.write("entry[resource.resourceType?Organization].resource.address[0].postalCode", state.OrgaPopup.organizationPostalCode);
      psp.write("entry[resource.resourceType?Organization].resource.address[0].city", state.OrgaPopup.organizationCity);
      psp.write("entry[resource.resourceType?Organization].resource.telecom[system?phone].value", state.OrgaPopup.organizationPhone);

      const selectedPrescriptionId = state.selectedPrescription.prescriptions[0].id;
      for (const prescriptionList of state.list) {
        if (selectedPrescriptionId == prescriptionList[0].id) {
          prescriptionList[0] = state.selectedPrescription.prescriptions[0];
        }
      }
    }
  });

  // MedicEdit Popup
  // SHOW
  builder.addCase(showPopupEditMedikamentAction, (state, { payload: index }) => {
    resetErrorsInMainWindow(state);
    if (index>=0) {
      state.MedikamentPopup = {index};
      const prescription = state.selectedPrescription.prescriptions[index];
      const medication = prescription.entry.filter(row=>row.resource.resourceType=='Medication')[0];
      Object.assign(state.MedikamentPopup, MedicamentProfile.getValuesFromFHIR(medication));
      const medicationRequest = prescription.entry.filter(row=>row.resource.resourceType=='MedicationRequest')[0];
      Object.assign(state.MedikamentPopup, MedicationRequestPrescription.getValuesFromFHIR(medicationRequest));
    }
  });
  // CHANGE PROFILE
  builder.addCase(changeProfilePopupEditMedikamentAction, (state, { payload: profile }) => {
    const index = state.MedikamentPopup.index;
    const uuid  = state.MedikamentPopup.uuid;
    state.MedikamentPopup = {index, profile, uuid};
    Object.assign(state.MedikamentPopup, MedicamentProfile.buildEmpty(profile));
    Object.assign(state.MedikamentPopup, MedicationRequestPrescription.buildEmpty());
  });
  // UPDATE
  builder.addCase(updatePopupEditMedikamentAction, (state, { payload:{collection,index,field,value} }) => {
    if (collection && (index || index===0))
      if (field)
        state.MedikamentPopup[collection][index][field] = value;
      else  
        state.MedikamentPopup[collection][index] = value;
    else if (collection)
      state.MedikamentPopup[collection] = value;
    else if (field)
      state.MedikamentPopup[field] = value;
    else
      state.MedikamentPopup = value;
  });
  // SAVE
  builder.addCase(savePopupEditMedikamentAction, (state) => {
    if (state.MedikamentPopup.index >= 0) {
      // re-build Medication
      const prescription = state.selectedPrescription.prescriptions[state.MedikamentPopup.index];
      const medicationEntryIndex = prescription.entry.findIndex(row=>row.resource.resourceType=='Medication');
      prescription.entry[medicationEntryIndex] = MedicamentProfile.buildFHIR(state.MedikamentPopup);
      // update MedicationRequest (too complex to re-build)
      const medicationRequest = prescription.entry.filter(row=>row.resource.resourceType=='MedicationRequest')[0];
      const medication = prescription.entry.filter(row=>row.resource.resourceType=='Medication')[0];
      MedicationRequestPrescription.modifyFHIR(medicationRequest, state.MedikamentPopup, medication.resource.code.coding[0].code);

      // write selectedPrescription lines back to original list
      const selectedPrescriptionId = state.selectedPrescription.prescriptions[0].id;
      for (const prescriptionList of state.list) {
        if (selectedPrescriptionId == prescriptionList[0].id) {
          prescriptionList[state.MedikamentPopup.index] = state.selectedPrescription.prescriptions[state.MedikamentPopup.index];
        }
      }
    }
    state.MedikamentPopup = {};
  });
  // Medication Line (prescription)
  // ADD
  builder.addCase(addMedicationLineAction, (state) => {
    // clone medication line (first prescription)
    const bundle = JSON.parse(JSON.stringify(state.selectedPrescription.prescriptions[0]));
    try {
      const medicationRequest = bundle.entry.filter(e => e.resource.resourceType == "MedicationRequest")[0];
      const medicationRequestId = uuidv4();
      const medicationId = uuidv4();
      medicationRequest.fullUrl = "http://pvs.praxis.local/fhir/MedicationRequest/"+medicationRequestId;
      medicationRequest.resource.id = medicationRequestId;
      medicationRequest.resource.medicationReference.reference = "Medication/"+medicationId;
      const medication = bundle.entry.filter(e => e.resource.resourceType == "Medication")[0];
      medication.fullUrl = "http://pvs.praxis.local/fhir/Medication/"+medicationId;
      medication.resource.id = medicationId;
      
      bundle.entry[0].resource.section[0].entry[0].reference = "MedicationRequest/"+medicationRequestId;
      
      state.selectedPrescription.prescriptions.push(bundle);
      addPrescriptionInState(state, state.selectedPrescription.prescriptions[0], bundle);
    } catch(e) {
      alert(e);
    }
  });
  // REMOVE
  builder.addCase(removeMedicationLineAction, (state, { payload: index }) => {
    try {
      let bundle = state.selectedPrescription.prescriptions[index];
      removePrescriptionFromState(state, bundle);
      state.selectedPrescription.prescriptions.splice(index,1);
    } catch(e) {
      alert(e);
    }
  });  

  //Validations
  builder.addCase(addValidationErrorForMainWindowAction, (state, { payload: { fieldId, error } }) => {
    state.currentValidationErrors[fieldId] = error;

    document.getElementById(fieldId).style.backgroundColor = "yellow";
    refreshErrorMessages(state.currentValidationErrors);
  });
  builder.addCase(removeValidationErrorForMainWindowAction, (state, { payload: { fieldId } }) => {
    delete state.currentValidationErrors[fieldId];

    document.getElementById(fieldId).style.backgroundColor = "";
    refreshErrorMessages(state.currentValidationErrors);
  });
  builder.addCase(ValidateAllFieldsInMainWindowAction, (state) => {
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);

    for (const [key, rule] of Object.entries(MainWindowValidationRules)) {
      try {
        let currentValue = document.getElementById(key).value.trim();

        if (key === 'birthdate') {
          currentValue = psp.read("entry[resource.resourceType?Patient].resource.birthDate", "");
        } else if (key === 'authoredOn') {
          currentValue = psp.read("entry[resource.resourceType?MedicationRequest].resource.authoredOn", "");
        } else if (key === 'Unfalltag') {
          currentValue = psp.read("entry[resource.resourceType?MedicationRequest].resource.extension[url?KBV_EX_FOR_Accident].extension[url?Unfalltag].valueDate", "");
        }

        let validation = validateInput(key, currentValue, MainWindowValidationRules);

        if (validation.fails()) {
          state.currentValidationErrors[key] = validation.errors.get(key);
          document.getElementById(key).style.backgroundColor = "yellow";

          refreshErrorMessages(state.currentValidationErrors);
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
  builder.addCase(sendToPharmacyAction, (state, { payload: { prescriptions: { prescriptions, patientEmail, surgeryDate } } }) => {
    const document = prescriptions.pdfDocument.content;
    const firstPrescription = prescriptions.bundleWithAccessCodeOrThrowables[0].bundle;
    const patient = firstPrescription.entry.filter(e => e.resource.resourceType == "Patient")[0].resource;
    const coverage = firstPrescription.entry.filter(e => e.resource.resourceType == "Coverage")[0].resource;
    const medication = firstPrescription.entry.filter(e => e.resource.resourceType == "Medication")[0].resource;
    const medicationRequest = firstPrescription.entry.filter(e => e.resource.resourceType == "MedicationRequest")[0].resource;
    const KBV_EX_ERP_StatusCoPayment = medicationRequest.extension.filter(e => e.url == "https://fhir.kbv.de/StructureDefinition/KBV_EX_ERP_StatusCoPayment")[0]?.valueCoding?.code == "0";
    const name = patient?.name[0];
    const address = patient.address[0];
    try {
      serverWebSocketActionForwarder.send({
        "type": "ErixaEvent",
        "processType": "SendToPharmacy",
        "payload": {
          "document": document,
          "details": {
            "firstName": name?.given[0],
            "lastName": name?.family,
            "salutation": name?.prefix[0],
            "birthday": patient.birthDate,
            "street": address.line[0],
            "postcode": address.postalCode,
            "city": address.city,
            "emailAddress": patientEmail,
            "insuranceType": coverage?.type?.coding[0]?.code,
            "healthInsurance": coverage?.payor[0]?.display,
            "healthInsuranceNumber": coverage?.payor[0]?.identifier.value,
            "pzn": medication?.code?.coding[0]?.code,
            "autIdem": medicationRequest?.substitution?.allowedBoolean,
            "dosage": medicationRequest?.dosageInstruction[0]?.text,
            "medicineDescription": medication?.code?.text,
            "extraPaymentNecessary": KBV_EX_ERP_StatusCoPayment,
            "creationDateTime": new Date().toISOString().split('.').shift() + 'Z',
            "surgeryDate": surgeryDate
          }
        }
      });
    } catch(e) {
      alert("Konnte server socket Nachricht nicht erstellen "+e);
    }
  });

  builder.addCase(activateComfortSignatureAction, (state) => {
    try {
      serverWebSocketActionForwarder.send({
        "type": "ActivateComfortSignature"
      });
    } catch(e) {
      alert("Konnte server socket Nachricht nicht erstellen "+e);
    }
  });

  builder.addCase(deactivateComfortSignatureAction, (state) => {
    try {
      serverWebSocketActionForwarder.send({
        "type": "DeactivateComfortSignature"
      });
    } catch(e) {
      alert("Konnte server socket Nachricht nicht erstellen "+e);
    }
  });

  builder.addCase(updateDirectAssignAction, (state, {payload: {key, value}}) => {
    if(!("directAssign" in state.selectedPrescription)) {
      state.selectedPrescription.directAssign = {};
    }
    state.selectedPrescription.directAssign[key] = value;
  });

  const validateInput = (name, value, ValidationRules) => {
    let data = new Object();
    let rule = new Object();

    data[name] = value;
    rule[name] = ValidationRules[name];

    return new Validator(data, rule, MainWindowErrorMessages[name]);
  }

  const refreshErrorMessages = (currentErrors) => {
    document.getElementById("error-messages").innerHTML = "";
    for (const field in currentErrors) {
      if (currentErrors[field] != "") {
        document.getElementById("error-messages").innerHTML += currentErrors[field] + "<BR/>";
      }
    }
  }

  const resetErrorsInMainWindow = (state) => {
    for (const [fieldId, error] of Object.entries(state.currentValidationErrors)) {
      document.getElementById(fieldId).style.backgroundColor = "";
    }

    state.currentValidationErrors = {};
    document.getElementById("error-messages").innerHTML = "";
  }

  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  //Optional values needing their own structure
  const setPrefix = (psp, namePath, value) => {
    const patientName = psp.read(namePath);
    if (value == "" || value === undefined) {
      delete patientName._prefix;
      delete patientName.prefix;
    } else {
      patientName.prefix = [];
      patientName._prefix = [];
      patientName._prefix[0] = new Object();
      patientName._prefix[0].extension = [];
      patientName._prefix[0].extension[0] = new Object();
      patientName._prefix[0].extension[0].url = "http://hl7.org/fhir/StructureDefinition/iso21090-EN-qualifier";
      patientName._prefix[0].extension[0].valueCode = "AC";
      patientName.prefix[0] = value;
    }
    psp.write(namePath, patientName);
  }

  const setOrganizationName = (psp, value) => {
    const organizationResource = psp.read("entry[resource.resourceType?Organization].resource");
    if (value == "") {
      delete organizationResource.name;
    } else {
      organizationResource.name = value;
    }
  }
})

const setWop = (psp, value) => {
  const coverageResource = psp.read("entry[resource.resourceType?Coverage].resource");
  const wopExtension = coverageResource.extension.find(elt => elt.url == "http://fhir.de/StructureDefinition/gkv/wop");

  if (value == "") {
    const indexOfWopExtension = coverageResource.extension.indexOf(wopExtension);
    if (indexOfWopExtension > -1) {
      coverageResource.extension.splice(indexOfWopExtension, 1);
    }
  } else {
    if (wopExtension) {
      wopExtension.valueCoding.code = value;
    } else {
      let newWopExtension = new Object();
      newWopExtension.url = "http://fhir.de/StructureDefinition/gkv/wop";
      newWopExtension.valueCoding = new Object();
      newWopExtension.valueCoding.system = "https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_ITA_WOP";
      newWopExtension.valueCoding.code = value;

      coverageResource.extension.push(newWopExtension);
    }
  }
}
