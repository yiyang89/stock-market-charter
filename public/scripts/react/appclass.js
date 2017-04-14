console.log("voting.js loaded successfully");

// React classes
var AppComponent = React.createClass({
  getInitialState: function() {
    // if (myPoll) {this.showReferredPoll();}
    if (myPoll) {
      return {
        showList: false,
        pollTarget: myPoll,
        showCreateNew: false,
        showPollDetails: true,
        globalList: []
      };
    } else {
      return {
        showList: true,
        pollTarget: {},
        showCreateNew: false,
        showPollDetails: false,
        globalList: []
      };
    }
  },
  render: function() {
    return (<div className="jumbotron container">
      <div className="header">
      Hello world.
        </div></div>
        );
  }
});
