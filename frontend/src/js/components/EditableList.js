import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../../style/editablelist.css';

import {
    EDITABLE_LIST_INIT,
    EDITABLE_LIST_APPEND,
    EDITABLE_LIST_REMOVE,
    EDITABLE_LIST_SELECT,
    EDITABLE_LIST_INPUT
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
        const lagre = () => 
            this.props.lagre(this.props.list, this.props.selected);
        return (
            <div className="editablelist">
                {this.props.list.map(l => this.renderLine(l))}
                <div className="line" key={seq++}>
                    <span className="line-op add" onClick={() => this.props.dispatch(append())}>
                        +
                    </span>
                    <InputField />
                </div>
                <button onClick={lagre} disabled={this.props.isPersisting}>
                    Lagre
                </button>
                <button onClick={()=>this.props.slett()} disabled={this.props.isPersisting}>
                    Slett
                </button>
            </div>
        );
    }
}

const InputField = connect(
    state => ({value: state.editableList.inputField}),
    dispatch => ({dispatch})
)(class extends Component {
    render(){
        return(
            <input 
                autoComplete="off" 
                type="text" 
                value={this.props.value} 
                onChange={event => {
                    this.props.dispatch({
                        type: EDITABLE_LIST_INPUT,
                        inputField: event.target.value
                    });
                }}
            />
        )
    }
});

const mapStateToProps = state => ({
    list: state.editableList.list,
    selected: state.editableList.selected
});

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(EditableList)
