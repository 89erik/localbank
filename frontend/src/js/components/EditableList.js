import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import '../../style/editablelist.css';
import 'react-select/dist/react-select.css'

import {
    EDITABLE_LIST_INIT,
    EDITABLE_LIST_APPEND,
    EDITABLE_LIST_REMOVE,
    EDITABLE_LIST_SELECT,
    EDITABLE_LIST_NEW_LINE_INPUT,
    EDITABLE_LIST_HEADLINE_INPUT
} from '../actions';

const init = initialList => ({
    type: EDITABLE_LIST_INIT,
    initialList
});

const remove = line => ({
    type: EDITABLE_LIST_REMOVE,
    line
});

const append = () => ({
    type: EDITABLE_LIST_APPEND,
});

const select = line => ({
    type: EDITABLE_LIST_SELECT,
    line
});


let seq = 0;

class EditableList extends Component {
    componentWillMount() {
        this.props.dispatch(init(this.props.children));
    }
    renderLine(line) {
        const selected = (this.props.selected === line) || null;
        return (
          <div className="line" key={seq++}>
            <span className="line-op delete" onClick={() => this.props.dispatch(remove(line))}>-</span>
            <span className={(selected ? "selected" : "")}>{line}</span>
          </div>
        );
    }

    render() {
        return (
            <div className="editablelist">
                {this.props.inputHeadline && (
                    <div>
                        <label>Navn:</label>
                        <HeadlineInputField />
                    </div>
                )}
                {this.props.list.map(l => this.renderLine(l))}
                <div className="line" key={seq++}>
                    <span className="line-op add" onClick={() => this.props.dispatch(append())}>
                        +
                    </span>
                    <NewLineInputField options={this.props.options} list={this.props.list}/>
                </div>
                <button onClick={this.props.lagre} disabled={this.props.isPersisting}>
                    Lagre
                </button>
                {!this.props.inputHeadline && 
                    <button onClick={()=>this.props.slett()} disabled={this.props.isPersisting}>
                        Slett
                    </button>
                }
            </div>
        );
    }
}

const inputFieldRenderer = actionType => props => {
    if (props.options) {
        const options = props.options
            .filter(potentialOption => !props.list.find(selectedOption => potentialOption === selectedOption))

        const option = opt => opt && {
            value: opt,
            label: opt
        };

        return (
            <Select
                onChange={option => props.dispatch({
                    type: actionType,
                    inputField: option && option.value
                })}
                // onBlur={v => field.input.onBlur(v.value)}
                options={options.map(option)}
                value={option(props.value)}
                clearable={false}
                placeholder="velg konto"
                autoBlur
            />
        );
    } else {
        return (
            <input 
                autoComplete="off" 
                type="text" 
                value={props.value} 
                onChange={event => props.dispatch({
                    type: actionType,
                    inputField: event.target.value
                })}
            />
        );
    }
};

const HeadlineInputField = connect(
    state => ({value: state.editableList.headlineInput}),
    dispatch => ({dispatch})
)(inputFieldRenderer(EDITABLE_LIST_HEADLINE_INPUT));

const NewLineInputField = connect(
    state => ({value: state.editableList.newLineInput}),
    dispatch => ({dispatch})
)(inputFieldRenderer(EDITABLE_LIST_NEW_LINE_INPUT));


const mapStateToProps = state => ({
    list: state.editableList.list,
    selected: state.editableList.selected
});

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(EditableList)
