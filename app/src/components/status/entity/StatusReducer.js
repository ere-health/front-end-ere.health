import { createReducer } from "../../../libs/redux-toolkit.esm.js"
import serverWebSocketActionForwarder from "../../../prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js";
import {
    requestStatusAction,
    updateStatusFromServerAction
} from "../control/StatusControl.js";


const initialState = {
  status: {
      connectorReachable:false,
      informationConnectorReachable:"<<FrontEnd Initial State>>"
  }
};
  
export const statusReducer = createReducer(initialState, (builder) => {
    builder.addCase(requestStatusAction, (state) => { 
        serverWebSocketActionForwarder.send({ type: "RequestStatus"});
    });
    builder.addCase(updateStatusFromServerAction,  (state, {payload: {status}}) => {
        state.status = status;
    });
});