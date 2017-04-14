var ListComponent = React.createClass({
  render: function() {
    var listjsx = !this.props.stocks? null : Object.keys(this.props.stocks).map(function(data, i) {
      return <div className="stockBox" key={i}>{data}</div>
    });
    return (
      <div className="listComponent">
      {listjsx}
      </div>
    );
  }
})
