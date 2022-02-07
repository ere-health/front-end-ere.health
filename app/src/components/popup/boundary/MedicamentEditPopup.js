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
        const nameFragments = event.target.name.split('-');
        const fieldName = nameFragments[0];
        const rowIndex = nameFragments?.[1] ?? null;
        const saveButton = document.getElementById(`${this.popupName}-save-button`);
        
        // import { Validator } from "../../../libs/validator.js";
        const data = new Object();
        data[fieldName] = value;
        const rules = new Object();
        rules[fieldName] = PopupRules[this.popupName][fieldName] ?? [];
        const validator =  new Validator(data, rules, PopupErrorMessages[this.popupName][fieldName]);
        if (validator.passes()) {
          removeValidationErrorForCurrentPopup(id);
          let row=null;
          switch (fieldName){
            case 'pznCode':
                row = FIELD_PZN_TYPE.filter(row=>row.value===value)?.[0];
                if (row) this.updatePZNfields(row.value, row.label, rowIndex);
                else updatePrescription("", value, fieldName, this.statePath, true);
                break;
            case 'medicationText':
                row = FIELD_PZN_TYPE.filter(row=>row.label===value)?.[0];
                if (row) this.updatePZNfields(row.value, row.label, rowIndex);
                else updatePrescription("", value, fieldName, this.statePath, true);
                break;
            default:
                updatePrescription("", value, fieldName, this.statePath, true);
          }
          if ((document.getElementById(`${this.popupName}-error-messages`).innerHTML.trim().length == 0)) {
            saveButton.disabled = false;
          }
        } else {
          addValidationErrorForCurrentPopup(id, validator.errors.get(id));
          saveButton.disabled = true;
        }
    }

    getIndexedName = (field, index)=>field + ((index===null) ? '':'-'+index);
 
    // spread the pznText into medicationText, normgroesseCode, dformCode
    updatePZNfields(pznCode, pznText, rowIndex){
        updatePrescription("", pznCode, this.getIndexedName("pznCode", rowIndex), this.statePath, true);
        const labelFragments = pznText.split(',');
        if (labelFragments.length<4)
            updatePrescription("", pznText, this.getIndexedName("medicationText", rowIndex), this.statePath, true);
        else {
            updatePrescription("", labelFragments[0]+" "+labelFragments[2], this.getIndexedName("medicationText", rowIndex), this.statePath, true);
            updatePrescription("", labelFragments[1] ?? "", this.getIndexedName("normgroesseCode", rowIndex), this.statePath, true);
            updatePrescription("", labelFragments[3] ?? "", this.getIndexedName("dformCode", rowIndex), this.statePath, true);
        }
    }

    view() {
        let name="";
        return html`
        <div class="modal" id="${this.popupName}" style="max-width: 800px;text-align:left">
            <form>
            <!-- Medikament -->
            <div class="modal-title" style="text-align:left">
                <p><strong>Medikament</strong>
                    <span>
                    <!-- profile changer -->
                    <select name="profile" .value=${this.state.profile}
                            @change="${_ => changeProfilePopupEditMedikament(_.target.value)}">
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
            <datalist id="dformCodes">
                ${FIELD_DARREICH_TYPE.map(row=>html`<option value="${row.label}">`)}
            </datalist>
            ${this.getProfileForm(this.state.profile)}
            <div class="fieldRow">
                <!-- dispenseQuantity -->
                <div style="display:flex; flex-direction:column; flex-grow: 0.05; padding: 7px;margin-top:5px"> 
                    <label for="${this.popupName}-${name="dispenseQuantity"}">Menge</label>
                    <input id="${this.popupName}-${name}"
                        name="${name}"                        
                        type="number" min="0" max="10000"
                        .value="${this.state?.[name] ?? ""}"
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
                </div>
                <!-- dosageInstruction -->
                <div style="display:flex; flex-direction:column; flex-grow: 1; padding: 7px;margin-top:5px"> 
                    <label for="${this.popupName}-${name="dosageInstruction"}">Dosierungsanweisung</label>
                    <input id="${this.popupName}-${name}"
                        name="${name}"
                        type="text" 
                        .value="${this.state?.[name] ?? ""}"
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
                </div>
            </div>
            </form>
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

    getProfileForm(profile){
        switch (profile){
            case MedicamentProfilePZN.profile:
                return this.getPZNform();
            case MedicamentProfileFreeText.profile:
                return this.getFreeTextForm();
            case MedicamentProfileIngredient.profile:
                return this.getIngredientForm();
            case MedicamentProfileCompounding.profile:
                return this.getCompoundingForm();
        }
    }

    // FreeText form
    getFreeTextForm(){
        let name="";
        return html`
        <div class="fieldRow">
            <!-- medicationText -->
            <div style="display:flex; flex-direction:column; flex-grow: 1; padding: 7px;margin-top:5px"> 
                <label for="${this.popupName}-${name="medicationText"}">%Medication%</label>
                <input id="${this.popupName}-${name}"
                    name="${name}"
                    type="text" 
                    .value="${this.state?.[name] ?? ""}"
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
            </div>
        </div>
        `;
    }

    // PZN form
    getPZNform(){
        let name="";
        return html`
        <div class="fieldRow">
            <!-- medicationText -->
            <div style="display:flex; flex-direction:column; flex-grow: 1; padding: 7px;margin-top:5px"> 
                <label for="${this.popupName}-${name="medicationText"}">Handelsname</label>
                <input id="${this.popupName}-${name}"
                    name="${name}"
                    type="text" 
                    .value="${this.state?.[name] ?? ""}"
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
                    list="pznTexts"
                    @change="${_ => this.onUserInputValidateAndStore(_)}"
                >
            </div>
        </div>
        <div class="fieldRow">
            <!-- pznCode -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.5; padding: 7px;margin-top:5px"> 
                <label for="${this.popupName}-${name="pznCode"}">PZN</label>
                <input id="${this.popupName}-${name}"
                    name="${name}"
                    type="text" 
                    .value="${this.state?.[name] ?? ""}"
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
                    list="pznCodes"
                    @change="${_ => this.onUserInputValidateAndStore(_)}"
                >
            </div>
        </div>
        <div class="fieldRow">
            <!-- normgroesseCode -->
            <div style="display:flex; flex-direction:column; flex-grow: 1; padding: 7px;margin-top:5px"> 
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
            <div style="display:flex; flex-direction:column; flex-grow: 1; padding: 7px;margin-top:5px"> 
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
                ${FIELD_DARREICH_TYPE.map(row=>html`<option value="${row.value}" ?selected=${this.state.dformCode === row.value}>${row.value} - ${row.label}</option>`)}
                </select>
            </div>
        </div>
        `;
    }
    // Ingredient
    getIngredientForm(){
        return this.getCompoundingForm();
    }

    getCompoundingForm(){
        let name="";
        return html`
        <div class="fieldRow">
            <!-- medicationText -->
            <div style="display:flex; flex-direction:column; flex-grow: 1; padding: 7px;margin-top:5px"> 
                <label for="${this.popupName}-${name="medicationText"}">%Medication%</label>
                <input id="${this.popupName}-${name}"
                    name="${name}"
                    type="text" 
                    .value="${this.state?.[name] ?? ""}"
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
            </div>
        </div>
        <div class="fieldRow">
            <!-- normgroesseCode -->
            <div style="display:flex; flex-direction:column; flex-grow: 1; padding: 7px;margin-top:5px"> 
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
            <!-- amountNumeratorValue -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.05; padding: 7px;margin-top:5px"> 
                <label for="${this.popupName}-${name="amountNumeratorValue"}">%nomin.%</label>
                <input id="${this.popupName}-${name}"
                    name="${name}"                        
                    type="number" min="0" max="10000"
                    .value="${this.state?.[name] ?? ""}"
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
            </div>
            <div style="display:flex; flex-direction:column; flex-grow: 0.05; padding: 7px;margin-top:5px">
                <label for="slash"amountDenominatorValue"}">&nbsp;</label>
                <input id="slash" type="text" value="/" readonly
                       style="height        : 56px;     
                            background    : #E4E4E44D;
                            border-radius : 4px;      
                            border        : none;     
                            width         : 100%;
                            font-family   : Quicksand;
                            font-style    : normal;
                            font-weight   : 500;
                            font-size     : 18px;
                            line-height   : 22px;
                            text-align    : center"
                >
            </div>
            <!-- amountDenominatorValue -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.05; padding: 7px;margin-top:5px"> 
                <label for="${this.popupName}-${name="amountDenominatorValue"}">%denomin.%</label>
                <input id="${this.popupName}-${name}"
                    name="${name}"                        
                    type="number" min="0" max="10000"
                    .value="${this.state?.[name] ?? ""}"
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
            </div>
            <!-- amountNumeratorUnit -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.1; padding: 7px;margin-top:5px"> 
                <label for="${this.popupName}-${name="amountNumeratorUnit"}">%unit%</label>
                <input id="${this.popupName}-${name}"
                    name="${name}"                        
                    type="text"
                    .value="${this.state?.[name] ?? ""}"
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
            </div>
            <!-- formText -->
            <div style="display:flex; flex-direction:column; flex-grow: 1; padding: 7px;margin-top:5px"> 
                <label for="${this.popupName}-${name="formText"}">Darreichungsform</label>
                <input id="${this.popupName}-${name}"
                    name="${name}"
                    type="text" 
                    .value="${this.state?.[name] ?? ""}"
                    list="dformCodes"
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
            </div>
            <!-- packagingText -->
            <div style="display:flex; flex-direction:column; flex-grow: 1; padding: 7px;margin-top:5px"> 
                <label for="${this.popupName}-${name="packagingText"}">%Packaging%</label>
                <input id="${this.popupName}-${name}"
                    name="${name}"
                    type="text" 
                    .value="${this.state?.[name] ?? ""}"
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
            </div>
        </div>
        ${this.state.ingredients.map((row,index,_)=>this.getItem(index))}
        `;
    }

    getItem(index){
        let name = "";
        return html`
        <div class="fieldRow">
            <!-- pznCode -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.3; padding: 7px;margin-top:5px"> 
                <input id="${this.popupName}-${name="pznCode"}-${index}"
                    name="${name}-${index}"
                    placeholder="PZN"
                    type="text"
                    .value="${this.state?.ingredients?.[index]?.[name] ?? ""}"
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
                    list="pznCodes"
                    @change="${_ => this.onUserInputValidateAndStore(_)}"
                >
            </div>            
            <!-- medicationText -->
            <div style="display:flex; flex-direction:column; flex-grow: 1; padding: 7px;margin-top:5px"> 
                <input id="${this.popupName}-${name="medicationText"}-${index}"
                    placeholder="%ItemText%"
                    name="${name}-${index}"
                    type="text"
                    .value="${this.state?.ingredients?.[index]?.[name] ?? ""}"
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
            </div>
        </div>
        `;
    }

}
customElements.define("medicament-edit-popup", MedicamentEditPopup);
