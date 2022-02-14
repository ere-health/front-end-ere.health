import { createReducer } from "../../../libs/redux-toolkit.esm.js"
import serverWebSocketActionForwarder from "../../../prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js";
import {
    updateRuntimeConfigAction,
    closeWizardAction,
    showWizardAction,
    sshConnectionOfferingAction,
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
    "idp.base.url": "",
    "idp.client.id": "",
    "idp.auth.request.redirect.url": "",
    "ere.workflow-service.prescription.server.url": ""
  }
};
  
export const wizardReducer = createReducer(initialState, (builder) => {
  builder.addCase(updateRuntimeConfigAction,  (state, {payload: {path,value}}) => {
    state.runtimeConfig[path] = value;
    if(path == "connector.https" || path == "connector.ip") {
      state.runtimeConfig["connector.base-url"] = "http"+(state.runtimeConfig["connector.https"] ? "s" : "")+"://"+state.runtimeConfig["connector.ip"];
    }
  }).addCase(closeWizardAction, (state, {}) => {
		serverWebSocketActionForwarder.runtimeConfig(JSON.parse(JSON.stringify(state.runtimeConfig)));
		state.showWizard = false;
	}).addCase(showWizardAction, (state, {}) => {
		state.showWizard = true;
	}).addCase(sshTunnelWorkedAction, (state, {payload}) => {
    state.sshTunnelWorked = true
	}).addCase(sshConnectionOfferingAction, (state, {payload}) => {
    state.runtimeConfig["idp.base.url"] = "https://localhost:"+payload.ports[1];
    state.runtimeConfig["idp.client.id"] = payload.idpClientId;
    state.runtimeConfig["idp.auth.request.redirect.url"] = payload.idpAuthRequestRedirectURL;
    state.runtimeConfig["ere.workflow-service.prescription.server.url"] = "https://localhost:"+payload.ports[2];
	})
  .addCase(resetSshTunnelWorkedAction, (state, {}) => {
		state.sshTunnelWorked = false
	});
});