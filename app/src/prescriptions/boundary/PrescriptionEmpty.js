import BElement from "../../models/BElement.js";
import { html } from "../../libs/lit-html.js";

class Prescription extends BElement {
  extractState({}) {
    return {};
  }

  view() {
    return html`
      <div class="print-wrapper">
        <img src="./assets/images/print.svg" alt="print" />
        <h3>Keine Rezepte zum Signieren ausgewählt.</h3>
        <p>
          Bitte klicken auf ein Rezept oder drucken Sie neue Rezepte in ihrem
          PVS.
        </p>
      </div>
    `;
  }
}
customElements.define('prescription-empty', Prescription);