import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from "react-table";
import "react-table/react-table.css";

import EditTransferPopup from './EditTransferPopup';

import {fetchKontoer, fetchTransfers, editTransfer, putTransfer, deleteTransfer} from '../actions';
import {settlements} from '../utils/debts';

class Transfers extends Component {
    componentWillMount() {
        if (this.props.transfers.needsFetch){
            this.props.dispatch(fetchTransfers());
        }
        if (this.props.kontoer.needsFetch) {
            this.props.dispatch(fetchKontoer());
        }
    }

    renderSettlement(settlement) {
        if (!settlement) return null;
        return <div>
            {settlement.fra} skylder {settlement.til} {settlement.belop.toFixed(2)}
            </div>;
    }
    renderColumn (props) {
        return <div onClick={() => this.props.dispatch(editTransfer(props.original.id))}>
                {props.value}
            </div>;
    }
    columns = [
        {
            Header: "Tidspunkt",
            id: "timestamp",
            className: "timestamp",
            headerClassName: "timestamp",
            accessor: t => (t.timestamp || "").slice(0, 19),
            Cell: props => this.renderColumn(props)
        },{
            Header: "Fra",
            accessor: "fra",
            className: "konto",
            headerClassName: "konto",
            Cell: props => this.renderColumn(props)
        },{
            Header: "Til",
            accessor: "til",
            className: "konto",
            headerClassName: "konto",
            Cell: props => this.renderColumn(props)
        },{
            Header: "Beløp",
            id: "belop",
            className: "belop",
            headerClassName: "belop",
            accessor: t => t.belop.toFixed(2),
            Cell: props => this.renderColumn(props)
        },{
            Header: "Kommentar",
            accessor: "kommentar",
            className: "kommentar",
            headerClassName: "kommentar",
            Cell: props => this.renderColumn(props)
        }
    ];

    render() {
        return (
            <div className="transfers">
                {this.renderSettlement(settlements(this.props.transfers.items, this.props.kontoer.items))}
                <ReactTable 
                    data={this.props.transfers.items} 
                    columns={this.columns}
                    filterable
                    defaultSorted={[{id: "timestamp", desc: true}]}
                    loading={this.props.transfers.isFetching}
                />
                <EditTransferPopup
                    transfer={this.props.transfers.selectedTransfer}
                    onClose={() => this.props.dispatch(editTransfer(false))}
                    putTransfer={(id, t) => this.props.dispatch(putTransfer(id, t))}
                    deleteTransfer={t => this.props.dispatch(deleteTransfer(t))}
                    kontoer={this.props.kontoer}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    transfers: state.transfers,
    kontoer: state.kontoer
  });

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(Transfers)
