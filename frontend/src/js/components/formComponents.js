import React from 'react';
import DatePicker from 'react-date-picker'
import Select from 'react-select';
import 'react-select/dist/react-select.css'

const validatorClassname = ({touched, error, warning}) => (touched && ((error && "error") || (warning && "warning"))) || "";

const fieldRenderer = inputRenderer => field => field.label 
    ? (
        <div>
            <label>{field.label}</label>
            {inputRenderer(field)}
        </div>
    ) 
    : inputRenderer(field);


export const renderSelector = fieldRenderer(field => (
    <Select
        {...field.input}
        onChange={field.input.onChange}
        onBlur={v => field.input.onBlur(v.value)}
        clearable={field.clearable || false}
        options={field.options}
        placeholder={field.placeholder}
        disabled={field.disabled}
        autoBlur
        className={validatorClassname(field.meta)}
    />
));

export const renderDatePicker = fieldRenderer(field => (
    <DatePicker
        onChange={field.input.onChange}
        value={field.input.value}
        locale="nb-NO"
        clearIcon={null}
        disabled={field.disabled}
        className={validatorClassname(field.meta)}
    />
));

export const renderField = fieldRenderer(field => (
    <input 
        {...field.input} 
        type={field.type} 
        placeholder={field.placeholder} 
        className={field.className + " " + validatorClassname(field.meta)}
        autoComplete={field.autoComplete}
        step={field.step}
        disabled={field.disabled}
    />
));
