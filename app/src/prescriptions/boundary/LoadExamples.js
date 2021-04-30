import BElement from "../../models/BElement.js";
import { html } from "../../libs/lit-html.js";
import { loadExamples } from "../control/UnsignedPrescriptionControl.js";

class LoadExamples extends BElement{
    
    view() {
        return html`
        <form>
            <button class="load-examples-button" @click="${e => this.loadExamples(e)}">Load examples</button>
        </form>
        `;
    }

    loadExamples(event) {
        const { target: { form } } = event;
        event.preventDefault();
        form.reportValidity();
        if(form.checkValidity()) {
            loadExamples();
        }
    }
}

customElements.define('load-examples', LoadExamples);