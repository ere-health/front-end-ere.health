import { configureStore } from "./libs/redux-toolkit.esm.js";                   
import { load }           from "./localstorage/control/StorageControl.js";      
import { prescriptions }  from "./prescriptions/entity/PrescriptionsReducer.js";
import { popupReducer }   from "./components/popup/entity/PopupReducer.js";     
import { mainReducer }   from "./components/layout/entity/MainReducer.js";   
import { settingsReducer }   from "./components/settings/entity/SettingsReducer.js";     
import { statusReducer }   from "./components/status/entity/StatusReducer.js";     
import { cardsReducer }   from "./components/cards/entity/CardsReducer.js";     
import { medicationItemReducer }   from "./components/medication/entity/MedicationItemReducer.js";     
import { showPopupId }    from "./components/popup/control/PopupControl.js";    

const reducer = {
  prescriptions,
  popupReducer,
  settingsReducer,
  mainReducer,
  statusReducer,
  cardsReducer,
  medicationItemReducer
};

const preloadedState = load();

// if popup was shown remove it
delete preloadedState?.popupReducer?.showPopup;

const config         = preloadedState ? { reducer, preloadedState } : { reducer };
const store          = configureStore(config);                                    

export default store;
