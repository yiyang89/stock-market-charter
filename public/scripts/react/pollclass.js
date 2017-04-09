
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
    var deleteDisplay = this.props.content.creator_id === user? <button className="btn btn-danger btn-wide" onClick={this.props.deleteClick.bind(null, this.props.content._id)}>Delete this poll</button> : null;
    var newOptionDisplay = user? <input className="inputBox" type="text" placeholder="Don't like these options? Add your own!" onChange={this.handleChangeCustom}/> : null;
    var url = "http://voting-app-decky.herokuapp.com/api/poll/"+this.props.content._id;
    var shareDisplay = user? <div type="text">{url}</div> : null;
    return (<div className="contentBox">
    <div className="paddedText head windowHeading" >{this.props.content.question}</div>
    <div className="boxContent grid-by-rows">
    {output}
    {newOptionDisplay}
    {this.state.customOption?<button className="btn btn-info btn-wide" onClick={this.props.voteClick.bind(null, this.props.content._id, this.state.customOption)}>{this.state.customOption}</button> : <div/>}
    <div id="chart_div"><GoogleDonut data={this.props.content.voted} target="chart_div"/></div>
    {shareDisplay}
    {deleteDisplay}
    </div>
    </div>)
  }
})

var GoogleDonut = React.createClass({
  componentDidMount: function() {
    google.charts.load("visualization", "1", {packages:["corechart"]});
    google.charts.setOnLoadCallback(this.drawCharts);
  },
  drawCharts: function() {
    // Process the voted array.
    var stepOneArray = [];
    this.props.data.forEach(function (entry) {
      if (!stepOneArray.includes(entry)) {stepOneArray.push(entry.answer)}
    })
    var counts = {};
    var i;
    var value;
    for (i = 0; i < stepOneArray.length; i++) {
      value = stepOneArray[i];
      if (typeof counts[value] === "undefined") {
        counts[value] = 1;
      } else {
        counts[value]++;
      }
    }
    var processedData = [];
    Object.keys(counts).forEach(function(key) {
      processedData.push([key, counts[key]]);
    });
    // Create the data table.
    // data.addColumn('string', 'Topping');
    console.log(JSON.stringify(google));
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Option');
    data.addColumn('number', 'Votes');
    data.addRows(
      processedData
    );
    // Set chart options
    var options = {
      'width':600,
      'height':500,
      'pieHole':0.4,
      'pieSliceBorderColor':"#eeeeee"};

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(document.getElementById(this.props.target));
      chart.draw(data, options);
    },
    render: function() {
      // google.charts.setOnLoadCallback(drawChart.bind(this));
      return null;
    }
  })
