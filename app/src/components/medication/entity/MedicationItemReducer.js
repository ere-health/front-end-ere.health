import { createReducer } from "../../../libs/redux-toolkit.esm.js"
import { 
    updateMedicationItemAction,
    saveMedicationItemAction,
    clearMedicationItemAction,
    cancelMedicationItemAction,
    deleteMedicationItemAction,
    openMedicationPopupAction,
    changeMedicationItemProfileAction
} from "../control/MedicationItemControl.js";
import {
    buildFhirPzn,
    buildFhirFreeText
} from "./MedicationItemType.js";

const initialState = {
    medicationItem: {},
}

export const medicationItemReducer = createReducer(initialState, (builder) => {
    builder.addCase(updateMedicationItemAction, (state, { payload: { name, value } }) => {

        let parts = name.split(/\./);
        let item = state.medicationItem;
        while(parts.length > 1) {
            let firstElement = parts.shift();
            if (Number.isInteger(firstElement)) firstElement = Number.parseInt(firstElement);
            item = item[firstElement];
        }
        item[parts[0]] = value;

    }).addCase(saveMedicationItemAction, (state, { payload }) => {
        state.medicationItem["id"] = payload;
        // state.list = state.list.concat(state.medicationItem);

    }).addCase(clearMedicationItemAction, (state) => {
        state.medicationItem = initialState.medicationItem;

    }).addCase(cancelMedicationItemAction, (state) => {
        state.medicationItem = initialState.medicationItem;

    }).addCase(deleteMedicationItemAction, (state, { payload }) => {
        // state.list = state.list.filter(medicationItem => medicationItem.id !== payload);

    }).addCase(openMedicationPopupAction, (state, { payload }) => {
        state.medicationItem = payload;

    }).addCase(changeMedicationItemProfileAction, (state, { payload }) => {
        // reuse UUID from bundle
        let uuid = state.medicationItem.resource.id;
        if(payload === "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_FreeText|1.0.2") {
            state.medicationItem = buildFhirFreeText(uuid,"","");

        } else if(payload === "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_PZN|1.0.2") {
            state.medicationItem = buildFhirPzn(uuid, "", "", "", "");
            
        }
    });
})