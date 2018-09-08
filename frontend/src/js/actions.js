import {reset} from 'redux-form'
import {push} from 'connected-react-router';
import {GET, POST, PUT, DELETE} from './utils/api';
import {withoutTimezone} from './utils/date';

export const GET_TRANSAKSJONER_REQUEST = "GET_TRANSAKSJONER_REQUEST";
export const GET_TRANSAKSJONER_SUCCESS = "GET_TRANSAKSJONER_SUCCESS";
export const GET_TRANSAKSJONER_FAILURE = "GET_TRANSAKSJONER_FAILURE";

export const POST_TRANSAKSJON_REQUEST = "POST_TRANSAKSJON_REQUEST";
export const POST_TRANSAKSJON_SUCCESS = "POST_TRANSAKSJON_SUCCESS";
export const POST_TRANSAKSJON_FAILURE = "POST_TRANSAKSJON_FAILURE";

export const DELETE_TRANSAKSJON_REQUEST = "DELETE_TRANSAKSJON_REQUEST";
export const DELETE_TRANSAKSJON_SUCCESS = "DELETE_TRANSAKSJON_SUCCESS";
export const DELETE_TRANSAKSJON_FAILURE = "DELETE_TRANSAKSJON_FAILURE";

export const GET_KONTOER_REQUEST = "GET_KONTOER_REQUEST";
export const GET_KONTOER_SUCCESS = "GET_KONTOER_SUCCESS";
export const GET_KONTOER_FAILURE = "GET_KONTOER_FAILURE";

export const GET_VALUTTAER_REQUEST = "GET_VALUTTAER_REQUEST";
export const GET_VALUTTAER_SUCCESS = "GET_VALUTTAER_SUCCESS";
export const GET_VALUTTAER_FAILURE = "GET_VALUTTAER_FAILURE";

export const GET_BRUKER_REQUEST = "GET_BRUKER_REQUEST";
export const GET_BRUKER_SUCCESS = "GET_BRUKER_SUCCESS";
export const GET_BRUKER_FAILURE = "GET_BRUKER_FAILURE";

export const SELECT_TRANSAKSJON = "SELECT_TRANSAKSJON";

export const selectTransaksjon = transaksjonId => ({
    type: SELECT_TRANSAKSJON,
    transaksjonId
});

const bank = getState => getState().router.location.pathname.slice(1);

export const fetchTransaksjoner = () => (dispatch, getState) => {
    dispatch({type: GET_TRANSAKSJONER_REQUEST});

    GET("/transaksjoner/" + bank(getState))
        .then(res => res.json())
        .then(transaksjoner => dispatch({type: GET_TRANSAKSJONER_SUCCESS, transaksjoner}))
        .catch(error => dispatch({type: GET_TRANSAKSJONER_FAILURE, error}));
}

export const postTransaksjon = transaksjon => (dispatch, getState) => {
    dispatch({type: POST_TRANSAKSJON_REQUEST});

    transaksjon = {
        bank: bank(getState),
        ...transaksjon,
        fra: transaksjon.fra.value,
        til: transaksjon.til.value,
        timestamp: withoutTimezone(transaksjon.timestamp),
        valutta: (transaksjon.valutta && transaksjon.valutta.value) || undefined
    }
    POST("/transaksjon", transaksjon)
        .then(() => {
            dispatch(reset("nyTransaksjon"));
            dispatch({type: POST_TRANSAKSJON_SUCCESS});
            dispatch(fetchTransaksjoner(bank))
        });
}

export const putTransaksjon = (id, transaksjon) => (dispatch, getState) => {
    dispatch({type: POST_TRANSAKSJON_REQUEST});

    transaksjon = {
        ...transaksjon,
        id,
        bank: bank(getState),
        fra: transaksjon.fra.value,
        til: transaksjon.til.value,
        timestamp: withoutTimezone(transaksjon.timestamp),
        valutta: transaksjon.valutta ? transaksjon.valutta.value || transaksjon.valutta : undefined
    }
    PUT("/transaksjon", transaksjon)
        .then(() => {
            dispatch({type: POST_TRANSAKSJON_SUCCESS});
            dispatch(fetchTransaksjoner(bank))
        });
}

export const deleteTransaksjon = transaksjon => dispatch => {
    dispatch({type: DELETE_TRANSAKSJON_REQUEST});

    DELETE("/transaksjon/" + transaksjon.id)
        .then(() => {
            dispatch({type: DELETE_TRANSAKSJON_SUCCESS, transaksjonId: transaksjon.id});
            dispatch(fetchTransaksjoner())
        });
}

export const fetchKontoer = () => (dispatch, getState) => {
    dispatch({type: GET_KONTOER_REQUEST});

    GET("/kontoer/" + bank(getState))
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

export const fetchBruker = () => (dispatch, getState) => {
    dispatch({type: GET_BRUKER_REQUEST});

    GET("/bruker")
        .then(res => res.json())
        .then(bruker => {
            dispatch({type: GET_BRUKER_SUCCESS, bruker});
            if (getState().router.location.pathname === "/") {
                dispatch(push("/" + bruker.defaultBank));
            }
        })
        .catch(error => dispatch({type: GET_BRUKER_FAILURE, error}));
}
