import BElement         from "../../../models/BElement.js";
import { html }         from "../../../libs/lit-html.js";
import { 
  updateMedicationItem,
  saveMedicationItem,
  clearMedicationItem,
  changeMedicationItemProfile,
  cancelMedicationItem,
  deleteMedicationItem
} from "../control/MedicationItemControl.js";
import { FIELD_NORMGROESSE_TYPE, FIELD_DARREICH_TYPE } from "./fieldselectoptions.js";

class MedicationPopup extends BElement {

    extractState({medicationItemReducer: {medicationItem}}) {
        return medicationItem;
    }

    getProfileForm(profile) {
        if(profile === "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_FreeText|1.0.2") {
            return html`Freetext Form`;
        } else if(profile === "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_PZN|1.0.2") {
            return html `<!-- Show this form for PZN -->
            <div style="text-align:left">
                <div class="fieldRow">
                    <input .value="${this.state?.resource?.code?.text}" @change="${_ => updateMedicationItem('resource.code.text', _.target.value)}" />
                    <edit-field statePath="prescriptions.MedikamentPopup" mapKey="medicationText" label="Handelsname" id="medic-medicationText"</edit-field>
                </div>
                <div class="fieldRow">
                    <edit-field statePath="prescriptions.MedikamentPopup" mapKey="pzn" label="PZN" ratio="0.5" id="medic-pzn"></edit-field>
                </div>
                <div class="fieldRow">
                    <edit-field statePath="prescriptions.MedikamentPopup" mapKey="quantityValue" label="Menge" id="medic-quantity"></edit-field>
                    <select-field statePath="prescriptions.MedikamentPopup" mapKey="norm" label="Normgröße" items="${JSON.stringify(FIELD_NORMGROESSE_TYPE)}"></select-field> 
                    <select-field statePath="prescriptions.MedikamentPopup" mapKey="form" label="Darreichungsform" items="${JSON.stringify(FIELD_DARREICH_TYPE)}"></select-field> 
                </div>
                <div class="fieldRow"> 
                    <edit-field statePath="prescriptions.MedikamentPopup" mapKey="dosageInstruction" label="Dosierungsanweisung" id="medic-dosage-instructions"</edit-field>
                </div>
            </div>`;
        }
    }

    view() {
        return html`
        <div class="modal" id="medicEdit" style="max-width: 800px;">
            <div class="modal-title" style="text-align:left">
                <p style="text-align:left"><strong>Medikament</strong></p>
            </div>
            <select @change="${_ => changeMedicationItemProfile(_.target.value)}">
                <option value="https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_FreeText|1.0.2">Freitext</option>
                <option value="https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_PZN|1.0.2" ?selected="${this.state.resource?.meta?.profile[0] === "https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_PZN|1.0.2"}">PZN</option>
                <option value="https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_Ingredient|1.0.2">Wirkstoff</option>
                <option value="https://fhir.kbv.de/StructureDefinition/KBV_PR_ERP_Medication_Compounding|1.0.2">Rezeptur</option>
            </select>
            <!-- Show this form for FreeText -->
            ${this.getProfileForm(this.state.resource?.meta?.profile[0])}
            <!-- TODO ... -->

            

            <!-- Show this form for Ingredient -->

            <!-- TODO ... -->


            <!-- Show this form for Compounding -->

            <!-- TODO ... -->

            <div class="modal-buttons">
                <button class="cancel"  @click="${() => this.onCancelButtonClick()}">Abbrechen</button>
                <button class="ok-next" @click="${e => this.onSaveButtonClick(e)}">Speichern</button>
            </div>
            <div id="medicEdit-error-messages"/>
        </div>
        `;
    }

    onUserInput({ target: { name,value } }) { 
        updateMedicationItem(name,value);
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