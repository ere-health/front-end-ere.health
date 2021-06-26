import { cancelPopupEditClinicAction, cancelPopupEditMedikamentAction, cancelPopupEditPractIdAction, savePopupEditClinicAction, savePopupEditMedikamentAction, savePopupEditPractIdAction, showPopupEditClinicAction, showPopupEditMedikamentAction, showPopupEditPractIdAction } from "../../components/popup/control/PopupControl.js";
import { Mapper } from "../../libs/helper/Mapper.js";
import { createReducer } from "../../libs/redux-toolkit.esm.js"
import { save } from "../../localstorage/control/StorageControl.js";
import serverWebSocketActionForwarder from "../../prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js";
import { 
    addPrescriptionAction, 
    signedPrescriptionAction, 
    updatePrescriptionAction,
    selectPrescriptionAction,
    signAndUploadBundlesAction,
    addSignedAction,
    updatePrescription
} from "../control/UnsignedPrescriptionControl.js";

const initialState = {
    list                 : [] ,
    signedList           : [] , // Demo Erixa
    selectedPrescription : {} ,
    isPrevious           : false,

    //Popups
    clinicPopup          : {},
    PractIdPopup         : {},
    MedikamentPopup      : {}
}

export const prescriptions = createReducer(initialState, (builder) => {
    //Add prescription to the unsigned list
    builder.addCase(addPrescriptionAction, (state, {payload: prescription}) => {
        if (!state.list.filter(_ => _[0].id ===  prescription[0].id).length) {
          state.list = state.list.concat([prescription]);
        }
    })
    builder.addCase(addSignedAction, (state, {payload: prescription}) => {
      state.signedList = state.signedList.concat(prescription);
      save(state);
  })
    //Move a prescription to the signed list
    .addCase(signedPrescriptionAction, (state, {payload: prescriptions}) => {
        let currentPrescription = null;
        state.list = state.list.filter(_ => {
          if (_[0].id !== prescriptions[0].id) return true;
          currentPrescription = _;
          return false;
        });
        //state.signedList = state.signedList.concat([currentPrescription]);
    })
    // Define the current prescription
    .addCase(selectPrescriptionAction, (state, {payload: {prescriptions, isPrevious}}) => {
        state.selectedPrescription = {prescriptions: prescriptions};
        state.isPrevious           = isPrevious;
        state.selectedPrescription.updatedProps = {}
    })
    .addCase(updatePrescriptionAction, (state, { payload: { name, value, key, statePath , useWindow} }) => {
        if (statePath?.indexOf("prescriptions") === 0) {
          statePath = statePath.replace("prescriptions.","");
        }
        //state.selectedPrescription.updatedProps[name] = value;
        // Clone object, Redux Toolkit does not support updateding object with Indexer.
        const _state = useWindow === "true" ? new Mapper(window) :  new Mapper(JSON.parse(JSON.stringify(state)));
        const _psp = new Mapper(_state.read(statePath ? statePath : "selectedPrescription.prescriptions[0]"));
        if (key) {
          _psp.write(key, value);
          if (useWindow !== "true") {
            Object.keys(_state.mapObject).forEach( k=> {
              state[k] = _state.mapObject[k];
            })
            //state.selectedPrescription.prescriptions[0] = _psp.mapObject;
            state.list.forEach((_,idx) => {
              if (_[0].id === state.selectedPrescription.prescriptions[0].id) {
                _[0] = state.selectedPrescription.prescriptions[0];
              }
            })
          }
        }
    })
    .addCase(signAndUploadBundlesAction, (state, { payload: bundles }) => {
        // Send a list of a list of a list
        serverWebSocketActionForwarder.send({type: "SignAndUploadBundles", bearerToken: window.bearerToken, payload: [bundles]});
    });


    // Clinic Popup

    builder.addCase(showPopupEditClinicAction, (state) => {
      const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
      state.clinicPopup = {
        type: psp.read("entry[resource.resourceType?Organization].resource.identifier[0].type.coding[0].code"),
        value: psp.read("entry[resource.resourceType?Organization].resource.identifier[0].value")
      }
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
          "http://fhir.de/CodeSystem/identifier-type-de-basis",
          "KZVA",
          "http://fhir.de/NamingSystem/kzbv/kzvabrechnungsnummer"
        ]
      })();
      const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
      const elt = psp.read("entry[resource.resourceType?Organization].resource.identifier[0]");
      elt.type.coding[0].code = _typeCode;
      elt.type.coding[0].system = _typeSystem;
      elt.system = _system;
      elt.value = state.clinicPopup.value;
    });


    // PractId Popup

    builder.addCase(showPopupEditPractIdAction, (state) => {
      const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
      state.PractIdPopup = {
        type: psp.read("entry[resource.resourceType?Practitioner].resource.identifier[0].type.coding[0].code"),
        value: psp.read("entry[resource.resourceType?Practitioner].resource.identifier[0].value")
      }
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
          "http://fhir.de/NamingSystem/kzbv/zahnarztnummer",
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
    });




    // MedicEdit Popup

    builder.addCase(showPopupEditMedikamentAction, (state) => {
      const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
      state.MedikamentPopup = {
        medicationText    : psp.read("entry[resource.resourceType=Medication].resource.code.text"),
        pzn               : psp.read("entry[resource.resourceType=Medication].resource.code.coding[system?pzn].code"),
        quantityValue     : psp.read("entry[resource.resourceType?MedicationRequest].resource.dispenseRequest.quantity.value"),
        norm              : psp.read("entry[resource.resourceType?Medication].resource.extension[url?normgroesse].valueCode"),
        form              : psp.read("entry[resource.resourceType?Medication].resource.form.coding[system?KBV_CS_SFHIR_KBV_DARREICHUNGSFORM].code"),
        dosageInstruction : psp.read("entry[resource.resourceType?MedicationRequest].resource.dosageInstruction[0].text")
      }
    });
    builder.addCase(cancelPopupEditMedikamentAction, (state) => {
      const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
      state.MedikamentPopup = {
        medicationText    : psp.read("entry[resource.resourceType=Medication].resource.code.text"),
        pzn               : psp.read("entry[resource.resourceType=Medication].resource.code.coding[system?pzn].code"),
        quantityValue     : psp.read("entry[resource.resourceType?MedicationRequest].resource.dispenseRequest.quantity.value"),
        norm              : psp.read("entry[resource.resourceType?Medication].resource.extension[url?normgroesse].valueCode"),
        form              : psp.read("entry[resource.resourceType?Medication].resource.form.coding[system?KBV_CS_SFHIR_KBV_DARREICHUNGSFORM].code"),
        dosageInstruction : psp.read("entry[resource.resourceType?MedicationRequest].resource.dosageInstruction[0].text")
      }
    });
    builder.addCase(savePopupEditMedikamentAction, (state) => {
      const psp = new Mapper(state.selectedPrescription.prescriptions[0]);
      psp.write("entry[resource.resourceType=Medication].resource.code.text", state.MedikamentPopup.medicationText);
      psp.write("entry[resource.resourceType=Medication].resource.code.coding[system?pzn].code", state.MedikamentPopup.pzn);
      psp.write("entry[resource.resourceType?MedicationRequest].resource.dispenseRequest.quantity.value", Number(state.MedikamentPopup.quantityValue));
      psp.write("entry[resource.resourceType?Medication].resource.extension[url?normgroesse].valueCode", state.MedikamentPopup.norm);
      psp.write("entry[resource.resourceType?Medication].resource.form.coding[system?KBV_CS_SFHIR_KBV_DARREICHUNGSFORM].code", state.MedikamentPopup.form);
      psp.write("entry[resource.resourceType?MedicationRequest].resource.dosageInstruction[0].text", state.MedikamentPopup.dosageInstruction);
      if (state.MedikamentPopup.dosageInstruction) {
        psp.write("entry[resource.resourceType?MedicationRequest].resource.dosageInstruction[0].extension[url?KBV_EX_ERP_DosageFlag].valueBoolean", true);
      } else {
        psp.write("entry[resource.resourceType?MedicationRequest].resource.dosageInstruction[0].extension[url?KBV_EX_ERP_DosageFlag].valueBoolean", false);
      }
    });
})