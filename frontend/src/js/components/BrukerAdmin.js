import React, { Component } from 'react';
import { connect } from 'react-redux';

import {postBruker} from '../actions';
import EditableList from './EditableList';

class BrukerAdmin extends Component {
    brukernavn() {
        return this.props.match.params.brukernavn;
    }

    render() {
        const brukernavn = this.brukernavn()
        const bruker = brukernavn && this.props.brukere.items.find(b => b.brukernavn === brukernavn);
        const banker = bruker ? bruker.banker : [];
        
        return (
          <div className="bruker-admin">
            <h2>{brukernavn ? `Banker som ${brukernavn} har tilgang til` : "Opprett ny bruker"}</h2>
            <EditableList lagre={() => this.props.dispatch(postBruker(this.brukernavn()))} 
                          slett={() => console.log("ikke implementert")}
                          isPersisting={this.props.brukere.isPosting}
                          inputHeadline={!brukernavn}
                          options={this.props.banker.map(b => b.navn)}
                      >
                {banker.map(bank => ({
                    value: bank,
                    selected: bruker.defaultBank === bank
                }))}
            </EditableList>
          </div>
        );
    }
}

const mapStateToProps = state => ({
    brukere: state.brukere,
    banker: state.banker.items
});

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(BrukerAdmin)
