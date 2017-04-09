var LoginArea = React.createClass({
  render: function() {
    // Return either a button or a welcome message based on global being set.
    if (user) {
      return <div className="userDisplay"> {user} </div>;
    } else {
      return (<div className="login">
      <a href="/auth/google/" id="loginButton" className="btn btn-primary waves-effect waves-light">
      Google+
      </a>
      </div>);
    }
  }
});
