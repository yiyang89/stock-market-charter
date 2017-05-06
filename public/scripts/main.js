// Front end rendering and logic
// Use React and Socket.io
// require("babel!./react/appclass.js");
// require("babel!./react/stockinputclass.js");
// require("babel!./react/stocklistclass.js");
// require("babel!./react/stockchartclass.js");
import React from 'react';
import ReactDOM from 'react-dom';
import AppComponent from './react/appclass';

// Global socket.
var socket = io();

// Render app
ReactDOM.render(<AppComponent socket={socket}/>, document.getElementById('stockChart'));
