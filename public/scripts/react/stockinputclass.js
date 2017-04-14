var InputComponent = React.createClass({
  getInitialState: function() {
    return {input: ''};
  },
  handleChange: function(event) {
    this.setState({input: event.target.value});
  },
  render: function() {
    return (
      <div className="inputComponent">
        <input className="inputBox" type="text" onChange={this.handleChange} placeholder="Enter a stock code" value={this.state.input}/>
        <button className="btn btn-info btn-add" onClick={this.props.onPress.bind(null, this.state.input)}>Add Stock</button>
      </div>
    );
  }
})
