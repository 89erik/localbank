import React from 'react';
import Popup from 'reactjs-popup';
import { reduxForm } from 'redux-form'
import renderTransaksjonForm from './renderTransaksjonForm';

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
        if ((this.props.transaksjon || {}).valutta) {
            return {
                ...this.props.transaksjon,
                belop: this.props.transaksjon.valutta.belop,
                valutta: this.props.transaksjon.valutta.navn
            }
        } else {
            return this.props.transaksjon
        }

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
                            onClick={() => this.closeWith(() => this.props.deleteTransaksjon(this.props.transaksjon))} 
                            className="Select-control"
                        >
                            Slett
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
