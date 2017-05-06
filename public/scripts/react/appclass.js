import React from 'react';
import ChartComponent from './stockchartclass';
import ListComponent from './stocklistclass';
import InputComponent from './stockinputclass';

console.log("voting.js loaded successfully");

// React classes
class AppComponent extends React.Component{

  constructor(props) {
    // populate list and chart from socket
    super(props);
    this.state = {stocks: null};
    this.submitNewCode = this.submitNewCode.bind(this);
    this.removeCode = this.removeCode.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('stocklist', function(stocklist) {
        console.log("received stocklist");
        this.setState({stocks: stocklist});
    }.bind(this));
    this.props.socket.on('symbol rejected', function(msg) {
      // TODO: deliver this message in a more appealing manner
      console.log('received symbol rejected');
      alert(msg);
    });
  }

  submitNewCode(code) {
    console.log('add code ' + code);
    this.props.socket.emit('add code', code);
  }

  removeCode(code) {
    console.log('remove code ' + code);
    this.props.socket.emit('remove code', code);
  }

  render() {
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
};

export default AppComponent;
