import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Route, Switch } from 'react-router'

import Bank from './components/Bank'
import {fetchBank} from './actions';

class Router extends Component {
    componentWillMount() {
        if (this.props.bank.needsFetch) {
            this.props.dispatch(fetchBank());
        }
    }

    isInitialized() {
        return !this.props.bank.isFetching && !this.props.bank.needsFetch;
    }

    renderLoading() {
        return <img src="loading.gif" className="loading-gif" alt="Laster..."/>
    }

    render() {
        return (
          <div>
            <Switch>
                { this.isInitialized() &&
                    <Route path="/:bankId" component={Bank} />
                }
                <Route path="/" render={this.renderLoading} />
            </Switch>
          </div>
        );
    }
}

const mapStateToProps = state => ({
    bank: state.bank,
    pathname: state.router.location.pathname // må tas inn for å rendre etter push
});

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(Router)
