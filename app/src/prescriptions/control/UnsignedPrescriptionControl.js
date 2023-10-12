import { createAction } from "../../libs/redux-toolkit.esm.js";
import store from "../../store.js";

export const addPrescriptionAction = createAction("addPrescriptionAction");
export const addPrescriptionActionWithSettingsAction = (prescription) => (dispatch, getState) => {
    const settings = getState().settingsReducer.settings;
    dispatch({ type: "addPrescriptionAction", payload: {prescription, settings} });
};
export const addPrescription = (prescription) => {
    store.dispatch(addPrescriptionActionWithSettingsAction(prescription));
}

export const deletePrescriptionAction = createAction("deletePrescriptionAction");
export const deletePrescription = (id) => {
    store.dispatch(deletePrescriptionAction({id}));
}

export const selectPrescriptionAction = createAction("selectPrescriptionAction");
export const selectPrescription = (prescriptions, isPrevious) => {
    store.dispatch(selectPrescriptionAction({prescriptions, isPrevious}));
}

export const abortTasksAction = createAction("abortTasksAction");
export const abortTasks = (prescriptions) => {
    store.dispatch(abortTasksAction({prescriptions}));
}

export const abortTasksStatusAction = createAction("abortTasksStatusAction");
export const abortTasksStatus = (abortTasksStatus) => {
    store.dispatch(abortTasksStatusAction({abortTasksStatus}));
}


export const createNewPrescriptionAction = createAction("createNewPrescriptionAction");
export const createNewPrescription = () => {
    store.dispatch(createNewPrescriptionAction());
}

export const signedPrescriptionAction = createAction("signedPrescriptionAction");
export const signedPrescription = (prescription) => {
    store.dispatch(signedPrescriptionAction(prescription));
}

export const updatePrescriptionAction = createAction("updatePrescriptionAction");
export const updatePrescription = (name, value, key, statePath, index, amountOfBundles) => {
    if(index === undefined && amountOfBundles) {
        for(let i=0;i<amountOfBundles;i++) {
            store.dispatch(updatePrescriptionAction({name, value, key, statePath, i}));
        }
    } else {
        store.dispatch(updatePrescriptionAction({name, value, key, statePath, index}));
    }
}

export const addSignedAction = createAction("addSignedAction");
export const addSigned = (bundles) => {
    store.dispatch(addSignedAction(bundles));
}

export const signAndUploadBundlesAction = createAction("signAndUploadBundlesAction");
export const signAndUploadBundles = (bundles, directAssign) => {
    store.dispatch(signAndUploadBundlesAction({bundles, directAssign}));
}
export const signAndUploadKimBundlesAction = (bundles, directAssign) =>
    (dispatch, getState) => {
        const settings = getState().settingsReducer.settings;
        dispatch({ type: "signAndUploadBundlesAction", payload: {bundles, directAssign, settings} });
    };
export const signAndUploadKimBundles = (bundles, directAssign) => {
    store.dispatch(signAndUploadKimBundlesAction(bundles, directAssign));
}

export const searchVZDAndFillAutoSuggestionWithSettingsAction = createAction("searchVZDAndFillAutoSuggestionWithSettingsAction");

export const searchVZDAndFillAutoSuggestionAction = (search) =>
(dispatch, getState) => {
    const settings = getState().settingsReducer.settings;
    dispatch({ type: "searchVZDAndFillAutoSuggestionWithSettingsAction", payload: {search, settings} });
};

export const searchVZDAndFillAutoSuggestion = (search) => {
    store.dispatch(searchVZDAndFillAutoSuggestionAction(search));
};

export const showSignFormAction = createAction("showSignFormAction");
export const showSignForm = (bundles) => {
    store.dispatch(showSignFormAction(bundles));
}

export const addValidationErrorForMainWindowAction = createAction("addValidationErrorForMainWindowAction");
export const addValidationErrorForMainWindow = (fieldId, error) => {
    store.dispatch(addValidationErrorForMainWindowAction({fieldId, error}));
}

export const removeValidationErrorForMainWindowAction = createAction("removeValidationErrorForMainWindowAction");
export const removeValidationErrorForMainWindow = (fieldId) => {
    store.dispatch(removeValidationErrorForMainWindowAction({fieldId}));
}

export const ValidateAllFieldsInMainWindowAction = createAction("ValidateAllFieldsInMainWindowAction");
export const ValidateAllFieldsInMainWindow = () => {
    store.dispatch(ValidateAllFieldsInMainWindowAction());
}

export const showHTMLBundlesAction = createAction("showHTMLBundlesAction");
export const showHTMLBundles = (bundles) => {
    store.dispatch(showHTMLBundlesAction(bundles));
}

export const showGetSignatureModeResponseAction = createAction("showGetSignatureModeResponseAction");
export const showGetSignatureModeResponse = (getSignatureModeResponse) => {
    store.dispatch(showGetSignatureModeResponseAction(getSignatureModeResponse));
}

export const sendToPharmacyAction = createAction("sendToPharmacyAction");
export const sendToPharmacy = (prescriptions, patientEmail, surgeryDate) => {
    store.dispatch(sendToPharmacyAction({prescriptions, patientEmail, surgeryDate}));
}

export const addMedicationLineAction = createAction("addMedicationLineAction");
export const addMedicationLine = () => {
    store.dispatch(addMedicationLineAction());
}

export const removeMedicationLineAction = createAction("removeMedicationLineAction");
export const removeMedicationLine = (medIndex) => {
    store.dispatch(removeMedicationLineAction(medIndex));
}

export const activateComfortSignatureAction = createAction("activateComfortSignatureAction");
export const activateComfortSignature = () => {
    store.dispatch(activateComfortSignatureAction());
}

export const deactivateComfortSignatureAction = createAction("deactivateComfortSignatureAction");
export const deactivateComfortSignature = () => {
    store.dispatch(deactivateComfortSignatureAction());
}

export const updateDirectAssignAction = createAction("updateDirectAssignAction");
export const updateDirectAssign = (key, value) => {
    store.dispatch(updateDirectAssignAction({key, value}));
}

export const updateVZDSearchSuggetionsAction = createAction("updateVZDSearchSuggetionsAction");
export const updateVZDSearchSuggetions = (results) => {
    store.dispatch(updateVZDSearchSuggetionsAction({results}));
}