import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form'

import renderTransferForm from './renderTransferForm';
import {postTransfer} from '../actions';

class CreateTransfer extends Component {
    render() {
        return (
            <CreateTransferForm onSubmit={transfer => this.props.dispatch(postTransfer(transfer))}/>
        );
    }
}


const CreateTransferForm = reduxForm({
    form: 'createTransfer'
})(renderTransferForm);


const mapStateToProps = state => ({
    state
  });

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(CreateTransfer)
