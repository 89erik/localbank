import React from 'react';
import { Field } from 'redux-form'
import Select from 'react-select';
import 'react-select/dist/react-select.css'
import '../../style/transfers.css'


const accountSelector = (field) => (
    <Select
        {...field.input}
        onChange={field.input.onChange}
        onBlur={v => field.input.onBlur(v.value)}
        clearable={false}
        options={field.options}
        placeholder={field.placeholder}
        autoBlur
    />
)

const kontoOptions = (prefix, kontoer) => kontoer.map(a => ({
    value: a.navn,
    label: prefix + " " + a.navn
}));

const required = v => (v||"").length === 0 ? "Påkrevd" : undefined;

export default props => (
    <form onSubmit={props.handleSubmit} className="transfer-form">
        <Field 
            name="fra" 
            component={accountSelector}
            options={kontoOptions("Fra", props.kontoer.items)}
            placeholder={"Fra konto"}
            validate={required}
            disabled={props.kontoer.isFetching}
        />
        <Field 
            name="til" 
            component={accountSelector}
            options={kontoOptions("Til", props.kontoer.items)}
            placeholder={"Til konto"}
            validate={required}
            disabled={props.kontoer.isFetching}
        />
        <Field 
            name="belop" 
            placeholder="Beløp"
            component="input" 
            type="number"
            validate={required}
            className="simple-field"
        />
        <Field 
            name="kommentar" 
            placeholder="Kommentar"
            component="input" 
            type="text"
            className="simple-field"
        />
        <button type="submit" className="Select-control">Lagre</button>
        {props.renderAmendments && props.renderAmendments()}
    </form>
);
