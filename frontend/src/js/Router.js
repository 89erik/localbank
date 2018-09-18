import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Route, Switch } from 'react-router'

import Bank from './components/Bank';
import Historikk from './components/Historikk';
import Admin from './components/Admin';
import {fetchKontekst} from './actions';

class Router extends Component {

    render() {
        return (
          <div>
            <Switch>
                <Route path="/admin" component={Admin} />
                <SubStateDependence path="/"
                                    subState={this.props.kontekst} 
                                    initialize={() => this.props.dispatch(fetchKontekst())}>
                    <Route exact path="/:bankId/transaksjon/:transaksjonId/historikk" component={Historikk}/>
                    <Route exact path="/:bankId" component={Bank} />
                </SubStateDependence>
            </Switch>
          </div>
        );
    }
}

class SubStateDependence extends Component {
    componentWillMount() {
        if (this.props.subState.needsFetch) {
            this.props.initialize();
        }
    }

    isInitialized() {
        return !this.props.subState.isFetching && !this.props.subState.needsFetch;
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
    pathname: state.router.location.pathname // må tas inn for å rendre etter push
});

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(Router)
