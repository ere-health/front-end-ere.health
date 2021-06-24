import { Mapper } from "../../libs/helper/Mapper.js";
import { createReducer } from "../../libs/redux-toolkit.esm.js"
import { save } from "../../localstorage/control/StorageControl.js";
import serverWebSocketActionForwarder from "../../prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js";
import { 
    addPrescriptionAction, 
    signedPrescriptionAction, 
    updatePrescriptionAction,
    selectPrescriptionAction,
    signAndUploadBundlesAction,
    addSignedAction
} from "../control/UnsignedPrescriptionControl.js";

const initialState = {
    list                 : [] ,
    signedList           : [] , // Demo Erixa
    selectedPrescription : {} ,
    isPrevious           : false
}

export const prescriptions = createReducer(initialState, (builder) => {
    //Add prescription to the unsigned list
    builder.addCase(addPrescriptionAction, (state, {payload: prescription}) => {
        if (!state.list.filter(_ => _[0].id ===  prescription[0].id).length) {
          state.list = state.list.concat([prescription]);
        }
    })
    builder.addCase(addSignedAction, (state, {payload: prescription}) => {
      state.signedList = state.signedList.concat(prescription);
      save(state);
  })
    //Move a prescription to the signed list
    .addCase(signedPrescriptionAction, (state, {payload: prescriptions}) => {
        let currentPrescription = null;
        state.list = state.list.filter(_ => {
          if (_[0].id !== prescriptions[0].id) return true;
          currentPrescription = _;
          return false;
        });
        //state.signedList = state.signedList.concat([currentPrescription]);
    })
    // Define the current prescription
    .addCase(selectPrescriptionAction, (state, {payload: {prescriptions, isPrevious}}) => {
        state.selectedPrescription = {prescriptions: prescriptions};
        state.isPrevious           = isPrevious;
        state.selectedPrescription.updatedProps = {}
    })
    .addCase(updatePrescriptionAction, (state, { payload: { name, value, key } }) => {
        state.selectedPrescription.updatedProps[name] = value;
        // Clone object, Redux Toolkit does not support updateding object with Indexer.
        const _psp = new Mapper(JSON.parse(JSON.stringify(state.selectedPrescription.prescriptions[0])));
        if (key) {
          _psp.write(key, value);
          state.selectedPrescription.prescriptions[0] = _psp.mapObject;
          state.list.forEach((_,idx) => {
            if (_[0].id === state.selectedPrescription.prescriptions[0].id) {
              _[0] = state.selectedPrescription.prescriptions[0];
            }
          })
        }
    })
    .addCase(signAndUploadBundlesAction, (state, { payload: bundles }) => {
        // Send a list of a list of a list
        serverWebSocketActionForwarder.send({type: "SignAndUploadBundles", bearerToken: window.bearerToken, payload: [bundles]});
    });
})