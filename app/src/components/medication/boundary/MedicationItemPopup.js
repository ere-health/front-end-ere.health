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
    FIELD_PZN_TYPE,
    FIELD_NORMGROESSE_TYPE, 
    FIELD_DARREICH_TYPE, 
} from "../fieldselectoptions.js";

class MedicationPopup extends BElement {

    extractState({medicationItemReducer: {medicationItem}}) {
        return medicationItem;
    }

    view() {
        return html`
            <form class="modal" id="medicEdit" style="max-width: 800px;">
                <!-- header -->
                <div class="modal-title" style="text-align:left">
                    <p style="text-align:left"><strong>Medikament</strong></p>
                </div>
                <datalist id="pznTexts">
                    ${FIELD_PZN_TYPE.map(row=>html`<option value="${row.label}">${row.value}`)}
                </datalist>
                <datalist id="pznCodes">
                    ${FIELD_PZN_TYPE.map(row=>html`<option value="${row.value}">${row.label}`)}
                </datalist>
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

    getProfileForm(profile) {
        switch (profile){
            case MedicationItemTypeFreeText.urlProfile:
                return html`<!-- Show this form for FreeText  -->
                <div style="text-align:left">
                    <div class="fieldRow">
                        <label for="medicationText">Freitext</label>
                        <input id="medicationText"
                               .value="${this.state.medicationText}" 
                               @change="${_ => this.onUserInput(_)}"
                        />
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
                               @change="${event=> this.onUserInput(event)}"
                        />
                        <label for="pznCode">PZN</label>
                        <input id="pznCode"
                               list="pznCodes"
                               .value="${this.state.pznCode}" 
                               @change="${event => this.onUserInput(event)}" 
                        />
                    </div>
                    <div class="fieldRow">
                    <label for="nominatorValue">Menge</label>
                        <input id="nominatorValue"
                               type="number" min="0" max="10000"
                               .value="${this.state.nominatorValue}"
                               @change="${event=> this.onUserInput(event)}"
                        />
                        <label for="pznText">Normgröße</label>
                        <select id="normgroesseCode" @change="${event => this.onUserInput(event)}">
                            ${FIELD_NORMGROESSE_TYPE.map(row=>html`<option value="${row.value}" ?selected=${this.state.normgroesseCode === row.value}>${row.label}</option>`)}
                        </select>
                        <label for="dformCode">Darreichungsform</label>
                        <select id="dformCode" @change="${event => this.onUserInput(event)}">
                            ${FIELD_DARREICH_TYPE.map(row=>html`<option value="${row.value}" ?selected=${this.state.dformCode === row.value}>${row.label}</option>`)}
                        </select>  

                        <edit-field statePath="prescriptions.MedikamentPopup" mapKey="quantityValue" label="Menge" id="medic-quantity"></edit-field>
                        <select-field statePath="prescriptions.MedikamentPopup" mapKey="form" label="Darreichungsform" items="${JSON.stringify(FIELD_DARREICH_TYPE)}"></select-field> 
                    </div>
                    <div class="fieldRow"> 
                        <edit-field statePath="prescriptions.MedikamentPopup" mapKey="dosageInstruction" label="Dosierungsanweisung" id="medic-dosage-instructions"</edit-field>
                    </div>
                </div>`;

            case MedicationItemTypeIngredient.urlProfile:


            case MedicationItemTypeCompounding.urlProfile:


            default:
        }
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