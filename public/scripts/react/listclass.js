var ListArea = React.createClass({
  getInitialState: function() {
    return {list: []};
  },
  componentDidMount: function() {
    // Get poll list from server
    this.serverRequest = $.getJSON('/api/getpolls', function (result) {
      this.setState({
        list: {result}
      });
    }.bind(this));
  },
  render: function() {
    // Return either a button or a welcome message based on global being set.
    var output;
    if (this.state.list.result) {
      output = this.state.list.result.map(function(data, i) {
          return <div className='pollBox' key={i} onClick={this.props.onClick.bind(null, data)}>{data.question}</div>;
      }, this)
    } else {
      output = '';
    }
    return (<div>
      {output}
      </div>)
  }
});
