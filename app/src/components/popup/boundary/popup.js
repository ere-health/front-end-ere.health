import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";
import {
  addActiveClass,
  removeActiveClass,
} from "../../../libs/helper/helper.js";
import { i18n } from "../../../libs/i18n/i18n.js";
import { signedPrescription } from "../../../prescriptions/control/UnsignedPrescriptionControl.js";
import { _hidePopup, showPopupId, showPopupFatig, showPopupProgress } from "../control/PopupControl.js";
import { initialPath } from "../../../libs/helper/helper.js";

class Popup extends BElement {
  showPopup(key) {
    //key = "organizationEdit" // debug purpose
    //Close all popup before
    this.hideAll();

    // Open selected popup
    const overlay = document.getElementById("overlay");
    const modal = document.querySelector("#" + key);
    addActiveClass(modal);
    addActiveClass(overlay);
  }

  hidePopup(key) {
    const overlay = document.getElementById("overlay");
    const modal = document.querySelector("#" + key);
    removeActiveClass(modal);
    removeActiveClass(overlay);
  }

  hideAll() {
    ["id", "processing", "fatig", "patientEdit", "statusEdit", "organizationEdit", "clinicEdit", "PractIdEdit", "medicEdit"].forEach(_ => this.hidePopup(_));
  }

  doSign() {
    _hidePopup();
    if (this.state.popupReducer.all) {
      const all = this.state.prescriptions.list.map((_) => _);
      all.forEach((_) => {
        signedPrescription(_);
      });
    } else {
      signedPrescription(this.state.prescriptions.selectedPrescription.prescriptions);
    }
  }

  view() {
    return html`
      ${this.state.popupReducer.showPopup 
        ? this.showPopup(this.state.popupReducer.showPopup)
        : this.hideAll()}
      <section class="popup">
        <div class="modal" id="id" style="max-width: 1200px; width: 1200px; max-height: 80vh; overflow-x: auto;">
          <div class="modal-title">
            <p>
              ${i18n("popupLoginText")[0]}<strong>${i18n("popupLoginText")[1]}</strong>${i18n("popupLoginText")[2]}
            </p>
          </div>
          <div class="modal-image">
            <img src="./assets/images/popup-icon.png" alt="popup" />
          </div>
          <div>
          ${this.state.prescriptions.HTMLBundles ? this.state.prescriptions.HTMLBundles.map(item => {
            const blob = new Blob([item], {type: "text/html; charset=utf-8"});
            const htmlBundleXsltResultUrl = URL.createObjectURL(blob);
            return html`<iframe src="${htmlBundleXsltResultUrl}" style="height: 560px; width: 1000px;"></iframe>`;
          }) : ""}
          </div>
          <div class="modal-buttons">
            <button data-close-button class="cancel" @click="${() => _hidePopup()}">${i18n("popupLoginBtnCancel")}</button>
            <button data-modal-target-processing="#processing" @click="${() => this.doSign()}" class="ok-next">${i18n("popupLoginBtnNext")}</button>
          </div>
        </div>

        <medicament-edit-popup></medicament-edit-popup>
        <patient-edit-popup></patient-edit-popup>
        <organization-edit-popup></organization-edit-popup>
        <status-edit-popup></status-edit-popup>
        <clinic-edit-popup></clinic-edit-popup>
        <pract-id-edit-popup></pract-id-edit-popup>
        <div id="overlay"></div>
      </section>
    `;
  }
}

customElements.define("prescription-popup", Popup);
