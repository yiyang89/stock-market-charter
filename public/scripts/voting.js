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
      showCreateNew: false,
      showPollDetails: false
    };
  },
  returnToHomeView: function() {
    this.setState({
      showList: true,
      showCreateNew: false,
      showPollDetails: false
    })
  },
  handleCreateNewClick: function() {
    var newState = this.state.showCreateNew ? false : true;
    console.log(newState);
    this.setState({
      showList: !newState,
      showCreateNew: newState,
      showPollDetails: false
    });
  },
  handleVoteClick: function(questionId, option) {
    // Request to server to add a vote
    var username = user? user.name : '';
    var params = "id=" + questionId + "&answer=" + encodeURI(option) + "&userid=" + username;
    console.log("Sending params: " + params);
    this.serverRequest = $.getJSON('/api/votepoll?'+params, function (result) {
      // On vote success: show confirmation?
      // On vote failure: You have already voted on this poll
      console.log(result);
    });
    // this.setState({showCreateNew: false});
  },
  handleSubmitNewClick: function(question, answer1, answer2) {
    // submit question, answer1 and answer2 to the server.
    // Implement a check for EMPTY question, answer1, or answer2
    var username = user? user.name : '';
    var params = "question=" + question + "&answer1=" + answer1 + "&answer2=" + answer2 + "&userid=" + username;
    this.serverRequest = $.getJSON('/api/createpoll?'+params, function (result) {
      this.setState({
        list: {result}
      });
    }.bind(this));
    this.setState({showCreateNew: false, showList: true});
  },
  handleSelectPoll: function(pollObject) {
    console.log(JSON.stringify(pollObject));
    this.setState({
      pollTarget: pollObject,
      showList: false,
      showPollDetails: true
    })
  },
  handleDeleteClick: function(questionId) {
    var username = user? user.name : '';
    var params = "id=" + questionId + "&userid=" + username;
    this.serverRequest = $.getJSON('/api/deletepoll?'+params, function (result) {
      console.log(result);
      this.setState({
        showPollDetails: false,
        showList: true
      });
    }.bind(this));
  },
  render: function() {
    return (<div className="jumbotron container">
      <div className="header">
        <button onClick={this.returnToHomeView} className="btn btn-primary waves-effect waves-light loginbtn">
          Home
        </button>
        <LoginArea />
      </div>
      <CreateNew onClick={this.handleCreateNewClick}/>
      {this.state.showList? <ListArea onClick={this.handleSelectPoll}/> : <div/>}
      {this.state.showCreateNew && !this.state.showList?<CreateNewArea displayfunc={this.handleSubmitNewClick}/> : <div/>}
      {this.state.showPollDetails && !this.state.showList?<PollDetailsArea content={this.state.pollTarget} voteClick={this.handleVoteClick} deleteClick={this.handleDeleteClick}/> : <div/>}
      </div>);
  }
});



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

// Render app
ReactDOM.render(<AppComponent/>, document.getElementById('votingApp'));
