import { createReducer } from "../../../libs/redux-toolkit.esm.js"
import {
  showPopupIdAction,
  showPopupProgressAction,
  showPopupFatigAction,
  hidePopupAction,
  showPopupAllAction,
  showPopupEditPatientAction,
  showPopupEditStatusAction,
  showPopupEditOrgaAction,
  showPopupEditMedicAction,
  showPopupEditClinicAction,
  cancelPopupEditClinicAction,
  savePopupEditClinicAction,
  showPopupEditPractIdAction,
  savePopupEditPractIdAction,
  cancelPopupEditPractIdAction,
  showPopupEditMedikamentAction,
  savePopupEditMedikamentAction,
  cancelPopupEditMedikamentAction,
  addValidationErrorForCurrentPopupAction,
  removeValidationErrorForCurrentPopupAction
} from "../control/PopupControl.js";

const initialState = {
  showPopup: "",
  all: false,
  currentValidationErrors: {}
}

export const popupReducer = createReducer(initialState, (builder) => {
  builder.addCase(showPopupIdAction, (state) => {
    state.showPopup = "id";
    state.all = false;
  });
  builder.addCase(showPopupProgressAction, (state) => {
    state.showPopup = "processing";
  });
  builder.addCase(showPopupFatigAction, (state) => {
    state.showPopup = "fatig";
  });

  builder.addCase(hidePopupAction, (state) => {
    state.showPopup = "";
    state.currentValidationErrors = {};
  });
  builder.addCase(showPopupAllAction, (state) => {
    state.all = true;
    state.showPopup = "id";
  });
  builder.addCase(showPopupEditPatientAction, (state) => {
    state.showPopup = "patientEdit";
  });
  builder.addCase(showPopupEditStatusAction, (state) => {
    state.showPopup = "statusEdit";
  });
  builder.addCase(showPopupEditOrgaAction, (state) => {
    state.showPopup = "organizationEdit";
  });


  builder.addCase(showPopupEditClinicAction, (state) => {
    state.showPopup = "clinicEdit";
  });
  builder.addCase(cancelPopupEditClinicAction, (state) => {
    state.showPopup = "";
    state.currentValidationErrors = {};
  });
  builder.addCase(savePopupEditClinicAction, (state) => {
    state.showPopup = "";
    state.currentValidationErrors = {};
  });


  builder.addCase(showPopupEditPractIdAction, (state) => {
    state.showPopup = "PractIdEdit";
  });
  builder.addCase(cancelPopupEditPractIdAction, (state) => {
    state.showPopup = "";
    state.currentValidationErrors = {};
  });
  builder.addCase(savePopupEditPractIdAction, (state) => {
    state.showPopup = "";
    state.currentValidationErrors = {};
  });


  builder.addCase(showPopupEditMedikamentAction, (state) => {
    state.showPopup = "medicEdit";
  });
  builder.addCase(cancelPopupEditMedikamentAction, (state) => {
    state.showPopup = "";
    state.currentValidationErrors = {};
  });
  builder.addCase(savePopupEditMedikamentAction, (state) => {
    state.showPopup = "";
    state.currentValidationErrors = {};
  });

  builder.addCase(addValidationErrorForCurrentPopupAction, (state, { payload: { fieldId, error } }) => {
    state.currentValidationErrors[fieldId] = error;

    document.getElementById(fieldId).style.backgroundColor = "yellow";
    refreshErrorMessages(state.showPopup, state.currentValidationErrors);
  });

  builder.addCase(removeValidationErrorForCurrentPopupAction, (state, { payload: { fieldId } }) => {
    state.currentValidationErrors[fieldId] = "";

    document.getElementById(fieldId).style.backgroundColor = "";
    refreshErrorMessages(state.showPopup, state.currentValidationErrors);
  });


  const refreshErrorMessages = (currentPopupName, currentErrors) => {
    document.getElementById(currentPopupName + "-error-messages").innerHTML = "";
    for (const field in currentErrors) {
      if (currentErrors[field] != "") {
        document.getElementById(currentPopupName + "-error-messages").innerHTML += currentErrors[field] + "<BR/>";
      }
    }
  }
})