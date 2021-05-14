import * as Hapi                from "@hapi/hapi";            
import * as inert               from "@hapi/inert";           
import * as Path                from "path";                  
import {json01, json02, json03} from "./exemples/samples.mjs";
import _ws                      from "ws";                    
const  {Server} = _ws;

async function startServer() {
  const server   = Hapi.server({ address: "localhost", port: 8888 });
  const listener = server.listener;                                  
  
  //Adds static serving features
  await server.register(inert);
  
  //Adds web socket
  
  // Serve the main directory
  server.route({
    method  : "GET",      
    path    : "/previous",
    handler : (r, h) => { 
      return [json01, json02, json03].map(_ => _.entry
        .filter(__ => __.resource.resourceType === "Patient")
        )
      }
  });

  server.route({
    method  : "GET",           
    path    : "/previous/{id}",
    handler : (r, h) => {      
      const list = [json01, json02, json03].map(_ => _.entry .filter(__ => __.resource.resourceType === "Patient")[0]);
      let selectedIdx = 0;

      list.forEach((_, idx) => _.resource.id === r.params.id && (selectedIdx = idx));

      return [json01, json02, json03][selectedIdx];
    }
  });



  server.route({
    method  : "GET",               
    path    : "/frontend/{param*}",
    handler : {                    
      directory: {
        path: Path.resolve("./"),
      },
    },
  });

  server.route({
    method  : "GET",     
    path    : "/",       
    handler : (r, h) => {
      return h.response().redirect("/frontend/app/src/index.html");
    }
  });
  
  await server.start();
  
  const io = new Server({server: listener});
  io.path  = "/websocket"                   

  io.on('connection', function (socket) {
    console.log("connection")
    socket.send(JSON.stringify({
      type    : "Bundles",
      payload : [json02]   
    }));

    socket.send(JSON.stringify({
      type    : "Bundles",
      payload : [json01]   
    }));

    socket.send(JSON.stringify({
      type    : "Bundles",
      payload : [json03]   
    }));
  });
  console.log('Server running at:', server.info.uri);
}

startServer();

export {}