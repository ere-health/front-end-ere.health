import { createReducer } from "../../../libs/redux-toolkit.esm.js"
import serverWebSocketActionForwarder from "../../../prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js";
import {
    updateSettingAction,
    saveSettingsAction,
    resetSettingsAction,
    updateSettingsFromServerAction,
    addDefaultFieldsToBundleAction
} from "../control/SettingsControl.js";


const initialState = {
  settings: {
    "practitioner.lanr": "",
    "organization.bsnr": "",
    "organization.phone": "",
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
        let kim = {};
        for(let p in state.settings) {
            if(p.startsWith("kim")) {
                kim[p] = state.settings[p];
            }
        }
        state.settings = settings;
        for(let p in kim) {
          state.settings[p] = kim[p];
        }
    });
    builder.addCase(addDefaultFieldsToBundleAction,  (state, {payload: {bundles}})) {
        for(let bundleList of bundles) {
            for(let bundle of bundleList) {
                try {
                    if(bundle.entry.length == 0) {
                        continue;
                    }
                    let aPractitioner = bundle.entry.filter(o => o.resource.resourceType == "Practitioner");
                    if(aPractitioner.length == 0) {
                        continue;
                    }
                    let oPractitioner = aPractitioner[0].resource;
                    if(!oPractitioner.identifier || oPractitioner.identifier.length == 0) {
                        continue;
                    }
                    if(!oPractitioner.identifier[0].value) {
                        oPractitioner.identifier[0].value = state.settings["practitioner.lanr"];
                    }

                    let aOrganization = bundle.entry.filter(o => o.resource.resourceType == "Organization");
                    if(aOrganization.length == 0) {
                        continue;
                    }
                    let oOrganization = aOrganization[0].resource;
                    if(!oOrganization.identifier || oOrganization.identifier.length == 0) {
                        continue;
                    }
                    if(!oOrganization.identifier[0].value) {
                        oOrganization.identifier[0].value = state.settings["organization.bsnr"];
                    }
                    if(!oOrganization.telecom || oOrganization.telecom.length == 0) {
                        continue;
                    }
                    if(!oOrganization.telecom[0].value) {
                        oOrganization.telecom[0].value = state.settings["organization.phone"];
                    }
                } catch(e) {
                    console.error(e);
                }
            }
        }
    }
});