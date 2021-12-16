import BElement from "../../../models/BElement.js";
import { html } from "../../../libs/lit-html.js";

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

  
  view() {
    return html`
      <section class="status" style="padding: 2.5rem">
      <table>
        <tr><th>Text</th><th>Wert</th></tr>
        <tr><td>Connector Reachable</td><td>${this.state.connectorReachable}</td></tr>
      </table>
      </section>
    `;
  }
}

customElements.define("status-report", Status);
