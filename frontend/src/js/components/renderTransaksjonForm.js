import React from 'react';
import { Field } from 'redux-form'
import '../../style/transaksjoner.css'

import {required} from '../utils/validators';
import {renderField, renderDatePicker, renderSelector} from './formComponents';

export const kontoAsOption = (prefix, konto) => ({
    value: konto.navn,
    label: prefix + " " + konto.navn
});

export const valuttaAsOption = v => ({
    value: v.id,
    label: `${v.id} - ${v.navn}`
});

export default props => (
    <form onSubmit={props.handleSubmit} className="transaksjon-form">
        <Field 
            name="fra" 
            component={renderSelector}
            options={props.kontoer.map(k => kontoAsOption("Fra", k))}
            placeholder={"Fra konto"}
            validate={required}
            disabled={props.displayOnly}
        />
        <Field 
            name="til" 
            component={renderSelector}
            options={props.kontoer.map(k => kontoAsOption("Til", k))}
            placeholder={"Til konto"}
            validate={required}
            disabled={props.displayOnly}
        />
        <Field 
            name="belop" 
            placeholder="Beløp"
            component={renderField}
            type="number"
            step="0.001"
            validate={required}
            className="simple-field"
            disabled={props.displayOnly}
        />
        <Field 
            name="valutta" 
            component={renderSelector}
            options={props.valuttaer.map(valuttaAsOption)}
            clearable={false}
            disabled={props.displayOnly}
        />
        <Field
            name="timestamp"
            component={renderDatePicker}
            disabled={props.displayOnly}
        />
        <Field 
            name="kommentar" 
            placeholder="Kommentar"
            component={renderField}
            autoComplete="off"
            type="text"
            className="simple-field"
            disabled={props.displayOnly}
        />
        {(!props.displayOnly || null) && <button type="submit" className="Select-control" disabled={props.isSaving}>Lagre</button> }
        {props.renderAmendments && props.renderAmendments()}
    </form>
);
