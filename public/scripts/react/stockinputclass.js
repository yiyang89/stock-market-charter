import React from 'react';

class InputComponent extends React.Component{

  constructor(props) {
    // populate list and chart from socket
    super(props);
    this.state = {input: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    this.setState({input: event.target.value});
  }

  handleClick() {
    this.props.onPress(this.state.input);
    this.setState({input: ''});
  }

  render() {
    return (
      <div className="inputComponent">
        <input className="inputBox" type="text" onChange={this.handleChange} placeholder="Enter a stock code" value={this.state.input}/>
        <button className="btn btn-info btn-add" onClick={this.handleClick}>Add Stock</button>
      </div>
    );
  }
}

export default InputComponent;
