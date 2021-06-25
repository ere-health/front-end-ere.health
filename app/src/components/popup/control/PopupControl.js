import { createAction } from "../../../libs/redux-toolkit.esm.js";
import store from "../../../store.js";

export const hidePopupAction = createAction("hidePopupAction");
export const _hidePopup = () => {
    store.dispatch(hidePopupAction());
}

export const showPopupIdAction = createAction("showPopupIdAction");
export const showPopupId = () => {
    store.dispatch(showPopupIdAction());
}

export const showPopupAllAction = createAction("showPopupAllAction");
export const showPopupAll = () => {
    store.dispatch(showPopupAllAction());
}

export const showPopupProgressAction = createAction("showPopupProgressAction");
export const showPopupProgress = () => {
    store.dispatch(showPopupProgressAction());
}

export const showPopupFatigAction = createAction("showPopupFatigAction");
export const showPopupFatig = () => {
    store.dispatch(showPopupFatigAction());
}

export const showPopupEditPatientAction = createAction("showPopupEditPatientAction");
export const showPopupEditPatient = () => {
    store.dispatch(showPopupEditPatientAction());
}

export const showPopupEditStatusAction = createAction("showPopupEditStatusAction");
export const showPopupEditStatus = () => {
    store.dispatch(showPopupEditStatusAction());
}

export const showPopupEditOrgaAction = createAction("showPopupEditOrgaAction");
export const showPopupEditOrga = () => {
    store.dispatch(showPopupEditOrgaAction());
}

export const showPopupEditMedicAction = createAction("showPopupEditMedicAction");
export const showPopupEditMedic = () => {
    store.dispatch(showPopupEditMedicAction());
}


// Clinic Popup
export const showPopupEditClinicAction = createAction("showPopupEditClinic");
export const showPopupEditClinic = () => {
    store.dispatch(showPopupEditClinicAction());
}

export const cancelPopupEditClinicAction = createAction("cancelPopupEditClinicAction");
export const cancelPopupEditClinic = () => {
    store.dispatch(cancelPopupEditClinicAction());
}

export const savePopupEditClinicAction = createAction("savePopupEditClinicAction");
export const savePopupEditClinic = () => {
    store.dispatch(savePopupEditClinicAction());
}



// Practitionner ID Popup
export const showPopupEditPractIdAction = createAction("showPopupEditPractId");
export const showPopupEditPractId = () => {
    store.dispatch(showPopupEditPractIdAction());
}

export const cancelPopupEditPractIdAction = createAction("cancelPopupEditPractIdAction");
export const cancelPopupEditPractId = () => {
    store.dispatch(cancelPopupEditPractIdAction());
}

export const savePopupEditPractIdAction = createAction("savePopupEditPractIdAction");
export const savePopupEditPractId = () => {
    store.dispatch(savePopupEditPractIdAction());
}