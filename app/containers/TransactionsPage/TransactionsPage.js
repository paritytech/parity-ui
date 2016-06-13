import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import * as TransactionActions from '../../actions/transactions';

import Header from '../../components/Header';
import Transactions from '../../components/Transactions';

class TransactionsPage extends Component {
  render () {
    return (
      <div>
        <Transactions { ...this.props } />
      </div>
    );
  }
}

function mapStateToProps (state) {
  return state;
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(TransactionActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionsPage);
