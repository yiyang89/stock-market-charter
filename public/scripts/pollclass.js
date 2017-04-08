
var PollDetailsArea = React.createClass({
  // Poll details receives props.content, props.voteClick(option), and props.newOption(option) on construction
  getInitialState: function() {
    return {
      customOption: null
    }
  },
  handleChangeCustom: function(event) {
    this.setState({customOption: event.target.value})
  },
  render: function() {
    // Box should contain a form for voting on a poll, and display existing poll stats
    var output = this.props.content.answers.map(function(data, i) {
      return <button className="btn btn-info btn-wide" key={i} onClick={this.props.voteClick.bind(null, this.props.content._id, data)}>{data}</button>
    }, this);
    return (<div className="contentBox">
              <h2 className="paddedText head" >{this.props.content.question}</h2>
              <div className="boxContent grid-by-rows">
              {output}
              <input className="inputBox" type="text" placeholder="Don't like these options? Add your own!" onChange={this.handleChangeCustom}/>
              {this.state.customOption?<button className="btn btn-info btn-wide" onClick={this.props.voteClick.bind(null, this.props.content._id, this.state.customOption)}>{this.state.customOption}</button> : <div/>}
              <button className="btn btn-danger btn-wide" onClick={this.props.deleteClick.bind(null, this.props.content._id)}>Delete this poll</button>
              </div>
            </div>)
  }
})
