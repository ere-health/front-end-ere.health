import { createAction } from "../../../libs/redux-toolkit.esm.js";
import store from "../../../store.js";

export const updateRuntimeConfigAction = createAction("updateRuntimeConfigAction");
export const updateRuntimeConfig = (path, value) => {
    store.dispatch(updateRuntimeConfigAction({path, value}));
}

export const closeWizardAction = createAction("closeWizardAction");
export const closeWizard = () => {
    store.dispatch(closeWizardAction());
}

export const showWizardAction = createAction("showWizardAction");
export const showWizard = () => {
    store.dispatch(showWizardAction());
}

export const sshTunnelWorkedAction = createAction("sshTunnelWorkedAction");
export const sshTunnelWorked = () => {
    store.dispatch(sshTunnelWorkedAction());
}

export const resetSshTunnelWorkedAction = createAction("resetSshTunnelWorkedAction");
export const resetSshTunnelWorked = () => {
    store.dispatch(resetSshTunnelWorkedAction());
}