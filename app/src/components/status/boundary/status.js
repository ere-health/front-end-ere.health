import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";
import {unsafeHTML} from 'https://unpkg.com/lit-html@latest/directives/unsafe-html.js?module';

import {
    requestStatus
} from "../control/StatusControl.js";

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
              // chosen blue because red–green color blindness
        case true: return html`<span style="color: blue;">&check;</span>`;
        case false: return html`<span style="color: red;">&cross;</span>`;
        case null:
        default: return html`<span style="color: red;">&quest;</span>`;
    }
  }

  view() {
    return html`
      <section class="status" style="padding: 2.5rem">
      <table style="padding: 1.5rem">
        <tr>
          <th>Komponent</th>
          <th>Status</th>
          <th>Bemerkung</th>
        </tr>
        <tr>
          <td>Connector Reachable</td>
          <td>${this.getHealthStateSymbol(this.state.connectorReachable)}</td>
          <td>${this.state.informationConnectorReachable}</td></tr>
      </table>
      </section>
    `;
  }

}

customElements.define("status-report", Status);
