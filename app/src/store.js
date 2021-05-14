import { configureStore } from "./libs/redux-toolkit.esm.js";                   
import { load }           from "./localstorage/control/StorageControl.js";      
import { prescriptions }  from "./prescriptions/entity/PrescriptionsReducer.js";
import { popupReducer }   from "./components/popup/entity/PopupReducer.js";     
import { showPopupId }    from "./components/popup/control/PopupControl.js";    

const reducer = {
  prescriptions,
  popupReducer,
};

const preloadedState = load();                                                    
const config         = preloadedState ? { reducer, preloadedState } : { reducer };
const store          = configureStore(config);                                    

export default store;

/*setTimeout(() => {
    console.log("dsss")
    showPopupId();
}, 5000)*/
