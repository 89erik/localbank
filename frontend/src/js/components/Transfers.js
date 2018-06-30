import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from "react-table";
import "react-table/react-table.css";


import {fetchTransfers} from '../actions';
import {settlements} from '../utils/debts';

class Transfers extends Component {
    componentWillMount() {
        if (this.props.transfers.needsFetch){
            this.props.dispatch(fetchTransfers());
        }
    }

    renderSettlement(settlement) {
        if (!settlement) return null;
        return <div>
            {settlement.fra} skylder {settlement.til} {settlement.belop.toFixed(2)}
            </div>;
    }
    columns = [
        {
            Header: "Tidspunkt",
            accessor: "timestamp",
        },{
            Header: "Fra",
            accessor: "fra"
        },{
            Header: "Til",
            accessor: "til"
        },{
            Header: "Beløp",
            id: "belop",
            accessor: t => t.belop.toFixed(2)
        },{
            Header: "Kommentar",
            accessor: "kommentar",
        }
    ];

    render() {
        return (
            <div className="transfers">
                {this.renderSettlement(settlements(this.props.transfers.items))}
                {this.props.transfers.isFetching}
                <ReactTable 
                    data={this.props.transfers.items} 
                    columns={this.columns}
                    filterable
                    defaultSorted={[{id: "timestamp", desc: true}]}
                />
                
            </div>
        );
    }
}

const mapStateToProps = state => ({
    transfers: state.transfers
  });

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(Transfers)
