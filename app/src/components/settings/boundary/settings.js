import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";

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
  }

  onUpdateSetting(path, value) {
    updateSetting(path, value);
  }
  
  view() {
    return html`
      <section class="settings" style="padding: 2.5rem">
            <form>
                <h2>Einstellungen</h2>
                <fieldset style="border: 0;margin-top: 2rem;border-radius: 1rem;background-color: white;padding: 1.5rem;">
                    <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
                        <label for="--settings-connector.base-url">Adresse des Konnektordienstverzeichnis</label>
                        <input type="text" id="--settings-connector.base-url" .value="${this.state.connector['base-url']}" style="
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
                        <label for="--settings-connector.verify-hostname">Signaturbestätigung auf dem Konnektor</label>
                        <select id="--settings-connector.verify-hostname" .value="${this.state.connector['verify-hostname']}" style="
                            height        : 56px;     
                            background    : #E4E4E44D;
                            border-radius : 4px;      
                            border        : none;     
                            width         : 100%;
                        "
                        @change="${_ => this.onUpdateSetting("connector.verify-hostname", _.target.value)}"
                        ></select>
                    </div>

                    <div style="display:flex; flex-direction:row;flex-grow: 1;padding: 7px;margin-top:5px;"> 
                        <div>
                            <label for="--settings-connector.mandant-id">Mandant ID</label><br />
                            <input type="text" id="--settings-connector.mandant-id" .value="${this.state.connector['mandant-id']}" style="
                                height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;
                                width: 95%;
                            "
                            @keyup="${_ => this.onUpdateSetting("connector.mandant-id", _.target.value)}"
                            >
                        </div>
                        <div>
                            <label for="--settings-connector.client-system-id">Client System ID</label><br />
                            <input type="text" id="--settings-connector.client-system-id" .value="${this.state.connector['client-system-id']}" style="
                                height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;
                                width: 95%;
                            "
                            @keyup="${_ => this.onUpdateSetting("connector.client-system-id", _.target.value)}"
                            >
                        </div>
                        <div>
                            <label for="--settings-connector.workplace-id">Arbeitsplatz ID</label><br />
                            <input type="text" id="--settings-connector.workplace-id" .value="${this.state.connector['workplace-id']}" style="
                                height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;
                                width: 95%;
                            "
                            @keyup="${_ => this.onUpdateSetting("connector.workplace-id", _.target.value)}"
                            >
                        </div>
                        <div>
                            <label for="--settings-connector.user-id">Nutzer ID</label><br />
                            <input type="text" id="--settings-connector.user-id" .value="${this.state.connector['user-id']}" style="
                                height        : 56px;
                                background    : #E4E4E44D;
                                border-radius : 4px;
                                border        : none;
                            "
                            @keyup="${_ => this.onUpdateSetting("connector.user-id", _.target.value)}"
                            >
                        </div>
                    </div>
                    <div style="padding: 7px;margin-top:5px;">
                        <button
                            style="float: left; background: #E4E4E4;"                                                                  
                            @click            = "${_ => this.resetSettings(_)}"  
                            class             = "jet-btn">
                        Änderungen zurücksetzen
                        </button>
                        <button 
                            style="margin-left: 1rem; float: right;"                                                                  
                            @click            = "${_ => this.saveSettings(_)}"  
                            class             = "jet-btn">
                        Konfiguration speichern
                        </button>
                        <button 
                            style="float: right; background: #E4E4E4;"                                                                    
                            @click            = "${_ => this.checkSettings(_)}"  
                            class             = "jet-btn">
                        Konfiguration prüfen
                        </button>
                    </div>
                </fieldset>
            </form>
      </section>
    `;
  }
}

customElements.define("settings-layout", Settings);
