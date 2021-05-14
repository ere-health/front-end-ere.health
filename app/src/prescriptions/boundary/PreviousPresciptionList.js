import BElement from "../../models/BElement.js";
import { html } from "../../libs/lit-html.js";
import { i18n } from "../../libs/i18n/i18n.js";

class PreviousPrescriptionList extends BElement {

    extractState({prescriptions: {signedList}}) {
        return signedList;
    }

    view() {
        let i = 0;
        return html`
            <div class="generated-list">
                ${this.state.map(unsignedPrescription => {
                    let patient     = unsignedPrescription[0].entry.filter(oEntry => oEntry.resource.resourceType === "Patient")[0];
                    let name        = patient.resource && patient.resource.name ? patient.resource.name[0] : {"given": [], "family": ""};
                    let displayName = name.given.join(" ")+" "+name.family;
                    return html`<a href="/prescription/${i++}" class="unsigned-button link-button" data-id="#unsigned_1"> <img src="/assets/images/tik-.svg" alt="" />${displayName}</button>`
                    }
                )}
            </div>
        `;
    }
}
customElements.define('previous-prescription-list', PreviousPrescriptionList);
