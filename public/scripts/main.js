// Front end rendering and logic
// Use React and Socket.io

// Global socket.
var socket = io();

// Render app
ReactDOM.render(<AppComponent />, document.getElementById('stockChart'));
