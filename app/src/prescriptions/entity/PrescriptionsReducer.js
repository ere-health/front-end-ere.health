import { createReducer } from "../../libs/redux-toolkit.esm.js"
import { addPrescriptionAction, loadExamplesAction, signedPrescriptionAction } from "../control/UnsignedPrescriptionControl.js";

const initialState = {
    list: [],
    signedList: [],
    unsignedPrescription:{}
}

export const prescriptions = createReducer(initialState, (builder) => {
    builder.addCase(addPrescriptionAction, (state, {payload: prescription}) => {
        state.list = state.list.concat([prescription]);
    }).addCase(loadExamplesAction, (state, {payload: prescriptions}) => {
        state.list = state.list.concat(prescriptions);
    }).addCase(signedPrescriptionAction, (state, {payload: prescriptions}) => {
        state.list = state.list.filter(_ => _.id !== prescriptions.id)
        state.signedList = state.signedList.concat([prescriptions]);
    });
})