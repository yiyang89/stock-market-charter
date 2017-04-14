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
    return (
    <div className="jumbotron container">
      <div className="grid-by-columns">
        <div className="grid-by-rows">
          <InputComponent />
          <ListComponent />
        </div>
        <ChartComponent />
      </div>
    </div>
  );
  }
});
