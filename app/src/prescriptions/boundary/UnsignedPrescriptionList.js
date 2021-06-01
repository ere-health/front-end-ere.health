import BElement             from "../../models/BElement.js";
import { html }             from "../../libs/lit-html.js";
import { i18n }             from "../../libs/i18n/i18n.js";
import {selectPrescription} from "../control/UnsignedPrescriptionControl.js"
import {setMusterTheme} from "../../components/layout/control/MainControl.js"
import { initialPath } from "../../libs/helper/helper.js";

class UnsignedPrescriptionList extends BElement {

    extractState({prescriptions: {list}}) {
        return list;
    }

    onNavigate(unsignedPrescriptionBundles) {
      setMusterTheme();
      selectPrescription(unsignedPrescriptionBundles, false)
    }

    view() {
        let i = 0;
        return html`
        <div class="unsigned-prescription">
            <p>${i18n("UnsignedRecipes")}</p>
            <div class="unsignierte-list" style="display: flex;flex-direction: column;align-items: flex-start;">
                ${
                  (() => {
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
                    let patient     = unsignedPrescription.entry.filter(oEntry => oEntry.resource.resourceType === "Patient")[0];
                    let name        = patient.resource && patient.resource.name ? patient.resource.name[0] : {"given": [], "family": ""};
                    let displayName = name?.given?.join(" ") +" " + name?.family;
                    return html`
                        <a
                            href    = "${initialPath}/prescription/${unsignedPrescription.id}"
                            @click  = "${() => this.onNavigate(unsignedPrescriptionBundles)}"
                            class   = "unsigned-button link-button"
                            data-id = "#unsigned_1"><img src="assets/images/pending-icon.svg" alt="" />${displayName}</a>`
                    }
                )}
            </div>
        </div>
        `;
    }
}
customElements.define('unsigned-prescription-list', UnsignedPrescriptionList);