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

export const showPopupEditStatusAction = createAction("showPopupEditStatusAction");
export const showPopupEditStatus = () => {
    store.dispatch(showPopupEditStatusAction());
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


// Practitionner ID Popup
export const showPopupEditMedikamentAction = createAction("showPopupEditMedikament");
export const showPopupEditMedikament = (index) => {
    store.dispatch(showPopupEditMedikamentAction(index));
}

export const cancelPopupEditMedikamentAction = createAction("cancelPopupEditMedikamentAction");
export const cancelPopupEditMedikament = () => {
    store.dispatch(cancelPopupEditMedikamentAction());
}

export const savePopupEditMedikamentAction = createAction("savePopupEditMedikamentAction");
export const savePopupEditMedikament = () => {
    store.dispatch(savePopupEditMedikamentAction());
}

// Validations
export const addValidationErrorForCurrentPopupAction = createAction("addValidationErrorForCurrentPopupAction");
export const addValidationErrorForCurrentPopup = (fieldId, error) => {
    store.dispatch(addValidationErrorForCurrentPopupAction({fieldId, error}));
}

export const removeValidationErrorForCurrentPopupAction = createAction("removeValidationErrorForCurrentPopupAction");
export const removeValidationErrorForCurrentPopup = (fieldId) => {
    store.dispatch(removeValidationErrorForCurrentPopupAction({fieldId}));
}

export const ValidateAllFieldsInCurrentPopupAction = createAction("ValidateAllFieldsInCurrentPopupAction");
export const ValidateAllFieldsInCurrentPopup = () => {
    store.dispatch(ValidateAllFieldsInCurrentPopupAction({}));
}


// patient Popup
export const showPopupEditPatientAction = createAction("showPopupEditPatient");
export const showPopupEditPatient = () => {
    store.dispatch(showPopupEditPatientAction());
}

export const cancelPopupEditPatientAction = createAction("cancelPopupEditPatientAction");
export const cancelPopupEditPatient = () => {
    store.dispatch(cancelPopupEditPatientAction());
}

export const savePopupEditPatientAction = createAction("savePopupEditPatientAction");
export const savePopupEditPatient = () => {
    store.dispatch(savePopupEditPatientAction());
}

// organisation Popup
export const showPopupEditOrgaAction = createAction("showPopupEditOrga");
export const showPopupEditOrga = () => {
    store.dispatch(showPopupEditOrgaAction());
}

export const cancelPopupEditOrgaAction = createAction("cancelPopupEditOrgaAction");
export const cancelPopupEditOrga = () => {
    store.dispatch(cancelPopupEditOrgaAction());
}

export const savePopupEditOrgaAction = createAction("savePopupEditOrgaAction");
export const savePopupEditOrga = () => {
    store.dispatch(savePopupEditOrgaAction());
}