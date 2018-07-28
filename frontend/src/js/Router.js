import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Route, Switch } from 'react-router'

import Bank from './components/Bank'
import {fetchBruker, fetchValuttaer} from './actions';

class Router extends Component {
    componentWillMount() {
        if (this.props.bruker.needsFetch) {
            this.props.dispatch(fetchBruker());
        }
        if (this.props.valuttaer.needsFetch) {
            this.props.dispatch(fetchValuttaer());
        }
    }

    renderLoading() {
        return <img src="loading.gif" className="loading-gif" alt="Laster..."/>
    }

    render() {
        return (
          <div>
            <Switch>
                <Route exact path="/" render={this.renderLoading} />
                <Route path="/:bankId" component={Bank} />
            </Switch>
          </div>
        );
    }
}

const mapStateToProps = state => ({
    bruker: state.bruker,
    valuttaer: state.valuttaer,
    pathname: state.router.location.pathname // må tas inn for å rendre etter push
});

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(Router)
