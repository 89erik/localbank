import {reset} from 'redux-form'
import {GET, POST, PUT, DELETE} from './utils/api'

export const GET_TRANSFERS_REQUEST = "GET_TRANSFERS_REQUEST";
export const GET_TRANSFERS_SUCCESS = "GET_TRANSFERS_SUCCESS";
export const GET_TRANSFERS_FAILURE = "GET_TRANSFERS_FAILURE";

export const POST_TRANSFER_REQUEST = "POST_TRANSFER_REQUEST";
export const POST_TRANSFER_SUCCESS = "POST_TRANSFER_SUCCESS";
export const POST_TRANSFER_FAILURE = "POST_TRANSFER_FAILURE";

export const DELETE_TRANSFER_REQUEST = "DELETE_TRANSFER_REQUEST";
export const DELETE_TRANSFER_SUCCESS = "DELETE_TRANSFER_SUCCESS";
export const DELETE_TRANSFER_FAILURE = "DELETE_TRANSFER_FAILURE";

export const GET_KONTOER_REQUEST = "GET_KONTOER_REQUEST";
export const GET_KONTOER_SUCCESS = "GET_KONTOER_SUCCESS";
export const GET_KONTOER_FAILURE = "GET_KONTOER_FAILURE";

export const GET_VALUTTAER_REQUEST = "GET_VALUTTAER_REQUEST";
export const GET_VALUTTAER_SUCCESS = "GET_VALUTTAER_SUCCESS";
export const GET_VALUTTAER_FAILURE = "GET_VALUTTAER_FAILURE";

export const EDIT_TRANSFER = "EDIT_TRANSFER";

export const editTransfer = transferId => ({
    type: EDIT_TRANSFER,
    transferId
});

export const fetchTransfers = () => dispatch => {
    dispatch({type: GET_TRANSFERS_REQUEST});

    GET("/transfers")
        .then(res => res.json())
        .then(transfers => dispatch({type: GET_TRANSFERS_SUCCESS, transfers}))
        .catch(error => dispatch({type: GET_TRANSFERS_FAILURE, error}));
}

export const postTransfer = (transfer) => dispatch => {
    dispatch({type: POST_TRANSFER_REQUEST});

    transfer = {
        ...transfer,
        fra: transfer.fra.value,
        til: transfer.til.value,
        valutta: (transfer.valutta && transfer.valutta.value) || undefined
    }
    POST("/transfer", transfer)
        .then(() => {
            dispatch(reset("createTransfer"));
            dispatch({type: POST_TRANSFER_SUCCESS});
            dispatch(fetchTransfers())
        });
}

export const putTransfer = (id, transfer) => dispatch => {
    dispatch({type: POST_TRANSFER_REQUEST});

    transfer = {
        ...transfer,
        id: id,
        fra: transfer.fra.value,
        til: transfer.til.value,
        valutta: transfer.valutta ? transfer.valutta.value || transfer.valutta : undefined
    }
    PUT("/transfer", transfer)
        .then(() => {
            dispatch({type: POST_TRANSFER_SUCCESS});
            dispatch(fetchTransfers())
        });
}

export const deleteTransfer = transfer => dispatch => {
    dispatch({type: DELETE_TRANSFER_REQUEST});

    DELETE("/transfer/" + transfer.id)
        .then(() => {
            dispatch({type: DELETE_TRANSFER_SUCCESS, transferId: transfer.id});
            dispatch(fetchTransfers())
        });
}

export const fetchKontoer = () => dispatch => {
    dispatch({type: GET_KONTOER_REQUEST});

    GET("/kontoer")
        .then(res => res.json())
        .then(kontoer => dispatch({type: GET_KONTOER_SUCCESS, kontoer}))
        .catch(error => dispatch({type: GET_KONTOER_FAILURE, error}));
}

export const fetchValuttaer = () => dispatch => {
    dispatch({type: GET_VALUTTAER_REQUEST});

    GET("/valuttaer")
        .then(res => res.json())
        .then(valuttaer => dispatch({type: GET_VALUTTAER_SUCCESS, valuttaer}))
        .catch(error => dispatch({type: GET_VALUTTAER_FAILURE, error}));
}
