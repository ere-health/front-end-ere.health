import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";
import {
    _hidePopup,
    changeProfilePopupEditMedikament,
    updatePopupEditMedikament,
    savePopupEditMedikament,
    initPopupEditMedikament,
    addValidationErrorForCurrentPopup,
    removeValidationErrorForCurrentPopup,
} from "../control/PopupControl.js";
import { PopupRules, PopupErrorMessages } from "../../../prescriptions/boundary/ValidationRules.js";
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
 
    getIndexedName(collection, index, field){
        if (collection) 
            return collection+'-'+index+'-'+field;
        return field;
    }
    getIndexFromName(name){
        const fragments = name.split('-');
        if (fragments.length==3)
            return {
                collection: fragments[0],
                index: Number.parseInt(fragments[1]),
                field: fragments[2],
            }
        return {collection:null, index:null, field};
    }

    onUserInputValidateAndStore(event) {
        const value = event.target.value;
        const id = event.target.id;
        const nameFragments = this.getIndexFromName(event.target.name);
        const saveButton = document.getElementById(`${this.popupName}-save-button`);
        
        // import { Validator } from "../../../libs/validator.js";
        const data = new Object();
        data[nameFragments.name] = value;
        const rules = new Object();
        rules[nameFragments.name] = PopupRules[this.popupName][nameFragments.name] ?? [];
        const validator =  new Validator(data, rules, PopupErrorMessages[this.popupName][nameFragments.name]);
        if (validator.passes()) {
          removeValidationErrorForCurrentPopup(id);
          let row=null;
          switch (nameFragments.name){
            case 'pznCode':
                row = FIELD_PZN_TYPE.filter(row=>row.value===value)?.[0];
                if (row) this.updatePZNfields(row.value, row.label, nameFragments);
                else updatePopupEditMedikament(nameFragments, value);
                break;
            case 'medicationText':
                row = FIELD_PZN_TYPE.filter(row=>row.label===value)?.[0];
                if (row) this.updatePZNfields(row.value, row.label, nameFragments);
                else updatePopupEditMedikament(nameFragments, value);
                break;
            default:
                updatePopupEditMedikament(nameFragments, value);
          }
          if ((document.getElementById(`${this.popupName}-error-messages`).innerHTML.trim().length == 0)) {
            saveButton.disabled = false;
          }
        } else {
          addValidationErrorForCurrentPopup(id, validator.errors.get(id));
          saveButton.disabled = true;
        }
    }

    // spread the pznLabel into medicationText, normgroesseCode, dformCode
    updatePZNfields(pznCode, pznLabel, {collection,index}){
        updatePopupEditMedikament({collection, index, field:"pznCode"}, pznCode);
        const labelFragments = pznLabel.split(',');
        if (labelFragments.length<4)
            updatePopupEditMedikament({collection, index, field:"medicationText"}, pznLabel);
        else {
            updatePopupEditMedikament({collection, index, field:"medicationText"}, labelFragments[0]+" "+labelFragments[2]);
            updatePopupEditMedikament({collection, index, field:"normgroesseCode"}, labelFragments[1]);
            updatePopupEditMedikament({collection, index, field:"dformCode"}, labelFragments[3]);
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
                        @click="${(_) => {initPopupEditMedikament({}); }}">
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
        ${this.state.ingredients.map((row,rowIndex,_)=>this.getItemView(rowIndex))}
        `;
    }

    getItemView(index){
        const collection = "ingredients";
        let name = "";
        return html`
        <div class="fieldRow">
            <!-- pznCode -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.3; padding: 7px;margin-top:5px"> 
                <input id="${this.popupName}-${this.getIndexedName(collection,index,name="pznCode")}"
                    name="${this.getIndexedName(collection,index,name)}"
                    placeholder="PZN"
                    type="text"
                    .value="${this.state?.[collection]?.[index]?.[name] ?? ""}"
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
                <input id="${this.popupName}-${this.getIndexedName(collection,index,name="medicationText")}"
                    placeholder="%ItemText%"
                    name="${this.getIndexedName(collection,index,name)}"
                    type="text"
                    .value="${this.state?.[collection]?.[index]?.[name] ?? ""}"
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
