import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form'

import {
    GET_TRANSAKSJONER_REQUEST, 
    GET_TRANSAKSJONER_SUCCESS, 
    GET_TRANSAKSJONER_FAILURE,
    POST_TRANSAKSJON_SUCCESS, 
    SELECT_TRANSAKSJON,
    GET_BANK_REQUEST,
    GET_BANK_SUCCESS,
    GET_BANK_FAILURE
} from './actions';

const transaksjoner = (state = {isFetching:false, needsFetch:true, items:[]}, action) => {
    switch (action.type){
        case GET_TRANSAKSJONER_REQUEST:
            return {
                ...state,
                isFetching: true,
                needsFetch: false
            };
        case GET_TRANSAKSJONER_FAILURE:
            return {
                ...state,
                isFetching: false,
                needsFetch: false
            };
        case GET_TRANSAKSJONER_SUCCESS:
            return {
                ...state,
                isFetching: false,
                needsFetch: false,
                items: action.transaksjoner.map(t => ({
                    ...t,
                    timestamp: new Date(t.timestamp)
                }))
            };
        case POST_TRANSAKSJON_SUCCESS:
            return {
                ...state,
                needsFetch: true
            }
        case SELECT_TRANSAKSJON:
            return {
                ...state,
                selectedTransaksjon: action.transaksjonId && state.items.find(t => t.id === action.transaksjonId)
            };
        default:
            return state;
    }
};

const bank = (state = {
    isFetching: false, 
    needsFetch: true, 
    valuttaer:[], 
    kontoer: [], 
    bruker: null
}, action) => {
    switch (action.type){
        case GET_BANK_REQUEST:
            return {
                ...state,
                needsFetch: false,
                isFetching: true
            };
        case GET_BANK_FAILURE:
            return {
                ...state,
                isFetching: false
            };
        case GET_BANK_SUCCESS:
            return {
                ...state,
                isFetching: false,
                valuttaer: action.valuttaer,
                kontoer: action.kontoer,
                bruker: action.bruker
            };
        default:
            return state;
    }
}

export default combineReducers({
    transaksjoner,
    bank,
    form: formReducer
});
