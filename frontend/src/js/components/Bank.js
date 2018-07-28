import React, { Component } from 'react';

import Transfers from './Transfers'
import CreateTransfer from './CreateTransfer'

class Bank extends Component {

    render() {
        return (
          <div className="bank">
            <CreateTransfer />
            <Transfers />
          </div>
        );
    }
}

export default Bank
