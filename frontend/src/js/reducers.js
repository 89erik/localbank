import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form'
import { required } from './utils/validators';

import {
    GET_TRANSAKSJONER_REQUEST, 
    GET_TRANSAKSJONER_SUCCESS, 
    GET_TRANSAKSJONER_FAILURE,
    POST_TRANSAKSJON_SUCCESS, 
    SELECT_TRANSAKSJON,
    GET_HISTORIKK_REQUEST,
    GET_HISTORIKK_SUCCESS,
    GET_HISTORIKK_FAILURE,
    GET_KONTEKST_REQUEST,
    GET_KONTEKST_SUCCESS,
    GET_KONTEKST_FAILURE,
    GET_BANKER_REQUEST,
    GET_BANKER_SUCCESS,
    GET_BANKER_FAILURE,
    GET_BRUKERE_REQUEST,
    GET_BRUKERE_SUCCESS,
    GET_BRUKERE_FAILURE,
    POST_BANK_REQUEST,
    POST_BANK_SUCCESS,
    POST_BANK_FAILURE,
    EDITABLE_LIST_INIT,
    EDITABLE_LIST_APPEND,
    EDITABLE_LIST_REMOVE,
    EDITABLE_LIST_SELECT,
    EDITABLE_LIST_INPUT
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

const historikk = (state = {isFetching: false, transaksjonId: null, items:[]}, action) => {
    switch (action.type) {
        case GET_HISTORIKK_REQUEST:
            return {
                ...state,
                isFetching: true,
                transaksjonId: action.transaksjonId
            };
        case GET_HISTORIKK_FAILURE:
            return {
                ...state,
                isFetching: false,
                transaksjonId: null
            };
        case GET_HISTORIKK_SUCCESS:
            return {
                ...state,
                isFetching: false,
                items: action.transaksjoner.map(t => ({
                    ...t,
                    timestamp: new Date(t.timestamp)
                }))
            };
        default:
            return state;
    }
};

const kontekst = (state = {
    isFetching: false, 
    needsFetch: true, 
    valuttaer:[], 
    kontoer: [], 
    bruker: null
}, action) => {
    switch (action.type){
        case GET_KONTEKST_REQUEST:
            return {
                ...state,
                needsFetch: false,
                isFetching: true
            };
        case GET_KONTEKST_FAILURE:
            return {
                ...state,
                isFetching: false
            };
        case GET_KONTEKST_SUCCESS:
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

const banker = (state = {
    isFetching: false, 
    needsFetch: true, 
    isPosting: false,
    items:[], 
}, action) => {
    switch (action.type){
        case GET_BANKER_REQUEST:
            return {
                ...state,
                needsFetch: false,
                isFetching: true
            };
        case GET_BANKER_FAILURE:
            return {
                ...state,
                isFetching: false
            };
        case GET_BANKER_SUCCESS:
            return {
                ...state,
                isFetching: false,
                items: action.banker
            };
        case POST_BANK_REQUEST:
            return {
                ...state,
                isPosting: true
            };
        case POST_BANK_FAILURE:
        case POST_BANK_SUCCESS:
            return {
                ...state,
                isPosting: true
            };
        default:
            return state;
    }
}

const brukere = (state = {
    isFetching: false, 
    needsFetch: true, 
    items:[], 
}, action) => {
    switch (action.type){
        case GET_BRUKERE_REQUEST:
            return {
                ...state,
                needsFetch: false,
                isFetching: true
            };
        case GET_BRUKERE_FAILURE:
            return {
                ...state,
                isFetching: false
            };
        case GET_BRUKERE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                items: action.brukere
            };
        default:
            return state;
    }
}

const editableList = (state = {
    list: [], 
    selected: undefined,
    inputField: ""
}, action) => {
    switch (action.type) {
        case EDITABLE_LIST_INIT:
            return {
                ...state,
                list: action.initialList.map(line => line.value),
                selected: (action.initialList.find(line => line.selected) || {}).value
            };
        case EDITABLE_LIST_APPEND:
            const allowed = required(state.inputField) === undefined;
            return allowed ? {
                ...state,
                list: [...state.list, state.inputField],
                inputField: ""
            } : state;
        case EDITABLE_LIST_REMOVE:
            return {
                ...state,
                list: state.list.filter(line => line !== action.line),
                selected: action.line === state.selected ? undefined : state.selected
            };
        case EDITABLE_LIST_SELECT:
            return {
                ...state,
                selected: action.line
            };
        case EDITABLE_LIST_INPUT:
            return {
                ...state,
                inputField: action.inputField
            };
        default:
            return state;
    }
}

export default combineReducers({
    transaksjoner,
    historikk,
    kontekst,
    banker,
    brukere,
    editableList,
    form: formReducer
});
