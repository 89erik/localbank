import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from "react-table";
import "react-table/react-table.css";

import TransaksjonPopup from './TransaksjonPopup';
import {belopAccessor, timestampAccessor} from '../utils/accessors';

import {
    fetchTransaksjoner, 
    selectTransaksjon, 
    putTransaksjon, 
    deleteTransaksjon,
    visHistorikk
} from '../actions';
import {beregnGjeld} from '../utils/gjeld';
let seq=0;

class Transaksjoner extends Component {
    componentWillMount() {
        if (this.props.transaksjoner.needsFetch){
            this.props.dispatch(fetchTransaksjoner());
        }
    }

    renderGjeld(gjeld) {
        return gjeld
            .map(transaksjon => transaksjon.fra)
            .reduce((unike, n) => unike.includes(n) ? unike : [...unike, n], [])
            .map(navn => gjeld.filter(g => g.fra === navn))
            .reduce((l, ll) => [...l, ...ll], [])
            .map(transaksjon => (
                <div key={seq++}>
                    {transaksjon.fra} skylder {transaksjon.til} {transaksjon.belop.toFixed(2)}
                </div>
            ));
    }

    renderColumn (props) {
        const v = props.column.id === "belop" && props.original.valutta;
        const title = v.kurs && `Verdt ${props.original.belop.toFixed(2)} NOK etter kurs ${v.kurs} beregnet ${v.timestamp}, pluss 2% valuttapåslag fra banken`
        return <div 
                    title={title || null}
                    onClick={() => this.props.dispatch(selectTransaksjon(props.original.id))}>
                {props.value}
            </div>;
    }
    columns = [
        {
            Header: "Dato",
            id: "timestamp",
            className: "timestamp",
            headerClassName: "timestamp",
            accessor: timestampAccessor,
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
            accessor: belopAccessor,
            Cell: props => this.renderColumn(props)
        },{
            Header: "Kommentar",
            accessor: "kommentar",
            className: "kommentar",
            headerClassName: "kommentar",
            Cell: props => this.renderColumn(props),
            minWidth: 250
        }
    ];

    render() {
        return (
            <div className="transaksjoner">
                <div className="gjeld">
                    Gjeld (alt i NOK):
                    {this.renderGjeld(beregnGjeld(this.props.transaksjoner.items, this.props.kontoer))}
                </div>
                <ReactTable 
                    data={this.props.transaksjoner.items} 
                    columns={this.columns}
                    filterable
                    defaultSorted={[{id: "timestamp", desc: true}]}
                    loading={this.props.transaksjoner.isFetching}
                />
                <TransaksjonPopup
                    transaksjon={this.props.transaksjoner.selectedTransaksjon}
                    onClose={() => this.props.dispatch(selectTransaksjon(false))}
                    putTransaksjon={(id, t) => this.props.dispatch(putTransaksjon(id, t))}
                    deleteTransaksjon={() => this.props.dispatch(deleteTransaksjon(this.props.transaksjoner.selectedTransaksjon))}
                    visHistorikk={() => this.props.dispatch(visHistorikk(this.props.transaksjoner.selectedTransaksjon.id))}
                    kontoer={this.props.kontoer}
                    valuttaer={this.props.valuttaer}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    transaksjoner: state.transaksjoner,
    kontoer: state.kontekst.kontoer,
    valuttaer: state.kontekst.valuttaer
  });

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(Transaksjoner)
