import React from 'react';

var InputComponent = React.createClass({
  getInitialState: function() {
    return {input: ''};
  },
  handleChange: function(event) {
    this.setState({input: event.target.value});
  },
  handleClick: function() {
    this.props.onPress(this.state.input);
    this.setState({input: ''});
  },
  render: function() {
    return (
      <div className="inputComponent">
        <input className="inputBox" type="text" onChange={this.handleChange} placeholder="Enter a stock code" value={this.state.input}/>
        <button className="btn btn-info btn-add" onClick={this.handleClick}>Add Stock</button>
      </div>
    );
  }
})

export default InputComponent;
