import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";

class SetupWizard extends BElement {

  constructor() {
      super();
      this.step = 1;
  }

  extractState(state) {
    return state?.runtimeConfigReducer?.runtimeConfig || {};
  }

  onUpdateSetting(path, value, e) {
    if(e) {
        e.preventDefault();
    }
    updateSetting(path, value);
  }
  
  next() {
    let currentDiv = document.getElementById('step-'+this.step);
    let stepDiv = document.getElementById('step-'+(this.step+1));
    if(stepDiv) {
        this.step++;
        currentDiv.style.display = "none";
        stepDiv.style.display = "block";
    }
  }
  
  back() {
    let currentDiv = document.getElementById('step-'+this.step);
    let stepDiv = document.getElementById('step-'+(this.step-1));
    if(stepDiv) {
        this.step--;
        currentDiv.style.display = "none";
        stepDiv.style.display = "block";
    }
  }


  view() {
    return html`
      <div>
        <div id="step-1" style="display: none">
            <h2>Konnektorverbindung</h2>
            <fieldset id="connector" style="border: 0;border-radius: 1rem;background-color: white;padding: 1.5rem;"> 
                <div style="height: 42rem">
                    <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
                        <label for="--runtimeConfig-connector.ip">IP-Adresse des Konnektors*</label>
                        <input type="text" id="--runtimeConfig-connector.ip" .value="${this.state['connector.ip']}" style="
                            height        : 56px;     
                            background    : #E4E4E44D;
                            border-radius : 4px;      
                            border        : none;     
                            width         : 100%;
                        "
                        @keyup="${_ => this.onUpdateSetting("connector.ip", _.target.value)}"
                        >
                        <!-- Show iframe with URL of connector to show if it is possible to connect to it -->
                    </div>
                    <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
                        <label for="--runtimeConfig-connector.ip">HTTPS mit Konnektor verwenden*</label>
                        <input type="checkbox" id="--runtimeConfig-connector.https" ?checked="${this.state['connector.https']}" style="
                            height        : 28px;
                            width         : 100%;
                        "
                        @change="${_ => this.onUpdateSetting("connector.https", _.target.value)}"
                        >
                    </div>
                    <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px;"> 
                        <label for="--runtimeConfig-connector.client-certificate">PKCS12 Connector Client Certificate</label><br />
                        <textarea id="--runtimeConfig-connector.client-certificate" .placeholder="${this.state['connector.client-certificate']?? ""}" style="
                            height        : 10rem;
                            background    : #E4E4E44D;
                            border-radius : 4px;
                            border        : none;
                        " readonly="readonly"
                        ></textarea>
                        <input type="file" id="--runtimeConfig-connector.client-certificate-file" @change="${_ => this.loadClientCertificateIntoTextarea(_)}" />
                        <button 
                            style="margin: 1rem 0; background: #FF0000;"                                                                  
                            @click            = "${_ => this.onUpdateSetting("connector.client-certificate", "", _)}"  
                            class             = "jet-btn">
                        Zertifikat löschen
                        </button>
                        <label for="--runtimeConfig-connector.client-certificate-password">PKCS12 Connector Client Certificate Password</label><br />
                        <input type="text" id="--runtimeConfig-connector.client-certificate-password" .value="${this.state['connector.client-certificate-password']}" style="
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
                            <label for="--runtimeConfig-connector.basic-auth-username">Basic Auth Username</label><br />
                            <input type="text" id="--runtimeConfig-connector.basic-auth-username" .value="${this.state['connector.basic-auth-username']}" style="
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
                            <label for="--runtimeConfig-connector.basic-auth-password">Basic Auth Password</label><br />
                            <input type="text" id="--runtimeConfig-connector.basic-auth-password" .value="${this.state['connector.basic-auth-password']}" style="
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
                </div>
                <div class="modal-buttons">
                    <button @click="${() => this.next()}" style="float: right">Weiter</button>
                </div>
            </fieldset>
        </div>
        <div id="step-2">
            <h2>SSH Tunnel</h2>
            <fieldset style="border: 0;border-radius: 1rem;background-color: white;padding: 1.5rem;">
                <div style="height: 42rem">
                    <div style="background: black; color: white; padding: 1rem; font-family: Courier, monospace; border-radius: 1rem">
                    route ADD 100.102.0.0 MASK 255.255.0.0 ${this.state["connector.ip"]}
                    ssh -p 1049 -o StrictHostKeyChecking=no -o GlobalKnownHostsFile=/dev/null -o UserKnownHostsFile=/dev/null -R 127.0.0.1:1501:${this.state["connector.ip"]}:443 -R 127.0.0.1:1502:idp-ref.zentral.idp.splitdns.ti-dienste.de:443 -R 127.0.0.1:1503:erp-ref.zentral.erp.splitdns.ti-dienste.de:443 manuel@localhost
                    </div>
                </div>
                <div class="modal-buttons">
                    <button @click="${() => this.back()}" style="float: left">Zurück</button>
                    <button @click="${() => this.next()}" style="float: right">Weiter</button>
                </div>
            </fieldset>
        </div>
        <div id="step-3" style="display: none">
            <h2>Konnektorkontext</h2>
            <fieldset style="border: 0;border-radius: 1rem;background-color: white;padding: 1.5rem;">
                <div style="height: 42rem">
                    <div style="display:flex; flex-direction:row;flex-grow: 1;padding: 7px;margin-top:5px;"> 
                        <div style="flex-grow: 1;">
                            <label for="--runtimeConfig-connector.mandant-id">Mandant ID*</label><br />
                            <input type="text" id="--runtimeConfig-connector.mandant-id" .value="${this.state['connector.mandant-id']}" style="
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
                            <label for="--runtimeConfig-connector.client-system-id">Client System ID*</label><br />
                            <input type="text" id="--runtimeConfig-connector.client-system-id" .value="${this.state['connector.client-system-id']}" style="
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
                            <label for="--runtimeConfig-connector.workplace-id">Arbeitsplatz ID*</label><br />
                            <input type="text" id="--runtimeConfig-connector.workplace-id" .value="${this.state['connector.workplace-id']}" style="
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
                            <label for="--runtimeConfig-connector.user-id">Nutzer ID*</label><br />
                            <input type="text" id="--runtimeConfig-connector.user-id" .value="${this.state['connector.user-id']}" style="
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
                </div>
                <div class="modal-buttons">
                    <button @click="${() => this.back()}" style="float: left">Zurück</button>
                    <button @click="${() => this.next()}" style="float: right">Abschließen</button>
                </div>
            </fieldset>
        </div>
      </div>
    `;
  }
}

customElements.define("setup-wizard", SetupWizard);
