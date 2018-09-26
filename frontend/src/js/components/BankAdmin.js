import React, { Component } from 'react';
import { connect } from 'react-redux';

import {postBank} from '../actions';
import EditableList from './EditableList';

class BankAdmin extends Component {

    bank() {
        return this.props.match.params.bankId;
    }

    lagreKontoer(lines, selected) {
        const bank = {
            navn: this.bank(),
            kontoer: lines.map(line => ({
                navn: line,
                felles: line === selected
            }))
        };
        this.props.dispatch(postBank(bank));
    }

    slettBank() {
        throw "ikke implementert"; // TODO
    }

    render() {
        const bank = this.bank();
        const kontoer = this.props.banker.items.find(b => b.navn === bank).kontoer;
        return (
          <div className="bank-admin">
            <h2>Kontoer i {bank}</h2>
            <EditableList lagre={(lines, selected) => this.lagreKontoer(lines,selected)} 
                          slett={() => this.slettBank()} 
                          isPersisting={this.props.banker.isPosting}
                      >
                {kontoer.map(konto => ({
                    value: konto.navn,
                    selected: konto.felles
                }))}
            </EditableList>
          </div>
        );
    }
}

const mapStateToProps = state => ({
    banker: state.banker,
});

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(BankAdmin)
