import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form'
import { required } from './utils/validators';

import {
    GET_TRANSAKSJONER_REQUEST, 
    GET_TRANSAKSJONER_SUCCESS, 
    GET_TRANSAKSJONER_FAILURE,
    POST_TRANSAKSJON_FAILURE,
    POST_TRANSAKSJON_SUCCESS, 
    SELECT_TRANSAKSJON,
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
    EDITABLE_LIST_NEW_LINE_INPUT,
    EDITABLE_LIST_HEADLINE_INPUT,
    SET_VIS_SLETTEDE_TRANSAKSJONER,
    DISMISS_ERROR,
    UNSPECIFIED_ERROR,
    POST_TRANSAKSJON_REQUEST,
} from './actions';

const error = (state = {message: null, fatal: false}, action) => {
    switch (action.type) {
        case DISMISS_ERROR:
            return {message: null};
        case UNSPECIFIED_ERROR:
        case GET_TRANSAKSJONER_FAILURE:
        case POST_TRANSAKSJON_FAILURE:
        case GET_BANKER_FAILURE:
        case GET_BRUKERE_FAILURE:
        case POST_BANK_FAILURE:
            return {
                message: action.error,
                fatal: false
            };
        case GET_KONTEKST_FAILURE:
            return {
                message: action.error,
                fatal: true
            };
        default:
            return state;
    }    
}

const transaksjoner = (state = {
    isFetching:false, 
    needsFetch:true, 
    isPosting: false, 
    items:[], 
    visSlettede: false
}, action) => {
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
        case POST_TRANSAKSJON_REQUEST:
            return {
                ...state,
                isPosting: true
            }
        case POST_TRANSAKSJON_FAILURE:
            return {
                ...state,
                isPosting: false
            }
        case POST_TRANSAKSJON_SUCCESS:
            return {
                ...state,
                needsFetch: true,
                isPosting: false
            }
        case SELECT_TRANSAKSJON:
            return {
                ...state,
                selectedTransaksjon: action.transaksjonId && state.items.find(t => t.id === action.transaksjonId)
            };
        case SET_VIS_SLETTEDE_TRANSAKSJONER:
            return {
                ...state,
                visSlettede: action.visSlettede
            }

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
        case GET_KONTEKST_SUCCESS:
            return {
                ...state,
                isFetching: false,
                valuttaer: action.valuttaer,
                kontoer: action.kontoer.map(konto => ({
                    ...konto,
                    fra: konto.fra && new Date(konto.fra),
                    til: konto.til && new Date(konto.til)
                })),
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
                items: action.banker.map(bank => ({
                    ...bank,
                    kontoer: bank.kontoer.map(konto => ({
                        ...konto,
                        fra: konto.fra && new Date(konto.fra),
                        til: konto.til && new Date(konto.til)
                    }))
                }))
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
                isPosting: false
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
    newLineInput: "",
    headlineInput: ""
}, action) => {
    switch (action.type) {
        case EDITABLE_LIST_INIT:
            return {
                ...state,
                list: action.initialList.map(line => line.value),
                selected: (action.initialList.find(line => line.selected) || {}).value,
                newLineInput: "",
                headlineInput: ""
            };
        case EDITABLE_LIST_APPEND:
            const allowed = required(state.newLineInput) === undefined;
            return allowed ? {
                ...state,
                list: [...state.list, state.newLineInput],
                selected: state.selected || state.newLineInput,
                newLineInput: "",
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
        case EDITABLE_LIST_NEW_LINE_INPUT:
            return {
                ...state,
                newLineInput: action.inputField
            };
        case EDITABLE_LIST_HEADLINE_INPUT:
            return {
                ...state,
                headlineInput: action.inputField
            }
        default:
            return state;
    }
}

export default combineReducers({
    error,
    transaksjoner,
    kontekst,
    banker,
    brukere,
    editableList,
    form: formReducer
});
