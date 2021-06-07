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
import { Mapper } from "./libs/helper/Mapper.js";

var browser = (function (agent) {
  switch (true) {
      case agent.indexOf("edge") > -1: return "edge";
      case agent.indexOf("edg") > -1: return "chromium based edge (dev or canary)";
      case agent.indexOf("opr") > -1 && !!window.opr: return "opera";
      case agent.indexOf("chrome") > -1 && !!window.chrome: return "chrome";
      case agent.indexOf("trident") > -1: return "ie";
      case agent.indexOf("firefox") > -1: return "firefox";
      case agent.indexOf("safari") > -1: return "safari";
      default: return "other";
  }
})(window.navigator.userAgent.toLowerCase());

if (browser !== "chrome") {
function addActiveClass(modal) {
  if (modal == null) return
  modal.classList.add('active')
}
const overlay = document.getElementById("overlay");
const modal = document.querySelector("#browser-error");
addActiveClass(modal);
addActiveClass(overlay);
} else {

  store.subscribe(_ => { 
      const state = store.getState();
      // Disable saving of state for testing purposes
      save(state);
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
}
