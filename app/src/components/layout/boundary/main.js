import BElement         from "../../../models/BElement.js";
import { html }         from "../../../libs/lit-html.js";
import { showPopupAll } from "../../../components/popup/control/PopupControl.js";
import {
  signAndUploadBundles
} from "../../../prescriptions/control/UnsignedPrescriptionControl.js";
import {  } from "../../../components/popup/boundary/PrescriptionEditPopup.js";
import { initialPath } from "../../../libs/helper/helper.js";

class MainLayout extends BElement {
  doClickId() {
    signAndUploadBundles(this.state.prescriptions.list);
    showPopupAll();
  }

  view() {
    if (this.state.mainReducer.isMuster) {
			document.body.setAttribute("class", "home-page");
		} else {
			document.body.setAttribute("class", "home-page lean-start-page");
		}

    return html`
      <div class="main-content-wrapper">
        <header class="header-wrapper">
          <div class="header">
            <div class="logo">
              <a href="${initialPath}/index.html">
              <img
								src = "assets/images/ere.health-logo.svg"
								alt = "ere.helath Logo"
              /></a>
            </div>
            <div>
              <a href="${initialPath}/settings" style="justify-content: left;" class="link-button">Einstellungen</a>
            </div>
            <div>
              <unsigned-prescription-list />
            </div>

            <div class="generated-pdf">
              <p>Erzeugte PDF’s</p>
              <previous-prescription-list />
            </div>

            <div class="jetzt-area">
              <p>
                <img src="assets/images/arrow-down.svg" alt="" /> Rezepte
                signieren und für Patienten direkt ausstellen.
              </p>
              <button
                data-modal-target = "#modal"                                                                     
                @click            = "${this.state.prescriptions.list.length ? () => this.doClickId() : void 0}"  
                class             = "jet-btn ${this.state.prescriptions.list.length ? "" : "btn-inactive"}">
                Jetzt alle Rezepte signieren
              </button>
            </div>
          </div>
        </header>

        <section class="recipe-body"></section>
        <!-- / Each patient items wrapper -->
        <edit-popup />
        <prescription-popup />
      </div>
    `;
  }
}

customElements.define("main-layout", MainLayout);
