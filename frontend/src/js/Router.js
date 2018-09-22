import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Route, Switch } from 'react-router'

import Bank from './components/Bank';
import Historikk from './components/Historikk';
import Admin from './components/Admin';
import BankAdmin from './components/BankAdmin';

import {
    fetchKontekst, 
    fetchBanker, 
    fetchBrukere
} from './actions';

class Router extends Component {

    render() {
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
                    <Route exact path="/admin/bank/:bankId" component={BankAdmin} />
                </SubStateDependence>

                <SubStateDependence path="/" subState={kontekst}>
                    <Route exact path="/:bankId/transaksjon/:transaksjonId/historikk" component={Historikk}/>
                    <Route exact path="/:bankId" component={Bank} />
                </SubStateDependence>
            </Switch>
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
    kontekst: state.kontekst,
    banker: state.banker,
    brukere: state.brukere,
    pathname: state.router.location.pathname // må tas inn for å rendre etter push
});

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(Router)
