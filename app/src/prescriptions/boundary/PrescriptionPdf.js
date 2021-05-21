import BElement from "../../models/BElement.js";
import { html } from "../../libs/lit-html.js";

class PrescriptionPdf extends BElement {

  view() {
    return html` <iframe
      src    = "https://www.kbv.de/media/sp/02_Mustersammlung.pdf"
      width  = "100%"                               
      height = "100%"                               
      style  = "border: none; width:100%">                     
      <p>Your browser does not support PDFs.
      <a href="https://www.kbv.de/media/sp/02_Mustersammlung.pdf">Download the PDF</a>.</p>
  </iframe>`;
  }
}
customElements.define('prescription-pdf', PrescriptionPdf);
