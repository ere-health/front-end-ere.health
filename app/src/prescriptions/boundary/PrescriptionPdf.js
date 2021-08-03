import BElement from "../../models/BElement.js";
import { html } from "../../libs/lit-html.js";

class PrescriptionPdf extends BElement {

  async sendPdfErixa() {
    const document = this.state.prescriptions.selectedPrescription.prescriptions.pdfDocument.content;
    const firstPrescription = this.state.prescriptions.selectedPrescription.prescriptions.bundleWithAccessCodeOrThrowables[0].bundle;
    const _psp = new Mapper(firstPrescription);

    let displayName = [
      _psp.read("entry[resource.resourceType?Patient].resource.name[0].given", []).join(" "),
      _psp.read("entry[resource.resourceType?Patient].resource.name[0].family")]
      .filter(_ => _).join(" ");

      try {

        await fetch("/erixa/sync", {
          method: "post",
          headers: { "Content-type" : "application/json" },
          body: JSON.stringify({ patient: displayName, document })
        });
        
        alert("Dokument gesendet");
      } catch(ex) {
        console.info(ex)
      }
  }

  view() {
    const document = this.state.prescriptions.selectedPrescription.prescriptions.pdfDocument.content;
    const firstPrescription = this.state.prescriptions.selectedPrescription.prescriptions.bundleWithAccessCodeOrThrowables[0].bundle;
     const _psp = new Mapper(firstPrescription);

    let displayName = [
      _psp.read("entry[resource.resourceType?Patient].resource.name[0].given", []).join(" "),
      _psp.read("entry[resource.resourceType?Patient].resource.name[0].family")]
      .filter(_ => _).join(" ");

    return html`
    <div style="
      height          : 65px;
      display         : flex;
      flex-direction  : row;
      align-content   : center;
      justify-content : space-between;
      align-items     : center;
    ">
      <span style="margin-left: 45px">
        <span style="
          font-family    : Quicksand;
          font-size      : 24px;
          font-style     : normal;
          font-weight    : 500;
          line-height    : 30px;
          letter-spacing : 0px;
          text-align     : left;
        ">Rezept für </span>
        <span style="
          font-family    : Quicksand;
          font-size      : 24px;
          font-style     : normal;
          font-weight    : 700;
          line-height    : 30px;
          letter-spacing : 0px;
          text-align     : left;

        ">${displayName}</span>

      </span>
    <button data-close-button class="cancel" style="
      filter        : drop-shadow(2px 4px 6px rgba(0,0,0,.25));
      margin-right  : 45px;            
      margin-bottom : 0px;                         
    " @click="${() => this.sendPdfErixa()}">Direkt an Apotheke senden</button>
    </div>
    <iframe
      src    = "data:application/pdf;base64, ${document}"
      width  = "100%"
      height = "100%"
      style  = "border: none; width:100%">
      <p>Your browser does not support PDFs.
      <a href="data:application/pdf;base64, ${document}">Download the PDF</a>.</p>
  </iframe>`;
  }
}
customElements.define('prescription-pdf', PrescriptionPdf);
