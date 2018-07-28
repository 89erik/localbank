import React, { Component } from 'react';

import Transaksjoner from './Transaksjoner'
import NyTransaksjon from './NyTransaksjon'

class Bank extends Component {

    render() {
        return (
          <div className="bank">
            <NyTransaksjon />
            <Transaksjoner />
          </div>
        );
    }
}

export default Bank
