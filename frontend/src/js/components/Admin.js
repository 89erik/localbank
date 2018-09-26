import React, { Component } from 'react';
import { connect } from 'react-redux';
import {push} from 'connected-react-router';

import BoxList from './BoxList';

class Admin extends Component {

    render() {
        return (
          <div className="admin">
            <h2>Banker</h2>
            <BoxList onAdd={() => this.props.dispatch(push("/admin/bank"))}>
                {this.props.banker.items.map(b => ({
                    header: b.navn,
                    lines: b.kontoer.filter(k => !k.felles).map(k => k.navn),
                    onClick: () => this.props.dispatch(push(`/admin/bank/${b.navn}`))
                }))}
            </BoxList>
            
            <h2>Brukere</h2>
            <BoxList onAdd={() => console.log("ikke implementert")}>
                {this.props.brukere.items.map(bruker=> ({
                    header: bruker.brukernavn,
                    lines: [bruker.defaultBank].concat(bruker.banker.filter(b => b !== bruker.defaultBank)),
                    onClick: () => console.log("ikke implementert")
                }))}
            </BoxList>
          </div>
        );
    }
}

const mapStateToProps = state => ({
    banker: state.banker,
    brukere: state.brukere
});

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(Admin)
