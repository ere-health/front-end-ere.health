import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";

import { updateRuntimeConfig,closeWizard } from "../control/WizardControl.js";

class SetupWizard extends BElement {

  constructor() {
      super();
      this.step = 1;
  }

  extractState(state) {
    return state.wizardReducer;
  }

  onUpdateRuntimeConfig(path, value, e) {
    if(e) {
        e.preventDefault();
    }
    updateRuntimeConfig(path, value);
  }
  
  loadClientCertificateIntoTextarea(e) {
    e.preventDefault();
    const reader = new FileReader();

    reader.onload = function (e2) {
        updateRuntimeConfig("connector.client-certificate", e2.target.result);
    }
    reader.readAsDataURL(e.target.files[0]);
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

  finish() {
	closeWizard();
  }

  view() {
    return html`
    <section class="popup">
        <div class="modal ${this.state.showWizard ? "active" : ""}" id="wizard-popup" .style="${this.state.showWizard ? "text-align: left; max-width: 100%; min-height: 57rem;" : "display: none"}">
            <div class="modal-title">
                <h1>go.ere.health SetUp</h1>
            </div>
            <div id="step-1">
                <h2>Konnektorverbindung</h2>
                <fieldset style="border: 0;border-radius: 1rem;background-color: white;padding: 1.5rem;"> 
                    <div>
                        <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
                            <label for="--runtimeConfig-connector.ip">IP-Adresse des Konnektors*</label>
                            <input type="text" id="--runtimeConfig-connector.ip" .value="${this.state.runtimeConfig['connector.ip']}" style="
                                height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;     
                                width         : 100%;
                            "
                            @keyup="${_ => this.onUpdateRuntimeConfig("connector.ip", _.target.value)}"
                            >
                            <!-- Show iframe with URL of connector to show if it is possible to connect to it -->
                        </div>
                        <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px"> 
                            <label for="--runtimeConfig-connector.ip">HTTPS mit Konnektor verwenden*</label>
                            <input type="checkbox" id="--runtimeConfig-connector.https" ?checked="${this.state.runtimeConfig['connector.https']}" style="
                                height        : 28px;
                                width         : 100%;
                            "
                            @change="${_ => this.onUpdateRuntimeConfig("connector.https", _.target.value)}"
                            >
                        </div>
                        <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px;"> 
                            <label for="--runtimeConfig-connector.client-certificate">PKCS12 Connector Client Certificate</label><br />
                            <textarea id="--runtimeConfig-connector.client-certificate" .placeholder="${this.state.runtimeConfig['connector.client-certificate']?? ""}" style="
                                height        : 10rem;
                                background    : #E4E4E44D;
                                border-radius : 4px;
                                border        : none;
                            " readonly="readonly"
                            ></textarea>
                            <input type="file" id="--runtimeConfig-connector.client-certificate-file" @change="${_ => this.loadClientCertificateIntoTextarea(_)}" />
                            <button 
                                style="margin: 1rem 0; background: #FF0000;"                                                                  
                                @click            = "${_ => this.onUpdateRuntimeConfig("connector.client-certificate", "", _)}"  
                                class             = "jet-btn">
                            Zertifikat löschen
                            </button>
                            <label for="--runtimeConfig-connector.client-certificate-password">PKCS12 Connector Client Certificate Password</label><br />
                            <input type="text" id="--runtimeConfig-connector.client-certificate-password" .value="${this.state.runtimeConfig['connector.client-certificate-password']}" style="
                                height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;
                            "
                            @keyup="${_ => this.onUpdateRuntimeConfig("connector.client-certificate-password", _.target.value)}"
                            >
                        </div>
                        <div style="display:flex; flex-direction:row;flex-grow: 1;padding: 7px;margin-top:5px;"> 
                            <div style="flex-grow: 1;">
                                <label for="--runtimeConfig-connector.basic-auth-username">Basic Auth Username</label><br />
                                <input type="text" id="--runtimeConfig-connector.basic-auth-username" .value="${this.state.runtimeConfig['connector.basic-auth-username']}" style="
                                    height        : 56px;     
                                    background    : #E4E4E44D;
                                    border-radius : 4px;      
                                    border        : none;
                                    width: 95%;
                                "
                                @keyup="${_ => this.onUpdateRuntimeConfig("connector.basic-auth-username", _.target.value)}"
                                >
                            </div>
                            <div style="flex-grow: 1;">
                                <label for="--runtimeConfig-connector.basic-auth-password">Basic Auth Password</label><br />
                                <input type="text" id="--runtimeConfig-connector.basic-auth-password" .value="${this.state.runtimeConfig['connector.basic-auth-password']}" style="
                                    height        : 56px;     
                                    background    : #E4E4E44D;
                                    border-radius : 4px;      
                                    border        : none;
                                    width: 100%;
                                "
                                @keyup="${_ => this.onUpdateRuntimeConfig("connector.basic-auth-password", _.target.value)}"
                                >
                            </div>
                        </div>
                    </div>
                </fieldset>
                <div class="modal-buttons" style="justify-content: right;">
                    <button @click="${() => this.next()}">Weiter</button>
                </div>
            </div>
            <div id="step-2" style="display: none">
                <h2>SSH Tunnel</h2>
                <fieldset style="border: 0;border-radius: 1rem;background-color: white;padding: 1.5rem;">
                    <div>
                        <div style="background: black; color: white; padding: 1rem; font-family: Courier, monospace; border-radius: 1rem">
                        route ADD 100.102.0.0 MASK 255.255.0.0 ${this.state.runtimeConfig["connector.ip"]}<br />
                        ssh -p 1049 -o StrictHostKeyChecking=no -o GlobalKnownHostsFile=/dev/null -o UserKnownHostsFile=/dev/null -R 127.0.0.1:1501:${this.state.runtimeConfig["connector.ip"]}:443 -R 127.0.0.1:1502:idp-ref.zentral.idp.splitdns.ti-dienste.de:443 -R 127.0.0.1:1503:erp-ref.zentral.erp.splitdns.ti-dienste.de:443 manuel@${window.location.hostname}
                        </div>
                    </div>
                </fieldset>
                <div class="modal-buttons" style="justify-content: right;">
                    <button @click="${() => this.back()}">Zurück</button>
                    <button class="jet-btn" @click="${() => this.next()}" ?disabled="${!this.state.sshTunnelWorked}">Weiter</button>
                </div>
            </div>
            <div id="step-3" style="display: none">
                <h2>Konnektorkontext</h2>
                <fieldset style="border: 0;border-radius: 1rem;background-color: white;padding: 1.5rem;">
                    <div style="display:flex; flex-direction:row;flex-grow: 1;padding: 7px;margin-top:5px;"> 
                        <div style="flex-grow: 1;">
                            <label for="--runtimeConfig-connector.mandant-id">Mandant ID*</label><br />
                            <input type="text" id="--runtimeConfig-connector.mandant-id" .value="${this.state.runtimeConfig['connector.mandant-id']}" style="
                                height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;
                                width: 95%;
                            "
                            @keyup="${_ => this.onUpdateRuntimeConfig("connector.mandant-id", _.target.value)}"
                            >
                        </div>
                        <div style="flex-grow: 1;">
                            <label for="--runtimeConfig-connector.client-system-id">Client System ID*</label><br />
                            <input type="text" id="--runtimeConfig-connector.client-system-id" .value="${this.state.runtimeConfig['connector.client-system-id']}" style="
                                height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;
                                width: 95%;
                            "
                            @keyup="${_ => this.onUpdateRuntimeConfig("connector.client-system-id", _.target.value)}"
                            >
                        </div>
                        <div style="flex-grow: 1;">
                            <label for="--runtimeConfig-connector.workplace-id">Arbeitsplatz ID*</label><br />
                            <input type="text" id="--runtimeConfig-connector.workplace-id" .value="${this.state.runtimeConfig['connector.workplace-id']}" style="
                                height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;
                                width: 95%;
                            "
                            @keyup="${_ => this.onUpdateRuntimeConfig("connector.workplace-id", _.target.value)}"
                            >
                        </div>
                        <div style="flex-grow: 1;">
                            <label for="--runtimeConfig-connector.user-id">Nutzer ID</label><br />
                            <input type="text" id="--runtimeConfig-connector.user-id" .value="${this.state.runtimeConfig['connector.user-id']}" style="
                                height        : 56px;
                                background    : #E4E4E44D;
                                border-radius : 4px;
                                border        : none;
                                width: 95%;
                            "
                            @keyup="${_ => this.onUpdateRuntimeConfig("connector.user-id", _.target.value)}"
                            >
                        </div>
                    </div>
                </fieldset>
                <h2>Experteneinstellungen <a href="#" @click="${(_) => {document.getElementById("wizard-expert").style.display='block'; return false;}}">Anzeigen</a></h2>
                <fieldset id="wizard-expert" style="display: none; border: 0;border-radius: 1rem;background-color: white;padding: 1.5rem;">
                    <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px;">
                        <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px;"> 
                            <label for="--runtimeConfig-ere.workflow-service.prescription.server.url">E-Rezept Fachdienst</label><br />
                            <input type="text" id="--runtimeConfig-ere.workflow-service.prescription.server.url" .value="${this.state.runtimeConfig['ere.workflow-service.prescription.server.url']}" style="
                                height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;
                            "
                            @keyup="${_ => this.onUpdateRuntimeConfig("ere.workflow-service.prescription.server.url", _.target.value)}"
                            >
                        </div>
                        <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px;"> 
                            <label for="--runtimeConfig-idp.base.url">Idp Base URL</label><br />
                            <input type="text" id="--runtimeConfig-idp.base.url" .value="${this.state.runtimeConfig['idp.base.url']}" style="
                                height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;
                            "
                            @keyup="${_ => this.onUpdateRuntimeConfig("idp.base.url", _.target.value)}"
                            >
                        </div>
                        <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px;"> 
                            <label for="--runtimeConfig-idp.client.id">Idp Client Id</label><br />
                            <input type="text" id="--runtimeConfig-idp.client.id" .value="${this.state.runtimeConfig['idp.client.id']}" style="
                                height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;
                            "
                            @keyup="${_ => this.onUpdateRuntimeConfig("idp.client.id", _.target.value)}"
                            >
                        </div>
                        <div style="display:flex; flex-direction:column;flex-grow: 1;padding: 7px;margin-top:5px;"> 
                            <label for="--runtimeConfig-idp.auth.request.redirect.url">Idp Client Id</label><br />
                            <input type="text" id="--runtimeConfig-idp.auth.request.redirect.url" .value="${this.state.runtimeConfig['idp.auth.request.redirect.url']}" style="
                                height        : 56px;     
                                background    : #E4E4E44D;
                                border-radius : 4px;      
                                border        : none;
                            "
                            @keyup="${_ => this.onUpdateRuntimeConfig("idp.auth.request.redirect.url", _.target.value)}"
                            >
                        </div>
                    </div>
                </fieldset>
                <div class="modal-buttons" style="justify-content: right;">
                    <button @click="${() => this.back()}">Zurück</button>
                    <button @click="${() => this.finish()}">Abschließen</button>
                </div>
            </div>
        </div>
    </section>
    `;
  }
}

customElements.define("setup-wizard", SetupWizard);
