import { configureStore } from "./libs/redux-toolkit.esm.js";                   
import { load }           from "./localstorage/control/StorageControl.js";      
import { prescriptions }  from "./prescriptions/entity/PrescriptionsReducer.js";
import { popupReducer }   from "./components/popup/entity/PopupReducer.js";     
import { mainReducer }   from "./components/layout/entity/MainReducer.js";   
import { settingsReducer }   from "./components/settings/entity/SettingsReducer.js";     
import { statusReducer }   from "./components/status/entity/StatusReducer.js";     
import { cardsReducer }   from "./components/cards/entity/CardsReducer.js";     
import { wizardReducer }   from "./components/setup/entity/WizardReducer.js";
import { showPopupId }    from "./components/popup/control/PopupControl.js";
import serverWebSocketActionForwarder from "./prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js";

const reducer = {
  prescriptions,
  popupReducer,
  settingsReducer,
  mainReducer,
  statusReducer,
  cardsReducer,
  wizardReducer
};

const preloadedState = load();

// if popup was shown remove it
delete preloadedState?.popupReducer?.showPopup;

if(preloadedState?.wizardReducer?.runtimeConfig) {
  serverWebSocketActionForwarder.runtimeConfig(preloadedState?.wizardReducer?.runtimeConfig);
}

const config         = preloadedState ? { reducer, preloadedState } : { reducer };
const store          = configureStore(config);                                    

export default store;
