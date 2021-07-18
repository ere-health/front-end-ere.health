import { addPrescription, addSigned, abortTasksStatus } from "../../control/UnsignedPrescriptionControl.js";
import { updateSettingsFromServer } from "../../../components/settings/control/SettingsControl.js";

class _ServerWebSocketActionForwarder {
    constructor() {
        this.socket = new ReconnectingWebSocket("ws"+(window.location.protocol === "https:" ? "s" : "")+"://"+window.location.host+"/websocket");
        window.__socket = this.socket;

        this.socket.onopen = (event) => {
            this.send({ type: "RequestSettings"});
        };

        this.socket.onmessage = (event) => {
            console.log("ws", event)
            try {
                const eventData = JSON.parse(event.data);
                if(eventData.type === "Bundles") {
                    addPrescription(eventData.payload);
                } else if(eventData.type === "AbortTasksStatus") {
                    try {
                        eventData.payload.filter(o => o.status == "ERROR").forEach(o => alert(o.throwable.localizedMessage))
                    } catch(e) {
                        alert(e);
                    }
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
                } else if(eventData.type === "Settings") {
                    updateSettingsFromServer(eventData.payload);
                } else if(eventData.type === "Exception") {
                    alert(JSON.stringify(eventData.payload));
                }
            } catch(e) {
                alert("Could not process message. "+e);
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