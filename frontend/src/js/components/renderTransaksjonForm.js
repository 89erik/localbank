import React from 'react';
import { Field } from 'redux-form'
import DatePicker from 'react-date-picker'
import Select from 'react-select';
import 'react-select/dist/react-select.css'
import '../../style/transaksjoner.css'

import {required} from '../utils/validators';

const renderSelector = (field) => (
    <Select
        {...field.input}
        onChange={field.input.onChange}
        onBlur={v => field.input.onBlur(v.value)}
        clearable={field.clearable || false}
        options={field.options}
        placeholder={field.placeholder}
        disabled={field.disabled}
        autoBlur
    />
)

const renderDatePicker = (field) => (
    <DatePicker
        onChange={field.input.onChange}
        value={field.input.value}
        locale="nb-NO"
        clearIcon={null}
        disabled={field.disabled}
    />
);

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
            component="input" 
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
            component="input" 
            autoComplete="off"
            type="text"
            className="simple-field"
            disabled={props.displayOnly}
        />
        {(!props.displayOnly || null) && <button type="submit" className="Select-control">Lagre</button> }
        {props.renderAmendments && props.renderAmendments()}
    </form>
);
