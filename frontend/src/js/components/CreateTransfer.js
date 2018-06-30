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
                <label htmlFor="from">Fra</label>
                <Field name="from" component="input" type="text"/>
                <label htmlFor="to">Til</label>
                <Field name="to" component="input" type="text"/>
                <label htmlFor="amount">Mengde</label>
                <Field name="amount" component="input" type="num"/>
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
