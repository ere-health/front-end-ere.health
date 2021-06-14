import { Mapper } from "../../libs/helper/Mapper.js";
import { createReducer } from "../../libs/redux-toolkit.esm.js"
import { save } from "../../localstorage/control/StorageControl.js";
import serverWebSocketActionForwarder from "../boundary/websocket/WebSocketHandler.js";
import { 
    addPrescriptionAction, 
    signedPrescriptionAction, 
    updatePrescriptionAction,
    selectPrescriptionAction,
    signAndUploadBundlesAction
} from "../control/UnsignedPrescriptionControl.js";
import { 
  addSignedPrescriptionAction,
  sendSignedPrescriptionAction
} from "../control/SignedPrescriptionControl.js";

const initialState = {
    list                 : [] ,
    signedList           : [] ,
    selectedPrescription : {} ,
    isPrevious           : false
}

var db = new PouchDB("Prescriptions");

export const prescriptions = createReducer(initialState, (builder) => {
    builder
    //Add prescription to the unsigned list
    .addCase(addPrescriptionAction, (state, {payload: prescription}) => {
        if (!state.list.filter(_ => _[0].id ===  prescription[0].id).length) {
          state.list = state.list.concat([prescription]);
        }
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
    .addCase(updatePrescriptionAction, (state, { payload: { name, value, key } }) => {
        state.selectedPrescription.updatedProps[name] = value;
        const _psp = new Mapper(state.selectedPrescription.prescriptions[0]);
        if (key) {
          _psp.write(key, value);
          state.list.forEach((_,idx) => {
            if (_[0].id === state.selectedPrescription.prescriptions[0].id) {
              _[0] = state.selectedPrescription.prescriptions[0];
            }
          })
          save(state);
        }
    })
    .addCase(signAndUploadBundlesAction, (state, { payload: bundles }) => {
        //Send a list of a list of a list :)
        serverWebSocketActionForwarder.send({type: "SignAndUploadBundles", bearerToken: window.bearerToken, payload: [bundles]});
    })
    //Add the signed prescription to the store
    .addCase(addSignedPrescriptionAction, (state, {payload: bundles}) => 
      state.signedList = state.signedList.concat([bundles])
    )
     //Send the pdf to the POST endpoint
    .addCase(sendSignedPrescriptionAction, (state, {payload}) => {
      console.log("payload received from action:" + payload);
      const payloadToSend = {"patient": payload.displayName, "document": payload.pdfEncodedInBase64 };
      console.log("Now sending document with payload:" + payloadToSend);
      
      // ajax({
      //   url: "http://127.0.0.1:8080/erixa/sync",
      //   type: "POST",
      //   data: payload,
      //   success: function (a) {
      //     console.log("prescription send successfully to post endpoint");
      //   }
      // });
    });
})