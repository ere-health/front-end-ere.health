import { configureStore } from "./libs/redux-toolkit.esm.js";                   
import { load }           from "./localstorage/control/StorageControl.js";      
import { prescriptions }  from "./prescriptions/entity/PrescriptionsReducer.js";
import { popupReducer }   from "./components/popup/entity/PopupReducer.js";     
import { mainReducer }   from "./components/layout/entity/MainReducer.js";     
import { showPopupId }    from "./components/popup/control/PopupControl.js";    

const reducer = {
  prescriptions,
  popupReducer,
  mainReducer
};

const preloadedState = load();

// if popup was shown remove it
delete preloadedState?.popupReducer?.showPopup;

const config         = preloadedState ? { reducer, preloadedState } : { reducer };
const store          = configureStore(config);                                    

export default store;
