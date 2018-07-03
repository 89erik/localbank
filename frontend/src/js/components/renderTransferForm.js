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

const accounts = ["erik", "beate", "felles"];
const accountsFra = accounts.map(a => ({
    value: a,
    label: "Fra " + a
}));
const accountsTil = accounts.map(a => ({
    value: a,
    label: "Til " + a
}));

const required = v => (v||"").length === 0 ? "Påkrevd" : undefined;

export default props => (
    <form onSubmit={props.handleSubmit} className="transfer-form">
        <Field 
            name="fra" 
            component={accountSelector}
            options={accountsFra}
            placeholder={"Fra konto"}
            validate={required}
        />
        <Field 
            name="til" 
            component={accountSelector}
            options={accountsTil}
            placeholder={"Til konto"}
            validate={required}
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
