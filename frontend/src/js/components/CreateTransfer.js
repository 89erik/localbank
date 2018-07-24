import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form'

import renderTransferForm from './renderTransferForm';
import {postTransfer} from '../actions';

class CreateTransfer extends Component {
    render() {
        return (
            <CreateTransferForm 
                onSubmit={transfer => this.props.dispatch(postTransfer(transfer))}
                kontoer={this.props.kontoer}
                valuttaer={this.props.valuttaer}
            />
        );
    }
}


const CreateTransferForm = reduxForm({
    form: 'createTransfer'
})(renderTransferForm);


const mapStateToProps = state => ({
    kontoer: state.kontoer,
    valuttaer: state.valuttaer
  });

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(CreateTransfer)
