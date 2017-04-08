// Front end rendering and logic
// Use React and jQuery

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
