import {GET, POST} from './utils/api'

export const GET_TRANSFERS_REQUEST = "GET_TRANSFERS_REQUEST";
export const GET_TRANSFERS_SUCCESS = "GET_TRANSFERS_SUCCESS";
export const GET_TRANSFERS_FAILURE = "GET_TRANSFERS_FAILURE";

export const POST_TRANSFER_REQUEST = "POST_TRANSFER_REQUEST";
export const POST_TRANSFER_SUCCESS = "POST_TRANSFER_SUCCESS";
export const POST_TRANSFER_FAILURE = "POST_TRANSFER_FAILURE";

export const fetchTransfers = () => dispatch => {
    dispatch({type: GET_TRANSFERS_REQUEST});

    GET("/transfers")
        .then(res => res.json())
        .then(transfers => dispatch({type: GET_TRANSFERS_SUCCESS, transfers}))
        .catch(error => dispatch({type: GET_TRANSFERS_FAILURE, error}));
}

export const postTransfer = (transfer) => dispatch => {
    dispatch({type: POST_TRANSFER_REQUEST});

    POST("/transfer", transfer)
        .then(() => {
            dispatch({type: POST_TRANSFER_SUCCESS});
            dispatch(fetchTransfers())
        });
}
