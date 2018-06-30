import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form'

import {
    GET_TRANSFERS_REQUEST, 
    GET_TRANSFERS_SUCCESS, 
    GET_TRANSFERS_FAILURE,
    POST_TRANSFER_REQUEST, 
    POST_TRANSFER_SUCCESS, 
    POST_TRANSFER_FAILURE
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
            console.log(action.transfers)
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

        default:
            return state;
    }
};

export default combineReducers({
    transfers,
    form: formReducer
});
