import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";
import { requestStatus } from "../control/StatusControl.js";

class Status extends BElement {

  extractState({statusReducer: {status}}) {
    return status;
  }

  requestStatus(e) {
    e.preventDefault();
    requestStatus();
  }

  getHealthStateSymbol(healthState) {
    switch (healthState) {
        // chosen blue instead of green because of red–green color blindness
        case true:  
          return html`<span style="color: blue;">&check;</span>`;
        case false: 
          return html`<span style="color: red;">&cross;</span>`;
        default:    
          return html`<span style="color: red;">&quest;</span>`;
    }
  }

  view() {
    return html`
      <section class="status">
      <table>
        <tr>
          <th>Komponent</th>
          <th style="padding: 0;text-align: center;">Status</th>
          <th>Bemerkung</th>
        </tr>
        <tr>
          <td>Connector is Reachable</td>
          <td style="text-align: center;">${this.getHealthStateSymbol(this.state.connectorReachable)}</td>
          <td>${this.state.connectorInformation}</td>
        </tr>
        <tr>
          <td>Identity Provider is Reachable</td>
          <td style="text-align: center;">${this.getHealthStateSymbol(this.state.idpReachable)}</td>
          <td>${this.state.idpInformation}</td>
        </tr>
        <tr>
          <td>SMC-B is Available</td>
          <td style="text-align: center;">${this.getHealthStateSymbol(this.smcbAvailable)}</td>
          <td>${this.state.smcbInformation}</td>
        </tr>        
        <tr>
          <td>C.AUT certificate from SMC-B is Readable</td>
          <td style="text-align: center;">${this.getHealthStateSymbol(this.cautReadable)}</td>
          <td>${this.state.cautInformation}</td>
        </tr>
        <tr>
          <td>E-HBA is Available</td>
          <td style="text-align: center;">${this.getHealthStateSymbol(this.ehbaAvailable)}</td>
          <td>${this.state.ehbaInformation}</td>
        </tr>
        <tr>
          <td>Comfort Signature is Available</td>
          <td style="text-align: center;">${this.getHealthStateSymbol(this.comfortsignatureAvailable)}</td>
          <td>${this.state.comfortsignatureInformation}</td>
        </tr>
        <tr>
          <td>IdP Access Token is Obtainable</td>
          <td style="text-align: center;">${this.getHealthStateSymbol(this.idpaccesstokenObtainable)}</td>
          <td>${this.state.idpaccesstokenInformation}</td>
        </tr>
        <tr>
          <td>Fachdienst is Reachable</td>
          <td style="text-align: center;">${this.getHealthStateSymbol(this.fachdienstReachable)}</td>
          <td>${this.state.fachdienstInformation}</td>
        </tr>
      </table>
      </section>
    `;
  }

}

customElements.define("status-report", Status);
