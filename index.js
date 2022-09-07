const path = require("path");
const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);
let socket = new WebSocket("wss://tarea-1.2022-2.tallerdeintegracion.cl/connect");

socket.onmessage = function(event) {
    alert(`[message] Datos recibidos del servidor: ${event.data}`);
  };
  
socket.onclose = function(event) {
    if (event.wasClean) {
      alert(`[close] Conexión cerrada limpiamente, código=${event.code} motivo=${event.reason}`);
    } else {
      // ej. El proceso del servidor se detuvo o la red está caída
      // event.code es usualmente 1006 en este caso
      alert('[close] La conexión se cayó');
    }
  };
  
socket.onerror = function(error) {
    alert(`[error] ${error.message}`);
  };

/* app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    res.sendFile('index.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
                                                        //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
}); */