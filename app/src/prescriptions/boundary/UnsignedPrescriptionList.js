import BElement from "../../BElement.js";
import { html } from "../../libs/lit-html.js";
import { selectPrescription } from "../control/UnsignedPrescriptionControl.js";

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
                    let name = unsignedPrescription.entry.filter(oEntry => oEntry.resource.resourceType === "Patient")[0].resource.name[0];
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