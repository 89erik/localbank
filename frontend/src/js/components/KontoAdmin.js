import React, { Component } from 'react';
import { Field } from 'redux-form'
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form'

import {renderField, renderDatePicker} from './formComponents';
import {putKonto} from '../actions';
import '../../style/kontoadmin.css';


class KontoAdmin extends Component {
    render() {
        const {bankId, kontoId} = this.props.match.params;
        const bank = this.props.banker.find(b => b.navn === bankId)
        const konto = bank.kontoer.find(k => k.navn === kontoId);
    
        return (
            <div className="konto-admin">
                <KontoForm 
                    initialValues={konto}
                    onSubmit={endretKonto => this.props.dispatch(putKonto(bankId, endretKonto))}
                />
            </div>
        );
    }
}


const KontoForm = reduxForm({form: "konto"})(props =>  (
    <form onSubmit={props.handleSubmit} className="konto-form">
        <Field 
            label="Navn"
            name="navn" 
            component={renderField}
            disabled={true}
        />
        <Field 
            name="felles" 
            component={renderField}
            label="Felles"
            type="checkbox"
        />
        <Field
            label="Fra"
            name="fra"
            component={renderDatePicker}
        />
        <Field
            label="Til"
            name="til"
            component={renderDatePicker}
        />
        <button type="submit" className="Select-control" disabled={props.isSaving}>Lagre</button>
    </form>
));

const mapStateToProps = state => ({
    banker: state.banker.items
});

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(KontoAdmin)
