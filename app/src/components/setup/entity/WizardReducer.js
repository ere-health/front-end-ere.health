import { createReducer } from "../../../libs/redux-toolkit.esm.js"
import serverWebSocketActionForwarder from "../../../prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js";
import {
    updateRuntimeConfigAction
} from "../control/WizardControl.js";


const initialState = {
  runtimeConfig: {
    "connector.base-url": "",
    "connector.ip": "",
    "connector.https": true,
    "connector.mandant-id": "",
    "connector.client-system-id": "",
    "connector.workplace-id": "",
    "connector.user-id": "",
    "connector.client-certificate": "",
    "connector.client-certificate-password": "",
    "connector.basic-auth-username": "",
    "connector.basic-auth-password": "",
  }
};
  
export const settingsReducer = createReducer(initialState, (builder) => {
    builder.addCase(updateRuntimeConfigAction,  (state, {payload: {path,value}}) => {
        state.runtimeConfig[path] = value;
    });
});