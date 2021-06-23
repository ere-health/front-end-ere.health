import BElement            from "../../models/BElement.js";
import { html }            from "../../libs/lit-html.js";
import { i18n, setLocale } from "../../libs/i18n/i18n.js";
import {
  showPopupId,
  showPopupEditPatient,
  showPopupEditStatus,
  showPopupEditOrga
} from "../../components/popup/control/PopupControl.js";
import { signAndUploadBundles, updatePrescription } from "../../prescriptions/control/UnsignedPrescriptionControl.js";
import { initialPath } from "../../libs/helper/helper.js";
import { Mapper } from "../../libs/helper/Mapper.js";

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
    return {selectedPrescription, isPrevious};
  }

  onUserCheckArt({ target: { name, checked } }) {
    updatePrescription(name, checked);
  }

  onUserInput({ target: { name, value } }, key) {
    updatePrescription(name, value, key);
  }

  onMount() {
    console.log("First Updated");
    this.triggerViewUpdate();
  }

  onClickSignRecipe(event) {
    signAndUploadBundles(this.state.selectedPrescription.prescriptions);
    showPopupId();
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

    const _this = this;
    return html`
      <div class="recipe-wrapper active" id="unsigned_1">
        <div class="title-rezept-button">
          <h2>${i18n("RecipeFor")} <strong>${displayName}</strong></h2>
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
                    .checked = "${this.state.selectedPrescription.updatedProps?.tollFree ?? false}"
                    @change  = "${(_) => this.onUserCheckArt(_)}"
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
                    .checked = "${this.state.selectedPrescription.updatedProps?.gebpfl ?? false}"
                    @change  = "${(_) => this.onUserCheckArt(_)}"
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
                    .checked = "${this.state.selectedPrescription.updatedProps?.industrialAccident ??false}"
                    @change  = "${(_) => this.onUserCheckArt(_)}"
                  />
                  <label for="arbeitsunfall"
                    >${i18n("IndustrialAccident")}</label
                  >
                  <span class="checkmark" @click="${() => document.getElementById("arbeitsunfall").click()}"></span>
                </li>
              </ul>

              <div class="collect-information">
                <div class="form-group border-bottom">
                  <div class="input-wrapper">
                    <label for="name">${i18n("HealthInsurance")}</label>
                    <input
                      type   = "text"
                      name   = "name"
                      id     = "name"
                      value  = "${_psp.read("entry[resource.resourceType?Coverage].resource.payor[0].display", "")}"
                      @keyup = "${_ => this.onUserInput(_, "entry[resource.resourceType?Coverage].resource.payor[0].display")}"
                    />
                  </div>
                </div>

                <div class="column-2 border-bottom">
                  <div class="form-group">
                    <div class="input-wrapper">
                    <div class="edit-btn" @click="${() => showPopupEditPatient()}" style="background-image: url(${initialPath}/assets/images/edit-btn.png);"></div>
                      <label for="address1">${i18n("Patient.Name")}</label>
                      <textarea
                        name   = "address"
                        id     = "address1"
                        cols   = "10"
                        @keyup = "${_ => this.onUserInput(_)}"
                      >${(this.state.selectedPrescription.updatedProps.address ?? (displayName + ", " +
                          _psp.read("entry[resource.resourceType?Patient].resource.address[0].line[0]", "") + "," +
                          _psp.read("entry[resource.resourceType?Patient].resource.address[0].postalCode","") + " " +
                          _psp.read("entry[resource.resourceType?Patient].resource.address[0].city", "").trim()))}
                      </textarea>
                      <span></span>
                    </div>
                  </div>

                  <div class="form-group">
                    <div class="input-wrapper">
                      <label for="geb1">${i18n("Patient.Birth")}</label>
                      <input
                        type   = "text"
                        name   = "geb"
                        id     = "geb1"
                        @keyup = "${_ => this.onUserInput(_, "entry[resource.resourceType?Patient].resource.birthDate")}"
                        value  = "${_psp.read("entry[resource.resourceType?Patient].resource.birthDate", "")}"
                      />
                    </div>
                  </div>
                </div>

                <div class="column-3 border-bottom">
                  <div class="form-group">
                    <div class="input-wrapper">
                      <label for="Kostenträgerkennung1"
                        >${i18n("CostUnitId")}</label
                      >
                      <input
                        type   = "text"
                        name   = "Kostenträgerkennung"
                        id     = "Kostenträgerkennung1"
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
                        id     = "address"
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
                      <label for="Status1">Status</label>
                      <input
                        type        = "text"
                        name        = "Status"
                        id          = "Status1"
                        class       = "bright"
                        value  = "${_psp.read("entry[resource.resourceType?Coverage].extension[url?'https://fhir.kbv.de/CodeSystem/KBV_CS_SFHIR_KBV_VERSICHERTENSTATUS'].valueCoding.code", "")}"/>
                    </div>
                  </div>
                </div>

                <div class="column-3 border-bottom">
                  <div class="form-group">
                    <div class="input-wrapper">
                      <label for="Betriebsstätten1"
                        >${i18n("OperatingSiteNum")}</label
                      >
                      <input
                        type   = "text"
                        name   = "Betriebsstätten-Nr."
                        id     = "Betriebsstätten1"
                        class  = "bright"
                        value  = "${_psp.read("entry[resource.resourceType?Organization].resource.identifier[0].value", "")}"
                        @keyup = "${_ => this.onUserInput(_, "entry[resource.resourceType?Organization].resource.identifier[0].value")}"
                      />
                      <span></span>
                    </div>
                  </div>

                  <div class="form-group">
                    <div class="input-wrapper">
                      <label for="doctor1">${i18n("DoctorNum")}</label>
                      <input
                        type   = "text"
                        name   = "doctor-no"
                        id     = "doctor1"
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
                        name   = "date"
                        value  = "${new Date(_psp.read("entry[resource.resourceType?MedicationRequest].resource.authoredOn", "")).toLocaleDateString()}"
                        @keyup = "${_ => {
                          try {
                            this.onUserInput({
                              target: { value: new Date(_.target.value).toISOString()}
                            }, "entry[resource.resourceType?MedicationRequest].resource.date")
                          } catch(ex) {
                            this.onUserInput(_, "entry[resource.resourceType?MedicationRequest].resource.date")
                          }
                        }}"                      />
                    </div>
                  </div>
                </div>

                <div class="column-2 col-reverse">
                  <div class="form-group">
                    <div class="input-wrapper">
                      <label for="Unfalltag1">${i18n("AccidentDay")}</label>
                      <input
                        type   = "text"
                        name   = "Unfalltag"
                        id     = "Unfalltag1"
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
                    id       = "noctu"
                    value    = "noctu"
                    name     = "noctu"
                            />
                  <label for="noctu">Impf-stoff</label>
                  <span class="checkmark"></span>
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
                  
                  ${prescriptions.map(medicationLine  => {
                    const medication =  medicationLine.entry.filter(
                      (oEntry) => oEntry.resource.resourceType === "Medication"
                    )[0].resource;
                    const medicationRequest =  medicationLine.entry.filter(
                      (oEntry) => oEntry.resource.resourceType === "MedicationRequest"
                    )[0].resource;
                    return html`
                      <li class="art-list-item">
                        <input
                          type        = "text"
                          class       = "drug-name"
                          name        = "drug-1"
                          value       = "${medication.code.text}" 
                          placeholder = ""
                        />
                        <input type="text" class="pzn" onclick="${_ => _.preventDefault()}" value="${_psp.read("entry[resource.resourceType?Medication].resource.code.coding[system?pzn].code", "")}" placeholder="" />
                        <input type="text" class="duration" onclick="${_ => _.preventDefault()}" value="${medicationRequest.dosageInstruction.length > 0 ? medicationRequest.dosageInstruction[0].text : ""}" placeholder="" />
                        <input type = "checkbox" id="drug-1-chk" style="display:none"/>
                        <span class="checkmark" @click="${() => document.getElementById("drug-1-chk").click()}"></span>
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
          <div style="text-align: center">
          ${_psp.read("entry[resource.resourceType?Practitioner].resource.name[0].prefix[0]") + " " +
                  _psp.read("entry[resource.resourceType?Practitioner].resource.name[0].given[0]") + " " +
                  _psp.read("entry[resource.resourceType?Practitioner].resource.name[0].family") + " "}                
        <br/>
        ${
           _psp.read("entry[resource.resourceType?Practitioner].resource.qualification[code.coding[system?Qualification_Type]].code.coding[system?Qualification_Type].code") + " " + 
           _psp.read("entry[resource.resourceType?Practitioner].resource.qualification[code.text].code.text") + " " 
        }
        <br/>
        ${
           _psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?streetName]].extension[url?streetName].valueString") + " " + 
           _psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?houseNumber]].extension[url?houseNumber].valueString") + " "
        }
        </div>
          </div>
        </div>
      </div>
      <!-- / Each patient item -->
    `;
  }
}
customElements.define("prescription-item", Prescription);
