import React from 'react';
import { connect } from 'react-redux';
import Popup from 'reactjs-popup';
import { reduxForm } from 'redux-form'
import renderTransaksjonForm, {valuttaAsOption} from './renderTransaksjonForm';

import {
    putTransaksjon, 
    deleteTransaksjon,
    restoreTransaksjon,
    visHistorikk
} from '../actions';

class TransaksjonPopup extends React.Component {
    closeWith(closeAction) {
        closeAction();
        this.props.onClose();
    }
    save(dtoTransaksjon) {
        const transaksjon = {
            ...dtoTransaksjon,
            fra: {value: dtoTransaksjon.fra.value || dtoTransaksjon.fra},
            til: {value: dtoTransaksjon.til.value || dtoTransaksjon.til}
        };

        this.props.putTransaksjon(this.props.transaksjon.id, transaksjon);
    }
    editableTransaksjon(){
        return this.props.transaksjon && {
            ...this.props.transaksjon,
            belop: this.props.transaksjon.valutta.belop || this.props.transaksjon.belop,
            valutta: valuttaAsOption(this.props.valuttaer.find(v => v.id === this.props.transaksjon.valutta.id))
        }
    }

    harHistorikk(){
        return this.props.transaksjon.forgjenger || this.props.transaksjon.etterkommer;
    }

    erSlettet() {
        return (this.props.transaksjon || {}).deleted;
    }



    render() {
        return (
            <Popup open={!!this.props.transaksjon} onClose={this.props.onClose}>
                <EditTransaksjonForm 
                    onSubmit={transaksjon => this.closeWith(() => this.save(transaksjon))}
                    initialValues={this.editableTransaksjon()}
                    kontoer={this.props.kontoer}
                    valuttaer={this.props.valuttaer}
                    displayOnly={this.erSlettet()}
                    isSaving={this.props.isPostingTransaksjon}
                    renderAmendments={() => [
                        <button 
                            key="delete"
                            onClick={() => this.closeWith(() => (this.erSlettet() ? this.props.restoreTransaksjon : this.props.deleteTransaksjon)(this.props.transaksjon))}
                            className="Select-control"
                        >
                            {this.erSlettet() ? "Gjenopprett" : "Slett"}
                        </button>,
                        this.harHistorikk() && <button
                            key="historikk"
                            onClick={() => this.closeWith(() => this.props.visHistorikk(this.props.transaksjon))}
                            className="Select-control"
                        >
                            Historikk
                        </button>,
                        <button 
                            key="avbryt"
                            onClick={() => this.props.onClose()} 
                            className="Select-control"
                        >
                            Avbryt
                        </button>
                    ]}
                />
            </Popup>
        );
    }
}

const EditTransaksjonForm = reduxForm({
    form: 'editTransaksjon'
})(renderTransaksjonForm);


const mapStateToProps = state => ({
    isPostingTransaksjon: state.transaksjoner.isPosting,
});

const mapDispatchToProps = dispatch => ({
    putTransaksjon: (id, t) => dispatch(putTransaksjon(id, t)),
    deleteTransaksjon: t => dispatch(deleteTransaksjon(t)),
    restoreTransaksjon: t => dispatch(restoreTransaksjon(t)),
    visHistorikk: t => dispatch(visHistorikk(t.id))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransaksjonPopup)
