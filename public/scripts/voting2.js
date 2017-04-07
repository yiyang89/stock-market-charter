// Front end rendering and logic
// Use React and jQuery

// Globals:
var host = "http://192.168.0.53:5000";
// var host = "http://voting-app-decky.herokuapp.com";
var user = null;

console.log("voting.js loaded successfully");


// React classes
var AppComponent = React.createClass({
  render: function() {
    return (<div className="jumbotron container">
      <div className="header">
        <div className="title">
          Voting App
        </div>
        <LoginArea />
      </div>
      <CreateNew />
      <CreateNewArea />
      <AddOptionArea />
      <PollDetailsArea />
      <ListArea />
      </div>);
  }
});
var LoginArea = React.createClass({
  render: function() {
    // Return either a button or a welcome message based on global being set.
    if (user) {
      return <p> Welcome [USERNAME GOES HERE]! </p>;
    } else {
      return (<div className="login">
      <button onClick={processLogin} id="loginButton" className="btn btn-primary waves-effect waves-light loginbtn">
      Google Login
      </button>
      </div>);
    }
  }
});
var CreateNew = React.createClass({
  render: function() {
    return (<div className="createNew">Create New</div>);
  }
})
var ListArea = React.createClass({
  getInitialState: function() {
    return {list: []};
  },
  componentDidMount: function() {
    // Get poll list from server
    this.serverRequest = $.getJSON('/api/getpolls', function (result) {
      this.setState({
        list: {result}
      });
    }.bind(this));
    // $.getJSON('/api/getpolls/', function(result) {
    //   this.setState({list: result});
    // })
  },
  render: function() {
    // Return either a button or a welcome message based on global being set.
    var output;
    if (this.state.list.result) {
      output = this.state.list.result.map(function(data, i) {
          return <div className='pollBox' key={i}>{JSON.stringify(data)}</div>;
      })
    } else {
      output = '';
    }
    return (<div>
      {output}
      </div>)
  }
});
var CreateNewArea = React.createClass({
  render: function() {
    // Div should be positioned above the list area
    // (Hidden until create new is clicked, animate dropdown style?)
    // Box should contain a form for creating a new poll
    // Question + 2 answers
    return null;
  }
})
var AddOptionArea = React.createClass({
  render: function() {
    // Div should be positioned above the list area
    // (Hidden until create new is clicked, animate dropdown style?)
    // Box should contain a form for adding a new option, and display existing options
    return null;
  }
})
var PollDetailsArea = React.createClass({
  render: function() {
    // Div should be positioned above the list area
    // (Hidden until create new is clicked, animate dropdown style?)
    // Box should contain a form for voting on a poll, and display existing poll stats
    return null;
  }
})

// Render app
ReactDOM.render(<AppComponent/>, document.getElementById('votingApp'));



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
