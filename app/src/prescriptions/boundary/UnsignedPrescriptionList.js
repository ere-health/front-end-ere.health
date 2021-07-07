import BElement from "../../models/BElement.js";
import { html } from "../../libs/lit-html.js";
import { i18n } from "../../libs/i18n/i18n.js";
import { selectPrescription, createNewPrescription, deletePrescription } from "../control/UnsignedPrescriptionControl.js"
import { setMusterTheme } from "../../components/layout/control/MainControl.js"
import { initialPath } from "../../libs/helper/helper.js";
import { Mapper } from "../../libs/helper/Mapper.js";

class UnsignedPrescriptionList extends BElement {

  extractState({ prescriptions: { list } }) {
    return list;
  }

  onNavigate(unsignedPrescriptionBundles) {
    setMusterTheme();
    selectPrescription(unsignedPrescriptionBundles, false);
  }

  onDelete(id) {
    deletePrescription(id);
  }
  

  view() {
    let i = 0;
    return html`
        <div class="unsigned-prescription">
            <p>${i18n("UnsignedRecipes")}</p> <button id = "create-new-prescription-button" @click = "${() => createNewPrescription()}" class = "open-modal jet-btn">neues Rezept erstellen</button>
            <div class="unsignierte-list" style="display: flex;flex-direction: column;align-items: flex-start;">
                ${(() => {
        if (!this.state.length) {
          return html`
                        <div class="empty-prescription-folder">
                          <img src="${initialPath}/assets/images/folder.svg"/>
                          <span>Keine Rezepte vorhanden.</span>
                        </div>
                        `;
        }
      })()
      }
                ${this.state.map(unsignedPrescriptionBundles => {
        const unsignedPrescription = unsignedPrescriptionBundles[0];
        const _psp = new Mapper(unsignedPrescription);

        let displayName = "New prescription";
        if (_psp.read("entry[resource.resourceType?Patient].resource.name[0].family", "")) {
          displayName = [
            _psp.read("entry[resource.resourceType?Patient].resource.name[0].given", []).join(" "),
            _psp.read("entry[resource.resourceType?Patient].resource.name[0].family")
          ].filter(_ => _).join(" ");
        }

        return html`<div>
                        <a
                            href    = "${initialPath}/prescription/${unsignedPrescription.id}"
                            @click  = "${() => this.onNavigate(unsignedPrescriptionBundles)}"
                            class   = "unsigned-button link-button"
                            data-id = "#unsigned_1"><img src="assets/images/pending-icon.svg" alt="" />${displayName}</a><a class="link-button remove-button" title="Löschen" @click="${() => this.onDelete(unsignedPrescription.id)}" href="#">X</a>
                    </div>`
      }
      )}
            </div>
        </div>
        `;
  }
}
customElements.define('unsigned-prescription-list', UnsignedPrescriptionList);