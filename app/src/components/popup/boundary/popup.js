import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";
import {
  addActiveClass,
  removeActiveClass,
} from "../../../libs/helper/helper.js";
import { i18n, setLocale } from "../../../libs/i18n/i18n.js";
import { signedPrescription } from "../../../prescriptions/control/UnsignedPrescriptionControl.js";
import { _hidePopup } from "../control/PopupControl.js";

class Popup extends BElement {
  showPopup(key) {
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

  onRendered() {
    const _this = this;
    const hidePopup = () => _this.hidePopup();

    document
      .querySelectorAll("[data-close-button]")
      .forEach((_) => _?.removeEventListener("click", hidePopup));
    document
      .querySelectorAll("[data-close-button]")
      .forEach((_) => _.addEventListener("click", hidePopup));

    const clickProcess = () => {
      this.hidePopup("id");
      this.showPopup("processing");
    };
    document
      .querySelector("[data-modal-target-processing]")
      ?.removeEventListener("click", clickProcess);
    document
      .querySelector("[data-modal-target-processing]")
      .addEventListener("click", clickProcess);
    const clickFatig = () => {
      this.hidePopup("processing");
      this.showPopup("fatig");
      const clickPrint = () => {
        this.hidePopup("fatig");
        _hidePopup();
        
        if (this.state.popupReducer.all) {
          const all = this.state.prescriptions.list.map(_ => _);
          all.forEach(_ => {
            
            signedPrescription(_);
          })
        } else {
          signedPrescription(
            this.state.prescriptions.list[
              window.location.pathname.split("/").pop()
            ]
            );
          }
      };
      document
        .querySelector("#print")
        ?.removeEventListener("click", clickPrint);
      document.querySelector("#print").addEventListener("click", clickPrint);
    };
    document
      .querySelector("[data-modal-target-fatig]")
      ?.removeEventListener("click", clickFatig);
    document
      .querySelector("[data-modal-target-fatig]")
      .addEventListener("click", clickFatig);
  }

  view() {
    return html`
      ${this.state.popupReducer.showPopup &&
      this.showPopup(this.state.popupReducer.showPopup)}
      <section class="popup">
        <div class="modal" id="id">
          <div class="modal-title">
            <p>
              Bitte legen Sie jetzt Ihren
              <strong>digitalen Arztausweis auf das Kartenlesegerät</strong> und
              geben Sie ihre Pin ein.
            </p>
          </div>
          <div class="modal-image">
            <img src="../assets/images/popup-icon.png" alt="popup" />
          </div>
          <div class="modal-buttons">
            <button data-close-button class="cancel">Abbrechen</button>
            <button data-modal-target-processing="#processing" class="ok-next">
              Ok, Weiter
            </button>
          </div>
        </div>

        <div class="modal" id="processing">
          <div class="modal-title">
            <p>
              Arztausweis erkannt.
              <strong>Rezepte werden erzeugt. </strong>Bitte warten.
            </p>
          </div>
          <div class="modal-image">
            <img src="../assets/images/popup-icon2.png" alt="popup" />
          </div>
          <div class="modal-buttons">
            <button data-modal-target-fatig="#fatig" class="grow-in-wealth">
              Bitte warten
            </button>
          </div>
        </div>

        <div class="modal" id="fatig">
          <div class="modal-title">
            <p>Rezept erzeugt und <strong>an Patient versandt</strong></p>
          </div>
          <div class="modal-image">
            <img src="../assets/images/popup-icon3.png" alt="popup" />
          </div>
          <div class="modal-buttons">
            <a href="/print.html" id="print" class="grow-in-wealth"> Fertig</a>
          </div>
        </div>
        <div id="overlay"></div>
      </section>
    `;
  }
}

customElements.define("prescription-popup", Popup);
