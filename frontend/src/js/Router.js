import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Route, Switch } from 'react-router'

import Bank from './components/Bank';
import Historikk from './components/Historikk';
import {fetchKontekst} from './actions';

class Router extends Component {
    componentWillMount() {
        if (this.props.kontekst.needsFetch) {
            this.props.dispatch(fetchKontekst());
        }
    }

    isInitialized() {
        return !this.props.kontekst.isFetching && !this.props.kontekst.needsFetch;
    }

    renderLoading() {
        return <img src="loading.gif" className="loading-gif" alt="Laster..."/>
    }

    render() {
        let seq = 0;
        return (
          <div>
            <Switch>
                { this.isInitialized() && [
                    <Route path="/:bankId/transaksjon/:transaksjonId/historikk" component={Historikk} key={seq++}/>,
                    <Route path="/:bankId" component={Bank} key={seq++} />
                ]}
                <Route path="/" render={this.renderLoading} key={seq++} />
            </Switch>
          </div>
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
