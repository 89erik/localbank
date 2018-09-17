import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form'

import renderTransaksjonForm, {valuttaAsOption, kontoAsOption} from './renderTransaksjonForm';
import {postTransaksjon} from '../actions';

class NyTransaksjon extends Component {
    render() {
        return (
            <NyTransaksjonForm 
                onSubmit={transaksjon => this.props.dispatch(postTransaksjon(transaksjon))}
                kontoer={this.props.kontoer}
                valuttaer={this.props.valuttaer}
                initialValues={{
                    til: kontoAsOption("Til", this.props.kontoer.find(k => k.felles)),
                    valutta: valuttaAsOption(this.props.valuttaer[0]),
                    timestamp: new Date()
                }}
            />
        );
    }
}


const NyTransaksjonForm = reduxForm({
    form: 'nyTransaksjon'
})(renderTransaksjonForm);


const mapStateToProps = state => ({
    kontoer: state.kontekst.kontoer,
    valuttaer: state.kontekst.valuttaer
  });

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(NyTransaksjon)
