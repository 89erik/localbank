import React from 'react';
import Popup from 'reactjs-popup';
import { Field, reduxForm } from 'redux-form'
import renderTransferForm from './renderTransferForm';

class EditTransferPopup extends React.Component {
    closeWith(closeAction) {
        closeAction();
        this.props.onClose();
    }
    save(dtoTransfer) {
        const transfer = {
            ...dtoTransfer,
            fra: {value: dtoTransfer.fra.value || dtoTransfer.fra},
            til: {value: dtoTransfer.til.value || dtoTransfer.til}
        };

        this.props.putTransfer(this.props.transfer.id, transfer);
    }
    render() {
        return (
            <Popup open={!!this.props.transfer} onClose={this.props.onClose}>
                <EditTransferForm 
                    onSubmit={transfer => this.closeWith(() => this.save(transfer))}
                    initialValues={this.props.transfer}
                    kontoer={this.props.kontoer}
                    renderAmendments={() => [
                        <button 
                            key="delete"
                            onClick={() => this.closeWith(() => this.props.deleteTransfer(this.props.transfer))} 
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

const EditTransferForm = reduxForm({
    form: 'editTransfer'
})(renderTransferForm);


export default EditTransferPopup;
