import BElement from "../../models/BElement.js";
import { html } from "../../libs/lit-html.js";

class UnsignedPrescriptionList extends BElement {
    
    extractState({prescriptions: {list}}) {
        return list;
    }

    view() {
        let i = 0;
        return html`
        <div class="unsigned-prescription">
            <p>Unsignierte Rezepte</p>
            <div class="unsignierte-list">
                ${this.state.map(unsignedPrescription => {
                    let patient = unsignedPrescription.entry.filter(oEntry => oEntry.resource.resourceType === "Patient")[0];
                    let name = patient.resource && patient.resource.name ? patient.resource.name[0] : {"given": [], "family": ""};
                    let displayName = name.given.join(" ")+" "+name.family;
                    return html`<a href="/prescription/${i++}" class="unsigned-button link-button" data-id="#unsigned_1"> <img src="assets/images/pending-icon.svg" alt="" />${displayName}</button>`
                    }
                )} 
            </div>
        </div>
        `;
    }
}
customElements.define('unsigned-prescription-list', UnsignedPrescriptionList);