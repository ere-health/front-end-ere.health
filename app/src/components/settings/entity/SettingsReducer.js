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
    connector: {
        "base-uri": "",
        "verify-hostname": false,
        "mandant-id": "",
        "client-system-id": "",
        "workplace-id": "",
        "user-id": "" 
    }
  }
};
  
export const settingsReducer = createReducer(initialState, (builder) => {
    builder.addCase(updateSettingAction,  (state, {payload: {path,value}}) => {
        const [group, key] = path.split(/\./);
        if(!state.settings[group]) {
            state.settings[group]= {};
        }
        state.settings[group][key] = value;
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
        for(let entry of Object.entries(settings)) {
            const [group, settingKey] = entry[0].split(/\./);
            if(!state.settings[group]) {
                state.settings[group] = {};
            }
            state.settings[group][settingKey] = entry[1];
        }
    });
});