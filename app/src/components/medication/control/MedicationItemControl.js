import { createAction } from "../../../libs/redux-toolkit.esm.js";
import store from "../../../store.js";

export const openMedicationPopupAction = createAction("openMedicationItemAction");
export const openMedicationPopup = (medication) => {
    store.dispatch(openMedicationPopupAction(medication));
}

export const changeMedicationItemProfileAction = createAction("changeprofileMedicationItemAction");
export const changeMedicationItemProfile = (urlProfile) => {
    store.dispatch(changeMedicationItemProfileAction(urlProfile));
}

export const updateMedicationItemAction = createAction("updateMedicationItemAction");
export const updateMedicationItem = (path, value) => {
    store.dispatch(updateMedicationItemAction({path,value}));
}

export const saveMedicationItemAction = createAction("saveMedicationItemAction");
export const saveMedicationItem = (id) => {
    store.dispatch(saveMedicationItemAction(id));
}

export const cancelMedicationItemAction = createAction("cancelMedicationItemAction");
export const cancelMedicationItem = _ => {
    store.dispatch(cancelMedicationItemAction());
}

export const deleteMedicationItemAction = createAction("deleteMedicationItemAction");
export const deleteMedicationItem = (id) => {
    store.dispatch(deleteMedicationItemAction(id));
}

