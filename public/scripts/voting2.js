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
    console.log(JSON.stringify(pollObject));
    this.setState({
      pollTarget: pollObject,
      showList: false,
      showPollDetails: true
    })
  },
  handleDeleteClick: function(pollObject) {
    this.serverRequest = $.getJSON('/api/createpoll?'+params, function (result) {
      this.setState({
        list: {result}
      });
    });
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
          return <div className='pollBox' key={i} onClick={this.props.onClick.bind(null, data)}><h5>{data.question}</h5></div>;
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
              <div className="boxContent grid-by-rows head">
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
              <div className="boxContent grid-by-rows">
                {this.state.answer1===''? null : <button className="btn btn-info btn-wide">{this.state.answer1}</button>}
                {this.state.answer2===''? null: <button className="btn btn-info btn-wide">{this.state.answer2}</button>}
              </div>
          </div>);
  }
})
var PollDetailsArea = React.createClass({
  // Poll details receives props.content, props.voteClick(option), and props.newOption(option) on construction
  getInitialState: function() {
    return {
      customOption: null
    }
  },
  handleChangeCustom: function(event) {
    this.setState({customOption: event.target.value})
  },
  render: function() {
    // Box should contain a form for voting on a poll, and display existing poll stats
    var output = this.props.content.answers.map(function(data, i) {
      return <button className="btn btn-info btn-wide" key={i} onClick={this.props.voteClick.bind(null, this.props.content._id, data)}>{data}</button>
    }, this);
    return (<div className="contentBox">
              <h2 className="paddedText head" >{this.props.content.question}</h2>
              <div className="boxContent grid-by-rows">
              {output}
              <input className="inputBox" type="text" placeholder="Don't like these options? Add your own!" onChange={this.handleChangeCustom}/>
              {this.state.customOption?<button className="btn btn-info btn-wide" onClick={this.props.voteClick.bind(null, this.props.content._id, this.state.customOption)}>{this.state.customOption}</button> : <div/>}
              <button className="btn btn-danger btn-wide" onClick={this.props.deleteClick.bind(null, this.props.content._id)}>Delete this poll</button>
              </div>
            </div>)
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

// Request to backend for poll deletion
function deletePoll(poll_id) {
  // Bundle user's id the request
}

// Render app
ReactDOM.render(<AppComponent/>, document.getElementById('votingApp'));
