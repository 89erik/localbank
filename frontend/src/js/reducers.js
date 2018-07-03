import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form'

import {
    GET_TRANSFERS_REQUEST, 
    GET_TRANSFERS_SUCCESS, 
    GET_TRANSFERS_FAILURE,
    POST_TRANSFER_SUCCESS, 
    EDIT_TRANSFER,
} from './actions';

const transfers = (state = {isFetching:false, needsFetch:true, items:[]}, action) => {
    switch (action.type){
        case GET_TRANSFERS_REQUEST:
            return {
                ...state,
                isFetching: true,
                needsFetch: false
            };
        case GET_TRANSFERS_FAILURE:
            return {
                ...state,
                isFetching: false,
                needsFetch: false
            };
        case GET_TRANSFERS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                needsFetch: false,
                items: action.transfers
            };
        case POST_TRANSFER_SUCCESS:
            return {
                ...state,
                needsFetch: true
            }
        case EDIT_TRANSFER:
            return {
                ...state,
                selectedTransfer: action.transferId && state.items.find(t => t.id === action.transferId)
            };
        default:
            return state;
    }
};

export default combineReducers({
    transfers,
    form: formReducer
});
