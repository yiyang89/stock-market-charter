console.log("voting.js loaded successfully");

// React classes
var AppComponent = React.createClass({
  getInitialState: function() {
    // populate list and chart from socket
    return {stocks: null};
  },
  submitNewCode: function(code) {
    console.log('add code ' + code);
    socket.emit('add code', code);
  },
  removeCode: function(code) {
    console.log('remove code ' + code);
    socket.emit('remove code', code);
  },
  render: function() {
    socket.on('stocklist', function(stocklist) {
      // if (Object.keys(stocklist.individual).length !== 0 && stocklist.combined.length === 0) {
      //   console.log('requesting stocklist');
      //   socket.emit('request stocklist', null);
      // } else {
        console.log("received stocklist");
        this.setState({stocks: stocklist});
      // }
    }.bind(this));
    socket.on('code does not exist', function(msg) {
      // TODO: deliver this message in a more appealing manner
      alert(msg);
    });
    return (
    <div className="jumbotron container">
      <div className="grid-by-columns">
        <div className="grid-by-rows">
          <InputComponent onPress={this.submitNewCode}/>
          <ListComponent stocks={this.state.stocks} removeItem={this.removeCode}/>
        </div>
        <ChartComponent stocks={this.state.stocks}/>
      </div>
    </div>
  );
  }
});
