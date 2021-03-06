import React from 'react';

class ListComponent extends React.Component {
  render() {
    var listjsx = !this.props.stocks? null : Object.keys(this.props.stocks.individual).map(function(data, i) {
      return <div className="stockBox" key={i}><div className="symbol">{data}</div><button onClick={this.props.removeItem.bind(null, data)} className="btn btn-danger closeButton">X</button></div>
    }.bind(this));
    return (
      <div className="listComponent">
      {listjsx}
      </div>
    );
  }
}

export default ListComponent;
