// Globals:
// var host = "http://192.168.0.53:5000";
var host = "http://voting-app-decky.herokuapp.com:5000";
var user = null;

console.log("voting.js loaded successfully");

// Login area class
var LoginArea = React.createClass({
  render: function() {
    // Return either a button or a welcome message based on global being set.
    if (user) {
      return <p> Welcome [USERNAME GOES HERE]! </p>;
    } else {
      return (<button onClick={processLogin} id="loginButton" className="btn btn-primary waves-effect waves-light loginbtn">Google Login</button>);
    }
  }
});

// Front end rendering and logic
// Use React and jQuery

// Render the default login area
ReactDOM.render(<LoginArea />,document.getElementById('login'));

// Render the default display area

// Request to backend for login
function someMethod(response) {
  console.log(response);
}

function processLogin() {
  $.ajax({
    url: host+'/auth/google?callback=?',
    dataType: 'jsonp',
    jsonp: 'callback',
    success: function(data) {
      console.log('success');
      console.log(JSON.stringify(data));
    }
  });
}

// Request to backend for initial polls.

// Request to backend for single poll.

// Request to backend for poll creation

// Request to backend for poll modification

// Request to backend for poll deletion

// Request to backend to vote

// Render login area


// Main display area class (REACT)
// $("#loginButton").on("click", processLogin());
