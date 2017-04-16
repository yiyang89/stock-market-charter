console.log("voting.js loaded successfully");

// React classes
var AppComponent = React.createClass({
  getInitialState: function() {
    // populate list and chart from socket
    return {stocks: null};
  },
  submitNewCode: function(code) {
    console.log('add code' + code);
    socket.emit('add code', code);
  },
  removeCode: function(code) {
    console.log('remove code' + code);
    socket.emit('remove code', code);
  },
  render: function() {
    socket.on('stocklist', function(stocklist) {
      console.log("received stocklist");
      console.log(stocklist);
      this.setState({stocks: stocklist});
    }.bind(this));
    return (
    <div className="jumbotron container">
      <div className="grid-by-columns">
        <div className="grid-by-rows">
          <InputComponent onPress={this.submitNewCode}/>
          <ListComponent stocks={this.state.stocks}/>
        </div>
        <ChartComponent stocks={this.state.stocks}/>
      </div>
    </div>
  );
  }
});
