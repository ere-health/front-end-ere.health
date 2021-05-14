import { createReducer } from "../../libs/redux-toolkit.esm.js"
import { 
    addPrescriptionAction, 
    signedPrescriptionAction, 
    updatePrescriptionAction,
    selectPrescriptionAction
} from "../control/UnsignedPrescriptionControl.js";

const initialState = {
    list                 : [] ,
    signedList           : [] ,
    selectedPrescription : {}
}

export const prescriptions = createReducer(initialState, (builder) => {
    //Add prescription to the unsigned list
    builder.addCase(addPrescriptionAction, (state, {payload: prescription}) => {
        state.list = state.list.concat([prescription]);
    })
    //Move a prescription to the signed list
    .addCase(signedPrescriptionAction, (state, {payload: prescriptions}) => {
        state.list       = state.list.filter(_ => _.id !== prescriptions.id) ;
        state.signedList = state.signedList.concat([prescriptions])          ;
    })
    // Define the current prescription
    .addCase(selectPrescriptionAction, (state, {payload: prescription}) => {
        state.selectedPrescription = {prescriptions: prescription};
        state.selectedPrescription.updatedProps = {}
    })
    .addCase(updatePrescriptionAction, (state, { payload: { name, value } }) => {
        state.selectedPrescription.updatedProps[name] = value;
    });
})