// Globals:
var host = "http://192.168.0.53:5000";
// var host = "http://voting-app-decky.herokuapp.com";
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
function getPolls() {
  // When rendering, check for votes from this ip against the list
  // -> Will show the user which polls they have voted on already
  // Indicate with a green tint?

}

// Request to backend for poll creation (pollanswers as an array)
function createPoll(poll_question, poll_answers) {
// Receive a success or fail from the server.
// If success, add to the rendered list
// If fail, notify user
}

// Request to backend to add a poll answer option
function addPollOption(poll_id, new_answer) {

}

// Request to backend for poll deletion
function deletePoll(poll_id) {
  // Bundle user's id the request
}

// Request to backend to vote
function votePoll(poll_id, poll_answer) {

}
