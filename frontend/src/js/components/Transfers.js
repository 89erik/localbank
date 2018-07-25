import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from "react-table";
import "react-table/react-table.css";

import EditTransferPopup from './EditTransferPopup';

import {
    fetchValuttaer,
    fetchKontoer, 
    fetchTransfers, 
    editTransfer, 
    putTransfer, 
    deleteTransfer
} from '../actions';
import {beregnGjeld} from '../utils/gjeld';
let seq=0;

class Transfers extends Component {
    componentWillMount() {
        if (this.props.transfers.needsFetch){
            this.props.dispatch(fetchTransfers());
        }
        if (this.props.kontoer.needsFetch) {
            this.props.dispatch(fetchKontoer());
        }
        if (this.props.valuttaer.needsFetch) {
            this.props.dispatch(fetchValuttaer());
        }
    }

    renderGjeld(gjeld) {
        return gjeld
            .map(overforing => overforing.fra)
            .reduce((unike, n) => unike.includes(n) ? unike : [...unike, n], [])
            .map(navn => gjeld.filter(g => g.fra === navn))
            .reduce((l, ll) => [...l, ...ll], [])
            .map(overforing => (
                <div key={seq++}>
                    {overforing.fra} skylder {overforing.til} {overforing.belop.toFixed(2)}
                </div>
            ));
    }

    renderColumn (props) {
        const v = props.column.id === "belop" && props.original.valutta;
        const title = v && `Verdt ${props.original.belop.toFixed(2)} NOK etter kurs ${v.kurs} beregnet ${v.timestamp}, pluss 2% valuttapåslag fra banken`
        return <div 
                    title={title || null}
                    onClick={() => this.props.dispatch(editTransfer(props.original.id))}>
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
            accessor: t => t.valutta ? `${t.valutta.belop.toFixed(2)} ${t.valutta.navn}` : t.belop.toFixed(2),
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
                <div className="gjeld">
                    Gjeld (alt i NOK):
                    {this.renderGjeld(beregnGjeld(this.props.transfers.items, this.props.kontoer.items))}
                </div>
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
                    valuttaer={this.props.valuttaer}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    transfers: state.transfers,
    kontoer: state.kontoer,
    valuttaer: state.valuttaer
  });

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(Transfers)
