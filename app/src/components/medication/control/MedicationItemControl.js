import { createAction } from "../../../libs/redux-toolkit.esm.js";
import store from "../../../store.js";

export const openMedicationPopupAction = createAction("MedicationPopupOPENaction");
export const openMedicationPopup = (medication) => {
    store.dispatch(openMedicationPopupAction(medication));
}

export const changeMedicationItemProfileAction = createAction("MedicationItemCHANGEPROFILEaction");
export const changeMedicationItemProfile = (urlProfile) => {
    store.dispatch(changeMedicationItemProfileAction(urlProfile));
}

export const updateMedicationItemAction = createAction("MedicationItemUPDATEaction");
export const updateMedicationItem = (path, value) => {
    store.dispatch(updateMedicationItemAction({path,value}));
}

export const saveMedicationItemAction = createAction("MedicationItemSAVEaction");
export const saveMedicationItem = (id) => {
    store.dispatch(saveMedicationItemAction(id));
}

export const cancelMedicationItemAction = createAction("MedicationItemCANCELaction");
export const cancelMedicationItem = _ => {
    store.dispatch(cancelMedicationItemAction());
}

export const deleteMedicationItemAction = createAction("MedicationItemDELETEaction");
export const deleteMedicationItem = (id) => {
    store.dispatch(deleteMedicationItemAction(id));
}

