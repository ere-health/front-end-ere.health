import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";
import {  } from "../../cards/boundary/cards.js";

import {
    updateSetting,
    checkSettings,
    saveSettings,
    resetSettings
} from "../control/SettingsControl.js";

class Settings extends BElement {

  extractState({settingsReducer: {settings}}) {
    return settings;
  }

  resetSettings(e) {
    e.preventDefault();
    resetSettings();
  }

  checkSettings(e) {
    e.preventDefault();
    checkSettings();
  }

  saveSettings(e) {
    e.preventDefault();
    saveSettings();
    alert("Daten an Server gesendet.");
  }

  loadClientCertificateIntoTextarea(e) {
    e.preventDefault();
    const reader = new FileReader();

    reader.onload = function (e2) {
        updateSetting("connector.client-certificate", e2.target.result);
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  onUpdateSetting(path, value, e) {
    if(e) {
        e.preventDefault();
    }
    updateSetting(path, value);
  }
  toggleFieldset(e, fieldset) {
    e.preventDefault();
    document.getElementById('cards').style.display = 'none';
    document.getElementById('connector').style.display = 'none';
    document.getElementById('document-service').style.display = 'none';
    document.getElementById('kbv').style.display = 'none';

    document.getElementById('reset-settings-button').style.display = (fieldset != "cards") ? 'inline-block' : 'none';
    document.getElementById('save-settings-button').style.display = (fieldset != "cards") ? 'inline-block' : 'none';
    
    document.getElementById(fieldset).style.display = 'block';    

  }
  
  view() {
    return html`
      <section class="settings" style="padding: 2.5rem">
            <form>
                <h2>Einstellungen</h2>
                <ul style="margin-top: 2rem;">
                    <li style="display: inline-block"><button style="
                            background-color: #E4E4E4;
                        " @click="${_ => this.toggleFieldset(_, 'cards')}">Karten</button></li>
                    <li style="display: inline-block"><button style="
                            background-color: #E4E4E4;
                        " @click="${_ => this.toggleFieldset(_, 'connector')}">Konnektor</button></li>
                    <li style="display: inline-block"><button style="
                            background-color: #E4E4E4;
                        " @click="${_ => this.toggleFieldset(_, 'document-service')}">Dokumenterkennung</button></li>
                    <li style="display: inline-block"><button style="
                            background-color: #E4E4E4;
                        " @click="${_ => this.toggleFieldset(_, 'kbv')}">KBV Prüfnummer</button></li>
                </ul>
                <fieldset id="cards" style="border: 0;border-radius: 1rem;background-color: white;padding: 1.5rem;">
                    <cards-section />
                </fieldset>
                <fieldset id="connector" style="display: none; border: 0;border-radius: 1rem;background-color: white;padding: 1.5rem;">
                    <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
                        <label for="--settings-connector.base-url">Adresse des Konnektordienstverzeichnis*</label>
                        <input type="text" id="--settings-connector.base-url" .value="${this.state['connector.base-url']}" style="
                            height        : 56px;     
                            background    : #E4E4E44D;
                            border-radius : 4px;      
                            border        : none;     
                            width         : 100%;
                        "
                        @keyup="${_ => this.onUpdateSetting("connector.base-url", _.target.value)}"
                        >
                    </div>
                    <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
                        <label for="--settings-connector.version">Version des Connectors*</label>
                        <input type="text" id="--settings-connector.version" .value="${this.state['connector.version']}" placeholder="PTV4 oder PTV4+" style="
                            height        : 56px;     
                            background    : #E4E4E44D;
                            border-radius : 4px;      
                            border        : none;     
                            width         : 100%;
                        "
                        @keyup="${_ => this.onUpdateSetting("connector.version", _.target.value)}"
                        >
                    </div>
                    <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px;"> 
                        <label for="--settings-connector.client-certificate">PKCS12 Connector Client Certificate</label><br />
                        <textarea id="--settings-connector.client-certificate" .placeholder="${this.state['connector.client-certificate']?? ""}" style="
                            height        : 10rem;
                            background    : #E4E4E44D;
                            border-radius : 4px;
                            border        : none;
                        " readonly="readonly"
                        ></textarea>
                        <input type="file" id="--settings-connector.client-certificate-file" @change="${_ => this.loadClientCertificateIntoTextarea(_)}" />
                        <button 
                            style="margin: 1rem 0; background: #FF0000;"                                                                  
                            @click            = "${_ => this.onUpdateSetting("connector.client-certificate", "", _)}"  
                            class             = "jet-btn">
                        Zertifikat löschen
                        </button>
                        <label for="--settings-connector.client-certificate-password">PKCS12 Connector Client Certificate Password</label><br />
                        <input type="text" id="--settings-connector.client-certificate-password" .value="${this.state['connector.client-certificate-password']}" style="
                            height        : 56px;     
                            background    : #E4E4E44D;
                            border-radius : 4px;      
                            border        : none;
                        "
                        @keyup="${_ => this.onUpdateSetting("connector.client-certificate-password", _.target.value)}"
                        >
                    </div>
                    <div style="display:flex; flex-direction:row;flex-grow: 1;padding: 7px;margin-top:5px;"> 
                        <div style="flex-grow: 1;">
                            <label for="--settings-connector.basic-auth-username">Basic Auth Username</label><br />
                            <input type="text" id="--settings-connector.basic-auth-username" .value="${this.state['connector.basic-auth-username']}" style="
                                height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;
                                width: 95%;
                            "
                            @keyup="${_ => this.onUpdateSetting("connector.basic-auth-username", _.target.value)}"
                            >
                        </div>
                        <div style="flex-grow: 1;">
                            <label for="--settings-connector.basic-auth-password">Basic Auth Password</label><br />
                            <input type="text" id="--settings-connector.basic-auth-password" .value="${this.state['connector.basic-auth-password']}" style="
                                height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;
                                width: 100%;
                            "
                            @keyup="${_ => this.onUpdateSetting("connector.basic-auth-password", _.target.value)}"
                            >
                        </div>
                    </div>
                    <div style="display:flex; flex-direction:row;flex-grow: 1;padding: 7px;margin-top:5px;"> 
                        <div style="flex-grow: 1;">
                            <label for="--settings-connector.mandant-id">Mandant ID*</label><br />
                            <input type="text" id="--settings-connector.mandant-id" .value="${this.state['connector.mandant-id']}" style="
                                height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;
                                width: 95%;
                            "
                            @keyup="${_ => this.onUpdateSetting("connector.mandant-id", _.target.value)}"
                            >
                        </div>
                        <div style="flex-grow: 1;">
                            <label for="--settings-connector.client-system-id">Client System ID*</label><br />
                            <input type="text" id="--settings-connector.client-system-id" .value="${this.state['connector.client-system-id']}" style="
                                height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;
                                width: 95%;
                            "
                            @keyup="${_ => this.onUpdateSetting("connector.client-system-id", _.target.value)}"
                            >
                        </div>
                        <div style="flex-grow: 1;">
                            <label for="--settings-connector.workplace-id">Arbeitsplatz ID*</label><br />
                            <input type="text" id="--settings-connector.workplace-id" .value="${this.state['connector.workplace-id']}" style="
                                height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;
                                width: 95%;
                            "
                            @keyup="${_ => this.onUpdateSetting("connector.workplace-id", _.target.value)}"
                            >
                        </div>
                        <div style="flex-grow: 1;">
                            <label for="--settings-connector.user-id">Nutzer ID*</label><br />
                            <input type="text" id="--settings-connector.user-id" .value="${this.state['connector.user-id']}" style="
                                height        : 56px;
                                background    : #E4E4E44D;
                                border-radius : 4px;
                                border        : none;
                                width: 95%;
                            "
                            @keyup="${_ => this.onUpdateSetting("connector.user-id", _.target.value)}"
                            >
                        </div>
                    </div>
                </fieldset>
                <fieldset id="document-service"  style="display: none; border: 0;border-radius: 1rem;background-color: white;padding: 1.5rem;">
                    <label for="muster16TemplateProfile">Einstellung für Dokumenterkennung</label>
                    <select id="muster16TemplateProfile" style="
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
                    @change="${_ => this.onUpdateSetting("extractor.template.profile", _.target.value)}"
                    >
                        <option value="CGM_TURBO_MED" ?selected=${this.state['extractor.template.profile'] === 'CGM_TURBO_MED'}>CGM_TURBO_MED</option>
                        <option value="CGM_Z1" ?selected=${this.state['extractor.template.profile'] === 'CGM_Z1'}>CGM_Z1</option>
                        <option value="APRAXOS" ?selected=${this.state['extractor.template.profile'] === 'APRAXOS'}>APRAXOS</option>
                        <option value="DENS" ?selected=${this.state['extractor.template.profile'] === 'DENS'}>DENS</option>
                        <option value="DENS_LANDSCAPE" ?selected=${this.state['extractor.template.profile'] === 'DENS_LANDSCAPE'}>DENS_LANDSCAPE</option>
                    </select>
                </fieldset>
                <fieldset id="kbv"  style="display: none; border: 0;border-radius: 1rem;background-color: white;padding: 1.5rem;">
                    <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
                        <label for="--settings-kbv.pruefnummer">KBV Prüfnummer*</label>
                        <input type="text" id="--settings-kbv.pruefnummer" .value="${this.state['kbv.pruefnummer']}" style="
                            height        : 56px;     
                            background    : #E4E4E44D;
                            border-radius : 4px;      
                            border        : none;     
                            width         : 100%;
                        "
                        @keyup="${_ => this.onUpdateSetting("kbv.pruefnummer", _.target.value)}"
                        >
                    </div>
                </fieldset>
                <div style="padding: 7px;margin-top:5px;">
                        <button
                            id="reset-settings-button"
                            style="display: none; float: left; background: #E4E4E4;"                                                                  
                            @click            = "${_ => this.resetSettings(_)}"  
                            class             = "jet-btn">
                        Änderungen zurücksetzen
                        </button>
                        <button
                            id="save-settings-button"
                            style="display: none; margin-left: 1rem; float: right;"                                                                  
                            @click            = "${_ => this.saveSettings(_)}"  
                            class             = "jet-btn">
                        Konfiguration speichern
                        </button>
                        <!-- <button 
                            style="float: right; background: #E4E4E4;"                                                                    
                            @click            = "${_ => this.checkSettings(_)}"  
                            class             = "jet-btn">
                        Konfiguration prüfen
                        </button> -->
                    </div>
                <div style="clear: both">
                    * Pflichtfelder
                </div>
            </form>
      </section>
    `;
  }
}

customElements.define("settings-layout", Settings);
