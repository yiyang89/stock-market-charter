// Front end rendering and logic
// Use React and jQuery

// Globals:
var host = "http://192.168.0.53:5000";
// var host = "http://voting-app-decky.herokuapp.com";
var user = null;

console.log("voting.js loaded successfully");


// React classes
var AppComponent = React.createClass({
  getInitialState: function() {
    return {
      showList: true,
      pollTarget: {},
      showCreateNew: false
    };
  },
  handleCreateNewClick: function() {
    var newState = this.state.showCreateNew ? false : true;
    console.log(newState);
    this.setState({
      showList: !newState,
      showCreateNew: newState
    });
  },
  handleSubmitNewClick: function(question, answer1, answer2) {
    // submit the state question, answer1 and answer2 to the server.
    // Implement a check for EMPTY question, answer1, or answer2
    var username = user? user.name : '';
    var params = "question=" + question + "&answer1=" + answer1 + "&answer2=" + answer2 + "&userid=" + username;
    this.serverRequest = $.getJSON('/api/createpoll?'+params, function (result) {
      this.setState({
        list: {result}
      });
    });
    this.setState({showCreateNew: false});
  },
  handleSelectPoll: function(pollObject) {
    this.setState({
      pollTarget: pollObject
    })
  },
  render: function() {
    return (<div className="jumbotron container">
      <div className="header">
        <div className="title">
          Voting App
        </div>
        <LoginArea />
      </div>
      <CreateNew onClick={this.handleCreateNewClick}/>
      {this.state.showList? <ListArea onClick={this.handleSelectPoll}/> : <CreateNewArea displayfunc={this.handleSubmitNewClick}/> }
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
    // Has inherited an onclick prop from its parent on creation
    return (<div className="createNew" onClick={this.props.onClick}>Create New</div>);
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
  },
  render: function() {
    // Return either a button or a welcome message based on global being set.
    var output;
    if (this.state.list.result) {
      output = this.state.list.result.map(function(data, i) {
          return <div className='pollBox' key={i} onClick={this.props.onClick(data)}>{JSON.stringify(data)}</div>;
      }, this)
    } else {
      output = '';
    }
    return (<div>
      {output}
      </div>)
  }
});
var CreateNewArea = React.createClass({
  handleClick: function(event) {
    if (this.state.question !== '' && this.state.answer1 !== '' && this.state.answer2 !== '') {
      this.props.displayfunc(this.state.question, this.state.answer1, this.state.answer2);
      } else {
      alert('Please fill out all fields');
    }
  },
  handleChangeQuestion: function(event) {
    this.setState({question: event.target.value});
  },
  handleChangeAnswer1: function(event) {
    this.setState({answer1: event.target.value});
  },
  handleChangeAnswer2: function(event) {
    this.setState({answer2: event.target.value});
  },
  getInitialState: function() {
    return {question: '', answer1: '', answer2:''};
  },
  render: function() {
    // Box should contain a form for creating a new poll
    // Question + 2 answers with preview
    // TODO: PREVIEW
    return (<div className="contentBox">
              <div className="boxContent grid-by-rows">
                <input className="inputBox" type="text" placeholder="Enter a question" value={this.state.question} onChange={this.handleChangeQuestion} />
                <br/>
                <input className="inputBox" type="text" placeholder="Enter an answer" value={this.state.answer1} onChange={this.handleChangeAnswer1} />
                <br/>
                <input className="inputBox" type="text" placeholder="Enter another answer" value={this.state.answer2} onChange={this.handleChangeAnswer2} />
                <br/>
                <button className="btn btn-info btn-wide" onClick={this.handleClick}>Create your poll!</button>
              </div>
              <h2 className="paddedText" >Preview:</h2>
              <h4 className="paddedText" >{this.state.question}</h4>
              <h4 className="paddedText" >{this.state.answer1} </h4>
              <h4 className="paddedText" >{this.state.answer2} </h4>
          </div>);
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

// Render app
ReactDOM.render(<AppComponent/>, document.getElementById('votingApp'));
