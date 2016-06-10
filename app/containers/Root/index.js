export default from './Root';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import assign from 'lodash.assign';

import MainSection from '../../components/MainSection';
import * as TransactionActions from '../../actions/transactions';
import * as WsActions from '../../actions/ws';
import style from './Root.css';

@connect(
  state => ({
    transactions: state.transactions,
    ws: state.ws
  }),
  dispatch => ({
    actions: bindActionCreators(assign({}, TransactionActions, WsActions), dispatch)
  })
)

export default class Root extends Component {

  static propTypes = {
    transactions: PropTypes.object.isRequired,
    ws: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    const { actions, transactions, ws } = this.props;
    return (
      <div className={style.normal}>
        <MainSection
          transactions={ transactions }
          actions={ actions }
          ws={ ws }
        />
      </div>
    );
  }
}
