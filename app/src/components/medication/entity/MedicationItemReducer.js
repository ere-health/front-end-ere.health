import { createReducer } from "../../../libs/redux-toolkit.esm.js"
import { 
    openMedicationPopupAction,
    changeMedicationItemProfileAction,
    updateMedicationItemAction,
    saveMedicationItemAction,
    cancelMedicationItemAction,
    deleteMedicationItemAction,
} from "../control/MedicationItemControl.js";
// import { updateMedicationLine } from "../../prescriptions/control/UnsignedPrescriptionControl.js";
import { MedicationItemType } from "../MedicationItemType.js";

const initialState = {
    medicationItem: {
        profile: '',
        uuid: '',
    },
}

export const medicationItemReducer = createReducer(initialState, (builder) => {
    
    builder.addCase(openMedicationPopupAction, (state, { payload }) => {
        state.medicationItem = MedicationItemType.getValuesFromFHIR(payload);

    }).addCase(changeMedicationItemProfileAction, (state, { payload }) => {
        state.medicationItem = MedicationItemType.buildEmptyFHIR(payload, state.medicationItem.uuid);

    }).addCase(updateMedicationItemAction, (state, { payload: { path, value } }) => {
        MedicationItemType.setObjectAttribute(state.medicationItem, path, value);

    }).addCase(saveMedicationItemAction, (state) => {
        let medicationItemFHIR = MedicationItemType.buildFHIR(state.medicationItem);
        // TODO: updateMedicationLine(medicationItemFHIR) ?

    }).addCase(cancelMedicationItemAction, (state) => {
        // TODO

    }).addCase(deleteMedicationItemAction, (state, { payload }) => {
        // TODO

    });
})
