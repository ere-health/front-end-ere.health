import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";
import {
    _hidePopup,
    changeProfilePopupEditMedikament,
    savePopupEditMedikament,
    cancelPopupEditMedikament,
    addValidationErrorForCurrentPopup,
    removeValidationErrorForCurrentPopup,
} from "../control/PopupControl.js";
import { PopupRules, PopupErrorMessages } from "../../../prescriptions/boundary/ValidationRules.js";
import { updatePrescription } from "../../../prescriptions/control/UnsignedPrescriptionControl.js";
import {
    FIELD_PZN_TYPE,
    FIELD_NORMGROESSE_TYPE, 
    FIELD_DARREICH_TYPE, 
} from "./fieldselectoptions.js";
import {
    MedicamentProfile,
    MedicamentProfileFreeText,
    MedicamentProfilePZN,
    MedicamentProfileIngredient,
    MedicamentProfileCompounding,
} from "./MedicamentProfile.js"

export class MedicamentEditPopup extends BElement {
    popupName = 'medicEdit';
    statePath = "prescriptions.MedikamentPopup";

    extractState({prescriptions: {MedikamentPopup: medikamentPopupState}}) {
        return medikamentPopupState;
    }
 
    onUserInputValidateAndStore(event) {
        const value = event.target.value;
        const id = event.target.id;
        const mapKey = event.target.name;
        const saveButton = document.getElementById(`${this.popupName}-save-button`);
        
        const data = new Object();
        data[id] = value;
        const rules = new Object();
        rules[id] = PopupRules[this.popupName][id] ?? [];
        // import { Validator } from "../../../libs/validator.js";
        const validator =  new Validator(data, rules, PopupErrorMessages[this.popupName][id]);
        if (validator.passes()) {
          removeValidationErrorForCurrentPopup(id);
          let row=null;
          switch (mapKey){
            case 'pznCode':
                row = FIELD_PZN_TYPE.filter(row=>row.value===value)?.[0];
                if (row)
                    this.updatePZNfields(row.value, row.label);
                break;
            case 'medicationText':
                row = FIELD_PZN_TYPE.filter(row=>row.label===value)?.[0];
                if (row)
                    this.updatePZNfields(row.value, row.label);
                break;
            default:
                updatePrescription("", value, mapKey, this.statePath, true);
          }
          if ((document.getElementById(`${this.popupName}-error-messages`).innerHTML.trim().length == 0)) {
            saveButton.disabled = false;
          }
        } else {
          addValidationErrorForCurrentPopup(id, validator.errors.get(id));
          saveButton.disabled = true;
        }
    }

    // spread the pznText into medicationText, normgroesseCode, dformCode
    updatePZNfields(pznCode,pznText){
        updatePrescription("", pznCode, "pznCode", this.statePath, true);
        const pznDetails = pznText.split(',');
        updatePrescription("", pznDetails?.[0]+" "+(pznDetails?.[2] ?? ""), "medicationText", this.statePath, true);
        updatePrescription("", pznDetails?.[1] ?? "", "normgroesseCode", this.statePath, true);
        updatePrescription("", pznDetails?.[3] ?? "", "dformCode", this.statePath, true);
    }

    view() {
        let name="";
    
        return html`
        <div class="modal" id="${this.popupName}" style="max-width: 800px;text-align:left">
            <!-- Medikament -->
            <div class="modal-title" style="text-align:left">
                <p><strong>Medikament</strong>
                    <span>
                    <!-- profile changer -->
                    <select @change="${_ => changeProfilePopupEditMedikament(_.target.value)}">
                        ${MedicamentProfile.profiles.map(row=>html`<option value="${row.value}" ?selected=${this.state.profile === row.value}>${row.label}</option>`)}
                    </select>                        
                    </span>
                </p>
            </div>

            <datalist id="pznTexts">
                ${FIELD_PZN_TYPE.map(row=>html`<option value="${row.label}">${row.value}`)}
            </datalist>
            <datalist id="pznCodes">
                ${FIELD_PZN_TYPE.map(row=>html`<option value="${row.value}">${row.label}`)}
            </datalist>
            <div class="fieldRow">
                <!-- medicationText -->
                <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
                    <label for="${this.popupName}-${name="medicationText"}">Handelsname</label>
                    <input id="${this.popupName}-${name}"
                        name="${name}"
                        type="text" 
                        .value="${this.state?.[name] ?? ""}"
                        style="height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;     
                                width         : 100%;"
                        list="pznTexts"
                        @change="${_ => this.onUserInputValidateAndStore(_)}"
                    >
                </div>
            </div>
            <div class="fieldRow">
                <!-- pznCode -->
                <div style="display:flex; flex-direction:column;flex-grow: 0.5;padding: 7px;margin-top:5px"> 
                    <label for="${this.popupName}-${name="pznCode"}">PZN</label>
                    <input id="${this.popupName}-${name}"
                        name="${name}"
                        type="text" 
                        .value="${this.state?.[name] ?? ""}"
                        style="height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;     
                                width         : 100%;"
                        list="pznCodes"
                        @change="${_ => this.onUserInputValidateAndStore(_)}"
                    >
                </div>
            </div>
            <div class="fieldRow">
                <!-- dispenseQuantity -->
                <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
                    <label for="${this.popupName}-${name="dispenseQuantity"}">Menge</label>
                    <input id="${this.popupName}-${name}"
                        name="${name}"                        
                        type="number" min="0" max="10000"
                        .value="${this.state?.[name] ?? ""}"
                        style="height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;     
                                width         : 100%;"
                        @change="${_ => this.onUserInputValidateAndStore(_)}"
                    >
                </div>
                <!-- normgroesseCode -->
                <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
                    <label for="${this.popupName}-${name="normgroesseCode"}">Normgröße</label>
                    <select id="${this.popupName}-${name}"
                            name="${name}"
                            style="height        : 56px;
                                    background    : #E4E4E44D;
                                    border-radius : 4px;
                                    border        : none;
                                    width         : 100%;
                                    font-family   : Quicksand;
                                    font-style    : normal;
                                    font-weight   : 500;
                                    font-size     : 18px;
                                    line-height   : 22px;"
                            @change="${_ => this.onUserInputValidateAndStore(_)}"
                    >
                    ${FIELD_NORMGROESSE_TYPE.map(row=>html`<option value="${row.value}" ?selected=${this.state.normgroesseCode === row.value}>${row.label}</option>`)}
                    </select>
                </div>
                <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
                    <label for="${this.popupName}-${name="dformCode"}">Darreichungsform</label>
                    <select id="${this.popupName}-${name}"
                            name="${name}"
                            style="height        : 56px;
                                    background    : #E4E4E44D;
                                    border-radius : 4px;
                                    border        : none;
                                    width         : 100%;
                                    font-family   : Quicksand;
                                    font-style    : normal;
                                    font-weight   : 500;
                                    font-size     : 18px;
                                    line-height   : 22px;"
                            @change="${_ => this.onUserInputValidateAndStore(_)}"
                    >
                    ${FIELD_DARREICH_TYPE.map(row=>html`<option value="${row.value}" ?selected=${this.state.dformCode === row.value}>${row.label}</option>`)}
                    </select>
                </div>
            </div>
            <div class="fieldRow"> 
                <edit-field statePath="prescriptions.MedikamentPopup" mapKey="dosageInstruction" label="Dosierungsanweisung" id="medicEdit-dosageInstruction"</edit-field>
            </div>
            <div class="modal-buttons">
                <button data-close-button 
                        class="cancel" 
                        @click="${(_) => {cancelPopupEditMedikament(); }}">
                    Abbrechen
                </button>
                <button data-modal-target-processing="#processing" 
                        @click="${() => savePopupEditMedikament()}" 
                        class="ok-next" 
                        id="${this.popupName}-save-button">
                    Speichern
                </button>
            </div>
            <div id="${this.popupName}-error-messages"/>
        </div>
        `;
    }
}
customElements.define("medicament-edit-popup", MedicamentEditPopup);
