import { createAction } from "../../libs/redux-toolkit.esm.js";
import store from "../../store.js";

export const medicationItemUpdatedAction = createAction("MedicationItemUpdatedAction");
export const medicationItemUpdated = (name, value) => {
    store.dispatch(medicationItemUpdatedAction({name,value}));
}

export const saveMedicationItemAction = createAction("saveMedicationItemAction");
export const saveMedicationItem = (id) => {
    store.dispatch(saveMedicationItemAction(id));
}

export const clearMedicationItemAction = createAction("clearMedicationItemAction");
export const clearMedicationItem = _ => {
    store.dispatch(clearMedicationItemAction());
}

export const cancelMedicationItemAction = createAction("cancelMedicationItemAction");
export const cancelMedicationItem = _ => {
    store.dispatch(cancelMedicationItemAction());
}

export const deleteMedicationItemAction = createAction("deleteMedicationItemAction");
export const deleteMedicationItem = (id) => {
    store.dispatch(deleteMedicationItemAction(id));
}