import React, { Component } from 'react';
import { connect } from 'react-redux';

import BoxList from './BoxList';
import {fetchBanker, fetchBrukere} from '../actions';

class Admin extends Component {
    componentWillMount(){
        if (this.props.banker.needsFetch) {
            this.props.dispatch(fetchBanker());
        }
        if (this.props.brukere.needsFetch) {
            this.props.dispatch(fetchBrukere());
        }
    }

    render() {
        if (this.props.brukere.items.length === 0 || this.props.banker.items === 0) {
            return null;
        }
        return (
          <div className="admin">
            <h2>Banker</h2>
            <BoxList onAdd={() => console.log("ikke implementert")}>
                {this.props.banker.items.map(b => ({
                    header: b.navn,
                    lines: b.kontoer.filter(k => !k.felles).map(k => k.navn),
                    onClick: () => console.log("ikke implementert")
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
