import React, { Component } from 'react';
import { connect } from 'react-redux';

import {fetchTransaksjoner} from '../actions';
import {belopAccessor, timestampAccessor} from '../utils/accessors';
import '../../style/historikk.css'

let seq = 0;

class Historikk extends Component {
    componentWillMount() {
        if (this.props.transaksjoner.needsFetch) {
            this.props.dispatch(fetchTransaksjoner());
        }
    }
    
    renderTransaksjon(transaksjon) {
        return (
            <div key={seq++} className="transaksjon">
                <div className="lines">
                    {transaksjon.lines.map((line, i) => (
                        <div key={i} className="line">
                            <span>{line.label}:</span>
                            <span className={(line.changed ? " changed" : "")}>
                                {line.value}
                            </span>
                        </div>
                    ))}
                    <span className={"kommentar"+ (transaksjon.kommentar.changed ? " changed" : "")}>
                        {transaksjon.kommentar.value}
                    </span>
                </div>
            </div>
        );
            
    }

    forgjengere(transaksjon) {
        if (transaksjon.forgjenger){
            const forgjenger = this.props.transaksjoner.items.find(t => t.id === transaksjon.forgjenger)
            return [...this.forgjengere(forgjenger), forgjenger];
        } else {
            return [];
        }
    }

    etterkommere(transaksjon) {
        if (transaksjon.etterkommer){
            const etterkommer = this.props.transaksjoner.items.find(t => t.id === transaksjon.etterkommer)
            return [etterkommer, ...this.etterkommere(etterkommer)];
        } else {
            return [];
        }
    }

    transaksjoner() {
        const transaksjon = this.props.transaksjoner.items.find(t => t.id === this.props.match.params.transaksjonId);
        const historikk = [...this.forgjengere(transaksjon), transaksjon, ...this.etterkommere(transaksjon)];

        return historikk.map((t, i) => {
            const forgjenger = historikk[i === 0 ? i : i-1];

            return {
                lines: [
                    {
                        key: "fra",
                        label: "Fra"
                    },{
                        key: "til",
                        label: "Til"
                    },{
                        key: "belop",
                        accessor: belopAccessor,
                        label: "Beløp"
                    },{
                        key: "timestamp",
                        accessor: timestampAccessor,
                        label: "Dato"
                    }
                ].map(l => ({
                    label: l.label,
                    value: l.accessor ? l.accessor(t) : t[l.key],
                    changed: JSON.stringify(t[l.key]) !== JSON.stringify(forgjenger[l.key])
                })),
                kommentar: {
                    value: t.kommentar,
                    changed: t.kommentar !== forgjenger.kommentar
                }
            };
        });
    }

    render() {

        return this.props.transaksjoner.needsFetch || this.props.transaksjoner.isFetching
            ? <img src="/loading.gif" className="loading-gif" alt="Laster..."/> 
            : <div className="historikk">
                {this.transaksjoner().map(this.renderTransaksjon)}
             </div>;
    }
}

const mapStateToProps = state => ({
    transaksjoner: state.transaksjoner
});

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(Historikk)
