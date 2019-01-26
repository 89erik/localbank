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

export const GET_KONTEKST_REQUEST = "GET_KONTEKST_REQUEST";
export const GET_KONTEKST_SUCCESS = "GET_KONTEKST_SUCCESS";
export const GET_KONTEKST_FAILURE = "GET_KONTEKST_FAILURE";

export const GET_BRUKERE_REQUEST = "GET_BRUKERE_REQUEST";
export const GET_BRUKERE_SUCCESS = "GET_BRUKERE_SUCCESS";
export const GET_BRUKERE_FAILURE = "GET_BRUKERE_FAILURE";

export const GET_BANKER_REQUEST = "GET_BANKER_REQUEST";
export const GET_BANKER_SUCCESS = "GET_BANKER_SUCCESS";
export const GET_BANKER_FAILURE = "GET_BANKER_FAILURE";

export const POST_BANK_REQUEST = "POST_BANK_REQUEST";
export const POST_BANK_SUCCESS = "POST_BANK_SUCCESS";
export const POST_BANK_FAILURE = "POST_BANK_FAILURE";

export const SELECT_TRANSAKSJON = "SELECT_TRANSAKSJON";

export const EDITABLE_LIST_INIT = "EDITABLE_LIST_INIT";
export const EDITABLE_LIST_APPEND = "EDITABLE_LIST_APPEND";
export const EDITABLE_LIST_REMOVE = "EDITABLE_LIST_REMOVE";
export const EDITABLE_LIST_SELECT = "EDITABLE_LIST_SELECT";
export const EDITABLE_LIST_NEW_LINE_INPUT = "EDITABLE_LIST_NEW_LINE_INPUT";
export const EDITABLE_LIST_HEADLINE_INPUT = "EDITABLE_LIST_HEADLINE_INPUT";

export const SET_VIS_SLETTEDE_TRANSAKSJONER = "SET_VIS_SLETTEDE_TRANSAKSJONER";
export const UNSPECIFIED_ERROR = "UNSPECIFIED_ERROR";
export const DISMISS_ERROR = "DISMISS_ERROR";

export const selectTransaksjon = transaksjonId => ({
    type: SELECT_TRANSAKSJON,
    transaksjonId
});

const bank = getState => {
    // eslint-disable-next-line
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
        })
        .catch(error => dispatch({type: POST_TRANSAKSJON_FAILURE, error}));
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
        })
        .catch(error => dispatch({type: POST_TRANSAKSJON_FAILURE, error}));
}

export const deleteTransaksjon = transaksjon => dispatch => {
    dispatch({type: DELETE_TRANSAKSJON_REQUEST});

    DELETE("/transaksjon/" + transaksjon.id)
        .then(() => {
            dispatch({type: DELETE_TRANSAKSJON_SUCCESS, transaksjonId: transaksjon.id});
            dispatch(fetchTransaksjoner())
        })
        .catch(error => dispatch({type: UNSPECIFIED_ERROR, error}));
}

export const restoreTransaksjon = transaksjon => dispatch => {
    PUT("/transaksjon/restore/" + transaksjon.id)
        .then(() => dispatch(fetchTransaksjoner()))
        .catch(error => dispatch({type: UNSPECIFIED_ERROR, error}));
}

export const fetchKontekst = () => (dispatch, getState) => {
    const valgtBank = bank(getState);

    dispatch({type: GET_KONTEKST_REQUEST});
    GET(valgtBank ? `/${valgtBank}/kontekst` : "/kontekst")
        .then(res => res.json())
        .then(bank => {
            dispatch({type: GET_KONTEKST_SUCCESS, ...bank});
            if (!valgtBank) {
                dispatch(push("/" + bank.valgtBank));
            }
        })
        .catch(error => dispatch({type: GET_KONTEKST_FAILURE, error}));
}

export const visHistorikk = transaksjonId => (dispatch, getState) => {
    dispatch(push(`/${bank(getState)}/transaksjon/${transaksjonId}/historikk`));
}

export const fetchBanker = () => dispatch => {
    dispatch({type: GET_BANKER_REQUEST});
    GET("/banker")
        .then(res => res.json())
        .then(banker => dispatch({type: GET_BANKER_SUCCESS, banker}))
        .catch(error => dispatch({type: GET_BANKER_FAILURE, error}));
}

export const fetchBrukere = () => dispatch => {
    dispatch({type: GET_BRUKERE_REQUEST});
    GET("/brukere")
        .then(res => res.json())
        .then(brukere => dispatch({type: GET_BRUKERE_SUCCESS, brukere}))
        .catch(error => dispatch({type: GET_BRUKERE_FAILURE, error}));
}

export const postBank = bankId => (dispatch, getState) => {
    const state = getState().editableList;
    const bank = {
        navn: bankId || state.headlineInput,
        kontoer: state.list.map(line => ({
            navn: line,
            felles: line === state.selected
        }))
    };

    dispatch({type: POST_BANK_REQUEST}); 
    POST("/banker", bank)
        .then(() => {
            dispatch({type: POST_BANK_SUCCESS})
            dispatch(fetchBanker());
            dispatch(push("/admin"));
        })
        .catch(error => dispatch({type: POST_BANK_FAILURE, error}));
}

export const postBruker = brukernavn => (dispatch, getState) => {
    const state = getState().editableList;
    const bruker = {
        brukernavn: brukernavn || state.headlineInput,
        banker: state.list,
        defaultBank: state.selected
    };
    POST("/brukere", bruker)
        .then(() => {
            dispatch(fetchBrukere());
            dispatch(push("/admin"));
        })
        .catch(error => dispatch({type: UNSPECIFIED_ERROR, error}));
}

export const putKonto = (bankId, konto) => (dispatch) => {
    konto = {
        ...konto,
        fra: konto.fra && withoutTimezone(konto.fra),
        til: konto.til && withoutTimezone(konto.til)
    };
    PUT(`/${bankId}/konto`, konto)
        .then(() => {
            dispatch(fetchBanker());
            dispatch(push(`/admin/bank/${bankId}`));
        })
        .catch(error => dispatch({type: UNSPECIFIED_ERROR, error}));
}

export const setVisSlettedeTransaksjoner = visSlettede => ({
    type: SET_VIS_SLETTEDE_TRANSAKSJONER,
    visSlettede
});

export const dismissError = () => ({
    type: DISMISS_ERROR
});