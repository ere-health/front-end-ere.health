import { createReducer } from "../../libs/redux-toolkit.esm.js"
import { addPrescriptionAction, loadExamplesAction } from "../control/UnsignedPrescriptionControl.js";

const initialState = {
    list: [],
    unsignedPrescription:{}
}

export const prescriptions = createReducer(initialState, (builder) => {
    builder.addCase(addPrescriptionAction, (state, {payload: prescription}) => {
        state.list = state.list.concat([prescription]);
    }).addCase(loadExamplesAction, (state, {payload: prescriptions}) => {
        state.list = state.list.concat(prescriptions);
    });
})