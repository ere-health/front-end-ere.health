import { createReducer } from "../../libs/redux-toolkit.esm.js"
import { loadExamplesAction } from "../control/UnsignedPrescriptionControl.js";

const initialState = {
    list: [],
    unsignedPrescription:{}
}

export const prescriptions = createReducer(initialState, (builder) => {
    builder.addCase(loadExamplesAction, (state, {payload: prescriptions}) => {
        state.list = state.list.concat(prescriptions);
    });
})