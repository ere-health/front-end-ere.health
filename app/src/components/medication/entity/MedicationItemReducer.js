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
    medicationItem: {},
}

function setObjectAttribute(object,path,value){
    let parts = path.split(/\./);
    for (let i=0; i<parts.length; i++){
        let actualElement = parts[i];
        if (Number.isInteger(actualElement)) actualElement = Number.parseInt(actualElement);
        if (i<parts.length-1)
            object = object[actualElement];
        else
            object[actualElement] = value;
    }
}

export const medicationItemReducer = createReducer(initialState, (builder) => {
    builder.addCase(changeMedicationItemProfileAction, (state, { payload }) => {
        state.medicationItem = MedicationItemType.buildEmptyFHIR(payload, state.medicationItem.resource.id);

    }).addCase(updateMedicationItemAction, (state, { payload: { name, value } }) => {
        setObjectAttribute(state.medicationItem, name, value)

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

    });
})
