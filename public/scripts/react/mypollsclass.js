var MyPolls = React.createClass({
  render: function() {
    console.log(JSON.stringify(this.props.globalList.result));
    // Filter globalList and only show polls with the same userid as
    //  in this.props.user
    var myPollArray = [];
    this.props.globalList.result.forEach(function(entry) {
      if (entry.creator_id === this.props.user) {
        myPollArray.push(entry);
      }
    }.bind(this));
    console.log("******** Filtering ********")
    console.log(JSON.stringify(myPollArray));
    // Iteratively render polls showing:
    // Question
    // # Voters
    // # Options
    var output = myPollArray.map(function(data, i) {
      return (<div className='pollBox pollAggregateBox' key={i} onClick={this.props.selectPoll.bind(null, data)}>
                {data.question}
                <p className='subtext'># Voters: {data.voted.length}</p>
                <p className='subtext'># Options: {data.answers.length}</p>
                </div>)
    }.bind(this));
    return <div>{output}</div>;
  }
});
