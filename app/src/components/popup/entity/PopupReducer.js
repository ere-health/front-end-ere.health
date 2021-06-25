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
  cancelPopupEditPractIdAction
} from "../control/PopupControl.js";

const initialState = {
    showPopup : "",
    all       : false
}

export const popupReducer = createReducer(initialState, (builder) => {
    builder.addCase(showPopupIdAction, (state) => {
        state.showPopup = "id";
        state.all       = false;
    });
    builder.addCase(showPopupProgressAction, (state) => {
        state.showPopup = "processing";
    });
    builder.addCase(showPopupFatigAction, (state) => {
        state.showPopup = "fatig";
    });
    builder.addCase(showPopupEditMedicAction, (state) => {
      state.showPopup = "medicEdit";
    });   
    builder.addCase(hidePopupAction, (state) => {
      state.showPopup = "";
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
    });
    builder.addCase(savePopupEditClinicAction, (state) => {
      state.showPopup = "";
    });


    builder.addCase(showPopupEditPractIdAction, (state) => {
      state.showPopup = "PractIdEdit";
    });
    builder.addCase(cancelPopupEditPractIdAction, (state) => {
      state.showPopup = "";
    });
    builder.addCase(savePopupEditPractIdAction, (state) => {
      state.showPopup = "";
    });
})