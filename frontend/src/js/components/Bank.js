import React, { Component } from 'react';

import Transaksjoner from './Transaksjoner'
import NyTransaksjon from './NyTransaksjon'
import '../../style/footer.css'

class Bank extends Component {

    render() {
        return (
          <div className="bank">
            <NyTransaksjon />
            <Transaksjoner />
            <footer>
                <span>localbank/{this.props.match.params.bankId}</span>
                <a href="https://github.com/89erik/localbank" target="_blank" rel="noopener noreferrer" title="Kildekode">
                    <img src="GitHub-Mark-32px.png" alt="github"/>
                </a>
            </footer>
          </div>
        );
    }
}

export default Bank
