import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

import Transaksjoner from './Transaksjoner'
import NyTransaksjon from './NyTransaksjon'
import '../../style/footer.css'

class Bank extends Component {

    render() {
        const antallRaderMatch = /antallRader=(\d+)/.exec(this.props.location.search);
        return (
          <div className="bank">
            <NyTransaksjon />
            <Transaksjoner antallRader={antallRaderMatch ? parseInt(antallRaderMatch[1]) : undefined}/>
            <footer>
                {(this.props.kontekst.bruker.admin || null) &&
                    <Link to="/admin" id="admin-link">admin</Link> 
                }
                <span>localbank/{this.props.match.params.bankId}</span>
                <a href="https://github.com/89erik/localbank" target="_blank" rel="noopener noreferrer" title="Kildekode">
                    <img src="GitHub-Mark-32px.png" alt="github"/>
                </a>
            </footer>
          </div>
        );
    }
}

const mapStateToProps = state => ({
    kontekst: state.kontekst
});

export default connect(
    mapStateToProps
)(Bank);
