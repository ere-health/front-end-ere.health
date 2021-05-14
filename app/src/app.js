import { Router } from "./libs/vaadin-router.js";
import store      from "./store.js";             
import './components/popup/boundary/popup.js';
import './components/layout/boundary/main.js';
import './prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js';
import './prescriptions/boundary/PrescriptionEmpty.js';
import './prescriptions/boundary/PrescriptionItem.js';
import './prescriptions/boundary/LoadExamples.js';
import './prescriptions/boundary/UnsignedPrescriptionList.js';
import './prescriptions/boundary/PreviousPresciptionList.js';
import { save } from "./localstorage/control/StorageControl.js";


store.subscribe(_ => { 
    const state = store.getState();
    // Disable saving of state for testing purposes
    // save(state);
})
const outlet = document.querySelector('.recipe-body');
const router = new Router(outlet);

router.setRoutes([
  { path: '/'                           , component: 'prescription-empty' },
  { path: '/print'                      , component: 'prescription-empty' },
  { path: '/prescription/:prescription' , component: 'prescription-item'  }
]);
console.log("router initialized");
