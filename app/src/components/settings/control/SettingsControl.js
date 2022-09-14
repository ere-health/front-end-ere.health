import { createAction } from "../../../libs/redux-toolkit.esm.js";
import store from "../../../store.js";

export const updateSettingAction = createAction("updateSettingAction");
export const updateSetting = (path, value) => {
    store.dispatch(updateSettingAction({path, value}));
}

export const resetSettingsAction = createAction("resetSettingsAction");
export const resetSettings = () => {
    store.dispatch(resetSettingsAction());
}

export const saveSettingsAction = createAction("saveSettingsAction");
export const saveSettings = () => {
    store.dispatch(saveSettingsAction());
}

export const updateSettingsFromServerAction = createAction("updateSettingsFromServerAction");
export const updateSettingsFromServer = (settings) => {
    store.dispatch(updateSettingsFromServerAction({settings}));
}

export const addDefaultFieldsToBundleAction = createAction("addDefaultFieldsToBundleAction");
export const addDefaultFieldsToBundle = (bundles) => {
    store.dispatch(addDefaultFieldsToBundleAction({bundles}));
}