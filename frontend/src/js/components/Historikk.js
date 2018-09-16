import React, { Component } from 'react';
import { connect } from 'react-redux';

import {lastHistorikk} from '../actions';
import {belopAccessor, timestampAccessor} from '../utils/accessors';
import '../../style/historikk.css'

let seq = 0;

class Historikk extends Component {
    componentWillMount() {
        if (this.props.match.params.transaksjonId !== this.props.historikk.transaksjonId) {
            this.props.dispatch(lastHistorikk(this.props.match.params.transaksjonId));
        }
    }
    
    renderTransaksjon(t) {
        const transaksjon = [
            ["Fra", t.fra],
            ["Til", t.til],
            ["Beløp", belopAccessor(t)],
            ["Dato", timestampAccessor(t)]
        ];
        return (
            <div key={seq++} className="transaksjon">
                <div className="lines">
                    {transaksjon.map((line, i) => (
                        <div key={i} className="line">
                            <span>{line[0]}:</span>
                            <span>{line[1]}</span>
                        </div>
                    ))}
                    <span className="kommentar">{t.kommentar}</span>
                </div>
            </div>
        );
            
    }

    render() {
        return this.props.historikk.isFetching 
            ? <img src="/loading.gif" className="loading-gif" alt="Laster..."/> 
            : <div className="historikk">
                {this.props.historikk.items.map(this.renderTransaksjon)}
             </div>;
    }
}

const mapStateToProps = state => ({
    historikk: state.historikk
});

export default connect(
    mapStateToProps,
    dispatch => ({dispatch})
)(Historikk)
