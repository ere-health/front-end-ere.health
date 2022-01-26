import { createReducer } from "../../libs/redux-toolkit.esm.js"
import { 
    updateMedicationItemAction,
    saveMedicationItemAction,
    clearMedicationItemAction,
    cancelMedicationItemEditAction,
    deleteMedicationItemAction, 
} from "../control/MedicationItemControl.js";

const initialState = {
    medicationItem: {},
}

export const medicationItemReducer = createReducer(initialState, (builder) => {
    builder.addCase(updateMedicationItemAction, (state, { payload: { name, value } }) => {
        state.medicationItem[name] = value;

    }).addCase(saveMedicationItemAction, (state, { payload }) => {
        state.medicationItem["id"] = payload;
        // state.list = state.list.concat(state.medicationItem);

    }).addCase(clearMedicationItemAction, (state) => {
        state.medicationItem = initialState.medicationItem;

    }).addCase(cancelMedicationItemEditAction, (state) => {
        state.medicationItem = initialState.medicationItem;

    }).addCase(deleteMedicationItemAction, (state, { payload }) => {
        // state.list = state.list.filter(medicationItem => medicationItem.id !== payload);
    });
})