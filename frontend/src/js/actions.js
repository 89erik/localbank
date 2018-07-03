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
        til: transfer.til.value
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
    console.log("put transfer", transfer);

    transfer = {
        ...transfer,
        id: id,
        fra: transfer.fra.value,
        til: transfer.til.value
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

