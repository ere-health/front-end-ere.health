
import { addPrescription, addSigned, abortTasksStatus } from "../../control/UnsignedPrescriptionControl.js";

class _ServerWebSocketActionForwarder {
    constructor() {
        this.socket = new ReconnectingWebSocket("ws"+(window.location.protocol === "https:" ? "s" : "")+"://"+window.location.host+"/websocket");
        this.socket.onmessage = (event) => {
            console.log("ws", event)
            const eventData = JSON.parse(event.data);
            if(eventData.type === "Bundles") {
                addPrescription(eventData.payload);
            } else if(eventData.type === "AbortTasksStatus") {
                abortTasksStatus(eventData.payload);
            } else if(eventData.type === "ERezeptWithDocuments") {
                if("pdfDocument" in eventData.payload[0]) {
                    const blob = this.b64toBlob(eventData.payload[0].pdfDocument.content, "application/pdf");
                    const blobUrl = URL.createObjectURL(blob);
                    window.open(blobUrl);
                    addSigned(eventData.payload);
                } else {
                    alert("Could not process e prescription");
                }
            } else if(eventData.type === "Exception") {
                alert(JSON.stringify(eventData.payload));
            }
        };
    }

    b64toBlob = (b64Data, contentType='', sliceSize=512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
      
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
      
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
      
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
      
        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    send(message) {
        this.socket.send(JSON.stringify(message));
    }
}

const ServerWebSocketActionForwarder = new _ServerWebSocketActionForwarder();
export default ServerWebSocketActionForwarder;