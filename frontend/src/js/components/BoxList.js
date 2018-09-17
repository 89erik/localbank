import React, { Component } from 'react';

import '../../style/boxlist.css';

let seq = 0;

class BoxList extends Component {
    renderBox(box) {
        const max = 4;
        const lines = box.lines.length > max ? box.lines.splice(0, max-1).concat("...") : box.lines;
        return (
          <div className="box" key={seq++} onClick={box.onClick}>
            <span className="header">{box.header}</span>
            <hr />
            <div>
                {lines.map(line => <div key={seq++}>{line}</div>)}
            </div>
          </div>
        );
    }

    render() {
        return (
            <div className="boxlist">
                {this.props.children.map(this.renderBox)}
                <div className="box add" key={seq++} onClick={this.props.onAdd}>+</div>
            </div>
        );
    }
}

export default BoxList
