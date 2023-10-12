import { createReducer } from "../../../libs/redux-toolkit.esm.js"
import serverWebSocketActionForwarder from "../../../prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js";
import {
    updateSettingAction,
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
    "kim.fromKimAddress": "",
    "kim.smtpHostServer": "",
    "kim.smtpPassword": "",
    "kim.smtpFdServer": "",
    "kim.mandant-id": "",
    "kim.client-system-id": "",
    "kim.workplace-id": "",
    "kim.user-id": "",
    "kim.vzd.base-url": "",
    "kim.vzd.client-certificate": "",
    "kim.vzd.client-certificate-password": "",
    "prefill.bsnr":"",
    "prefill.lanr":"",
    "prefill.phone":""
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
        setTimeout(() => serverWebSocketActionForwarder.send({ type: "RequestStatus", payload: {}}), 1000)
    });
    builder.addCase(updateSettingsFromServerAction,  (state, {payload: {settings}}) => {
        let clientOnlySettings = {};
        for(let p in state.settings) {
            if(p.startsWith("kim") || p.startsWith("prefill")) {
                clientOnlySettings[p] = state.settings[p];
            }
        }
        state.settings = settings;
        for(let p in clientOnlySettings) {
          state.settings[p] = clientOnlySettings[p];
        }
    });
});