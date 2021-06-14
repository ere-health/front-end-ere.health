
import { addPrescription } from "../../control/UnsignedPrescriptionControl.js";
import { addSignedPrescription} from '../../control/SignedPrescriptionControl.js'

class _WebSocketHandler {
    constructor() {
        this.socket = new WebSocket("ws"+(window.location.protocol === "https:" ? "s" : "")+"://"+window.location.host+"/websocket");

        this.socket.onmessage = (event) => {
            console.log("ws message received:", event)
            const eventData = JSON.parse(event.data);

            if(eventData.type === "Bundles") {
                addPrescription(eventData.payload);
            } 
            else if(eventData.type === "ERezeptDocuments") {
                addSignedPrescription(eventData.payload);
            } 
            else if(eventData.type === "Exception") {
                alert(JSON.stringify(eventData.payload));
            }
        };
    }

    // May be useful later on, we'll see
    // b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    //     const byteCharacters = atob(b64Data);
    //     const byteArrays = [];
      
    //     for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    //       const slice = byteCharacters.slice(offset, offset + sliceSize);
      
    //       const byteNumbers = new Array(slice.length);
    //       for (let i = 0; i < slice.length; i++) {
    //         byteNumbers[i] = slice.charCodeAt(i);
    //       }
      
    //       const byteArray = new Uint8Array(byteNumbers);
    //       byteArrays.push(byteArray);
    //     }
      
    //     const blob = new Blob(byteArrays, {type: contentType});
    //     return blob;
    // }
}

const WebSocketHandler = new _WebSocketHandler();
export default WebSocketHandler;