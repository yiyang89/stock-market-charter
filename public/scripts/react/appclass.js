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
  handleSubmitNewClick: function(question, answers) {
    // submit question, answer1 and answer2 to the server.
    // Implement a check for EMPTY question, answer1, or answer2
    console.log(answers);
    var username = user? user.name : '';
    var answerParam = '';
    answers.forEach(function(answer) {
      answerParam = answerParam.concat("&answer="+answer);
    });
    var params = "question=" + question + answerParam + "&userid=" + username;
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
      {this.state.showList? <ListArea onClick={this.handleSelectPoll}/> : null}
      {this.state.showCreateNew && !this.state.showList?<CreateNewArea displayfunc={this.handleSubmitNewClick}/> : null}
      {this.state.showPollDetails && !this.state.showList?<PollDetailsArea content={this.state.pollTarget} voteClick={this.handleVoteClick} deleteClick={this.handleDeleteClick}/> : null}
      </div>);
  }
});
