import React from 'react';
import { Field } from 'redux-form'
import DatePicker from 'react-date-picker'
import Select from 'react-select';
import 'react-select/dist/react-select.css'
import '../../style/transaksjoner.css'


const renderSelector = (field) => (
    <Select
        {...field.input}
        onChange={field.input.onChange}
        onBlur={v => field.input.onBlur(v.value)}
        clearable={field.clearable || false}
        options={field.options}
        placeholder={field.placeholder}
        autoBlur
    />
)

const renderDatePicker = (field) => (
    <DatePicker
        onChange={field.input.onChange}
        value={field.input.value}
        locale="nb-NO"
        clearIcon={null}
    />
);

const kontoOptions = (prefix, kontoer) => kontoer.map(a => ({
    value: a.navn,
    label: prefix + " " + a.navn
}));

const valuttaOptions = valuttaer => valuttaer.map(v => ({
    value: v.id,
    label: `${v.id} - ${v.navn}`
}));


const required = v => (v||"").length === 0 ? "Påkrevd" : undefined;

export default props => (
    <form onSubmit={props.handleSubmit} className="transaksjon-form">
        <Field 
            name="fra" 
            component={renderSelector}
            options={kontoOptions("Fra", props.kontoer)}
            placeholder={"Fra konto"}
            validate={required}
        />
        <Field 
            name="til" 
            component={renderSelector}
            options={kontoOptions("Til", props.kontoer)}
            placeholder={"Til konto"}
            validate={required}
        />
        <Field 
            name="belop" 
            placeholder="Beløp"
            component="input" 
            type="number"
            autoComplete="off"
            validate={required}
            className="simple-field"
        />
        <Field 
            name="valutta" 
            component={renderSelector}
            options={valuttaOptions(props.valuttaer)}
            placeholder={"NOK - Norske kroner"}
            clearable={true}
        />
        <Field
            name="timestamp"
            component={renderDatePicker}
        />
        <Field 
            name="kommentar" 
            placeholder="Kommentar"
            component="input" 
            autoComplete="off"
            type="text"
            className="simple-field"
        />
        <button type="submit" className="Select-control">Lagre</button>
        {props.renderAmendments && props.renderAmendments()}
    </form>
);
