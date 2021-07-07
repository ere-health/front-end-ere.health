import { cancelPopupEditClinicAction, cancelPopupEditMedikamentAction, cancelPopupEditOrgaAction, cancelPopupEditPatient, cancelPopupEditPatientAction, cancelPopupEditPractIdAction, savePopupEditClinicAction, savePopupEditMedikamentAction, savePopupEditOrgaAction, savePopupEditPatient, savePopupEditPatientAction, savePopupEditPractIdAction, showPopupEditClinicAction, showPopupEditMedikamentAction, showPopupEditOrgaAction, showPopupEditPatientAction, showPopupEditPractIdAction } from "../../components/popup/control/PopupControl.js";
import { Mapper } from "../../libs/helper/Mapper.js";
import { createReducer } from "../../libs/redux-toolkit.esm.js"
import { save } from "../../localstorage/control/StorageControl.js";
import serverWebSocketActionForwarder from "../../prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js";
import {
  addPrescriptionAction,
  signedPrescriptionAction,
  abortTasksAction,
  abortTasksStatusAction,
  updatePrescriptionAction,
  selectPrescriptionAction,
  signAndUploadBundlesAction,
  addSignedAction,
  deletePrescriptionAction,
  addValidationErrorForMainWindowAction,
  removeValidationErrorForMainWindowAction,
  createNewPrescriptionAction,
  ValidateAllFieldsInMainWindowAction
} from "../control/UnsignedPrescriptionControl.js";
import {
  MainWindowValidationRules,
  MainWindowErrorMessages
} from "../boundary/ValidationRules.js"
import { NewPrescriptionTemplate } from "../../../../template/NewPrescriptionTemplate.js";

const initialState = {
  list: [],
  signedList: [], // Demo Erixa
  selectedPrescription: {},
  isPrevious: false,
  currentValidationErrors: {},

  //Popups
  clinicPopup: {},
  PractIdPopup: {},
  MedikamentPopup: {},
  PatientPopup: {},
  OrgaPopup: {}
}

export const prescriptions = createReducer(initialState, (builder) => {
  //Add prescription to the unsigned list
  builder.addCase(addPrescriptionAction, (state, { payload: prescription }) => {
    if(prescription.length == 0) {
      console.warn("Try to add prescriptions with empty array. Ignoring.");
      return;
    }
    if (!state.list.filter(_ => _[0].id === prescription[0].id).length) {

      /*//Check if need to be merged
      const psp = new Mapper(prescription[0]);
      const id = `${psp.read("entry[resource.resourceType?Patient].resource.name[0].given[0]")}-${psp.read("entry[resource.resourceType?Patient].resource.name[0].family")}-${psp.read("entry[resource.resourceType?Patient].resource.birthDate", "")}`
      console.info("MERGE", id, prescription);
      let merged = false;

      state.list.forEach(p => {
        const psp = new Mapper(p[0]);
        const _id = `${psp.read("entry[resource.resourceType?Patient].resource.name[0].given[0]")}-${psp.read("entry[resource.resourceType?Patient].resource.name[0].family")}-${psp.read("entry[resource.resourceType?Patient].resource.birthDate", "")}`
        
        if (id === _id) {
          //Founded
          console.info("Added")
          p.push(prescription[0]);
          merged = true;
        }
        
        console.info("MERGE LIST", id);
      })


      !merged &&*/ (state.list = state.list.concat([prescription]));
    }
  })
  builder.addCase(addSignedAction, (state, { payload: prescription }) => {
    state.signedList = state.signedList.concat(prescription);
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
        payload: prescriptions.map(p => {
          return {accessCode: p.accessCode, id: p.bundle.identifier.value};
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
    .addCase(createNewPrescriptionAction, (state) => {
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
      state.list = state.list.concat([[JSON.parse(bundleTemplate)]]);
    })
    .addCase(updatePrescriptionAction, (state, { payload: { name, value, key, statePath, index } }) => {
      index = index ?? 0;
      if (statePath?.indexOf("prescriptions") === 0) {
        statePath = statePath.replace("prescriptions.", "");
      }

      //state.selectedPrescription.updatedProps[name] = value;
      // Clone object, Redux Toolkit does not support updateing object with Indexer.
      const _state = new Mapper(JSON.parse(JSON.stringify(state)));
      const _psp = new Mapper(_state.read(statePath ? statePath : "selectedPrescription.prescriptions[" + index + "]"));
      if (key) {
        _psp.write(key, value);
          Object.keys(_state.mapObject).forEach(k => {
            state[k] = _state.mapObject[k];
          })
          //state.selectedPrescription.prescriptions[0] = _psp.mapObject;
          state.list.forEach((_, idx) => {
            if (_[0].id === state.selectedPrescription.prescriptions[0].id) {
              _[index] = state.selectedPrescription.prescriptions[index];
            }
          })
      }
    })
    .addCase(signAndUploadBundlesAction, (state, { payload: bundles }) => {
      // Send a list of a list of a list    
      serverWebSocketActionForwarder.send({ type: "SignAndUploadBundles", bearerToken: window.bearerToken, payload: [bundles] });
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
      type: psp.read("entry[resource.resourceType?Organization].resource.identifier[0].value"),
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
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
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
  });


  // PractId Popup
  builder.addCase(showPopupEditPractIdAction, (state) => {
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
    state.PractIdPopup = {
      type: psp.read("entry[resource.resourceType?Practitioner].resource.identifier[0].type.coding[0].code"),
      value: psp.read("entry[resource.resourceType?Practitioner].resource.identifier[0].value")
    };
    resetErrorsInMainWindow(state);
  });
  builder.addCase(cancelPopupEditPractIdAction, (state) => {
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
    state.PractIdPopup = {
      type: psp.read("entry[resource.resourceType?Practitioner].resource.identifier[0].value"),
      value: psp.read("entry[resource.resourceType?Practitioner].resource.identifier[0].value")
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
        "https://fhir.kbv.de/NamingSystem/KBV_NS_Base_BSNR",
        "ZANR",
        "http://fhir.de/CodeSystem/identifier-type-de-basis"
      ]
    })();
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
    const elt = psp.read("entry[resource.resourceType?Practitioner].resource.identifier[0]");
    elt.type.coding[0].code = _typeCode;
    elt.type.coding[0].system = _typeSystem;
    elt.system = _system;
    elt.value = state.PractIdPopup.value;

    const selectedPrescriptionId = state.selectedPrescription.prescriptions[0].id;
    for (const prescriptionList of state.list) {
      if (selectedPrescriptionId == prescriptionList[0].id) {
        prescriptionList[0] = state.selectedPrescription.prescriptions[0];
      }
    }
  });
  // Patient Popup
  builder.addCase(showPopupEditPatientAction, (state) => {
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
    state.PatientPopup = {
      "patientPrefix": psp.read("entry[resource.resourceType?Patient].resource.name[0].prefix[0]"),
      "patientGiven": psp.read("entry[resource.resourceType?Patient].resource.name[0].given[0]"),
      "patientFamily": psp.read("entry[resource.resourceType?Patient].resource.name[0].family"),
      "patientStreetName": psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?streetName]].extension[url?streetName].valueString"),
      "patientStreetNumber": psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?houseNumber]].extension[url?houseNumber].valueString"),
      "patientStreetAdditional": psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?additionalLocator]].extension[url?additionalLocator].valueString", ""),
      "patientPostalCode": psp.read("entry[resource.resourceType?Patient].resource.address[0].postalCode"),
      "patientCity": psp.read("entry[resource.resourceType?Patient].resource.address[0].city")
    };
    resetErrorsInMainWindow(state);
  });

  builder.addCase(cancelPopupEditPatientAction, (state) => {
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
    state.PatientPopup = {
      "patientPrefix": psp.read("entry[resource.resourceType?Patient].resource.name[0].prefix[0]"),
      "patientGiven": psp.read("entry[resource.resourceType?Patient].resource.name[0].given[0]"),
      "patientFamily": psp.read("entry[resource.resourceType?Patient].resource.name[0].family"),
      "patientStreetName": psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?streetName]].extension[url?streetName].valueString"),
      "patientStreetNumber": psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?houseNumber]].extension[url?houseNumber].valueString"),
      "patientStreetAdditional": psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?additionalLocator]].extension[url?additionalLocator].valueString", ""),
      "patientPostalCode": psp.read("entry[resource.resourceType?Patient].resource.address[0].postalCode"),
      "patientCity": psp.read("entry[resource.resourceType?Patient].resource.address[0].city")
    }
  });

  builder.addCase(savePopupEditPatientAction, (state) => {
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
    let writer = null;

    setPrefix(psp, "entry[resource.resourceType?Patient].resource.name[0]", state.PatientPopup.patientPrefix);
    psp.write("entry[resource.resourceType?Patient].resource.name[0].given[0]", state.PatientPopup.patientGiven);
    psp.write("entry[resource.resourceType?Patient].resource.name[0].family", state.PatientPopup.patientFamily);

    writer = psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?streetName]].extension[url?streetName]");
    writer.valueString = state.PatientPopup.patientStreetName;

    writer = psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?houseNumber]].extension[url?houseNumber]");
    writer.valueString = state.PatientPopup.patientStreetNumber;

    writer = psp.read("entry[resource.resourceType?Patient].resource.address[0]");
    if (writer.line) {
      while(writer.line.length) {
        writer.line.pop();
      }
      writer.line.push(`${state.PatientPopup.patientStreetName} ${state.PatientPopup.patientStreetNumber}`);
    }
    
    try {
      writer = psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?additionalLocator]].extension[url?additionalLocator]");
      writer.valueString = state.PatientPopup.patientStreetAdditional;
    } catch (ex) {/* Field not found in teh bundle */ }

    psp.write("entry[resource.resourceType?Patient].resource.address[0].postalCode", state.PatientPopup.patientPostalCode);
    psp.write("entry[resource.resourceType?Patient].resource.address[0].city", state.PatientPopup.patientCity);

    const selectedPrescriptionId = state.selectedPrescription.prescriptions[0].id;
    for (const prescriptionList of state.list) {
      if (selectedPrescriptionId == prescriptionList[0].id) {
        prescriptionList[0] = state.selectedPrescription.prescriptions[0];
      }
    }
  });



  // Orga Popup
  builder.addCase(showPopupEditOrgaAction, (state) => {
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
    state.OrgaPopup = {
      "practitionerPrefix": psp.read("entry[resource.resourceType?Practitioner].resource.name[0].prefix[0]", ""),
      "practitionerGiven": psp.read("entry[resource.resourceType?Practitioner].resource.name[0].given[0]", ""),
      "practitionerFamily": psp.read("entry[resource.resourceType?Practitioner].resource.name[0].family", ""),
      "qualifikation": psp.read("entry[resource.resourceType?Practitioner].resource.qualification[code.coding[system?Qualification_Type]].code.coding[system?Qualification_Type].code", ""),
      "berufsbezeichnung": psp.read("entry[resource.resourceType?Practitioner].resource.qualification[code.coding[system?Qualification_Type]].code.text", ""),
      "organizationName": psp.read("entry[resource.resourceType?Organization].resource.name", ""),
      "organizationStreetName": psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?streetName]].extension[url?streetName].valueString", ""),
      "organizationStreetNumber": psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?houseNumber]].extension[url?houseNumber].valueString", ""),
      "organizationStreetAdditional": psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?additionalLocator]].extension[url?additionalLocator].valueString", ""),
      "organizationPostalCode": psp.read("entry[resource.resourceType?Organization].resource.address[0].postalCode", ""),
      "organizationCity": psp.read("entry[resource.resourceType?Organization].resource.address[0].city", ""),
      "organizationPhone": psp.read("entry[resource.resourceType?Organization].resource.telecom[system?phone].value", ""),
    };
    resetErrorsInMainWindow(state);
  });

  builder.addCase(cancelPopupEditOrgaAction, (state) => {
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
    state.OrgaPopup = {
      "practitionerPrefix": psp.read("entry[resource.resourceType?Practitioner].resource.name[0].prefix[0]", ""),
      "practitionerGiven": psp.read("entry[resource.resourceType?Practitioner].resource.name[0].given[0]", ""),
      "practitionerFamily": psp.read("entry[resource.resourceType?Practitioner].resource.name[0].family", ""),
      "qualifikation": psp.read("entry[resource.resourceType?Practitioner].resource.qualification[code.coding[system?Qualification_Type]].code.coding[system?Qualification_Type].code", ""),
      "berufsbezeichnung": psp.read("entry[resource.resourceType?Practitioner].resource.qualification[code.coding[system?Qualification_Type]].code.text", ""),
      "organizationName": psp.read("entry[resource.resourceType?Organization].resource.name", ""),
      "organizationStreetName": psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?streetName]].extension[url?streetName].valueString", ""),
      "organizationStreetNumber": psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?houseNumber]].extension[url?houseNumber].valueString", ""),
      "organizationStreetAdditional": psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?additionalLocator]].extension[url?additionalLocator].valueString", ""),
      "organizationPostalCode": psp.read("entry[resource.resourceType?Organization].resource.address[0].postalCode", ""),
      "organizationCity": psp.read("entry[resource.resourceType?Organization].resource.address[0].city", ""),
      "organizationPhone": psp.read("entry[resource.resourceType?Organization].resource.telecom[system?phone].value", ""),
    }
  });

  builder.addCase(savePopupEditOrgaAction, (state) => {
    const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
    let writer = null;

    setPrefix(psp, "entry[resource.resourceType?Practitioner].resource.name[0]", state.OrgaPopup.practitionerPrefix);
    psp.write("entry[resource.resourceType?Practitioner].resource.name[0].given[0]", state.OrgaPopup.practitionerGiven);
    psp.write("entry[resource.resourceType?Practitioner].resource.name[0].family", state.OrgaPopup.practitionerFamily);
    psp.write("entry[resource.resourceType?Practitioner].resource.qualification[code.coding[system?Qualification_Type]].code.coding[system?Qualification_Type].code", state.OrgaPopup.qualifikation);
    psp.write("entry[resource.resourceType?Practitioner].resource.qualification[code.coding[system?Qualification_Type]].code.text", state.OrgaPopup.berufsbezeichnung);
    psp.write("entry[resource.resourceType?Organization].resource.name", state.OrgaPopup.organizationName);
    psp.write("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?streetName]].extension[url?streetName].valueString", state.OrgaPopup.organizationStreetName);
    psp.write("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?houseNumber]].extension[url?houseNumber].valueString", state.OrgaPopup.organizationStreetNumber);
    try {
      psp.write("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?additionalLocator]].extension[url?additionalLocator].valueString", state.OrgaPopup.organizationStreetAdditional);
    } catch (ex) { }
    psp.write("entry[resource.resourceType?Organization].resource.address[0].postalCode", state.OrgaPopup.organizationPostalCode);
    psp.write("entry[resource.resourceType?Organization].resource.address[0].city", state.OrgaPopup.organizationCity);
    psp.write("entry[resource.resourceType?Organization].resource.telecom[system?phone].value", state.OrgaPopup.organizationPhone);

    const selectedPrescriptionId = state.selectedPrescription.prescriptions[0].id;
    for (const prescriptionList of state.list) {
      if (selectedPrescriptionId == prescriptionList[0].id) {
        prescriptionList[0] = state.selectedPrescription.prescriptions[0];
      }
    }
  });

  // MedicEdit Popup
  builder.addCase(showPopupEditMedikamentAction, (state, {payload: index}) => {
    console.info("showPopupEditMedikamentAction", state.MedikamentPopup.index);
    const psp = new Mapper(state.selectedPrescription.prescriptions[index]);
    state.MedikamentPopup = {
      index,
      medicationText: psp.read("entry[resource.resourceType=Medication].resource.code.text"),
      pzn: psp.read("entry[resource.resourceType=Medication].resource.code.coding[system?pzn].code"),
      quantityValue: psp.read("entry[resource.resourceType?MedicationRequest].resource.dispenseRequest.quantity.value"),
      norm: psp.read("entry[resource.resourceType?Medication].resource.extension[url?normgroesse].valueCode"),
      form: psp.read("entry[resource.resourceType?Medication].resource.form.coding[system?KBV_CS_SFHIR_KBV_DARREICHUNGSFORM].code"),
      dosageInstruction: psp.read("entry[resource.resourceType?MedicationRequest].resource.dosageInstruction[0].text")
    };
    resetErrorsInMainWindow(state);
  });
  builder.addCase(cancelPopupEditMedikamentAction, (state) => {
    
    const psp = new Mapper(state.selectedPrescription.prescriptions[state.MedikamentPopup.index]);
    state.MedikamentPopup = {
      index: state.MedikamentPopup.index,
      medicationText: psp.read("entry[resource.resourceType=Medication].resource.code.text"),
      pzn: psp.read("entry[resource.resourceType=Medication].resource.code.coding[system?pzn].code"),
      quantityValue: psp.read("entry[resource.resourceType?MedicationRequest].resource.dispenseRequest.quantity.value"),
      norm: psp.read("entry[resource.resourceType?Medication].resource.extension[url?normgroesse].valueCode"),
      form: psp.read("entry[resource.resourceType?Medication].resource.form.coding[system?KBV_CS_SFHIR_KBV_DARREICHUNGSFORM].code"),
      dosageInstruction: psp.read("entry[resource.resourceType?MedicationRequest].resource.dosageInstruction[0].text")
    }
    console.info("cancelPopupEditMedikamentAction", state.MedikamentPopup.index);
  });
  builder.addCase(savePopupEditMedikamentAction, (state) => {
    console.info("savePopupEditMedikamentAction", state.MedikamentPopup.index);

    const psp = new Mapper(state.selectedPrescription.prescriptions[state.MedikamentPopup.index]);
    psp.write("entry[resource.resourceType=Medication].resource.code.text", state.MedikamentPopup.medicationText);
    psp.write("entry[resource.resourceType=Medication].resource.code.coding[system?pzn].code", state.MedikamentPopup.pzn);
    psp.write("entry[resource.resourceType?MedicationRequest].resource.dispenseRequest.quantity.value", Number(state.MedikamentPopup.quantityValue));
    try {
      psp.write("entry[resource.resourceType?Medication].resource.extension[url?normgroesse].valueCode", state.MedikamentPopup.norm);

    } catch(ex) {
      let writer = psp.read("entry[resource.resourceType?Medication].resource.extension");
      writer.push({
            "url": "http://fhir.de/StructureDefinition/normgroesse",
            "valueCode": state.MedikamentPopup.norm
          });
    }
    psp.write("entry[resource.resourceType?Medication].resource.form.coding[system?KBV_CS_SFHIR_KBV_DARREICHUNGSFORM].code", state.MedikamentPopup.form);
    psp.write("entry[resource.resourceType?MedicationRequest].resource.dosageInstruction[0].text", state.MedikamentPopup.dosageInstruction);
    if (state.MedikamentPopup.dosageInstruction) {
      psp.write("entry[resource.resourceType?MedicationRequest].resource.dosageInstruction[0].extension[url?KBV_EX_ERP_DosageFlag].valueBoolean", true);
    } else {
      psp.write("entry[resource.resourceType?MedicationRequest].resource.dosageInstruction[0].extension[url?KBV_EX_ERP_DosageFlag].valueBoolean", false);
    }

    const selectedPrescriptionId = state.selectedPrescription.prescriptions[0].id;
    for (const prescriptionList of state.list) {
      if (selectedPrescriptionId == prescriptionList[0].id) {
        prescriptionList[state.MedikamentPopup.index] = state.selectedPrescription.prescriptions[state.MedikamentPopup.index];
      }
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
      let currentValue = document.getElementById(key).value.trim();

      if (key === 'birthdate') {
        currentValue = psp.read("entry[resource.resourceType?Patient].resource.birthDate", "");
      } else if (key === 'authoredOn') {
        currentValue = psp.read("entry[resource.resourceType?MedicationRequest].resource.authoredOn", "");
      }

      let validation = validateInput(key, currentValue, MainWindowValidationRules);

      if (validation.fails()) {
        state.currentValidationErrors[key] = validation.errors.get(key);
        document.getElementById(key).style.backgroundColor = "yellow";

        refreshErrorMessages(state.currentValidationErrors);
      }
    }
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

  const setPrefix = (psp, namePath, value) => {
    const patientName = psp.read(namePath);
    if (value == "") {
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
  };
})