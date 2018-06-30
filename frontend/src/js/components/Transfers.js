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
            {settlement.from} skylder {settlement.to} {settlement.amount.toFixed(2)}
            </div>;
    }

    columns = [
        {
            Header: "Fra",
            accessor: "from"
        },{
            Header: "Til",
            accessor: "to"
        },{
            Header: "Beløp",
            id: "amount",
            accessor: t => t.amount.toFixed(2)
        }
    ];

    render() {
        return (
            <div className="transfers">
                {this.renderSettlement(settlements(this.props.transfers.items))}
                Overføringer:
                {this.props.transfers.isFetching}
                <ReactTable 
                    data={this.props.transfers.items} 
                    columns={this.columns}
                    filterable
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
