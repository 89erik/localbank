import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form'

import renderTransaksjonForm from './renderTransaksjonForm';
import {postTransaksjon} from '../actions';

class NyTransaksjon extends Component {
    render() {
        return (
            <NyTransaksjonForm 
                onSubmit={transaksjon => this.props.dispatch(postTransaksjon(transaksjon))}
                kontoer={this.props.kontoer}
                valuttaer={this.props.valuttaer}
                initialValues={{timestamp: new Date()}}
            />
        );
    }
}


const NyTransaksjonForm = reduxForm({
    form: 'nyTransaksjon'
})(renderTransaksjonForm);


const mapStateToProps = state => ({
    kontoer: state.kontoer,
    valuttaer: state.valuttaer
  });

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(NyTransaksjon)
