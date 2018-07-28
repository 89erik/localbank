import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form'

import {
    GET_TRANSAKSJONER_REQUEST, 
    GET_TRANSAKSJONER_SUCCESS, 
    GET_TRANSAKSJONER_FAILURE,
    POST_TRANSAKSJON_SUCCESS, 
    SELECT_TRANSAKSJON,
    GET_KONTOER_REQUEST,
    GET_KONTOER_SUCCESS,
    GET_KONTOER_FAILURE,
    GET_VALUTTAER_REQUEST,
    GET_VALUTTAER_SUCCESS,
    GET_VALUTTAER_FAILURE,
    GET_BRUKER_REQUEST,
    GET_BRUKER_SUCCESS,
    GET_BRUKER_FAILURE
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
                items: action.transaksjoner
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

const kontoer = (state = {isFetching: false, needsFetch: true, items:[]}, action) => {
    switch (action.type){
        case GET_KONTOER_REQUEST:
            return {
                ...state,
                needsFetch: false,
                isFetching: true
            };
        case GET_KONTOER_FAILURE:
            return {
                ...state,
                isFetching: false
            };
        case GET_KONTOER_SUCCESS:
            return {
                ...state,
                isFetching: false,
                items: action.kontoer
            };
        default:
            return state;
    }
}

const valuttaer = (state = {isFetching: false, needsFetch: true, items:[]}, action) => {
    switch (action.type){
        case GET_VALUTTAER_REQUEST:
            return {
                ...state,
                needsFetch: false,
                isFetching: true
            };
        case GET_VALUTTAER_FAILURE:
            return {
                ...state,
                isFetching: false
            };
        case GET_VALUTTAER_SUCCESS:
            return {
                ...state,
                isFetching: false,
                items: action.valuttaer
            };
        default:
            return state;
    }
}

const bruker = (state = {isFetching: false, needsFetch: true}, action) => {
    switch (action.type){
        case GET_BRUKER_REQUEST:
            return {
                ...state,
                needsFetch: false,
                isFetching: true
            };
        case GET_BRUKER_FAILURE:
            return {
                ...state,
                isFetching: false
            };
        case GET_BRUKER_SUCCESS:
            return {
                ...state,
                isFetching: false,
                defaultBank: action.bruker.defaultBank
            };
        default:
            return state;
    }
}
export default combineReducers({
    bruker,
    transaksjoner,
    kontoer,
    valuttaer,
    form: formReducer
});
