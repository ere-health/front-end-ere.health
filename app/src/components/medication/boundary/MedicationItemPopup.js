import BElement         from "../../../models/BElement.js";
import { html }         from "../../../libs/lit-html.js";
import { 
  changeMedicationItemProfile,
  updateMedicationItem,
  saveMedicationItem,
  cancelMedicationItem,
  deleteMedicationItem
} from "../control/MedicationItemControl.js";
import {
    MedicationItemTypePZN,
    MedicationItemTypeFreeText,
    MedicationItemTypeIngredient,
    MedicationItemTypeCompounding
} from "../MedicationItemType.js";

import { 
    FIELD_NORMGROESSE_TYPE, 
    FIELD_DARREICH_TYPE, 
    FIELD_PZN_TYPE 
} from "./fieldselectoptions.js";

class MedicationPopup extends BElement {

    extractState({medicationItemReducer: {medicationItem}}) {
        return medicationItem;
    }

    getProfileForm(profile) {
        switch (profile){
            case MedicationItemTypeFreeText.urlProfile:
                return html`<!-- Show this form for FreeText  -->
                <div style="text-align:left">
                    <div class="fieldRow">
                        <label for="medicationText">Freitext</label>
                        <input id="medicationText" .value="${this.state.medicationText}" @change="${_ => this.onUserInput(_)}" />
                    </div>
                </div>`;

            case MedicationItemTypePZN.urlProfile:
                return html`<!-- Show this form for PZN  -->
                <div style="text-align:left">
                    <div class="fieldRow">
                        <label for="pznText">Handelsname</label>
                        <input id="pznText"
                               list="pznTexts"
                               .value="${this.state.pznText}" 
                               @change="${_ => this.onUserInput(_,"resource.code.text")}" />
                        <datalist id="pznTexts">
                          ${FIELD_PZN_TYPE.map(pznRow=>html`<option value="${pznRow.label}">${pznRow.value}`)}
                        </datalist>
                    </div>
                    <div class="fieldRow">
                        <label for="pznCode">PZN</label>
                        <input id="pznCode"
                                list="pznCodes"
                               .value="${this.state.pznCode}" 
                               @change="${_ => this.onUserInput(_,"resource.code.coding.0.code")}" />
                        <datalist id="pznCodes">
                          ${FIELD_PZN_TYPE.map(pznRow=>html`<option value="${pznRow.value}">${pznRow.label}`)}
                        </datalist>
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

            case MedicationItemTypeIngredient.urlProfile:


            case MedicationItemTypeCompounding.urlProfile:


            default:
        }
    }

    view() {
        return html`
            <form class="modal" id="medicEdit" style="max-width: 800px;">
                <!-- header -->
                <div class="modal-title" style="text-align:left">
                    <p style="text-align:left"><strong>Medikament</strong></p>
                </div>
                <!-- profile changer -->
                <select @change="${_ => changeMedicationItemProfile(_.target.value)}">
                    <option value=${MedicationItemTypePZN.urlProfile}         ?selected=${this.state.profile === MedicationItemTypePZN.urlProfile}>PZN</option>
                    <option value=${MedicationItemTypeFreeText.urlProfile}    ?selected=${this.state.profile === MedicationItemTypeFreeText.urlProfile}>Freitext</option>
                    <option value=${MedicationItemTypeIngredient.urlProfile}  ?selected=${this.state.profile === MedicationItemTypeIngredient.urlProfile}>Wirkstoff</option>
                    <option value=${MedicationItemTypeCompounding.urlProfile} ?selected=${this.state.profile === MedicationItemTypeCompounding.urlProfile}>Rezeptur</option>
                </select>
                <!-- include the Profile's corresponding Form -->
                ${this.getProfileForm(this.state.profile)}
                <!-- Cancel and Save buttons -->
                <div class="modal-buttons">
                    <button class="cancel"  @click="${() => this.onCancelButtonClick()}">Abbrechen</button>
                    <button class="ok-next" @click="${e => this.onSaveButtonClick(e)}">Speichern</button>
                </div>
                <div id="medicEdit-error-messages"/>
            </form>
        `;
    }

    onUserInput({ target: { id, value } }) { 
        updateMedicationItem(id,value);
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
        }
    }
}
customElements.define("medication-popup", MedicationPopup);