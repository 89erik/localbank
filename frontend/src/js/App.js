import React, { Component } from 'react';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router'

import reducers from './reducers'
import Router from './Router'

const history = createBrowserHistory()
const middleware = applyMiddleware(thunk, routerMiddleware(history))
const store = createStore(connectRouter(history)(reducers), middleware)

class App extends Component {

    render() {
        return (
          <Provider store={store}>
            <ConnectedRouter history={history}>
                <Router />
            </ConnectedRouter>
          </Provider>
        );
    }
}

export default App;
