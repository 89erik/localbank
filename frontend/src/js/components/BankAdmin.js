import React, { Component } from 'react';
import { connect } from 'react-redux';

import {postBank} from '../actions';
import EditableList from './EditableList';

class BankAdmin extends Component {

    bank() {
        return this.props.match.params.bankId;
    }

    slettBank() {
        throw "ikke implementert"; // TODO
    }

    render() {
        const bank = this.bank();
        const kontoer = bank ? this.props.banker.items.find(b => b.navn === bank).kontoer : [];
        return (
          <div className="bank-admin">
            <h2>{bank ? `Kontoer i ${bank}` : "Opprett ny bank"}</h2>
            <EditableList lagre={() => this.props.dispatch(postBank(this.bank()))} 
                          slett={() => this.slettBank()} 
                          isPersisting={this.props.banker.isPosting}
                          inputHeadline={!bank}
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
