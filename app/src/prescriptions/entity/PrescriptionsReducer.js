import { createReducer } from "../../libs/redux-toolkit.esm.js"
import serverWebSocketActionForwarder from "../../prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js";
import { 
    addPrescriptionAction, 
    signedPrescriptionAction, 
    updatePrescriptionAction,
    selectPrescriptionAction,
    signAndUploadBundlesAction
} from "../control/UnsignedPrescriptionControl.js";

const initialState = {
    list                 : [] ,
    signedList           : [] ,
    selectedPrescription : {} ,
    isPrevious           : false
}

var db = new PouchDB("Prescriptions");

export const prescriptions = createReducer(initialState, (builder) => {
    //Add prescription to the unsigned list
    builder.addCase(addPrescriptionAction, (state, {payload: prescription}) => {
        state.list = state.list.concat([prescription]);
    })
    //Move a prescription to the signed list
    .addCase(signedPrescriptionAction, (state, {payload: prescriptions}) => {
        let currentPrescription = null;
        state.list = state.list.filter(_ => {
          if (_[0].id !== prescriptions[0].id) return true;
          currentPrescription = _;
          return false;
        });
        state.signedList = state.signedList.concat([currentPrescription]);
    })
    // Define the current prescription
    .addCase(selectPrescriptionAction, (state, {payload: {prescriptions, isPrevious}}) => {
        state.selectedPrescription = {prescriptions: prescriptions};
        state.isPrevious           = isPrevious;
        state.selectedPrescription.updatedProps = {}
    })
    .addCase(updatePrescriptionAction, (state, { payload: { name, value } }) => {
        state.selectedPrescription.updatedProps[name] = value;
    })
    .addCase(signAndUploadBundlesAction, (state, { payload: bundles }) => {
        // Send a list of a list of a list
        serverWebSocketActionForwarder.send({type: "SignAndUploadBundles", payload: [bundles]});
    });
})