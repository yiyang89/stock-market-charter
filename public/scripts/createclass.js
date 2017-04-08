var CreateNew = React.createClass({
  render: function() {
    // Has inherited an onclick prop from its parent on creation
    return (<div className="createNew" onClick={this.props.onClick}>Create New</div>);
  }
})

var CreateNewArea = React.createClass({
  handleClick: function(event) {
    if (this.state.question !== '' && this.state.answer1 !== '' && this.state.answer2 !== '') {
      this.props.displayfunc(this.state.question, this.state.answer1, this.state.answer2);
      } else {
      alert('Please fill out all fields');
    }
  },
  handleChangeQuestion: function(event) {
    this.setState({question: event.target.value});
  },
  handleChangeAnswer1: function(event) {
    this.setState({answer1: event.target.value});
  },
  handleChangeAnswer2: function(event) {
    this.setState({answer2: event.target.value});
  },
  getInitialState: function() {
    return {question: '', answer1: '', answer2:''};
  },
  render: function() {
    // Box should contain a form for creating a new poll
    // Question + 2 answers with preview
    // TODO: PREVIEW
    return (<div className="contentBox">
              <div className="boxContent grid-by-rows head">
                <input className="inputBox" type="text" placeholder="Enter a question" value={this.state.question} onChange={this.handleChangeQuestion} />
                <br/>
                <input className="inputBox" type="text" placeholder="Enter an answer" value={this.state.answer1} onChange={this.handleChangeAnswer1} />
                <br/>
                <input className="inputBox" type="text" placeholder="Enter another answer" value={this.state.answer2} onChange={this.handleChangeAnswer2} />
                <br/>
                <button className="btn btn-info btn-wide" onClick={this.handleClick}>Create your poll!</button>
              </div>
              <h2 className="paddedText" >Preview:</h2>
              <h4 className="paddedText" >{this.state.question}</h4>
              <div className="boxContent grid-by-rows">
                {this.state.answer1===''? null : <button className="btn btn-info btn-wide">{this.state.answer1}</button>}
                {this.state.answer2===''? null: <button className="btn btn-info btn-wide">{this.state.answer2}</button>}
              </div>
          </div>);
  }
})
