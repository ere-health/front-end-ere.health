import { createAction } from "../../../libs/redux-toolkit.esm.js";
import store from "../../../store.js";

export const openMedicationPopupAction = createAction("openMedicationPopupAction");
export const openMedicationPopup = (medication) => {
    store.dispatch(openMedicationPopupAction(medication));
}

export const changeMedicationItemProfileAction = createAction("changeMedicationItemProfileAction");
export const changeMedicationItemProfile = (medication) => {
    store.dispatch(changeMedicationItemProfileAction(medication));
}

export const updateMedicationItemAction = createAction("MedicationItemUpdatedAction");
export const updateMedicationItem = (name, value) => {
    store.dispatch(updateMedicationItemAction({name,value}));
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

