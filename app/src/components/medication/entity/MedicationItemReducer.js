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
import { MedicationItemType } from "../MedicationItemType.js";

const initialState = {
    pznLookup : MedicationItemType.loadPznRecords("../medication-data.csv", ","),
    medicationItem: {},
}

export const medicationItemReducer = createReducer(initialState, (builder) => {
    
    builder.addCase(openMedicationPopupAction, (state, { payload }) => {
        state.medicationItem = payload;

    }).addCase(changeMedicationItemProfileAction, (state, { payload }) => {
        state.medicationItem = MedicationItemType.buildEmptyFHIR(payload, state.medicationItem.resource.id);

    }).addCase(updateMedicationItemAction, (state, { payload: { path, value } }) => {
        MedicationItemType.setObjectAttribute(state.medicationItem, path, value)

    }).addCase(saveMedicationItemAction, (state, { payload }) => {
        state.medicationItem["id"] = payload;
        // state.list = state.list.concat(state.medicationItem);

    }).addCase(clearMedicationItemAction, (state) => {
        state.medicationItem = initialState.medicationItem;

    }).addCase(cancelMedicationItemAction, (state) => {
        state.medicationItem = initialState.medicationItem;

    }).addCase(deleteMedicationItemAction, (state, { payload }) => {
        // state.list = state.list.filter(medicationItem => medicationItem.id !== payload);

    });
})
