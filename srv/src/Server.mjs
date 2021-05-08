import * as Hapi from "@hapi/hapi";
import * as inert from "@hapi/inert";
import * as Path from "path";
import {json01, json02, json03} from "./exemples/samples.mjs";
import _ws from "ws";
const  {Server} = _ws;

async function startServer() {
  const server = Hapi.server({ address: "localhost", port: 8888 });
  const listener = server.listener;
  
  //Adds static serving features
  await server.register(inert);
  
  //Adds web socket
  
  // Serve the main directory
  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: Path.resolve("./app/src"),
      },
    },
  });
  
  await server.start();
  
  const io  = new Server({server: listener});
  io.path = "/websocket"

  io.on('connection', function (socket) {
    console.log("connection")
    socket.send(JSON.stringify({
      type: "Bundle",
      payload: json02
    }));

    socket.send(JSON.stringify({
      type: "Bundle",
      payload: json01
    }));

    socket.send(JSON.stringify({
      type: "Bundle",
      payload: json03
    }));
  });
  console.log('Server running at:', server.info.uri);
}

startServer();

export {}