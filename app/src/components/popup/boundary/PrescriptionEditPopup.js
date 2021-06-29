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
  removeValidationErrorForCurrentPopup
} from "../control/PopupControl.js";
import { Mapper } from "../../../libs/helper/Mapper.js";
import { updatePrescription } from "../../../prescriptions/control/UnsignedPrescriptionControl.js";
import { PopupRules, PopupErrorMessages } from "../../../prescriptions/boundary/ValidationRules.js";


const FIELD_STATUS_VERSICHERTENART = [
  { value: "1", label: "Mitglieder" },
  { value: "3", label: "Familienangehoerige" },
  { value: "5", label: "Rentner" }
]

const FIELD_STATUS_BESONDERE = [
  { value: "00", label: "nicht gesetzt" },
  { value: "04", label: "SOZ" },
  { value: "06", label: "BVG" },
  { value: "07", label: "SVA1" },
  { value: "08", label: "SVA2" },
  { value: "09", label: "ASY" },
]

const FIELD_STATUS_ZUORDNUNG = [
  { value: "00", label: "nicht gesetzt" },
  { value: "01", label: "DM2" },
  { value: "02", label: "BRK" },
  { value: "03", label: "KHK" },
  { value: "04", label: "DM1" },
  { value: "05", label: "Asthma" },
  { value: "06", label: "COPD" },
  { value: "07", label: "HI" },
  { value: "08", label: "Depression" },
  { value: "09", label: "Rueckenschmerz" },
  { value: "10", label: "Rheuma" },
]

const FIELD_STATUS_STATUSKENNZEICHEN = [
  { value: "00", label: "ohne Ersatzverordnungskennzeichen" },
  { value: "01", label: "ASV-Kennzeichen" },
  { value: "04", label: "Entlassmanagement-Kennzeichen" },
  { value: "07", label: "TSS-Kennzeichen" },
  { value: "10", label: "nur Ersatzverordnungskennzeichen" },
  { value: "11", label: "ASV-Kennzeichen mit Ersatzverordnungskennzeichen" },
  { value: "14", label: "Entlassmanagement-Kennzeichen mit Ersatzverordnungskennzeichen" },
  { value: "17", label: "TSS-Kennzeichen mit Ersatzverordnungskennzeichen" }
];

const FIELD_CLINIC_TYPE = [
  { value: "BSNR", label: "Betriebsstättennummer" },
  { value: "KZVA", label: "KZV-Abrechnungsnummer" }
];

const FIELD_PRACTID_TYPE = [
  { value: "LANR", label: "Arztnummer" },
  { value: "ZANR", label: "Zahnarztnummer" }
];

const FIELD_NORMGROBE_TYPE = [
  { value: "KA", label: "Keine Angabe" },
  { value: "KTP", label: "Keine therapiegerechte Packungsgröße" },
  { value: "N1", label: "N1" },
  { value: "N2", label: "N2" },
  { value: "N3", label: "N3" },
  { value: "NB", label: "Nicht betroffen" },
  { value: "Sonstiges", label: "Sonstiges" }
];

const FIELD_DARREICH_TYPE = [
  { value: "AEO", label: "Öl" },
  { value: "AMP", label: "Amp" },
  { value: "APA", label: "Amp" },
  { value: "ASN", label: "Salbe" },
  { value: "ASO", label: "Salbe" },
  { value: "ATO", label: "Tropf" },
  { value: "ATR", label: "AuTropf" },
  { value: "AUB", label: "AuBad" },
  { value: "AUC", label: "AuCreme" },
  { value: "AUG", label: "AuGel" },
  { value: "AUS", label: "AuSalbe" },
  { value: "BAD", label: "Bad" },
  { value: "BAL", label: "Balsam" },
  { value: "BAN", label: "Bandage" },
  { value: "BEU", label: "Beutel" },
  { value: "BIN", label: "Binden" },
  { value: "BON", label: "Bonbons" },
  { value: "BPL", label: "Platte" },
  { value: "BRE", label: "Brei" },
  { value: "BTA", label: "BrTabl" },
  { value: "CRE", label: "Creme" },
  { value: "DFL", label: "Flasche" },
  { value: "DIL", label: "Dilut" },
  { value: "DIS", label: "DIS" },
  { value: "DKA", label: "Dragees" },
  { value: "DOS", label: "Spray" },
  { value: "DRA", label: "Dragees" },
  { value: "DRM", label: "Dragees" },
  { value: "DSC", label: "Schaum" },
  { value: "DSS", label: "Spray" },
  { value: "EDP", label: "Pipette" },
  { value: "EIN", label: "Einreib" },
  { value: "ELE", label: "Elektr" },
  { value: "ELI", label: "Elixier" },
  { value: "EMU", label: "Emul" },
  { value: "ESS", label: "Essenz" },
  { value: "ESU", label: "Supp" },
  { value: "EXT", label: "Extrakt" },
  { value: "FBE", label: "Beutel" },
  { value: "FBW", label: "Einreib" },
  { value: "FDA", label: "Drag" },
  { value: "FER", label: "Spritze" },
  { value: "FET", label: "Salbe" },
  { value: "FLA", label: "Flasche" },
  { value: "FLE", label: "Flüss" },
  { value: "FLU", label: "Flüss" },
  { value: "FMR", label: "Tabl" },
  { value: "FOL", label: "Folie" },
  { value: "FRB", label: "FRB" },
  { value: "FSE", label: "Seife" },
  { value: "FTA", label: "Tabl" },
  { value: "GEK", label: "Gran" },
  { value: "GEL", label: "Gel" },
  { value: "GLI", label: "GLI" },
  { value: "GLO", label: "Globuli" },
  { value: "GMR", label: "Gran" },
  { value: "GPA", label: "Platte" },
  { value: "GRA", label: "Gran" },
  { value: "GSE", label: "Saft" },
  { value: "GUL", label: "Lösung" },
  { value: "HAS", label: "Handsch" },
  { value: "HKM", label: "Kaps" },
  { value: "HKP", label: "Kaps" },
  { value: "HPI", label: "InhKaps" },
  { value: "HVW", label: "Kaps" },
  { value: "IFA", label: "Amp" },
  { value: "IFB", label: "Beutel" },
  { value: "IFD", label: "InfDisp" },
  { value: "IFE", label: "Spritze" },
  { value: "IFF", label: "Flasche" },
  { value: "IFK", label: "Lösung" },
  { value: "IFL", label: "Flasche" },
  { value: "IFS", label: "Set" },
  { value: "IHA", label: "InhAmp" },
  { value: "IHP", label: "InhPulv" },
  { value: "IIE", label: "Lösung" },
  { value: "IIL", label: "Lösung" },
  { value: "IIM", label: "Lösung" },
  { value: "IKA", label: "InhKaps" },
  { value: "ILO", label: "Lösung" },
  { value: "IMP", label: "Impl" },
  { value: "INF", label: "Lösung" },
  { value: "INH", label: "Inhalat" },
  { value: "INI", label: "Flasche" },
  { value: "INL", label: "InhLös" },
  { value: "INS", label: "Tee" },
  { value: "IST", label: "Instill" },
  { value: "ISU", label: "Susp" },
  { value: "IUP", label: "Spirale" },
  { value: "KAN", label: "Kanüle" },
  { value: "KAP", label: "Kaps" },
  { value: "KAT", label: "KAT" },
  { value: "KDA", label: "KauDrag" },
  { value: "KEG", label: "Kegel" },
  { value: "KER", label: "Kerne" },
  { value: "KGU", label: "Kaug" },
  { value: "KID", label: "Konz" },
  { value: "KII", label: "Konz" },
  { value: "KKS", label: "Supp" },
  { value: "KLI", label: "Klist" },
  { value: "KLT", label: "KlisTbl" },
  { value: "KMP", label: "Kaps" },
  { value: "KMR", label: "Kaps" },
  { value: "KOD", label: "Kondom" },
  { value: "KOM", label: "Kompr" },
  { value: "KON", label: "Konz" },
  { value: "KPG", label: "KombiPg" },
  { value: "KRI", label: "KRI" },
  { value: "KSS", label: "Supp" },
  { value: "KSU", label: "Supp" },
  { value: "KTA", label: "KauTabl" },
  { value: "LAN", label: "Lanz" },
  { value: "LII", label: "Lösung" },
  { value: "LIQ", label: "Flüss" },
  { value: "LOE", label: "Lösung" },
  { value: "LOT", label: "Lotion" },
  { value: "LOV", label: "LOV" },
  { value: "LSE", label: "Lösung" },
  { value: "LTA", label: "Tabl" },
  { value: "LUP", label: "LUP" },
  { value: "LUT", label: "LuTabl" },
  { value: "MIL", label: "Milch" },
  { value: "MIS", label: "Misch" },
  { value: "MIX", label: "Mixtur" },
  { value: "MRG", label: "RetGran" },
  { value: "MRP", label: "Pellets" },
  { value: "MTA", label: "Tabl" },
  { value: "MUW", label: "MUW" },
  { value: "NAG", label: "NasGel" },
  { value: "NAO", label: "NasÖl" },
  { value: "NAS", label: "NasSpr" },
  { value: "NAW", label: "NAW" },
  { value: "NDS", label: "NasSpr" },
  { value: "NSA", label: "NSalbe" },
  { value: "NTR", label: "NTropf" },
  { value: "OCU", label: "OCU" },
  { value: "OEL", label: "Öl" },
  { value: "OHT", label: "OTropf" },
  { value: "OVU", label: "Ovula" },
  { value: "PAS", label: "Pastill" },
  { value: "PEL", label: "Pellets" },
  { value: "PEN", label: "Pen" },
  { value: "PER", label: "Perlen" },
  { value: "PFL", label: "Pflast" },
  { value: "PFT", label: "Pflast" },
  { value: "PHI", label: "Pulver" },
  { value: "PHV", label: "Pulver" },
  { value: "PIE", label: "Pulver" },
  { value: "PIF", label: "Lösung" },
  { value: "PII", label: "Pulver" },
  { value: "PIJ", label: "Pulver" },
  { value: "PIK", label: "Pulver" },
  { value: "PIS", label: "Pulver" },
  { value: "PIV", label: "PIV" },
  { value: "PKI", label: "Pulver" },
  { value: "PLE", label: "Pulver" },
  { value: "PLF", label: "PLF" },
  { value: "PLG", label: "PLG" },
  { value: "PLH", label: "PLH" },
  { value: "PLI", label: "PLI" },
  { value: "PLK", label: "PLK" },
  { value: "PLS", label: "Pulver" },
  { value: "PLV", label: "PLV" },
  { value: "PPL", label: "Lösung" },
  { value: "PRS", label: "PRS" },
  { value: "PSE", label: "Saft" },
  { value: "PST", label: "Paste" },
  { value: "PUD", label: "Puder" },
  { value: "PUL", label: "Pulver" },
  { value: "RED", label: "RetDrag" },
  { value: "REK", label: "RetKaps" },
  { value: "RET", label: "RetTabl" },
  { value: "RGR", label: "RetGran" },
  { value: "RKA", label: "RekKaps" },
  { value: "RMS", label: "Depot" },
  { value: "RSC", label: "Schaum" },
  { value: "RSU", label: "RekSusp" },
  { value: "RUT", label: "RetTabl" },
  { value: "SAF", label: "Saft" },
  { value: "SAL", label: "Salbe" },
  { value: "SAM", label: "Salbe" },
  { value: "SCH", label: "Schaum" },
  { value: "SEI", label: "Seife" },
  { value: "SHA", label: "Shampoo" },
  { value: "SIR", label: "Sirup" },
  { value: "SMF", label: "SMF" },
  { value: "SMT", label: "SMT" },
  { value: "SMU", label: "Supp" },
  { value: "SPA", label: "Amp" },
  { value: "SPF", label: "Flasche" },
  { value: "SPL", label: "Lösung" },
  { value: "SPR", label: "Spray" },
  { value: "SPT", label: "Spray" },
  { value: "SRI", label: "Spritze" },
  { value: "SSU", label: "Supp" },
  { value: "STA", label: "Amp" },
  { value: "STB", label: "Stäbch" },
  { value: "STI", label: "Stifte" },
  { value: "STR", label: "Streif" },
  { value: "SUB", label: "Subst" },
  { value: "SUE", label: "Susp" },
  { value: "SUL", label: "SubSpr" },
  { value: "SUP", label: "Supp" },
  { value: "SUS", label: "Susp" },
  { value: "SUT", label: "SubTabl" },
  { value: "SUV", label: "Susp" },
  { value: "SWA", label: "Schwamm" },
  { value: "TAB", label: "Tabl" },
  { value: "TAE", label: "Tafel" },
  { value: "TAM", label: "Amp" },
  { value: "TEE", label: "Tee" },
  { value: "TEI", label: "Tropfen" },
  { value: "TES", label: "Test" },
  { value: "TIN", label: "Tinktur" },
  { value: "TKA", label: "Tabl" },
  { value: "TLE", label: "LösTabl" },
  { value: "TMR", label: "Tabl" },
  { value: "TON", label: "Tonikum" },
  { value: "TPN", label: "Tampon" },
  { value: "TPO", label: "Tamp" },
  { value: "TRA", label: "TrAmp" },
  { value: "TRI", label: "TRI" },
  { value: "TRO", label: "Tropfen" },
  { value: "TRS", label: "TRS" },
  { value: "TRT", label: "TrTabl" },
  { value: "TSA", label: "Saft" },
  { value: "TSD", label: "TSD" },
  { value: "TSE", label: "SusTabl" },
  { value: "TSS", label: "TSS" },
  { value: "TST", label: "Test" },
  { value: "TSY", label: "TSY" },
  { value: "TTR", label: "Test" },
  { value: "TUB", label: "Tube" },
  { value: "TUE", label: "Tücher" },
  { value: "TUP", label: "Tupfer" },
  { value: "TVW", label: "RetTabl" },
  { value: "UTA", label: "Tabl" },
  { value: "VAL", label: "VagLös" },
  { value: "VAR", label: "VagRing" },
  { value: "VCR", label: "VagCrem" },
  { value: "VER", label: "Verband" },
  { value: "VGE", label: "VagGel" },
  { value: "VKA", label: "VagKaps" },
  { value: "VLI", label: "Vlies" },
  { value: "VOV", label: "VagOvul" },
  { value: "VST", label: "VagStäb" },
  { value: "VSU", label: "VagSupp" },
  { value: "VTA", label: "VagTabl" },
  { value: "WAT", label: "Watte" },
  { value: "WGA", label: "Gaze" },
  { value: "WKA", label: "Kaps" },
  { value: "WKM", label: "Kaps" },
  { value: "WUE", label: "Würfel" },
  { value: "XDG", label: "Gel" },
  { value: "XDS", label: "Spray" },
  { value: "XFE", label: "Festig." },
  { value: "XGM", label: "Maske" },
  { value: "XHS", label: "Spül." },
  { value: "XNC", label: "Creme" },
  { value: "XPK", label: "Pflege" },
  { value: "XTC", label: "Creme" },
  { value: "ZAM", label: "Amp" },
  { value: "ZBU", label: "Bürste" },
  { value: "ZCR", label: "Zahncr." },
  { value: "ZGE", label: "Zahngel" },
  { value: "ZKA", label: "ZerbKps" },
  { value: "ZPA", label: "Zahnp." }
];

const FIELD_PRACTQUALI_CODE = [
  { value: "00", label: "Arzt" },
  { value: "01", label: "Zahnarzt" },
  { value: "02", label: "Hebamme" },
  { value: "03", label: "Arzt in Weiterbildung" },
  { value: "04", label: "Arzt als Vertreter" },
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

    //How to get here state.showPopup?
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
      updatePrescription(label, value, key, statePath, useWindow);

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
    return html`
    <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
      <label>${this.label}</label>
      <input type="text" id="--${this.id !== "null" ? this.id : this.label}" value="${stateObject.read(this.mapKey ?? "", "")}" style="
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
            <edit-field statePath="prescriptions.PractIdPopup" mapKey="value" id="practId-doctor-number" label="Betriebsstätten-Nr" />
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

  view() {
    return html`
      <div class="modal" id="patientEdit" style="max-width: 800px;">
        <div class="modal-title" style="text-align:left">
          <p style="text-align:left"><strong>Name und Adresse des Patienten</strong></p>
        </div>
        <div style="text-align:left">
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id="patient-prefix" label="Titel" mapKey="entry[resource.resourceType?Patient].resource.name[0].prefix[0]"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id="patient-given" label="Vorname"  mapKey="entry[resource.resourceType?Patient].resource.name[0].given[0]"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id="patient-family" label="Nachname" mapKey="entry[resource.resourceType?Patient].resource.name[0].family"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id="patient-street-name" label="Straße" mapKey="entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?streetName]].extension[url?streetName].valueString" ratio="1.5"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id="patient-street-number" label="Hausnummer" mapKey="entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?houseNumber]].extension[url?houseNumber].valueString" ratio="0.5"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id="patient-street-additional" label="Adresszusatz" mapKey="entry[resource.resourceType?Patient].resource.address[0]._line[extension[url?additionalLocator]].extension[url?additionalLocator].valueString" ></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id="patient-postal-code" label="Postleitzahl" mapKey="entry[resource.resourceType?Patient].resource.address[0].postalCode" ratio="1"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id="patient-city" label="Stadt" mapKey="entry[resource.resourceType?Patient].resource.address[0].city" ratio="2"></edit-field>
          </div>
        </div>
        <div class="modal-buttons">
            <button data-close-button class="cancel" @click="${() => _hidePopup()}">Abbrechen</button>
            <button data-modal-target-processing="#processing" @click="${() => _hidePopup()}" class="ok-next" id="patient-save-button">Speichern</button>
        </div>
        <div id="patientEdit-error-messages"/>
      </div>
    `;
  }
};
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
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id="practitioner-prefix" mapKey="entry[resource.resourceType?Practitioner].resource.name[0].prefix[0]" label="Titel"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id="practitioner-given" mapKey="entry[resource.resourceType?Practitioner].resource.name[0].given[0]" label="Vorname"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id="practitioner-family" mapKey="entry[resource.resourceType?Practitioner].resource.name[0].family" label="Nachname"></edit-field>
          </div>
          <div class="fieldRow"> 
            <select-field statePath="prescriptions.selectedPrescription.prescriptions[0]" mapKey="entry[resource.resourceType?Practitioner].resource.qualification[code.coding[system?Qualification_Type]].code.coding[system?Qualification_Type].code" label="Qualifikation" ratio="1" items="${JSON.stringify(FIELD_PRACTQUALI_CODE)}"></select-field> 
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id='practitioner-qualification-text' mapKey="entry[resource.resourceType?Practitioner].resource.qualification[code.coding[system?Qualification_Type]].code.text" label="Berufsbezeichnung" ratio="2"></edit-field>
          </div>
        </div>
        <div class="modal-title" style="text-align:left;margin-top:15px;margin-bottom:15px">
          <p style="text-align:left"><strong>Informationen zum Betrieb</strong></p>
        </div>
        <div style="text-align:left">
        <div class="fieldRow"> 
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id="organization-name" mapKey="entry[resource.resourceType?Organization].resource.name" label="Betriebsname" ratio="1"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id="organization-street-name" mapKey="entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?streetName]].extension[url?streetName].valueString" label="Straße" ratio="1.5"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id="organization-street-number" mapKey="entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?houseNumber]].extension[url?houseNumber].valueString" label="Hausnummer" ratio="0.5"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id="organization-street-additional" mapKey="entry[resource.resourceType?Organization].resource.address[0]._line[extension[url?additionalLocator]].extension[url?additionalLocator].valueString" label="Adresszusatz"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id="organization-postal-code" mapKey="entry[resource.resourceType?Organization].resource.address[0].postalCode" label="Postleitzahl" ratio="1"></edit-field>
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id="organization-city" mapKey="entry[resource.resourceType?Organization].resource.address[0].city" label="Stadt" ratio="2"></edit-field>
          </div>
          <div class="fieldRow"> 
            <edit-field statePath="prescriptions.selectedPrescription.prescriptions[0]" id="organization-phone" mapKey="entry[resource.resourceType?Organization].resource.telecom[system?phone].value" label="Telefonnummer" ratio="1"></edit-field>
          </div>
        </div>
        <div class="modal-buttons">
            <button data-close-button class="cancel" @click="${() => _hidePopup()}">Abbrechen</button>
            <button data-modal-target-processing="#processing" @click="${() => _hidePopup()}" class="ok-next" id="organization-save-button">Speichern</button>
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