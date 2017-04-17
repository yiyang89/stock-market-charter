var ListComponent = React.createClass({
  render: function() {
    var listjsx = !this.props.stocks? null : Object.keys(this.props.stocks.individual).map(function(data, i) {
      return <div className="stockBox" key={i}>{data}<button onClick={this.props.removeItem.bind(null, data)} className="btn btn-danger">X</button></div>
    }.bind(this));
    return (
      <div className="listComponent">
      {listjsx}
      </div>
    );
  }
})
