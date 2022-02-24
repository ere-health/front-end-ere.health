import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";
import {
    _hidePopup,
    changeProfilePopupEditMedikament,
    updatePopupEditMedikament,
    savePopupEditMedikament,
    addValidationErrorForCurrentPopup,
    removeValidationErrorForCurrentPopup,
} from "../control/PopupControl.js";
import { PopupRules, PopupErrorMessages } from "../../../prescriptions/boundary/ValidationRules.js";
import {
    FIELD_PZN_TYPE,
    FIELD_ASK_TYPE,
    FIELD_NORMGROESSE_TYPE, 
    FIELD_DARREICH_TYPE, 
} from "./fieldselectoptions.js";
import {
    MedicamentProfile,
    MedicamentProfileFreeText,
    MedicamentProfilePZN,
    MedicamentProfileIngredient,
    MedicamentProfileCompounding,
    CompoundingIngredientItem,
} from "./MedicamentProfile.js";
import { initialPath } from "../../../libs/helper/helper.js";

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
        const fragments = name?.split('-');
        if (fragments && fragments.length===3) {
            const indesAsInteger = Number.parseInt(fragments[1]);
            return {
                collection: fragments[0],
                index: (String(indesAsInteger)===fragments[1]) ? indesAsInteger:fragments[1],
                field: fragments[2],
            }
        };
        return {collection:null, index:null, field:name};
    }

    onUserInputValidateAndStore(event) {
        const value = event.target.value;
        const id = event.target.id;
        const nameFragments = this.getIndexFromName(event.target.name);
        const saveButton = document.getElementById(`${this.popupName}-save-button`);
        
        // import { Validator } from "../../../libs/validator.js";
        const data = new Object();
        data[nameFragments.field] = value;
        const rules = new Object();
        rules[nameFragments.field] = PopupRules[this.popupName][nameFragments.field] ?? [];
        const validator =  new Validator(data, rules, PopupErrorMessages[this.popupName][nameFragments.field]);
        if (validator.passes()) {
          removeValidationErrorForCurrentPopup(id);
          let row=null;
          switch (nameFragments.field){
            case 'pznCode':
                row = FIELD_PZN_TYPE.filter(row=>row.value===value)?.[0];
                if (row) this.updatePZNfields(row.value, row.label, nameFragments);
                else updatePopupEditMedikament(nameFragments, value);
                break;
            case 'pznText':
                row = FIELD_PZN_TYPE.filter(row=>row.label===value)?.[0];
                if (row) this.updatePZNfields(row.value, row.label, nameFragments);
                else updatePopupEditMedikament(nameFragments, value);
                break;
            case 'askCode':
                row = FIELD_ASK_TYPE.filter(row=>row.value===value)?.[0];
                if (row) this.updateASKfields(row.value, row.label, nameFragments);
                else updatePopupEditMedikament(nameFragments, value);
                break;
            case 'askText':
                row = FIELD_ASK_TYPE.filter(row=>row.label===value)?.[0];
                if (row) this.updateASKfields(row.value, row.label, nameFragments);
                else updatePopupEditMedikament(nameFragments, value);
                break;
            default:
                updatePopupEditMedikament(nameFragments, value);
          }
          if ((document.getElementById(`${this.popupName}-error-messages`).innerHTML.trim().length == 0)) {
            saveButton.disabled = false;
          }
        } else {
          addValidationErrorForCurrentPopup(id, validator.errors.get(nameFragments.field));
          saveButton.disabled = true;
        }
    }

    // spread the pznLabel into pznText, normgroesseCode, dformCode
    updatePZNfields(pznCode, pznLabel, {collection,index}){
        updatePopupEditMedikament({collection, index, field:"pznCode"}, pznCode);
        const labelFragments = pznLabel.split(',');
        if (labelFragments.length<4)
            updatePopupEditMedikament({collection, index, field:"pznText"}, pznLabel);
        else {
            updatePopupEditMedikament({collection, index, field:"pznText"}, labelFragments[0]+" "+labelFragments[2]);
            updatePopupEditMedikament({collection, index, field:"normgroesseCode"}, labelFragments[1]);
            const dformCode = labelFragments[3];
            updatePopupEditMedikament({collection, index, field:"dformCode"}, dformCode);
            const dformText = FIELD_DARREICH_TYPE.filter(row=>row.value===dformCode)?.[0]?.label ?? "";
            updatePopupEditMedikament({collection, index, field:"dformText"}, dformText);
        }
    }

    // spread the askLabel into askText
    updateASKfields(askCode, askLabel, {collection,index}){
        updatePopupEditMedikament({collection, index, field:"askCode"}, askCode);
        updatePopupEditMedikament({collection, index, field:"askText"}, askLabel);
    }    

    removeCompoundingIngredientItem(event) {
        event.preventDefault();
        event.stopPropagation()
        const nameFragments = this.getIndexFromName(event.target.name);
        nameFragments.field = null;
        updatePopupEditMedikament(nameFragments, null);
    }
    

    view() {
        let name="";
        return html`
        <div class="modal" id="${this.popupName}" style="max-width: 800px;text-align:left">
            <!-- title: Medikament -->
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
            <datalist id="askTexts">
                ${FIELD_ASK_TYPE.map(row=>html`<option value="${row.label}">${row.value}`)}
            </datalist>
            <datalist id="askCodes">
                ${FIELD_ASK_TYPE.map(row=>html`<option value="${row.value}">${row.label}`)}
            </datalist>
            <datalist id="dformCodes">
                ${FIELD_DARREICH_TYPE.map(row=>html`<option value="${row.label}">`)}
            </datalist>

            ${this.getProfileView(this.state.profile)}

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
            <div class="modal-buttons">
                <button data-close-button 
                        class="cancel" 
                        @click="${(_) => updatePopupEditMedikament(this.getIndexFromName(""),{})}">
                    Abbrechen
                </button>
                <button data-modal-target-processing="#processing" 
                        @click="${() => savePopupEditMedikament()}" 
                        class="ok-next" 
                        id="${this.popupName}-save-button">
                    Speichern
                </button>
            </div>
            <div id="${this.popupName}-error-messages"
                 style="width         : 100%;
                        font-family   : Quicksand;
                        font-style    : normal;
                        font-weight   : 500;
                        font-size     : 16px;
                        color         : red;"
            />
        </div>
        `;
    }

    getProfileView(profile){
        switch (profile){
            case MedicamentProfilePZN.profile:
                return this.getPZNview(this.state);
            case MedicamentProfileFreeText.profile:
                return this.getFreeTextView(this.state);
            case MedicamentProfileIngredient.profile:
                return this.getIngredientView(this.state);
            case MedicamentProfileCompounding.profile:
                return this.getCompoundingView(this.state);
        }
    }

    // FreeText form
    getFreeTextView(){
        let name="";
        return html`
        <div class="fieldRow">
            <!-- medicationText -->
            <div style="display:flex; flex-direction:column; flex-grow: 1; padding: 7px;margin-top:5px"> 
                <label for="${this.popupName}-${name="medicationText"}">Medikamentenname</label>
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
    getPZNview(){
        let name="";
        return html`
        <div class="fieldRow">
            <!-- pznText -->
            <div style="display:flex; flex-direction:column; flex-grow: 1; padding: 7px;margin-top:5px"> 
                <label for="${this.popupName}-${name="pznText"}">Handelsname</label>
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
    // INGREDIENT
    getIngredientView(){
        let name="";
        return html`
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
            <!-- dformText -->
            <div style="display:flex; flex-direction:column; flex-grow: 1; padding: 7px;margin-top:5px"> 
                <label for="${this.popupName}-${name="dformText"}">Darreichungsform</label>
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
            <!-- amountNumeratorValue -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.05; padding: 7px;margin-top:5px"> 
                <label for="${this.popupName}-${name="amountNumeratorValue"}">%numer.%</label>
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
            <!-- forward slash -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.05; padding: 7px;margin-top:5px">
                <label for="${this.popupName}-${name="slash"}">&nbsp;</label>
                <input id="${this.popupName}-${name}" type="text" value="/" readonly
                       style="height        : 56px;     
                            border-radius : 4px;      
                            border        : none;     
                            width         : 22px;
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
                <label for="${this.popupName}-${name="amountDenominatorValue"}">%den.%</label>
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
        </div>
        ${this.state.ingredients.map((ingredient,rowIndex,_)=>this.getIngredientItemView(ingredient, "ingredients", rowIndex))}
        `;
    }

    // INGREDIENT ITEM
    getIngredientItemView(item, collection, index){
        let name = "";
        return html`
        <div class="fieldRow">
            <!-- askCode -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.3; padding: 7px;margin-top:5px"> 
                <input id="${this.popupName}-${this.getIndexedName(collection,index,name="askCode")}"
                    name="${this.getIndexedName(collection,index,name)}"
                    placeholder="ASKP-Nr."
                    type="text"
                    .value="${item?.[name] ?? ""}"
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
                    list="askCodes"
                    @change="${_ => this.onUserInputValidateAndStore(_)}"
                >
            </div>            
            <!-- askText -->
            <div style="display:flex; flex-direction:column; flex-grow: 1; padding: 7px;margin-top:5px"> 
                <input id="${this.popupName}-${this.getIndexedName(collection,index,name="askText")}"
                    placeholder="Wirkstoffbezeichnung"
                    name="${this.getIndexedName(collection,index,name)}"
                    type="text"
                    .value="${item?.[name] ?? ""}"
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
                    list="askTexts"                            
                    @change="${_ => this.onUserInputValidateAndStore(_)}"
                >
            </div>
        </div>
        <div class="fieldRow">
            <!-- strengthNumeratorValue -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.05; padding: 7px;margin-top:5px"> 
                <input id="${this.popupName}-${this.getIndexedName(collection,index,name="strengthNumeratorValue")}"
                    name="${this.getIndexedName(collection,index,name)}"                        
                    type="number" min="0" max="10000"
                    placeholder="%numerator%"
                    .value="${item?.[name] ?? ""}"
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
            <!-- forward slash -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.05; padding: 7px;margin-top:5px">
                <input id="${this.popupName}-${this.getIndexedName(collection,index,name="slash")}"
                       type="text"
                       value="/" 
                       readonly
                       style="height        : 56px;     
                            border-radius : 4px;      
                            border        : none;     
                            width         : 22px;
                            font-family   : Quicksand;
                            font-style    : normal;
                            font-weight   : 500;
                            font-size     : 18px;
                            line-height   : 22px;
                            text-align    : center"
                >
            </div>
            <!-- strengthDenominatorValue -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.05; padding: 7px;margin-top:5px"> 
                <input id="${this.popupName}-${this.getIndexedName(collection,index,name="strengthDenominatorValue")}"
                    name="${this.getIndexedName(collection,index,name)}"                        
                    type="number" min="0" max="10000"
                    placeholder="%denominator%"
                    .value="${item?.[name] ?? ""}"
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
            <!-- strengthNumeratorUnit -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.1; padding: 7px;margin-top:5px"> 
                <input id="${this.popupName}-${this.getIndexedName(collection,index,name="strengthNumeratorUnit")}"
                    name="${this.getIndexedName(collection,index,name)}"                        
                    type="text"
                    placeholder="%unit%"
                    .value="${item?.[name] ?? ""}"
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

    // COMPOUNDING
    getCompoundingView(){
        let name="";
        return html`
        <div class="fieldRow">
            <!-- medicationText -->
            <div style="display:flex; flex-direction:column; flex-grow: 1; padding: 7px;margin-top:5px"> 
                <label for="${this.popupName}-${name="medicationText"}">Medikamentenname</label>
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
            <!-- amountNumeratorValue -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.05; padding: 7px;margin-top:5px"> 
                <label for="${this.popupName}-${name="amountNumeratorValue"}">%numer.%</label>
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
            <!-- forward slash -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.05; padding: 7px;margin-top:5px">
                <label for="${this.popupName}-${name="slash"}">&nbsp;</label>
                <input id="${this.popupName}-${name}" type="text" value="/" readonly
                       style="height        : 56px;     
                            border-radius : 4px;      
                            border        : none;     
                            width         : 22px;
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
                <label for="${this.popupName}-${name="amountDenominatorValue"}">%den.%</label>
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
            <!-- dformText -->
            <div style="display:flex; flex-direction:column; flex-grow: 1; padding: 7px;margin-top:5px"> 
                <label for="${this.popupName}-${name="dformText"}">Darreichungsform</label>
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
                <label for="${this.popupName}-${name="packagingText"}">Verpackung</label>
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
        ${this.state.ingredients.map((ingredient,rowIndex,_)=>this.getCompoundingItemView(ingredient, "ingredients", rowIndex))}
        <button @click="${_ => updatePopupEditMedikament({collection:"ingredients",index:this.state.ingredients.length}, CompoundingIngredientItem.buildEmpty())}" 
                style="float: right;"
        >+</button>
        `;
    }

    // COMPOUNDING ITEM
    getCompoundingItemView(item, collection, index){
        if (item === null) return "";
        let name = "";
        return html`
        <div class="fieldRow">
            <!-- pznCode -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.3; padding: 7px;margin-top:5px"> 
                <input id="${this.popupName}-${this.getIndexedName(collection,index,name="pznCode")}"
                    name="${this.getIndexedName(collection,index,name)}"
                    placeholder="PZN"
                    type="text"
                    .value="${item?.[name] ?? ""}"
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
            <!-- pznText -->
            <div style="display:flex; flex-direction:column; flex-grow: 1; padding: 7px;margin-top:5px"> 
                <input id="${this.popupName}-${this.getIndexedName(collection,index,name="pznText")}"
                    placeholder="Medikamentenname"
                    name="${this.getIndexedName(collection,index,name)}"
                    type="text"
                    .value="${item?.[name] ?? ""}"
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
            <button name="${this.getIndexedName(collection,index,"removebtn")}"
                    class="remove-meditem-btn" 
                    style="height          : 48px;
                           width           : 48px;
                           padding         : 7px;
                           margin-top      : 15px;
                           background-image: url(${initialPath}/assets/images/remove-btn.png);
                           ${(this.state?.[collection]?.length === 1 ? "display: none;" : "")};"
                    @click="${_ => this.removeCompoundingIngredientItem(_)}">
            </button>
        </div>
        <div class="fieldRow">
            <!-- dformText -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.3; padding: 7px;margin-top:5px"> 
                <input id="${this.popupName}-${this.getIndexedName(collection,index,name="dformText")}"
                    name="${this.getIndexedName(collection,index,name)}"
                    placeholder="%dformText%"
                    type="text"
                    .value="${item?.[name] ?? ""}"
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
                    list="dformCodes"
                    @change="${_ => this.onUserInputValidateAndStore(_)}"
                >
            </div>            
            <!-- strengthText -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.5; padding: 7px;margin-top:5px"> 
                <input id="${this.popupName}-${this.getIndexedName(collection,index,name="strengthText")}"
                    placeholder="%strengthText%"
                    name="${this.getIndexedName(collection,index,name)}"
                    type="text"
                    .value="${item?.[name] ?? ""}"
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
            <!-- strengthNumeratorValue -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.05; padding: 7px;margin-top:5px"> 
                <input id="${this.popupName}-${this.getIndexedName(collection,index,name="strengthNumeratorValue")}"
                    name="${this.getIndexedName(collection,index,name)}"                        
                    type="number" min="0" max="10000"
                    placeholder="%numerator%"
                    .value="${item?.[name] ?? ""}"
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
            <!-- forward slash -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.05; padding: 7px;margin-top:5px">
                <input id="${this.popupName}-${this.getIndexedName(collection,index,name="slash")}"
                       type="text"
                       value="/" 
                       readonly
                       style="height        : 56px;     
                            border-radius : 4px;      
                            border        : none;     
                            width         : 22px;
                            font-family   : Quicksand;
                            font-style    : normal;
                            font-weight   : 500;
                            font-size     : 18px;
                            line-height   : 22px;
                            text-align    : center"
                >
            </div>
            <!-- strengthDenominatorValue -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.05; padding: 7px;margin-top:5px"> 
                <input id="${this.popupName}-${this.getIndexedName(collection,index,name="strengthDenominatorValue")}"
                    name="${this.getIndexedName(collection,index,name)}"                        
                    type="number" min="0" max="10000"
                    placeholder="%denominator%"
                    .value="${item?.[name] ?? ""}"
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
            <!-- strengthNumeratorUnit -->
            <div style="display:flex; flex-direction:column; flex-grow: 0.1; padding: 7px;margin-top:5px"> 
                <input id="${this.popupName}-${this.getIndexedName(collection,index,name="strengthNumeratorUnit")}"
                    name="${this.getIndexedName(collection,index,name)}"                        
                    type="text"
                    placeholder="%unit%"
                    .value="${item?.[name] ?? ""}"
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
