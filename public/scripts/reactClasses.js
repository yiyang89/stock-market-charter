module.exports.LoginArea = React.createClass({
  render: function() {
    // Return either a button or a welcome message based on global being set.
    if (user) {
      return <p> Welcome [USERNAME GOES HERE]! </p>;
    } else {
      return (<button onClick={processLogin} id="loginButton" className="btn btn-primary waves-effect waves-light loginbtn">Google Login</button>);
    }
  }
});
var ListArea = React.createClass({
  render: function() {
    // Return either a button or a welcome message based on global being set.
    return (<div>
      {this.props.list.map(function(data, i) {
          return <div className='pollBox'>{JSON.stringify(data)}</div>;
      })}
      </div>)
  }
});
var CreateNewArea = React.createClass({
  render: function() {
    // Div should be positioned above the list area
    // (Hidden until create new is clicked, animate dropdown style?)
    // Box should contain a form for creating a new poll
    // Question + 2 answers
  }
})
var AddOptionArea = React.createClass({
  render: function() {
    // Div should be positioned above the list area
    // (Hidden until create new is clicked, animate dropdown style?)
    // Box should contain a form for adding a new option, and display existing options
  }
})
var PollDetailsArea = React.createClass({
  render: function() {
    // Div should be positioned above the list area
    // (Hidden until create new is clicked, animate dropdown style?)
    // Box should contain a form for voting on a poll, and display existing poll stats
  }
})
