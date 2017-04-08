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
      showPollDetails: false,
      globalList: []
    };
  },
  hideAll: function() {
    this.setState({
      showList: false,
      showCreateNew: false,
      showPollDetails: false,
      showMyPolls: false
    })
  },
  setGlobalList: function(result) {
    this.setState({
      globalList: {result}
    })
  },
  returnToHomeView: function() {
    this.hideAll();
    this.setState({
      showList: true,
    })
  },
  handleCreateNewClick: function() {
    this.hideAll();
    this.setState({
      showCreateNew: true
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
    this.hideAll();
    this.setState({
      pollTarget: pollObject,
      showPollDetails: true
    })
  },
  handleDeleteClick: function(questionId) {
    var username = user? user.name : '';
    var params = "id=" + questionId + "&userid=" + username;
    this.serverRequest = $.getJSON('/api/deletepoll?'+params, function (result) {
      console.log(result);
      this.hideAll();
      this.setState({
        showList: true
      });
    }.bind(this));
  },
  handleLogin: function() {
    this.serverRequest = $.getJSON(host+'/api/login', function (result) {
      console.log(result);
    })
  },
  showMyPolls: function() {
    console.log("Theres nothing here yet!");
    this.hideAll();
    this.setState({
      showMyPolls: true
    })
  },
  render: function() {
    var username = user? user.name : '';
    return (<div className="jumbotron container">
      <div className="header">
        <LoginArea loginHandler={this.handleLogin}/>
        <button onClick={this.returnToHomeView} className="btn btn-primary waves-effect waves-light loginbtn">
          Home
        </button>
        <button onClick={this.showMyPolls} className="btn btn-primary waves-effect waves-light mypollsbtn">
          My Polls
        </button>
      </div>
      <CreateNew onClick={this.handleCreateNewClick}/>
      {this.state.showList? <ListArea onClick={this.handleSelectPoll} setGlobalList={this.setGlobalList}/> : null}
      {this.state.showCreateNew && !this.state.showList?<CreateNewArea displayfunc={this.handleSubmitNewClick}/> : null}
      {this.state.showPollDetails && !this.state.showList?<PollDetailsArea content={this.state.pollTarget} voteClick={this.handleVoteClick} deleteClick={this.handleDeleteClick}/> : null}
      {this.state.showMyPolls && !this.state.showList?<MyPolls user={username} globalList={this.state.globalList} selectPoll={this.handleSelectPoll}/>:null}
      </div>);
  }
});
