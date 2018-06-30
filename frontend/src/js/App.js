import React, { Component } from 'react';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import Transfers from './components/Transfers'
import CreateTransfer from './components/CreateTransfer'
import reducers from './reducers'

class App extends Component {
  
    render() {
        return (
          <Provider store={createStore(reducers, applyMiddleware(thunk))}>
              <div className="App">
                <CreateTransfer/>
                <Transfers/>
              </div>
          </Provider>
        );
    }
}

export default App;
