// Front end rendering and logic
// Use React and jQuery
// Globals:

var user = myUser? myUser : null;
console.log("user: "+user);
// var socket = io();

// Render app
ReactDOM.render(<AppComponent />, document.getElementById('stockChart'));
