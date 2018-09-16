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

export const GET_BANK_REQUEST = "GET_BANK_REQUEST";
export const GET_BANK_SUCCESS = "GET_BANK_SUCCESS";
export const GET_BANK_FAILURE = "GET_BANK_FAILURE";

export const GET_HISTORIKK_REQUEST = "GET_HISTORIKK_REQUEST";
export const GET_HISTORIKK_SUCCESS = "GET_HISTORIKK_SUCCESS";
export const GET_HISTORIKK_FAILURE = "GET_HISTORIKK_FAILURE";

export const SELECT_TRANSAKSJON = "SELECT_TRANSAKSJON";

export const selectTransaksjon = transaksjonId => ({
    type: SELECT_TRANSAKSJON,
    transaksjonId
});

const bank = getState => {
    const m = /\/([^\/]+)/.exec(getState().router.location.pathname)
    return m && m[1];
};

export const fetchTransaksjoner = () => (dispatch, getState) => {
    dispatch({type: GET_TRANSAKSJONER_REQUEST});

    GET(`/${bank(getState)}/transaksjoner`)
        .then(res => res.json())
        .then(transaksjoner => dispatch({type: GET_TRANSAKSJONER_SUCCESS, transaksjoner}))
        .catch(error => dispatch({type: GET_TRANSAKSJONER_FAILURE, error}));
}

export const postTransaksjon = transaksjon => (dispatch, getState) => {
    dispatch({type: POST_TRANSAKSJON_REQUEST});

    transaksjon = {
        ...transaksjon,
        fra: transaksjon.fra.value,
        til: transaksjon.til.value,
        timestamp: withoutTimezone(transaksjon.timestamp),
        valutta: transaksjon.valutta.value
    }
    POST(`/${bank(getState)}/transaksjon`, transaksjon)
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
        fra: transaksjon.fra.value,
        til: transaksjon.til.value,
        timestamp: withoutTimezone(transaksjon.timestamp),
        valutta: transaksjon.valutta.value
    }
    PUT(`/${bank(getState)}/transaksjon`, transaksjon)
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

export const fetchBank = () => (dispatch, getState) => {
    dispatch({type: GET_BANK_REQUEST});
    const valgtBank = bank(getState);

    GET(valgtBank ? `/${valgtBank}/bank` : "/bank")
        .then(res => res.json())
        .then(bank => {
            dispatch({type: GET_BANK_SUCCESS, ...bank});
            if (!valgtBank) {
                dispatch(push("/" + bank.valgtBank));
            }
        })
        .catch(error => dispatch({type: GET_BANK_FAILURE, error}));
}

export const visHistorikk = transaksjonId => (dispatch, getState) => {
    dispatch(push(`/${bank(getState)}/transaksjon/${transaksjonId}/historikk`));
}

export const lastHistorikk = transaksjonId => dispatch => {
    dispatch({type: GET_HISTORIKK_REQUEST, transaksjonId});
    GET(`/transaksjon/${transaksjonId}/historikk`)
        .then(res => res.json())
        .then(transaksjoner => dispatch({type: GET_HISTORIKK_SUCCESS, transaksjoner}))
        .catch(error => dispatch({type: GET_HISTORIKK_FAILURE, error}));
}
