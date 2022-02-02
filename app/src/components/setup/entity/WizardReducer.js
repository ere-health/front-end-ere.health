import { createReducer } from "../../../libs/redux-toolkit.esm.js"
import serverWebSocketActionForwarder from "../../../prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js";
import {
    updateRuntimeConfigAction,
    closeWizardAction,
    showWizardAction,
    sshTunnelWorkedAction,
    resetSshTunnelWorkedAction
} from "../control/WizardControl.js";


const initialState = {
  showWizard: true,
  sshTunnelWorked: false,
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
  
export const wizardReducer = createReducer(initialState, (builder) => {
    builder.addCase(updateRuntimeConfigAction,  (state, {payload: {path,value}}) => {
        state.runtimeConfig[path] = value;
    }).addCase(closeWizardAction, (state, {}) => {
		serverWebSocketActionForwarder.runtimeConfig(JSON.parse(JSON.stringify(state.runtimeConfig)));
		state.showWizard = false;
	}).addCase(showWizardAction, (state, {}) => {
		state.showWizard = true;
	}).addCase(sshTunnelWorkedAction, (state, {}) => {
		state.sshTunnelWorked = true
	}).addCase(resetSshTunnelWorkedAction, (state, {}) => {
		state.sshTunnelWorked = false
	});
});