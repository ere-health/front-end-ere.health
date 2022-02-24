import { addPrescription, addSigned, abortTasksStatus, showHTMLBundles, showGetSignatureModeResponse } from "../../control/UnsignedPrescriptionControl.js";
import { updateSettingsFromServer } from "../../../components/settings/control/SettingsControl.js";
import { updateStatusFromServer } from "../../../components/status/control/StatusControl.js";
import { updateCardsFromServer } from "../../../components/cards/control/CardsControl.js";

class _ServerWebSocketActionForwarder {
	
    constructor() {
		this.errorHandlerForMessage = {};
        this.socket = new ReconnectingWebSocket("ws"+(window.location.protocol === "https:" ? "s" : "")+"://"+window.location.host+"/websocket");
        window.__socket = this.socket;

        this.socket.onopen = (event) => {
            this.send({ type: "RequestSettings"});
            this.send({ type: "GetCards"});
            this.send({ type: "RequestStatus"});
            setInterval(() => this.send({ type: "GetSignatureMode"}), 10000);
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
                } else if(eventData.type === "StatusResponse") {
                    updateStatusFromServer(eventData.payload);
                } else if(eventData.type === "HTMLBundles") {
                    showHTMLBundles(eventData.payload);
                } else if(eventData.type === "GetSignatureModeResponse") {
                    showGetSignatureModeResponse(eventData.payload);
                } else if(eventData.type === "GetCardsResponse") {
                    updateCardsFromServer(eventData.payload.getCardsResponse.cards.card);
                } else if(eventData.type === "BundlesValidationResult") {
                    alert(JSON.stringify(eventData.payload));
                } else if(eventData.type === "ChangePinResponse") {
                    alert(JSON.stringify(eventData.payload));
                } else if(eventData.type === "Exception") {
					if(eventData.replyToMessageId in this.errorHandlerForMessage) {
						this.errorHandlerForMessage[eventData.replyToMessageId](eventData);
						delete this.errorHandlerForMessage[eventData.replyToMessageId];
					} else {						
                    	alert(JSON.stringify(eventData.payload));
					}
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

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    send(message) {
        if(!("id" in message)) {
	        message.id = this.uuidv4();
		}
        this.socket.send(JSON.stringify(message));
    }
    
    registerErrorHandlerForMessage(messageId, fn) {
		this.errorHandlerForMessage[messageId] = fn;
	}
}

const ServerWebSocketActionForwarder = new _ServerWebSocketActionForwarder();
export default ServerWebSocketActionForwarder;