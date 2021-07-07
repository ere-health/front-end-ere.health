import BElement from "../../models/BElement.js";
import { html } from "../../libs/lit-html.js";
import { i18n } from "../../libs/i18n/i18n.js";
import {setLeanTheme} from "../../components/layout/control/MainControl.js"
import { initialPath } from "../../libs/helper/helper.js";
import { selectPrescription, abortTasks} from "../control/UnsignedPrescriptionControl.js"

class PreviousPrescriptionList extends BElement {

    extractState({prescriptions: {signedList}}) {
        return signedList;
    }

    onNavigate(previousPrescriptionBundles) {
      setLeanTheme();
      selectPrescription(previousPrescriptionBundles, true);
    }

    onAbort(previousPrescriptionBundles) {
      abortTasks(previousPrescriptionBundles.bundleWithAccessCodeOrThrowables);
    }

    view() {
        let i = 0;
        return html`
            <div class="generated-list" style="display: flex;flex-direction: column;align-items: flex-start;">
                ${
                  (() => {
                    if (!this.state.length) {
                      return html`
                        <div class="empty-prescription-folder">
                          <img src="${initialPath}/assets/images/folder.svg"/>
                          <span>Keine PDF’s vorhanden.</span>
                        </div>
                        `;
                    }
                  })()
                }
                ${this.state.map(previousPrescriptionBundles => {
                    const previousPrescription = previousPrescriptionBundles.bundleWithAccessCodeOrThrowables[0].bundle;
                    let patient     = previousPrescription.entry.filter(oEntry => oEntry.resource.resourceType === "Patient")[0];
                    let name        = patient.resource && patient.resource.name ? patient.resource.name[0] : {"given": [], "family": ""};
                    let displayName = name.given.join(" ")+" "+name.family;
                    return html`<div><a 
                      href    = "${initialPath}/previous/${previousPrescription.id}" 
                      class   = "unsigned-button link-button"
                      @click  = "${() => this.onNavigate(previousPrescriptionBundles)}"
                      data-id = "#unsigned_1"><img src="/assets/images/tik-.svg" alt="" />${displayName}</button><a class="link-button remove-button" title="Stornieren" @click="${() => this.onAbort(previousPrescriptionBundles)}" href="#">X</a></div>`
                    }
                )}
            </div>
        `;
    }
}
customElements.define('previous-prescription-list', PreviousPrescriptionList);
