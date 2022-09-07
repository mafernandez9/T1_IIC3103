﻿var map = L.map('map').setView([51.505, -0.09], 0);

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

window.addEventListener("load", init, false);
function init() {
    wsConnect();
}

function wsConnect() {
    socket = new WebSocket("wss://tarea-1.2022-2.tallerdeintegracion.cl/connect");

    socket.onopen = function (evt) {
        onOpen();
    };
    socket.onclose = function (evt) {
        onclose(evt);
    };
    socket.onmessage = function (evt) {
        onMessage(evt);
    };
    socket.onerror = function (evt) {
        onerror(evt);
    };
}

function sendUser() {
    socket.send(JSON.stringify({
        "type": "join",
        "id": "f831d20e-b9b9-4846-bf53-deee0480150a",
        "username": "MF"
    }));
}

function sendMessage(content) {
    socket.send(JSON.stringify({
        "type": "chat",
        "content": content
    }));
}

function onOpen() {
    document.getElementById("enviar").disabled=false;
    sendUser();
}

function onClose() {
    setTimeout(function () {
        wsConnect()
    }, 1000);
}

function onMessage(evt) {
    var message = JSON.parse(evt.data);
    if (message.type == "flights") {
        for (let i = 0; i <10; i++) {
        const flight_id = Object.values(message.flights)[i].id;
        const f_airport_id = Object.values(message.flights)[i].departure.id;
        const f_airport_name = Object.values(message.flights)[i].departure.name;
        const f_city_id = Object.values(message.flights)[i].departure.city;
        const f_airport_city_id = Object.values(message.flights)[i].departure.city.id;
        const f_airport_city_name = Object.values(message.flights)[i].departure.city.name;
        const f_airport_country_id = Object.values(message.flights)[i].departure.city.country.id;
        const f_airport_country_name = Object.values(message.flights)[i].departure.city.country.name;
        const f_airport_location_la = Object.values(message.flights)[i].departure.location.lat;
        const f_airport_location_lo = Object.values(message.flights)[i].departure.location.long;
        const t_airport_id = Object.values(message.flights)[i].destination.id;
        const t_airport_name = Object.values(message.flights)[i].destination.name;
        const t_city_id = Object.values(message.flights)[i].destination.city;
        const t_airport_city_id = Object.values(message.flights)[i].destination.city.id;
        const t_airport_city_name = Object.values(message.flights)[i].destination.city.name;
        const t_airport_country_id = Object.values(message.flights)[i].destination.city.country.id;
        const t_airport_country_name = Object.values(message.flights)[i].destination.city.country.name;
        const t_airport_location_la = Object.values(message.flights)[i].destination.location.lat;
        const t_airport_location_lo = Object.values(message.flights)[i].destination.location.long;
        const d_date = Object.values(message.flights)[i].departure_date;
        var redIcon = L.icon({
            iconUrl: 'src/public/red.png',        
            iconSize:     [38, 95], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
        var marker_f = L.marker([f_airport_location_la, f_airport_location_lo], {icon: redIcon}).addTo(map);
        marker_f.bindPopup(`ID Vuelo:${flight_id}<br> Nombre aeropuerto: ${f_airport_name} <br> Ciudad: ${f_airport_city_name} <br> País: ${f_airport_country_name}`);
        var blueIcon = L.icon({
            iconUrl: 'src/public/blue.png',
            iconSize:     [38, 95], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
        var marker_t = L.marker([t_airport_location_la, t_airport_location_lo], {icon : blueIcon}).addTo(map);
        marker_t.bindPopup(`ID Vuelo :${flight_id}<br> Nombre aeropuerto: ${t_airport_name} <br> Ciudad: ${t_airport_city_name} <br> País: ${t_airport_country_name}`);
        const polygon = L.polygon([
            [f_airport_location_la, f_airport_location_lo],
            [t_airport_location_la, t_airport_location_lo]
        ]).addTo(map);
        const remove = async () => {
            await sleep(1000);
            polygon.remove();
        }
        remove();
        }
    }
    else if (message.type == "plane") {
        const flight_id = message.plane.flight_id;
        const airline_id = message.plane.airline.id;
        const airline_name = message.plane.airline.name;
        const p_captain = message.plane.captain;
        const lat_pos = message.plane.position.lat;
        const lon_pos = message.plane.position.long;
        const h_lat = message.plane.heading.lat;
        const h_lon = message.plane.heading.long;
        const ETA = message.plane.eta;
        const distance = message.plane.distance;
        const arrival = message.plane.arrival;
        const status = message.plane.status;
        var planeIcon = L.icon({
            iconUrl: 'src/public/plane.png',
            iconSize:     [38, 95], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
        var marker_f = L.marker([lat_pos, lon_pos], {icon: planeIcon}).addTo(map);
        marker_f.bindPopup(`ID Vuelo :${flight_id}<br> airline: ${airline_name} <br> Capitán: ${p_captain} <br> ETA: ${ETA}`);
        const remove = async () => {
            await sleep(2000);
            marker_f.remove();
        }
        remove();
        var circle = L.circle([lat_pos, lon_pos], {
            color: 'green',
            fillColor: '#f03',
            fillopacity: 0.5,
            radius: 100
        }).addTo(map);
       
    }
        //console.log(message.plane.captain);
    else if (message.type == "take-off") {
        const flight_id = message.flight_id;
    }
    else if (message.type == "landing") {
        const flight_id = message.flight_id;
    }
    else if (message.type == "crashed") {
        const flight_id = message.flight_id;
    }
    else if (message.type == "message") {
        var area = document.getElementById("mensajes")
        area.innerHTML += "[" + message.message.name + "  " + message.message.date + "]"  + message.message.content + "\n";
        //poder enviar mensaje
    }
}
function sendAnswer(evt, content) {
    var to_send = evt.target.text;
    sendMessage(content);
} 