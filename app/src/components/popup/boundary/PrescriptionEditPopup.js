import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";
import {
  addActiveClass,
  removeActiveClass,
} from "../../../libs/helper/helper.js";
import { _hidePopup } from "../control/PopupControl.js";
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
    this.ratio     = Number(this.getAttribute('ratio') ?? 1);
    this.statePath = this.getAttribute('statePath');
    this.mapKey    = this.getAttribute('mapKey');
  }

  view() {
    const stateObject = new Mapper(new Mapper(this.state).read(this.statePath));
    this.style.flexGrow = this.ratio;
    return html`
    <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
      <label>${this.label}</label>
      <input type="text" value="${stateObject.read(this.mapKey ?? "", "")}" style="
        height        : 56px;     
        background    : #E4E4E44D;
        border-radius : 4px;      
        border        : none;     
        width         : 100%;
      "
      @keyup="${_ => updatePrescription(this.label, _.target.value, this.mapKey)}"
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
      "
      @change="${_ => void 0}"
      >
      ${this.items.map(_ => new Option(_.label, _.value, stateObject.read(this.mapKey ?? "", "")))}
      </select>
    </div>
    `;
  }
}
customElements.define("select-field", SelectField);


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
            <edit-field label="Titel"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" label="Vorname"  mapKey="entry[resource.resourceType?Patient].resource.name[0].given[0]"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" label="Nachname" mapKey="entry[resource.resourceType?Patient].resource.name[0].family"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" label="Straße" mapKey="entry[resource.resourceType?Patient].resource.address[0].line[0]" ratio="1.5"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" label="Hausnummer" mapKey="entry[resource.resourceType?Patient].resource.address[0].line[1]" ratio="0.5"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" label="Adresszusatz" mapKey="entry[resource.resourceType?Patient].resource.address[0].line[2]" ></edit-field>
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
            <edit-field label="Titel"></edit-field>
            <edit-field label="Vorname"></edit-field>
            <edit-field label="Nachname"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field label="Qualifikation" ratio="1"></edit-field>
            <edit-field label="Berufsbezeichnung" ratio="2"></edit-field>
          </div>
        </div>
        <div class="modal-title" style="text-align:left;margin-top:15px;margin-bottom:15px">
          <p style="text-align:left"><strong>Informationen zum Betrieb</strong></p>
        </div>
        <div style="text-align:left">
          <div class="fieldRow"> 
          <edit-field label="Straße" ratio="1.5"></edit-field>
            <edit-field label="Hausnummer" ratio="0.5"></edit-field>
            <edit-field label="Adresszusatz"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field label="Postleitzahl" ratio="1"></edit-field>
            <edit-field label="Stadt" ratio="2"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field label="Telefonnummer" ratio="1"></edit-field>
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
            <select-field label="Versichertenart" items="${JSON.stringify(FIELD_STATUS_VERSICHERTENART)}"></select-field>
          </div>
          <div class="fieldRow">
            <select-field label="Besondere Personengruppe" items="${JSON.stringify(FIELD_STATUS_BESONDERE)}"></select-field>
          </div>
          <div class="fieldRow"> 
            <select-field label="DMP-Zuordnung" items="${JSON.stringify(FIELD_STATUS_ZUORDNUNG)}"></select-field>
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