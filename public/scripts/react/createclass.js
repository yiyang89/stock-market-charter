var CreateNew = React.createClass({
  render: function() {
    // Has inherited an onclick prop from its parent on creation
    return (<div className="createNew" onClick={this.props.onClick}>Create New</div>);
  }
})

var CreateNewArea = React.createClass({
  handleClick: function(event) {
    var validAnswers = 0;
    this.state.answers.forEach(function(entry) {if (entry !== '') {validAnswers++}});
    if (this.state.question !== '' && validAnswers >= 2) {
      this.props.displayfunc(this.state.question, this.state.answers);
      } else {
      alert('Please ensure you have filled out a question and at least 2 answers');
    }
  },
  handleChangeQuestion: function(event) {
    this.setState({question: event.target.value});
  },
  handleChangeAnswers: function(index, event) {
    // this.setState({answer1: event.target.value});
    var newAnswerArray = this.state.answers;
    newAnswerArray[index] = event.target.value;
    this.setState({answers: newAnswerArray});
  },
  handleAddOption: function() {
    var newAnswerArray = this.state.answers;
    newAnswerArray.push('');
    this.setState({answers: newAnswerArray});
  },
  getInitialState: function() {
    return {question: '', answers: ['','']};
  },
  render: function() {
    // Depending on number of answers (populated on onchange)
    // Add or remove number of answer input boxes (this.state.answers.length + 1)
    // Same with preview answer buttons.
    var entryOutput = this.state.answers.map(function(data, i) {
      return <input className="inputBox" key={i} type="text" placeholder="Enter an answer" value={this.state.answers[i]} onChange={this.handleChangeAnswers.bind(null,i)} />;
    }.bind(this));
    var previewOutput = this.state.answers.map(function(data, i) {
      var output;
      if (this.state.answers[i] === '') {
        output = null;
      } else {
        output = <button className="btn btn-info btn-wide" key={i}>{data}</button>;
      }
      return output;
    }.bind(this));
    return (<div className="contentBox">
              <div className="boxContent grid-by-rows head">
                <input className="inputBox" type="text" placeholder="Enter a question" value={this.state.question} onChange={this.handleChangeQuestion} />
                <br/>
                {entryOutput}
                <button className="btn btn-info btn-wide" onClick={this.handleAddOption}>Add another option</button>
                <button className="btn btn-info btn-wide" onClick={this.handleClick}>Create your poll!</button>
              </div>
              <h2 className="paddedText" >Preview:</h2>
              <h4 className="paddedText" >{this.state.question}</h4>
              <div className="boxContent grid-by-rows">
                {previewOutput}
              </div>
          </div>);
  }
})
