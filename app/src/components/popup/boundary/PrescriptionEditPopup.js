import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";
import {
  addActiveClass,
  removeActiveClass,
} from "../../../libs/helper/helper.js";
import { cancelPopupEditClinic, savePopupEditClinic, _hidePopup } from "../control/PopupControl.js";
import { Mapper } from "../../../libs/helper/Mapper.js";
import { updatePrescription } from "../../../prescriptions/control/UnsignedPrescriptionControl.js";

const FIELD_STATUS_VERSICHERTENART = [
  {value: "1", label: "Mitglieder"},
  {value: "3", label: "Familienangehoerige"},
  {value: "5", label: "Rentner"}
]

const FIELD_STATUS_BESONDERE  = [
  {value: "00", label: "nicht gesetzt"},
  {value: "04", label: "SOZ"},
  {value: "06", label: "BVG"},
  {value: "07", label: "SVA1"},
  {value: "08", label: "SVA2"},
  {value: "09", label: "ASY"},
]

const FIELD_STATUS_ZUORDNUNG = [
  {value: "00", label: "ni11cht gesetzt"},
  {value: "01", label: "DM2"},
  {value: "02", label: "BRK"},
  {value: "03", label: "KHK"},
  {value: "04", label: "DM1"},
  {value: "05", label: "Asthma"},
  {value: "06", label: "COPD"},
  {value: "07", label: "HI"},
  {value: "08", label: "Depression"},
  {value: "09", label: "Rueckenschmerz"},
  {value: "10", label: "Rheuma"},
]

const FIELD_STATUS_STATUSKENNZEICHEN = [
  {value: "00",	label: "ohne Ersatzverordnungskennzeichen"},
  {value: "01",	label: "ASV-Kennzeichen"},
  {value: "04",	label: "Entlassmanagement-Kennzeichen"},
  {value: "07",	label: "TSS-Kennzeichen"},
  {value: "10",	label: "nur Ersatzverordnungskennzeichen"},
  {value: "11",	label: "ASV-Kennzeichen mit Ersatzverordnungskennzeichen"},
  {value: "14",	label: "Entlassmanagement-Kennzeichen mit Ersatzverordnungskennzeichen"},
  {value: "17",	label: "TSS-Kennzeichen mit Ersatzverordnungskennzeichen"}
];

const FIELD_CLINIC_TYPE = [
  {value: "BSNR",	label: "Betriebsstättennummer"},
  {value: "KZVA",	label: "KZV-Abrechnungsnummer"}
];

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

    this.label     = this.getAttribute('label');
    this.id        = this.getAttribute('id');
    this.ratio     = Number(this.getAttribute('ratio') ?? 1);
    this.statePath = this.getAttribute('statePath');
    this.mapKey    = this.getAttribute('mapKey');
    this.useWindow = this.getAttribute('useWindow');
  }

  view() {
    const stateObject = new Mapper(new Mapper(this.useWindow === "true" ? window : this.state).read(this.statePath));
    this.style.flexGrow = this.ratio;
    return html`
    <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
      <label>${this.label}</label>
      <input type="text" id="--${this.id}" value="${stateObject.read(this.mapKey ?? "", "")}" style="
        height        : 56px;     
        background    : #E4E4E44D;
        border-radius : 4px;      
        border        : none;     
        width         : 100%;
      "
      @keyup="${_ => updatePrescription(this.label, _.target.value, this.mapKey, this.statePath, true)}"
      >
    </div>
    `;
  }
}
customElements.define("edit-field", EditField);

export class SelectField extends BElement {
  constructor() {
    super();

    this.label     = this.getAttribute('label');
    this.ratio     = Number(this.getAttribute('ratio') ?? 1);
    this.statePath = this.getAttribute('statePath');
    this.mapKey    = this.getAttribute('mapKey');
    this.useWindow = this.getAttribute('useWindow');
  }

  view() {
    this.items     = JSON.parse(this.getAttribute('items')) ?? [];
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
        //console.info(this.mapKey, _.value === stateObject.read(this.mapKey))
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
    document.getElementById("--xx").value = psp.read("entry[resource.resourceType?Organization].resource.identifier[0].value");
    cancelPopupEditClinic();
  }

  view() {
    return html`
      <div class="modal" id="clinicEdit" style="max-width: 800px;">
        <div class="modal-title" style="text-align:left">
          <p style="text-align:left"><strong>Medikament</strong></p>
        </div>
        <div style="text-align:left">
          <div class="fieldRow">
            <select-field statePath="prescriptions.clinicPopup" mapKey="type" label="Type" items="${JSON.stringify(FIELD_CLINIC_TYPE)}"></select-field> 
            <edit-field statePath="prescriptions.clinicPopup" mapKey="value" id="xx" label="Betriebsstätten-Nr" />
          </div>
        </div>
        <div class="modal-buttons">
            <button data-close-button class="cancel" @click="${() => this.cancelPopupEditClinic()}">Abbrechen</button>
            <button data-modal-target-processing="#processing" @click="${() => savePopupEditClinic()}" class="ok-next">Speichern</button>
        </div>
      </div>
    `;
  }
}
customElements.define("clinic-edit-popup", ClinicEditPopup);


export class MedicamentEditPopup extends BElement {
  view() {
    return html`
      <div class="modal" id="medicEdit" style="max-width: 800px;">
        <div class="modal-title" style="text-align:left">
          <p style="text-align:left"><strong>Medikament</strong></p>
        </div>
        <div style="text-align:left">
          <div class="fieldRow"> 
            <edit-field label="Handelsname" />
          </div>
          <div class="fieldRow">
            <span style="display:flex;flex:1"><edit-field label="PZN" /></span>
            <span style="display:flex;flex:1"><edit-field label="Darreichungsform" /></span>
          </div>
          <div class="fieldRow"> 
            <edit-field label="Dosierungsanweisung" />
          </div>
        </div>
        <div class="modal-buttons">
          <a
            href="/print"
            id="print"
            @click="${() => this.doSign()}"
            class="grow-in-wealth"
          >
            asdasdasdasd</a
          >
        </div>
      </div>
    `;
  }
}
customElements.define("medicament-edit-popup", MedicamentEditPopup);

export class PatientEditPopup extends BElement {
  view() {
    return html`
      <div class="modal" id="patientEdit" style="max-width: 800px;">
        <div class="modal-title" style="text-align:left">
          <p style="text-align:left"><strong>Name und Adresse des Patienten</strong></p>
        </div>
        <div style="text-align:left">
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" label="Titel" mapKey="entry[resource.resourceType?Patient].resource.name[0].prefix[0]"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" label="Vorname"  mapKey="entry[resource.resourceType?Patient].resource.name[0].given[0]"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" label="Nachname" mapKey="entry[resource.resourceType?Patient].resource.name[0].family"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" label="Straße" mapKey="entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?streetName]].extension[url?streetName].valueString" ratio="1.5"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" label="Hausnummer" mapKey="entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?houseNumber]].extension[url?houseNumber].valueString" ratio="0.5"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" label="Adresszusatz" mapKey="entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?additionalLocator]].extension[url?additionalLocator].valueString" ></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" label="Postleitzahl" mapKey="entry[resource.resourceType?Patient].resource.address[0].postalCode" ratio="1"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" label="Stadt" mapKey="entry[resource.resourceType?Patient].resource.address[0].city" ratio="2"></edit-field>
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
customElements.define("patient-edit-popup", PatientEditPopup);


export class OrganizationEditPopup extends BElement {
  view() {
    return html`
      <div class="modal" id="organizationEdit" style="max-width: 800px;">
        <div class="modal-title" style="text-align:left;margin-bottom:15px">
          <p style="text-align:left"><strong>Verschreibender Arzt</strong></p>
        </div>
        <div style="text-align:left">
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Practitioner].resource.name[0].prefix[0]" label="Titel"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Practitioner].resource.name[0].given[0]" label="Vorname"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Practitioner].resource.name[0].family" label="Nachname"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Practitioner].resource.qualification[code.coding[system?Qualification_Type]].code.coding[system?Qualification_Type].code" label="Qualifikation" ratio="1"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Practitioner].resource.qualification[code.text].code.text" label="Berufsbezeichnung" ratio="2"></edit-field>
          </div>
        </div>
        <div class="modal-title" style="text-align:left;margin-top:15px;margin-bottom:15px">
          <p style="text-align:left"><strong>Informationen zum Betrieb</strong></p>
        </div>
        <div style="text-align:left">
        <div class="fieldRow"> 
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Organization].resource.name" label="Betriebsname" ratio="1"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?streetName]].extension[url?streetName].valueString" label="Straße" ratio="1.5"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?houseNumber]].extension[url?houseNumber].valueString" label="Hausnummer" ratio="0.5"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?additionalLocator]].extension[url?additionalLocator].valueString" label="Adresszusatz"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Organization].resource.address[0].postalCode" label="Postleitzahl" ratio="1"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Organization].resource.address[0].city" label="Stadt" ratio="2"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Organization].resource.telecom[system?phone].value" label="Telefonnummer" ratio="1"></edit-field>
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
            <select-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?MedicationRequest].ext.st0.valueCoding" label="Versichertenart" items="${JSON.stringify(FIELD_STATUS_VERSICHERTENART)}"></select-field>
          </div>
          <div class="fieldRow">
            <select-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?MedicationRequest].ext.st1.valueCoding" label="Besondere Personengruppe (optional)" items="${JSON.stringify(FIELD_STATUS_BESONDERE)}"></select-field>
          </div>
          <div class="fieldRow"> 
            <select-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?MedicationRequest].ext.st2.valueCoding" label="DMP-Zuordnung (optional)" items="${JSON.stringify(FIELD_STATUS_ZUORDNUNG)}"></select-field>
          </div>
          <div class="fieldRow"> 
            <select-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?MedicationRequest].ext.st3.valueCoding" label="Statuskennzeichen (optional)" items="${JSON.stringify(FIELD_STATUS_STATUSKENNZEICHEN)}"></select-field>
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