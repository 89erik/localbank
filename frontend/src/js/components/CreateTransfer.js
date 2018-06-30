import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form'

import {postTransfer} from '../actions';

class CreateTransfer extends Component {
    componentWillMount() {
    }

    render() {
        return (
            <CreateTransferForm onSubmit={transfer => this.props.dispatch(postTransfer(transfer))}/>
        );
    }
}

const CreateTransferForm = reduxForm({
    form: 'createTransfer'
})(props => {
    return (
        <form onSubmit={props.handleSubmit} className="create-transfer-form">
                <label htmlFor="fra">Fra</label>
                <Field name="fra" component="input" type="text"/>
                <label htmlFor="til">Til</label>
                <Field name="til" component="input" type="text"/>
                <label htmlFor="belop">Belop</label>
                <Field name="belop" component="input" type="num"/>
                <button type="submit">Lagre</button>
        </form>
    );
});


const mapStateToProps = state => ({
    state
  });

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(CreateTransfer)
