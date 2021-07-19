import { createReducer } from "../../../libs/redux-toolkit.esm.js"
import serverWebSocketActionForwarder from "../../../prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js";
import {
    updateSettingAction,
    checkSettingsAction,
    saveSettingsAction,
    resetSettingsAction,
    updateSettingsFromServerAction
} from "../control/SettingsControl.js";


const initialState = {
  settings: {
    "connector.base-url": "",
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
    builder.addCase(updateSettingAction,  (state, {payload: {path,value}}) => {
        state.settings[path] = value;
    });
    builder.addCase(resetSettingsAction, (state) => {
        // Send a list of a list of a list    
        serverWebSocketActionForwarder.send({ type: "RequestSettings"});
    });
    builder.addCase(saveSettingsAction, (state) => {
        // Send a list of a list of a list    
        serverWebSocketActionForwarder.send({ type: "SaveSettings", payload: state.settings});
    });
    builder.addCase(checkSettingsAction, (state) => {
        // Send a list of a list of a list    
        serverWebSocketActionForwarder.send({ type: "CheckSettings", payload: state.settings});
    });
    builder.addCase(updateSettingsFromServerAction,  (state, {payload: {settings}}) => {
        state.settings = settings;
    });
});