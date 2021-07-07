import BElement from "../../models/BElement.js";
import { html } from "../../libs/lit-html.js";
import { i18n, setLocale } from "../../libs/i18n/i18n.js";
import {
  showPopupId,
  showPopupEditPatient,
  showPopupEditStatus,
  showPopupEditOrga,
  showPopupEditClinic,
  showPopupEditMedic,
  showPopupEditPractId,
  showPopupEditMedikament
} from "../../components/popup/control/PopupControl.js";
import {
  signAndUploadBundles,
  updatePrescription,
  addValidationErrorForMainWindow,
  removeValidationErrorForMainWindow,
  ValidateAllFieldsInMainWindow
} from "../../prescriptions/control/UnsignedPrescriptionControl.js";
import { initialPath } from "../../libs/helper/helper.js";
import { Mapper } from "../../libs/helper/Mapper.js";
import { MainWindowValidationRules, MainWindowErrorMessages } from "./ValidationRules.js";

let impfStoffInit = false;
let drug1chkInit = false;

function getFromRes(source, resourceType, key) {
  const resource = source.entry.filter(
    (oEntry) => oEntry.resource.resourceType === resourceType
  )[0].resource;
  if (typeof key === "string") {
    return resource[key] ?? "";
  }

  return key(resource);
}

class Prescription extends BElement {
  constructor() {
    super();
  }

  extractState({ prescriptions: { selectedPrescription, isPrevious } }) {
    return { selectedPrescription, isPrevious };
  }

  onUserCheckArt({ target: { name, checked } }) {
    updatePrescription(name, checked);
  }

  onUserInput({ target: { name, value } }, key) {
    if (name === 'birthdate') {
      value = this.convertGermanDateToFhirFormat(value);
    } else if (name === 'authoredOn') {
      value = this.convertGermanDateToFhirFormat(value);
      value += "T00:00:00.000Z";
    }

    let validation = this.validateInput(name, value);

    if (validation.passes()) {
      removeValidationErrorForMainWindow(name);
      updatePrescription(name, value, key);
    } else {
      addValidationErrorForMainWindow(name, validation.errors.get(name));
    }
  }

  validateInput(name, value) {
    let data = new Object();
    let rule = new Object();

    data[name] = value;
    rule[name] = MainWindowValidationRules[name];

    return new Validator(data, rule, MainWindowErrorMessages[name]);
  }

  onMount() {
    this.triggerViewUpdate();
  }

  onClickSignRecipe(event) {
    ValidateAllFieldsInMainWindow();

    if (document.getElementById("error-messages").innerHTML.trim().length == 0) {
      signAndUploadBundles(this.state.selectedPrescription.prescriptions);
      showPopupId();
    } else {
      alert('Bitte beheben Sie alle unten auf dieser Seite aufgeführten Fehler, bevor Sie das Rezept unterschreiben');
    }
  }

  doesClientHasToPay(boolean) {
    if (boolean) {
      updatePrescription("geb-pfl", 0, "entry[1].resource.extension[0].valueCoding.code");
      document.getElementById("gebührenfrei").checked = false;
    } else {
      updatePrescription("gebührenfrei", 1, "entry[1].resource.extension[0].valueCoding.code");
      document.getElementById("geb-pfl").checked = false;
    }
  }

  extractDate(date) {
    if (date != "") {
      return new Date(date).toLocaleDateString("de-DE");
    } else {
      return "";
    }
  }

  convertGermanDateToFhirFormat(germanDate) {
    const dateArray = germanDate.split(".");
    let month = dateArray[1];
    let day = dateArray[0];

    if (month && month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }

    return dateArray[2] + "-" + month + "-" + day;
  }


  view() {
    // get the first prescription of the bundle array
    const firstPrescription = this.state.selectedPrescription.prescriptions[0];
    const prescriptions = this.state.selectedPrescription.prescriptions;
    const _psp = new Mapper(firstPrescription);

    let displayName = [
      _psp.read("entry[resource.resourceType?Patient].resource.name[0].given", []).join(" "),
      _psp.read("entry[resource.resourceType?Patient].resource.name[0].family")]
      .filter(_ => _).join(" ");

    const _this = this; //Why?
    return html`
      <div class="recipe-wrapper active" id="unsigned_1">
        <div class="title-rezept-button">
          <h2>${i18n("RecipeFor")} <strong>${displayName}</strong></h2>
          <button
            id     = "check-errors-button"
            @click = "${() => ValidateAllFieldsInMainWindow()}"
            class  = "open-modal jet-btn">
            Fehler prüfen
          </button>
          <button
            id     = "sign-recipe"
            @click = "${(_) => this.onClickSignRecipe(_)}"
            class  = "open-modal jet-btn"
            style="${this.state.isPrevious ? "display:none" : ""}"
          >
            ${i18n("SignRecipe")}
          </button>
        </div>

        <div class="art-info-form">
          <div class="art">
            <form action="" class="art-form">
              <ul class="zet-check-list">
                <div class="zet-title">Art</div>
                <li class="art-list-item">
                  <input
                    type     = "checkbox"
                    id       = "gebührenfrei"
                    name     = "tollFree"
                    .checked = "${_psp.read("entry[1].resource.extension[0].valueCoding.code") == 1}"
                    @change  = "${_ => this.doesClientHasToPay(false)}"
                    value    = "Gebührenfrei"
                  />
                  <label for="gebührenfrei">${i18n("TollFree")}</label>
                  <span class="checkmark" @click="${() => document.getElementById("gebührenfrei").click()}"></span>
                </li>
                <li class="art-list-item">
                  <input
                    type     = "checkbox"
                    id       = "geb-pfl"
                    name     = "gebpfl"
                    value    = "Geb. -pfl."
                    name     = "gebpfl"
                    .checked = "${_psp.read("entry[1].resource.extension[0].valueCoding.code") == 0}"
                    @change  = "${_ => this.doesClientHasToPay(true)}"
                  />
                  <label for="geb-pfl">Geb. -pfl.</label>
                  <span class="checkmark" @click="${() => document.getElementById("geb-pfl").click()}"></span>
                </li>
                <li class="art-list-item">
                  <input
                    type     = "checkbox"
                    id       = "noctu"
                    value    = "noctu"
                    name     = "noctu"
                    .checked = "${this.state.selectedPrescription.updatedProps?.noctu ?? false}"
                    @change  = "${(_) => this.onUserCheckArt(_)}"
                  />
                  <label for="noctu">noctu</label>
                  <span class="checkmark" @click="${() => document.getElementById("noctu").click()}"></span>
                </li>
                <li class="art-list-item">
                  <input
                    type     = "checkbox"
                    id       = "sonstige"
                    value    = "Sonstige"
                    name     = "other"
                    .checked = "${this.state.selectedPrescription.updatedProps?.other ?? false}"
                    @change  = "${(_) => this.onUserCheckArt(_)}"
                  />
                  <label for="sonstige">${i18n("Other")}</label>
                  <span class="checkmark" @click="${() => document.getElementById("sonstige").click()}"></span>
                </li>
                <li class="art-list-item">
                  <input
                    type     = "checkbox"
                    id       = "unfall"
                    value    = "Unfall"
                    name     = "accident"
                    .checked = "${this.state.selectedPrescription.updatedProps?.accident ?? false}"
                    @change  = "${(_) => this.onUserCheckArt(_)}"
                  />
                  <label for="unfall">${i18n("Accident")}</label>
                  <span class="checkmark" @click="${() => document.getElementById("unfall").click()}"></span>
                </li>
                <li class="art-list-item">
                  <input
                    type     = "checkbox"
                    id       = "arbeitsunfall"
                    value    = "Arbeitsunfall"
                    name     = "industrialAccident"
                    .checked = "${this.state.selectedPrescription.updatedProps?.industrialAccident ?? false}"
                    @change  = "${(_) => this.onUserCheckArt(_)}"
                  />
                  <label for="arbeitsunfall">${i18n("IndustrialAccident")}</label>
                  <span class="checkmark" @click="${() => document.getElementById("arbeitsunfall").click()}"></span>
                </li>
              </ul>

              <div class="collect-information">
                <div class="form-group border-bottom" style="display:flex; justify-content: space-between;">
                  <div class="input-wrapper">
                    <label for="coverage-payor-display">${i18n("HealthInsurance")}</label>
                    <input
                      type   = "text"
                      name   = "coverage-payor-display"
                      id     = "coverage-payor-display"
                      value  = "${_psp.read("entry[resource.resourceType?Coverage].resource.payor[0].display", "")}"
                      @keyup = "${_ => this.onUserInput(_, "entry[resource.resourceType?Coverage].resource.payor[0].display")}"
                    />
                  </div>

                  <div class="input-wrapper">
                  <label for="wop">WOP</label>
                  <input
                    type   = "text"
                    name   = "wop"
                    id     = "wop"
                    value  = "${_psp.read("entry[resource.resourceType?Coverage].resource.extension[url?wop].valueCoding.code", "")}"
                    @keyup = "${_ => this.onUserInput(_, "entry[resource.resourceType?Coverage].resource.extension[url?wop].valueCoding.code")}"
                  />
                </div>
              </div>

                <div class="column-2 border-bottom">
                  <div class="form-group">
                    <div class="input-wrapper">
                    <div class="edit-btn" @click="${() => showPopupEditPatient()}" style="background-image: url(${initialPath}/assets/images/edit-btn.png);"></div>
                      <label for="full-patient-address">${i18n("Patient.Name")}</label>
                      <textarea
                        name   = "full-patient-address"
                        id     = "full-patient-address"
                        cols   = "10"
                        rows   = "2"
                      >${
                        _psp.read("entry[resource.resourceType?Patient].resource.name[0].prefix[0]", "") + " " +
                        _psp.read("entry[resource.resourceType?Patient].resource.name[0].given[0]", "") + " " +
                        _psp.read("entry[resource.resourceType?Patient].resource.name[0].family", "") + ", " +
        _psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?streetName]].extension[url?streetName].valueString", "") + " " +
        _psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?houseNumber]].extension[url?houseNumber].valueString", "") + ", " +
        _psp.read("entry[resource.resourceType?Patient].resource.address[0].postalCode", "") + " " +
        _psp.read("entry[resource.resourceType?Patient].resource.address[0].city", "").trim()}
                      </textarea>
                      <span></span>
                    </div>
                  </div>

                  <div class="form-group">
                    <div class="input-wrapper">
                      <label for="birthdate">${i18n("Patient.Birth")}</label>
                      <input
                        type   = "text"
                        name   = "birthdate"
                        id     = "birthdate"
                        @keyup = "${_ => this.onUserInput({ target: { name: "birthdate", value: _.target.value } }, "entry[resource.resourceType?Patient].resource.birthDate")}"
                        value  = "${this.extractDate(_psp.read("entry[resource.resourceType?Patient].resource.birthDate", ""))}"
                      />
                    </div>
                  </div>
                </div>

                <div class="column-3 border-bottom">
                  <div class="form-group">
                    <div class="input-wrapper">
                      <label for="coverage-payor-iknr"
                        >${i18n("CostUnitId")}</label
                      >
                      <input
                        type   = "text"
                        name   = "coverage-payor-iknr"
                        id     = "coverage-payor-iknr"
                        class  = "bright"
                        value  = "${_psp.read("entry[resource.resourceType?Coverage].resource.payor[0].identifier.value", "")}" 
                        @keyup = "${_ => this.onUserInput(_, "entry[resource.resourceType?Coverage].resource.payor[0].identifier.value")}"
                      />
                      <span></span>
                    </div>
                  </div>

                  <div class="form-group">
                    <div class="input-wrapper">
                      <label for="kvid">${i18n("InsuredPersNum")}</label>
                      <input
                        type   = "text"
                        name   = "kvid"
                        id     = "kvid"
                        class  = "bright"
                        value  = "${_psp.read("entry[resource.resourceType?Patient].resource.identifier[0].value", "")}"
                        @keyup = "${_ => this.onUserInput(_, "entry[resource.resourceType?Patient].resource.identifier[0].value")}"
                      />
                      <span></span>
                    </div>
                  </div>

                  <div class="form-group">
                    <div class="input-wrapper">
                      <div class="edit-btn" @click="${() => showPopupEditStatus()}" style="background-image: url(${initialPath}/assets/images/edit-btn.png);"></div>
                      <label for="status">Status</label>
                      <input
                        type        = "text"
                        name        = "status"
                        id          = "status"
                        class       = "bright"
                        value  = "${_psp.read("entry[resource.resourceType?Coverage].resource.extension[url?versichertenart].valueCoding.code", "") + "-" +
      _psp.read("entry[resource.resourceType?Coverage].resource.extension[url?personengruppe].valueCoding.code", "") + "-" +
      _psp.read("entry[resource.resourceType?Coverage].resource.extension[url?dmp].valueCoding.code", "") + "-" +
      _psp.read("entry[resource.resourceType?Composition].resource.extension[url?KBV_EX_FOR_Legal_basis].valueCoding.code", "")
      }"/>
                    </div>
                  </div>
                </div>

                <div class="column-3 border-bottom">
                  <div class="form-group">
                    <div class="input-wrapper">
                      <div class="edit-btn" @click="${() => showPopupEditClinic()}" style="background-image: url(${initialPath}/assets/images/edit-btn.png);"></div>
                      <label for="betriebsstätten"
                        >${i18n("OperatingSiteNum")}</label
                      >
                      <input
                        type   = "text"
                        name   = "betriebsstätten"
                        id     = "betriebsstätten"
                        class  = "bright"
                        value  = "${_psp.read("entry[resource.resourceType?Organization].resource.identifier[0].value", "")}"
                        @keyup = "${_ => this.onUserInput(_, "entry[resource.resourceType?Organization].resource.identifier[0].value")}"
                      />
                      <span></span>
                    </div>
                  </div>

                  <div class="form-group">
                    <div class="input-wrapper">
                      <div class="edit-btn" @click="${() => showPopupEditPractId()}" style="background-image: url(${initialPath}/assets/images/edit-btn.png);"></div>
                      <label for="doctor-number">${i18n("DoctorNum")}</label>
                      <input
                        type   = "text"
                        name   = "doctor-number"
                        id     = "doctor-number"
                        class  = "bright"
                        value  = "${_psp.read("entry[resource.resourceType?Practitioner].resource.identifier[0].value", "")}"
                        @keyup = "${_ => this.onUserInput(_, "entry[resource.resourceType?Practitioner].resource.identifier[0].value")}"
                      />
                      <span></span>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <div class="input-wrapper">
                      <label for="authoredOn">${i18n("Date")}</label>
                      <input
                        type   = "text"
                        id     = "authoredOn"
                        class  = "bright"
                        name   = "authoredOn"
                        value  = "${this.extractDate(_psp.read("entry[resource.resourceType?MedicationRequest].resource.authoredOn", "").split("T")[0])}"
                        @keyup = "${_ => {
        this.onUserInput({ target: { name: "authoredOn", value: _.target.value} }, "entry[resource.resourceType?MedicationRequest].resource.authoredOn")
      }}"/>
                    </div>
                  </div>
                </div>

                <div class="column-2 col-reverse">
                  <div class="form-group">
                    <div class="input-wrapper">
                      <label for="Unfalltag">${i18n("AccidentDay")}</label>
                      <input
                        industrialAccident
                        type   = "text"
                        name   = "Unfalltag"
                        id     = "Unfalltag"
                        value  = "${_psp.read("entry[resource.resourceType?Accident].resource.extension[url?unfalltag].value[0].valueDate", "")}"
                        @keyup = "${_ => this.onUserInput(_, "entry[resource.resourceType?Accident].resource.extension[url?unfalltag].value[0].valueDate")}"
                           />
                      <span class="long-border"></span>
                    </div>
                  </div>

                  <div class="form-group">
                    <div class="input-wrapper">
                      <label for="Unfallbetrieb1"
                        >${i18n("AccidentCompanyNum")}</label
                      >
                      <input
                        type   = "text"
                        readonly
                        id     = "Unfallbetrieb1"
                        name   = "Unfallbetrieb"
                        value  = "${_psp.read("entry[resource.resourceType?Accident].resource.extension[url?unfallbetrieb].value[0].valueDate", "")}"
                        @keyup = "${_ => this.onUserInput(_, "entry[resource.resourceType?Accident].resource.extension[url?unfallbetrieb].value[0].valueDate")}"
                       />
                    </div>
                  </div>
                </div>
              </div>

              <ul class="zet-check-list" style="margin-left: 15px">
                <div class="zet-title"></div>
                <li class="art-list-item">
                  <input
                    type     = "checkbox"
                    id       = "gebührenfrei"
                    name     = "BVG"
                   
                    value    = "BVG"
                  />
                  <label for="gebührenfrei">BVG</label>
                  <span class="checkmark"></span>
                </li>
                <li class="art-list-item">
                  <input
                    type     = "checkbox"
                    id       = "geb-pfl"
                    name     = "gebpfl"
                    value    = "Geb. -pfl."
                    name     = "gebpfl"
                           />
                  <label for="geb-pfl">Hilfs-mittel</label>
                  <span class="checkmark" ></span>
                </li>

                <li class="art-list-item">
                  <input
                    type     = "checkbox"
                    id       = "Impf-stoff"
                    name     = "Impf-stoff"
                    checked = "${(() => {
        const value = _psp.read("entry[resource.resourceType=Medication].resource.extension[url?KBV_EX_ERP_Medication_Vaccine].valueBoolean");
        if (!impfStoffInit) {
          impfStoffInit = true;
          if (!value) setTimeout(() => document.getElementById("Impf-stoff").click(), 0)
        }
        return value;
      })()
      }"
                    @change  = "${_ => updatePrescription("", _.target.checked, "entry[resource.resourceType=Medication].resource.extension[url?KBV_EX_ERP_Medication_Vaccine].valueBoolean", "")}"
                  />
                  <label for="Impf-stoff">Impf-stoff</label>
                  <span class="checkmark" @click="${() => document.getElementById("Impf-stoff").click()}"></span>
                </li>
                <li class="art-list-item">
                  <input
                    type     = "checkbox"
                    id       = "sonstige"
                    value    = "Sonstige"
                    name     = "other"
                   
                  />
                  <label for="sonstige">Spr. St. Bedarf</label>
                  <span class="checkmark" ></span>
                </li>
                <li class="art-list-item">
                  <input
                    type     = "checkbox"
                    id       = "unfall"
                    value    = "Unfall"
                    name     = "accident"
                    
                  />
                  <label for="unfall">Begr. Pflicht</label>
                  <span class="checkmark"></span>
                </li>
              </ul>
            </form>
          </div>
          <div class="user-info-box"></div>
        </div>

        <div style="display: flex;">
          <div class="drug-area-1" style="flex: 1;flex-grow: 2;">
            <div class="drug-area">
              <div class="inline">
                <div class="zet-title first-col">Aut idem</div>
                <div class="zet-title second-col">Medikament</div>
                <div class="zet-title first-col-bis">PZN</div>
                <div class="zet-title third-col">Dosierung</div>
              </div>

              <form action="" class="art-form">
              
              <ul class="zet-check-list">
              
              ${prescriptions.map((medicationLine, medIndex) => {
        const medicationResource = medicationLine.entry.filter(
          (oEntry) => oEntry.resource.resourceType === "Medication"
        )[0].resource;
        const medicationRequestResource = medicationLine.entry.filter(
          (oEntry) => oEntry.resource.resourceType === "MedicationRequest"
        )[0].resource;
        return html`
                    <li class="art-list-item">
                    <div class="edit-btn" @click="${() => showPopupEditMedikament(medIndex)}" style="left: 40px; background-image: url(${initialPath}/assets/images/edit-btn.png);"></div>
                        <input
                          type        = "text"
                          class       = "drug-name"
                          name        = "medicationText"
                          id          = "medicationText"
                          value       = "${medicationResource.code.text}"
                          @keyup = "${_ => this.onUserInput(_, "entry[resource.resourceType?Medication].resource.code.text")}"
                          placeholder = ""
                        />
                        <input type="text" 
                          class="pzn"
                          id="pzn"
                          value="${medicationResource.code.coding[0].code}"
                          @keyup="${_ => this.onUserInput(_, "entry[resource.resourceType?Medication].resource.code.coding[0].code")}" 
                          placeholder="" 
                        />
                        <input type="text" 
                          class="duration" 
                          id="dosage-instructions"
                          value="${medicationRequestResource.dosageInstruction.length > 0 && medicationRequestResource.dosageInstruction[0].text != undefined ? medicationRequestResource.dosageInstruction[0].text : ""}"
                          @keyup="${_ => this.onUserInput(_, "entry[1].resource.dosageInstruction[0].text")}"
                          placeholder="" 
                        />
                        <input 
                        type="checkbox" 
                        id="drug-1-chk-${medIndex}" 
                        style="display:none"
                        .checked = "${(() => {
                          const p = new Mapper(this.state.selectedPrescription.prescriptions[medIndex])
                          const value = p.read("entry[resource.resourceType?MedicationRequest].resource.substitution.allowedBoolean");
                          if (!drug1chkInit) {
                            drug1chkInit = true;
                            if (!value) setTimeout(() => document.getElementById("drug-1-chk-0").click(), 0)
                          }
                          return value;
                        })()
                        }"
                        @change  = "${_ => updatePrescription("", _.target.checked, "entry[resource.resourceType?MedicationRequest].resource.substitution.allowedBoolean", "", medIndex)}"
                        />
                        <span class="checkmark" @click="${() => document.getElementById(`drug-1-chk-${medIndex}`).click()}"></span>
                      </li>`;
      })}

                </ul>
              </form>
            </div>
          </div>
          <div class="drug-area-2" style="
              display         : flex;      
              flex            : 1;         
              padding         : 40px 0;    
              align-content   : center;    
              justify-content : flex-start;
              flex-direction  : column;    
              align-items     : center;    
              position        : relative;  
          ">
          <div class="edit-btn" @click="${() => showPopupEditOrga()}" style="background-image: url(${initialPath}/assets/images/edit-btn.png);"></div>

          <div class="zet-title first-col">Vertragsarztdaten</div>
          <textarea
                        name   = "organization-summary"
                        id     = "organization-summary"
                        rows="5" 
                        cols="30"
                        style="background: transparent; border: none;"
                      >${_psp.read("entry[resource.resourceType?Practitioner].resource.name[0].prefix[0]", "") + " " +
      _psp.read("entry[resource.resourceType?Practitioner].resource.name[0].given[0]") + " " +
      _psp.read("entry[resource.resourceType?Practitioner].resource.name[0].family") + ", " +
      _psp.read("entry[resource.resourceType?Practitioner].resource.qualification[code.coding[system?Qualification_Type]].code.coding[system?Qualification_Type].code") + " " +
      _psp.read("entry[resource.resourceType?Practitioner].resource.qualification[code.text].code.text", "") + ", " +
      _psp.read("entry[resource.resourceType?Organization].resource.name", "") + ", " +
      _psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?streetName]].extension[url?streetName].valueString") + " " +
      _psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?houseNumber]].extension[url?houseNumber].valueString") + ", " +
      _psp.read("entry[resource.resourceType?Organization].resource.address[0].postalCode") + " " +
      _psp.read("entry[resource.resourceType?Organization].resource.address[0].city") + ", " +
      _psp.read("entry[resource.resourceType?Organization].resource.telecom[system?phone].value")}
            </textarea>
          </div>
        </div>
        <div id="error-messages"/>
      </div>
      <!-- / Each patient item -->
    `;
  }
}
customElements.define("prescription-item", Prescription);