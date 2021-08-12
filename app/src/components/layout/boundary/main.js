import BElement         from "../../../models/BElement.js";
import { html }         from "../../../libs/lit-html.js";
import { showPopupAll } from "../../../components/popup/control/PopupControl.js";
import {
  signAndUploadBundles,
  activateComfortSignature,
  deactivateComfortSignature
} from "../../../prescriptions/control/UnsignedPrescriptionControl.js";
import {  } from "../../../components/popup/boundary/PrescriptionEditPopup.js";
import { initialPath } from "../../../libs/helper/helper.js";

class MainLayout extends BElement {
  doClickId() {
    signAndUploadBundles(this.state.prescriptions.list);
    showPopupAll();
  }

  onComfortSignatureChange(enabled) {
    if(enabled) {
      activateComfortSignature();
    } else {
      deactivateComfortSignature();
    }
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
								alt = "ere.health Logo"
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
            <div class="comfort-signature">
              <p style="color: #11142D; font-weight: bold;">Komfortsignatur</p>
              <div style="position: absolute; ">
                <label class="switch" for="comfort-signature-checkbox" style="top: -3rem; left: 16rem;">
                  <input type="checkbox" id="comfort-signature-checkbox" @change="${(_) => this.onComfortSignatureChange(_.target.checked)}" />
                  <div class="slider round"></div>
                </label>
              </div>
              <p>Mehrere Rezepte ohne erneute PIN-Eingabe mit dem eHBA signieren.</p>
            </div>
            ${this.state.prescriptions.GetSignatureModeResponse && this.state.prescriptions.GetSignatureModeResponse.comfortSignatureStatus == "ENABLED" ? html`
              <table style="font-size: 80%; margin-bottom: 2rem; font-weight: 500; color: #808191;">
                <tr>
                  <td>Anzahl Signaturen</td>
                  <td>${this.state.prescriptions.GetSignatureModeResponse.comfortSignatureMax}</td>
                </tr>
                <tr>
                  <td>Möglich in Zeitraum</td>
                  <td>${this.state.prescriptions.GetSignatureModeResponse.comfortSignatureTimer}</td>
                </tr>
                <tr>
                  <td>Noch möglich</td>
                  <td>${this.state.prescriptions.GetSignatureModeResponse.sessionInfo.countRemaining}</td>
                </tr>
                <tr>
                  <td>In Zeitraum</td>
                  <td>${this.state.prescriptions.GetSignatureModeResponse.sessionInfo.timeRemaining}</td>
                </tr>
              </table>
            ` : ""}
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
