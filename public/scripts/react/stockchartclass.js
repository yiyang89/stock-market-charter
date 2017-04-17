var ChartComponent = React.createClass({
  render: function() {
    return (
      <div className="chartComponent">
      <div id="chart_div"><GoogleLine stocks={this.props.stocks} target="chart_div"/></div>
      </div>
    );
  }
})

var GoogleLine = React.createClass({
  componentDidMount: function() {
    google.charts.load("visualization", "1", {packages:["corechart"]});
    console.log("component mounted, drawing chart with " + this.props.stocks);
    google.charts.setOnLoadCallback(this.drawCharts);
  },
  componentWillUpdate: function() {
    console.log("component updated, drawing chart with " + this.props.stocks);
    this.drawCharts();
  },
  drawCharts: function() {
    var drawTimer = setInterval(function() {
      if (this.props.stocks) {
        // Data should be in format:
        //  [Stock Code, Date, Closing Price]
        var keys = Object.keys(this.props.stocks.individual);
        console.log(this.props.stocks);
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Date');
        keys.forEach(function(key) {
          data.addColumn('number', key);
        });
        // console.log(JSON.stringify(this.props.stocks.combined));
        data.addRows(this.props.stocks.combined);
        var options = {
          'width':1400,
          'height':800,
          focusTarget: 'category',
          crosshair: {trigger: 'focus', orientation: 'vertical', color: 'black'},
          legend: 'top',
          hAxis: {
            showTextEvery: 60
          }
          // vAxis: {
          //   title: 'Closing Price'
          // }
        }
        var chart = new google.visualization.LineChart(document.getElementById(this.props.target));
        // Courtesy of  http://stackoverflow.com/questions/34898925/how-to-remove-default-error-message-in-google-chart
        google.visualization.events.addListener(chart, 'error', function (googleError) {
          google.visualization.errors.removeError(googleError.id);
        });

        chart.draw(data, options);
        clearInterval(drawTimer);
      }
    }.bind(this), 500);
  },
  render: function() {
    return null;
  }
})
