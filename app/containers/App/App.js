import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MainSection from '../../components/MainSection';
import * as TransactionActions from '../../actions/transactions';
import style from './App.css';

@connect(
  state => ({
    transactions: state.transactions
  }),
  dispatch => ({
    actions: bindActionCreators(TransactionActions, dispatch)
  })
)

export default class App extends Component {

  static propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    const { actions, transactions } = this.props;
    return (
      <div className={style.normal}>
        <MainSection
          transactions={ transactions }
          actions={ actions }
        />
      </div>
    );
  }
}
