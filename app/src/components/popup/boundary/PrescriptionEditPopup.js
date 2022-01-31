import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";
import {
  addActiveClass,
  removeActiveClass,
} from "../../../libs/helper/helper.js";
import {
  cancelPopupEditClinic,
  savePopupEditClinic,
  _hidePopup,
  cancelPopupEditPractId,
  savePopupEditPractId,
  savePopupEditMedikament,
  cancelPopupEditMedikament,
  addValidationErrorForCurrentPopup,
  removeValidationErrorForCurrentPopup,
  savePopupEditPatient,
  cancelPopupEditPatient,
  cancelPopupEditOrga,
  savePopupEditOrga,
  ValidateAllFieldsInCurrentPopup
} from "../control/PopupControl.js";
import { Mapper } from "../../../libs/helper/Mapper.js";
import { updatePrescription } from "../../../prescriptions/control/UnsignedPrescriptionControl.js";
import { PopupRules, PopupErrorMessages } from "../../../prescriptions/boundary/ValidationRules.js";
import { 
  FIELD_CLINIC_TYPE, 
  FIELD_PRACTID_TYPE, 
  FIELD_NORMGROBE_TYPE, 
  FIELD_DARREICH_TYPE, 
  FIELD_PRACTQUALI_CODE, 
  FIELD_STATUS_VERSICHERTENART, 
  FIELD_STATUS_BESONDERE, 
  FIELD_STATUS_ZUORDNUNG, 
  FIELD_STATUS_STATUSKENNZEICHEN 
} from "./fieldselectoptions.js";


export class BasePopup extends BElement {
  constructor() {
    super();
    this.id = "genPopup";
  }

  showPopup() {
    // Open selected popup
    const overlay = document.getElementById("overlayGen");
    const modal = document.querySelector("#" + this.id);
    addActiveClass(modal);
    addActiveClass(overlay);
  }

  hidePopup() {
    const overlay = document.getElementById("overlayGen");
    const modal = document.querySelector("#" + this.id);
    removeActiveClass(modal);
    removeActiveClass(overlay);
  }

  view() {
    //this.showPopup();
    return html`
      <section class="popup">
        <div class="modal" id="genPopup"></div>
        <div id="overlayGen" class="overlay"></div>
      </section>
    `;
  }
}

export class EditField extends BElement {
  constructor() {
    super();

    this.label = this.getAttribute('label');
    this.id = this.getAttribute('id');
    this.ratio = Number(this.getAttribute('ratio') ?? 1);
    this.statePath = this.getAttribute('statePath');
    this.mapKey = this.getAttribute('mapKey');
    this.useWindow = this.getAttribute('useWindow');
  }

  validateInput(name, value) {
    let data = new Object();
    let rule = new Object();
    let currentPopupName = "";

    if (this.id.startsWith('patient')) {
      currentPopupName = 'patientEdit';
    } else if ((this.id.startsWith('practitioner')) || (this.id.startsWith('organization'))) {
      currentPopupName = 'organizationEdit';
    } else if (this.id.startsWith('practId')) {
      currentPopupName = 'PractIdEdit';
    } else if (this.id.startsWith('clinic')) {
      currentPopupName = 'clinicEdit';
    } else if (this.id.startsWith('medic')) {
      currentPopupName = 'medicEdit';
    }

    data[name] = value;
    rule[name] = PopupRules[currentPopupName][name];

    return new Validator(data, rule, PopupErrorMessages[currentPopupName][name]);
  }

  onUserInput(label, value, key, statePath, useWindow, id) {
    let validation = this.validateInput(id, value);

    if (validation.passes()) {
      removeValidationErrorForCurrentPopup(id);
      updatePrescription(id, value, key, statePath, useWindow);

      if ((id.startsWith("clinic")) && ((document.getElementById("clinicEdit-error-messages").innerHTML.trim().length == 0))) {
        document.getElementById("clinic-save-button").disabled = false;
      } else if ((id.startsWith("practId")) && ((document.getElementById("PractIdEdit-error-messages").innerHTML.trim().length == 0))) {
        document.getElementById("practId-save-button").disabled = false;
      } else if ((id.startsWith("medic")) && ((document.getElementById("medicEdit-error-messages").innerHTML.trim().length == 0))) {
        document.getElementById("medic-save-button").disabled = false;
      } else if ((id.startsWith("patient")) && ((document.getElementById("patientEdit-error-messages").innerHTML.trim().length == 0))) {
        document.getElementById("patient-save-button").disabled = false;
      } else if ((id.startsWith("organization")) && ((document.getElementById("organizationEdit-error-messages").innerHTML.trim().length == 0))) {
        document.getElementById("organization-save-button").disabled = false;
      }
    } else {
      addValidationErrorForCurrentPopup(id, validation.errors.get(id));

      if (id.startsWith("clinic")) {
        document.getElementById("clinic-save-button").disabled = true;
      } else if (id.startsWith("practId")) {
        document.getElementById("practId-save-button").disabled = true;
      } else if (id.startsWith("medic")) {
        document.getElementById("medic-save-button").disabled = true;
      } else if (id.startsWith("patient")) {
        document.getElementById("patient-save-button").disabled = true;
      } else if ((id.startsWith("organization")) || (id.startsWith("practitioner"))) {
        document.getElementById("organization-save-button").disabled = true;
      }
    }
  }

  view() {
    const stateObject = new Mapper(new Mapper(this.useWindow === "true" ? window : this.state).read(this.statePath));
    this.style.flexGrow = this.ratio;
    const value = stateObject.read(this.mapKey ?? "", "");
    const id = this.id !== "null" ? this.id : this.label;
    console.log(`Setting ${id} to ${value}`);
    return html`
    <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
      <label>${this.label}</label>
      <input type="text" id="--${id}" .value="${value}" style="
        height        : 56px;     
        background    : #E4E4E44D;
        border-radius : 4px;      
        border        : none;     
        width         : 100%;
      "
      @keyup="${_ => this.onUserInput(this.label, _.target.value, this.mapKey, this.statePath, true, this.id)}"
      >
    </div>
    `;
  }
}
customElements.define("edit-field", EditField);

export class SelectField extends BElement {
  constructor() {
    super();

    this.label = this.getAttribute('label');
    this.ratio = Number(this.getAttribute('ratio') ?? 1);
    this.statePath = this.getAttribute('statePath');
    this.mapKey = this.getAttribute('mapKey');
    this.useWindow = this.getAttribute('useWindow');
  }

  view() {
    this.items = JSON.parse(this.getAttribute('items')) ?? [];
    const stateObject = new Mapper(new Mapper(this.state).read(this.statePath));
    this.style.flexGrow = this.ratio;

    return html`
    <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
      <label>${this.label}</label>
      <select style="
        height        : 56px;
        background    : #E4E4E44D;
        border-radius : 4px;
        border        : none;
        width         : 100%;
        font-family   : Quicksand;
        font-style    : normal;
        font-weight   : 500;
        font-size     : 18px;
        line-height   : 22px;
      "
      @change="${_ => updatePrescription(this.label, _.target.value, this.mapKey, this.statePath)}"
      >
      ${this.items.map(_ => {
      return new Option(_.label, _.value, false, _.value === stateObject.read(this.mapKey))
    })}
      </select>
    </div>
    `;
  }
}
customElements.define("select-field", SelectField);

export class ClinicEditPopup extends BElement {

  cancelPopupEditClinic() {
    const psp = new Mapper(this.state.prescriptions.selectedPrescription.prescriptions[0]);
    document.getElementById("--clinic-betriebsstätten").value = psp.read("entry[resource.resourceType?Organization].resource.identifier[0].value");
    cancelPopupEditClinic();
  }

  view() {
    return html`
      <div class="modal" id="clinicEdit" style="max-width: 800px;">
        <div class="modal-title" style="text-align:left">
          <p style="text-align:left"><strong>Betriebsstätten-Nr.</strong></p>
        </div>
        <div style="text-align:left">
          <div class="fieldRow">
            <select-field statePath="prescriptions.clinicPopup" mapKey="type" label="Type" items="${JSON.stringify(FIELD_CLINIC_TYPE)}"></select-field> 
            <edit-field statePath="prescriptions.clinicPopup" mapKey="value" id="clinic-betriebsstätten" label="Betriebsstätten-Nr" />
          </div>
        </div>
        <div class="modal-buttons">
            <button data-close-button class="cancel" @click="${() => this.cancelPopupEditClinic()}">Abbrechen</button>
            <button data-modal-target-processing="#processing" @click="${() => savePopupEditClinic()}" class="ok-next" id="clinic-save-button">Speichern</button>
        </div>
        <div id="clinicEdit-error-messages"/>
      </div>
    `;
  }
}
customElements.define("clinic-edit-popup", ClinicEditPopup);

export class PractIdEditPopup extends BElement {

  cancelPopupEditPractId() {
    const psp = new Mapper(this.state.prescriptions.selectedPrescription.prescriptions[0]);
    document.getElementById("--practId-doctor-number").value = psp.read("entry[resource.resourceType?Practitioner].resource.identifier[0].value");
    cancelPopupEditPractId();
  }

  view() {
    return html`
      <div class="modal" id="PractIdEdit" style="max-width: 800px;">
        <div class="modal-title" style="text-align:left">
          <p style="text-align:left"><strong>Arzt-Nr.</strong></p>
        </div>
        <div style="text-align:left">
          <div class="fieldRow">
            <select-field statePath="prescriptions.PractIdPopup" mapKey="type" label="Type" items="${JSON.stringify(FIELD_PRACTID_TYPE)}"></select-field> 
            <edit-field statePath="prescriptions.PractIdPopup" mapKey="value" id="practId-doctor-number" label="Lebenslange Arztnummer" />
          </div>
        </div>
        <div class="modal-buttons">
            <button data-close-button class="cancel" @click="${() => this.cancelPopupEditPractId()}">Abbrechen</button>
            <button data-modal-target-processing="#processing" @click="${() => savePopupEditPractId()}" class="ok-next" id="practId-save-button">Speichern</button>
        </div>
        <div id="PractIdEdit-error-messages"/>
      </div>
    `;
  }
}
customElements.define("pract-id-edit-popup", PractIdEditPopup);

export class MedicamentEditPopup extends BElement {

  view() {
    return html`
      <div class="modal" id="medicEdit" style="max-width: 800px;">
        <div class="modal-title" style="text-align:left">
          <p style="text-align:left"><strong>Medikament</strong></p>
        </div>
        <div style="text-align:left">
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.MedikamentPopup" mapKey="medicationText" label="Handelsname" id="medic-medicationText"</edit-field>
          </div>
          <div class="fieldRow">
            <edit-field statePath="prescriptions.MedikamentPopup" mapKey="pzn" label="PZN" ratio="0.5" id="medic-pzn"></edit-field>
          </div>
          <div class="fieldRow">
            <edit-field statePath="prescriptions.MedikamentPopup" mapKey="quantityValue" label="Menge" id="medic-quantity"></edit-field>
            <select-field statePath="prescriptions.MedikamentPopup" mapKey="norm" label="Normgröße" items="${JSON.stringify(FIELD_NORMGROBE_TYPE)}"></select-field> 
            <select-field statePath="prescriptions.MedikamentPopup" mapKey="form" label="Darreichungsform" items="${JSON.stringify(FIELD_DARREICH_TYPE)}"></select-field> 
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.MedikamentPopup" mapKey="dosageInstruction" label="Dosierungsanweisung" id="medic-dosage-instructions"</edit-field>
          </div>
        </div>
        <div class="modal-buttons">
        <button data-close-button class="cancel" @click="${() => cancelPopupEditMedikament()}">Abbrechen</button>
        <button data-modal-target-processing="#processing" @click="${() => savePopupEditMedikament()}" class="ok-next" id="medic-save-button">Speichern</button>
    </div>
    <div id="medicEdit-error-messages"/>
      </div>
    `;
  }
}
customElements.define("medicament-edit-popup", MedicamentEditPopup);

export class PatientEditPopup extends BElement {
  cancelPopupEditPatient() {
    const psp = new Mapper(this.state.prescriptions.selectedPrescription.prescriptions[0]);
    document.getElementById("--patient-prefix").value            = psp.read("entry[resource.resourceType?Patient].resource.name[0].prefix[0]", "");
    document.getElementById("--patient-given").value             = psp.read("entry[resource.resourceType?Patient].resource.name[0].given[0]");
    document.getElementById("--patient-family").value            = psp.read("entry[resource.resourceType?Patient].resource.name[0].family");
    document.getElementById("--patient-street-name").value       = psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?streetName]].extension[url?streetName].valueString");
    document.getElementById("--patient-street-number").value     = psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?houseNumber]].extension[url?houseNumber].valueString");
    document.getElementById("--patient-street-additional").value = psp.read("entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?additionalLocator]].extension[url?additionalLocator].valueString", "");
    document.getElementById("--patient-postal-code").value       = psp.read("entry[resource.resourceType?Patient].resource.address[0].postalCode");
    document.getElementById("--patient-city").value              = psp.read("entry[resource.resourceType?Patient].resource.address[0].city");

    cancelPopupEditPatient();
  }
  view() {
    return html`
      <div class="modal" id="patientEdit" style="max-width: 800px;">
        <div class="modal-title" style="text-align:left">
          <p style="text-align:left"><strong>Name und Adresse des Patienten</strong></p>
        </div>
        <div style="text-align:left">
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.PatientPopup" id="patient-prefix" label="Titel" mapKey="patientPrefix"></edit-field>
            <edit-field statePath="prescriptions.PatientPopup" id="patient-given" label="Vorname"  mapKey="patientGiven"></edit-field>
            <edit-field statePath="prescriptions.PatientPopup" id="patient-family" label="Nachname" mapKey="patientFamily"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.PatientPopup" id="patient-street-name" label="Straße" mapKey="patientStreetName" ratio="1.5"></edit-field>
            <edit-field statePath="prescriptions.PatientPopup" id="patient-street-number" label="Hausnummer" mapKey="patientStreetNumber" ratio="0.5"></edit-field>
            <edit-field statePath="prescriptions.PatientPopup" id="patient-street-additional" label="Adresszusatz" mapKey="patientStreetAdditional" ></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.PatientPopup" id="patient-postal-code" label="Postleitzahl" mapKey="patientPostalCode" ratio="1"></edit-field>
            <edit-field statePath="prescriptions.PatientPopup" id="patient-city" label="Stadt" mapKey="patientCity" ratio="2"></edit-field>
          </div>
        </div>
        <div class="modal-buttons">
            <button data-close-button class="cancel" @click="${() => this.cancelPopupEditPatient()}">Abbrechen</button>
            <button data-close-button class="check-errors" @click="${() => ValidateAllFieldsInCurrentPopup()}">Fehler prüfen</button>
            <button data-modal-target-processing="#processing" @click="${() => savePopupEditPatient()}" class="ok-next" id="patient-save-button">Speichern</button>
        </div>
        <div id="patientEdit-error-messages"/>
      </div>
    `;
  }
};
customElements.define("patient-edit-popup", PatientEditPopup);


export class OrganizationEditPopup extends BElement {

  cancelPopupEditOrga() {
    const psp = new Mapper(this.state.prescriptions.selectedPrescription.prescriptions[0]);

    document.getElementById("--practitioner-prefix").value = psp.read("entry[resource.resourceType?Practitioner].resource.name[0].prefix[0]", "");
    document.getElementById("--practitioner-given").value = psp.read("entry[resource.resourceType?Practitioner].resource.name[0].given[0]");
    document.getElementById("--practitioner-family").value = psp.read("entry[resource.resourceType?Practitioner].resource.name[0].family");
    //document.getElementById("--qualifikation").value = psp.read("entry[resource.resourceType?Practitioner].resource.qualification[code.coding[system?Qualification_Type]].code.coding[system?Qualification_Type].code");
    document.getElementById("--practitioner-qualification-text").value = psp.read("entry[resource.resourceType?Practitioner].resource.qualification[code.coding[system?Qualification_Type]].code.text", "");
    document.getElementById("--organization-name").value = psp.read("entry[resource.resourceType?Organization].resource.name");
    document.getElementById("--organization-street-name").value = psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?streetName]].extension[url?streetName].valueString");
    document.getElementById("--organization-street-number").value = psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?houseNumber]].extension[url?houseNumber].valueString");
    document.getElementById("--organization-street-additional").value = psp.read("entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?additionalLocator]].extension[url?additionalLocator].valueString", "");
    document.getElementById("--organization-postal-code").value = psp.read("entry[resource.resourceType?Organization].resource.address[0].postalCode");
    document.getElementById("--organization-city").value = psp.read("entry[resource.resourceType?Organization].resource.address[0].city");
    document.getElementById("--organization-phone").value = psp.read("entry[resource.resourceType?Organization].resource.telecom[system?phone].value");

    cancelPopupEditOrga();
  }

  view() {
    return html`
      <div class="modal" id="organizationEdit" style="max-width: 800px;">
        <div class="modal-title" style="text-align:left;margin-bottom:15px">
          <p style="text-align:left"><strong>Verschreibender Arzt</strong></p>
        </div>
        <div style="text-align:left">
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.OrgaPopup" id="practitioner-prefix" mapKey="practitionerPrefix" label="Titel"></edit-field>
            <edit-field statePath="prescriptions.OrgaPopup" id="practitioner-given" mapKey="practitionerGiven" label="Vorname"></edit-field>
            <edit-field statePath="prescriptions.OrgaPopup" id="practitioner-family" mapKey="practitionerFamily" label="Nachname"></edit-field>
          </div>
          <div class="fieldRow"> 
            <select-field statePath="prescriptions.OrgaPopup" mapKey="qualifikation" label="Qualifikation" ratio="1" items="${JSON.stringify(FIELD_PRACTQUALI_CODE)}"></select-field> 
            <edit-field statePath="prescriptions.OrgaPopup" id='practitioner-qualification-text' mapKey="berufsbezeichnung" label="Berufsbezeichnung" ratio="2"></edit-field>
          </div>
        </div>
        <div class="modal-title" style="text-align:left;margin-top:15px;margin-bottom:15px">
          <p style="text-align:left"><strong>Informationen zum Betrieb</strong></p>
        </div>
        <div style="text-align:left">
        <div class="fieldRow"> 
            <edit-field statePath="prescriptions.OrgaPopup" id="organization-name" mapKey="organizationName" label="Betriebsname" ratio="1"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.OrgaPopup" id="organization-street-name" mapKey="organizationStreetName" label="Straße" ratio="1.5"></edit-field>
            <edit-field statePath="prescriptions.OrgaPopup" id="organization-street-number" mapKey="organizationStreetNumber" label="Hausnummer" ratio="0.5"></edit-field>
            <edit-field statePath="prescriptions.OrgaPopup" id="organization-street-additional" mapKey="organizationStreetAdditional" label="Adresszusatz"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.OrgaPopup" id="organization-postal-code" mapKey="organizationPostalCode" label="Postleitzahl" ratio="1"></edit-field>
            <edit-field statePath="prescriptions.OrgaPopup" id="organization-city" mapKey="organizationCity" label="Stadt" ratio="2"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.OrgaPopup" id="organization-phone" mapKey="organizationPhone" label="Telefonnummer" ratio="1"></edit-field>
          </div>
        </div>
        <div class="modal-buttons">
            <button data-close-button class="cancel" @click="${() => this.cancelPopupEditOrga()}">Abbrechen</button>
            <button data-close-button class="check-errors" @click="${() => ValidateAllFieldsInCurrentPopup()}">Fehler prüfen</button>
            <button data-modal-target-processing="#processing" @click="${() => savePopupEditOrga()}" class="ok-next" id="organization-save-button">Speichern</button>
        </div>
        <div id="organizationEdit-error-messages"/>
      </div>
    `;
  }
}
customElements.define("organization-edit-popup", OrganizationEditPopup);

export class StatusEditPopup extends BElement {
  view() {
    return html`
      <div class="modal" id="statusEdit" style="max-width: 800px;">
        <div class="modal-title" style="text-align:left">
          <p style="text-align:left"><strong>Status</strong></p>
        </div>
        <div style="text-align:left">
          <div class="fieldRow"> 
            <select-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Coverage].resource.extension[url?versichertenart].valueCoding.code" label="Versichertenart" items="${JSON.stringify(FIELD_STATUS_VERSICHERTENART)}"></select-field>
          </div>
          <div class="fieldRow">
            <select-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Coverage].resource.extension[url?personengruppe].valueCoding.code" label="Besondere Personengruppe (optional)" items="${JSON.stringify(FIELD_STATUS_BESONDERE)}"></select-field>
          </div>
          <div class="fieldRow"> 
            <select-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Coverage].resource.extension[url?dmp].valueCoding.code" label="DMP-Zuordnung (optional)" items="${JSON.stringify(FIELD_STATUS_ZUORDNUNG)}"></select-field>
          </div>
          <div class="fieldRow"> 
            <select-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Composition].resource.extension[url?KBV_EX_FOR_Legal_basis].valueCoding.code" label="Statuskennzeichen (optional)" items="${JSON.stringify(FIELD_STATUS_STATUSKENNZEICHEN)}"></select-field>
          </div>
        </div>
        <div class="modal-buttons">
            <button data-close-button class="cancel" @click="${() => _hidePopup()}">Abbrechen</button>
            <button data-modal-target-processing="#processing" @click="${() => _hidePopup()}" class="ok-next">Speichern</button>
        </div>
      </div>
    `;
  }
}
customElements.define("status-edit-popup", StatusEditPopup);