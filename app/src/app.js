import { Router } from "./libs/vaadin-router.js";
import store      from "./store.js";             
import './components/popup/boundary/popup.js';
import './components/layout/boundary/main.js';
import './prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js';
import loadVosBundleAndConvertToPrescriptionBundle from './prescriptions/boundary/vos/VOSBoundary.js';
import './prescriptions/boundary/PrescriptionEmpty.js';
import './prescriptions/boundary/PrescriptionItem.js';
import './prescriptions/boundary/UnsignedPrescriptionList.js';
import './prescriptions/boundary/PreviousPresciptionList.js';
import './prescriptions/boundary/PrescriptionPdf.js';
import { save } from "./localstorage/control/StorageControl.js";
import { initialPath } from "./libs/helper/helper.js";


store.subscribe(_ => { 
    const state = store.getState();
    // Disable saving of state for testing purposes
    // save(state);
})
const outlet = document.querySelector('.recipe-body');
const router = new Router(outlet);

router.setRoutes([
  { path: `${initialPath}/`                           , component: 'prescription-empty', action: () => {
      const vosBundleUrl = new URL(window.location.href).searchParams.get("vosBundleUrl");
      if(vosBundleUrl) {
        loadVosBundleAndConvertToPrescriptionBundle(vosBundleUrl);
      }
    }
  },
  { path: `${initialPath}/index.html`                 , component: 'prescription-empty' },
  { path: `${initialPath}/print`                      , component: 'prescription-empty' },
  { path: `${initialPath}/prescription/:prescription` , component: 'prescription-item'  },
  { path: `${initialPath}/previous/:prescription`     , component: 'prescription-pdf'  }
]);
console.log("router initialized");
