import BElement         from "../../../models/BElement.js";
import { html }         from "../../../libs/lit-html.js";
import { 
  changeMedicationItemProfile,
  updateMedicationItem,
  saveMedicationItem,
  clearMedicationItem,
  cancelMedicationItem,
  deleteMedicationItem
} from "../control/MedicationItemControl.js";
import {
    MedicationItemTypePZN,
    MedicationItemTypeFreeText,
    MedicationItemTypeIngredient,
    MedicationItemTypeCompounding
} from "../MedicationItemType.js";

import { FIELD_NORMGROESSE_TYPE, FIELD_DARREICH_TYPE } from "./fieldselectoptions.js";

class MedicationPopup extends BElement {

    extractState({medicationItemReducer: {medicationItem}}) {
        return medicationItem;
    }

    getProfileForm(profile) {
        switch (profile){
            case MedicationItemTypeFreeText.profile:
                return html`<!-- Show this form for FreeText  -->
                <div style="text-align:left">
                    <div class="fieldRow">
                        <label for="free.medicationText">Freitext</label>
                        <input id="free.medicationText" .value="${this.state?.resource?.code?.text}" @change="${_ => this.onUserInput(_,"resource.code.text")}" />
                    </div>
                </div>`;

            case MedicationItemTypePZN.profile:
                return html`<!-- Show this form for PZN  -->
                <div style="text-align:left">
                    <div class="fieldRow">
                        <label for="pzn.pznText">Handelsname</label>
                        <input id="pzn.pznText" .value="${this.state?.resource?.code?.text}" @change="${_ => this.onUserInput(_,"resource.code.text")}" />
                    </div>
                    <div class="fieldRow">
                        <label for="pzn.pznCode">PZN</label>
                        <input id="pzn.pznCode" .value="${this.state?.resource?.code?.coding[0]?.code}" @change="${_ => this.onUserInput(_,"rresource.code.coding.code")}" />
                        <!-- <edit-field statePath="prescriptions.MedikamentPopup" mapKey="pzn" label="PZN" ratio="0.5" id="medic-pzn"></edit-field> -->
                    </div>
                    <!-- <div class="fieldRow">
                        <edit-field statePath="prescriptions.MedikamentPopup" mapKey="quantityValue" label="Menge" id="medic-quantity"></edit-field>
                        <select-field statePath="prescriptions.MedikamentPopup" mapKey="norm" label="Normgröße" items="${JSON.stringify(FIELD_NORMGROESSE_TYPE)}"></select-field> 
                        <select-field statePath="prescriptions.MedikamentPopup" mapKey="form" label="Darreichungsform" items="${JSON.stringify(FIELD_DARREICH_TYPE)}"></select-field> 
                    </div>
                    <div class="fieldRow"> 
                        <edit-field statePath="prescriptions.MedikamentPopup" mapKey="dosageInstruction" label="Dosierungsanweisung" id="medic-dosage-instructions"</edit-field>
                    </div> -->
                </div>`;

            case MedicationItemTypeIngredient.profile:


            case MedicationItemTypeCompounding.profile:


            default:
        }
    }

    view() {
        let profile = this.state.resource?.meta?.profile[0];
        return html`
            <div class="modal" id="medicEdit" style="max-width: 800px;">
                <div class="modal-title" style="text-align:left">
                    <p style="text-align:left"><strong>Medikament</strong></p>
                </div>
                <select @change="${_ => changeMedicationItemProfile(_.target.value)}">
                    <option value=${MedicationItemTypePZN.profile}         ?selected=${profile === MedicationItemTypePZN.profile}>PZN</option>
                    <option value=${MedicationItemTypeFreeText.profile}    ?selected=${profile === MedicationItemTypeFreeText.profile}>Freitext</option>
                    <option value=${MedicationItemTypeIngredient.profile}  ?selected=${profile === MedicationItemTypeIngredient.profile}>Wirkstoff</option>
                    <option value=${MedicationItemTypeCompounding.profile} ?selected=${profile === MedicationItemTypeCompounding.profile}>Rezeptur</option>
                </select>
                <!-- include the Profile's corresponding Form -->
                ${this.getProfileForm(this.state.resource?.meta?.profile[0])}
                <!-- Cancel and Save buttons -->
                <div class="modal-buttons">
                    <button class="cancel"  @click="${() => this.onCancelButtonClick()}">Abbrechen</button>
                    <button class="ok-next" @click="${e => this.onSaveButtonClick(e)}">Speichern</button>
                </div>
                <div id="medicEdit-error-messages"/>
            </div>
        `;
    }

    onUserInput({ target: { value } }, path) { 
        updateMedicationItem(path,value);
    }

    onCancelButtonClick() {
        cancelMedicationItemEdit();
    }

    onSaveButtonClick(event) {
        // extract form element from event->target
        const { target: { form } } = event;
        event.preventDefault();
        form.reportValidity();
        if(form.checkValidity()){
            saveMedicationItem();
            clearMedicationItem();
            form.reset();
        }
    }
}
customElements.define("medication-popup", MedicationPopup);