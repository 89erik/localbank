import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Route, Switch } from 'react-router'
import Popup from 'reactjs-popup';

import Bank from './components/Bank';
import Historikk from './components/Historikk';
import Admin from './components/Admin';
import BankAdmin from './components/BankAdmin';

import {
    dismissError,
    fetchKontekst, 
    fetchBanker, 
    fetchBrukere
} from './actions';

class Router extends Component {
    renderErrorMessage() {
        return (
            <div>
                <h1>Feil</h1>
                <p>{this.props.error.message}</p>
                {this.props.error.fatal ? null : <button onClick={() => this.props.dispatch(dismissError())}>OK</button>}
            </div>
        );
    }
    render() {
        if (this.props.error.message && this.props.error.fatal) {
            return this.renderErrorMessage();
        }

        const adminSubStates = [{
                ...this.props.brukere,
                fetch: () => this.props.dispatch(fetchBrukere())
            },{
                ...this.props.banker,
                fetch: () => this.props.dispatch(fetchBanker())
            }];

        const kontekst = {
            ...this.props.kontekst, 
            fetch: () => this.props.dispatch(fetchKontekst())
        };

        return (
          <div>
            <Switch>
                <SubStateDependence path="/admin" subStates={adminSubStates}>
                    <Route exact path="/admin" component={Admin} />
                    <Route exact path="/admin/bank" component={BankAdmin} />
                    <Route exact path="/admin/bank/:bankId" component={BankAdmin} />
                </SubStateDependence>

                <SubStateDependence path="/" subState={kontekst}>
                    <Route exact path="/:bankId/transaksjon/:transaksjonId/historikk" component={Historikk}/>
                    <Route exact path="/:bankId" component={Bank} />
                </SubStateDependence>
            </Switch>
            <Popup open={!!this.props.error.message}>
                {this.renderErrorMessage()}
            </Popup>
          </div>
        );
    }
}

class SubStateDependence extends Component {
    subStates() {
        return this.props.subStates || [this.props.subState];
    }

    componentWillMount() {
        this.subStates()
            .filter(s => s.needsFetch)
            .forEach(s => s.fetch());
    }

    isInitialized() {
        return this.subStates().every(s => !s.isFetching && !s.needsFetch);
    }
    
    renderLoading() {
        return <img src="loading.gif" className="loading-gif" alt="Laster..."/>
    }

    render() {
        return (
            <Route path={this.props.path} render={() => 
                this.isInitialized() ? this.props.children : this.renderLoading()
            } />
        );
    }
}

const mapStateToProps = state => ({
    error: state.error,
    kontekst: state.kontekst,
    banker: state.banker,
    brukere: state.brukere,
    pathname: state.router.location.pathname // må tas inn for å rendre etter push
});

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(Router)
