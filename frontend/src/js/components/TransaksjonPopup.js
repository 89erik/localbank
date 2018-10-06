import React from 'react';
import Popup from 'reactjs-popup';
import { reduxForm } from 'redux-form'
import renderTransaksjonForm, {valuttaAsOption} from './renderTransaksjonForm';

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
        return this.props.transaksjon.deleted;
    }

    render() {
        return (
            <Popup open={!!this.props.transaksjon} onClose={this.props.onClose}>
                <EditTransaksjonForm 
                    onSubmit={transaksjon => this.closeWith(() => this.save(transaksjon))}
                    initialValues={this.editableTransaksjon()}
                    kontoer={this.props.kontoer}
                    valuttaer={this.props.valuttaer}
                    renderAmendments={() => [
                        <button 
                            key="delete"
                            onClick={() => this.closeWith(this.erSlettet() ? this.props.restoreTransaksjon : this.props.deleteTransaksjon)}
                            className="Select-control"
                        >
                            {this.erSlettet() ? "Gjenopprett" : "Slett"}
                        </button>,
                        this.harHistorikk() && <button
                            key="historikk"
                            onClick={() => this.closeWith(this.props.visHistorikk)}
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


export default TransaksjonPopup;
