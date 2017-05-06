import React from 'react';
import ChartComponent from './stockchartclass';
import ListComponent from './stocklistclass';
import InputComponent from './stockinputclass';

console.log("voting.js loaded successfully");

// React classes
var AppComponent = React.createClass({
  getInitialState: function() {
    // populate list and chart from socket
    return {stocks: null};
  },
  componentDidMount: function() {
    this.props.socket.on('stocklist', function(stocklist) {
        console.log("received stocklist");
        this.setState({stocks: stocklist});
    }.bind(this));
    this.props.socket.on('symbol rejected', function(msg) {
      // TODO: deliver this message in a more appealing manner
      console.log('received symbol rejected');
      alert(msg);
    });
  },
  submitNewCode: function(code) {
    console.log('add code ' + code);
    this.props.socket.emit('add code', code);
  },
  removeCode: function(code) {
    console.log('remove code ' + code);
    this.props.socket.emit('remove code', code);
  },
  render: function() {
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

export default AppComponent;
