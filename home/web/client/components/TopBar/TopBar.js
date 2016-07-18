import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import AppsIcon from './logo.svg';
import ReportProblem from 'material-ui/svg-icons/action/report-problem';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import AccountsChooser from '../AccountsChooser';
import UnconfirmedTransactions from '../UnconfirmedTransactions';
import AccountsDetails from '../AccountsDetails';
import SubdomainDialog from '../SubdomainDialog';
import CreateAccount from '../CreateAccount';
import StatusLine from '../StatusLine';
import DappsNav from '../DappsNav';
import ExtensionLink from '../ExtensionLink';
import { appLink } from '../../utils/appLink';

import styles from './TopBar.css';

export default class TopBar extends Component {

  static propTypes = {
    isDomReady: PropTypes.bool.isRequired,
    noAccounts: PropTypes.bool.isRequired
  };

  state = {
    DappsNavOpen: false,
    createAccountOpen: false,
    accountsDetailsOpen: false
  };

  render () {
    const { isDomReady } = this.props;
    const { accountsDetailsOpen, createAccountOpen, DappsNavOpen } = this.state;

    if (!isDomReady) {
      return (
        <div className={ styles.topbar }>
          <h4 className={ styles.header }>Loading...</h4>
        </div>
      );
    }

    return (
      <div>
        <div className={ styles.topbar }>
          <div className={ styles.header }>
            <a
              href={ appLink('home') }
              onClick={ this.forceNavigation }
              title='Home @ Parity'
              >
              <img src={ AppsIcon } className={ styles.dapps } />
            </a>
            <div className={ styles.dialog }>
              <SubdomainDialog>
                <ReportProblem />
              </SubdomainDialog>
            </div>
            <DappsNav
              onOpen={ this.onOpenDappsNav }
              onClose={ this.onCloseDappsNav }
              open={ DappsNavOpen }
            />
            <div className={ DappsNavOpen ? styles.statusHidden : styles.statusVisible }>
              <StatusLine />
            </div>
            <div className={ styles.separator } />
            <div className={ styles.extension }>
              <ExtensionLink />
            </div>
          </div>
          { this.renderManageAccounts() }
        </div>
        <AccountsDetails
          open={ accountsDetailsOpen }
          onOpenCreateAccount={ this.onOpenCreateAccount }
          onClose={ this.onCloseAccountsDetails }
          />
        <CreateAccount
          open={ createAccountOpen }
          onClose={ this.closeCreateAccount }
        />
      </div>
    );
  }

  renderManageAccounts () {
    const { noAccounts } = this.props;

    if (noAccounts) {
      return (
        <div className={ styles.link }>
          <a onClick={ this.onOpenCreateAccount }>
            Create Account
          </a>
        </div>
      );
    }

    return (
      <div className={ styles.nowrap }>
        <AccountsChooser />
        <a
          className={ styles.settings }
          href='javascript:void(0)'
          onClick={ this.onOpenAccountDetails }
          >
          <SettingsIcon />
        </a>
        <UnconfirmedTransactions />
      </div>
    );
  }

  onOpenDappsNav = () => {
    this.setState({
      DappsNavOpen: true
    });
  }

  onCloseDappsNav = () => {
    this.setState({
      DappsNavOpen: false
    });
  }

  onOpenAccountDetails = () => {
    this.setState({
      accountsDetailsOpen: true
    });
  }

  onCloseAccountsDetails = () => {
    this.setState({
      accountsDetailsOpen: false
    });
  }

  closeCreateAccount = () => {
    this.setState({ createAccountOpen: false });
  }

  onOpenCreateAccount = () => {
    this.setState({ createAccountOpen: true });
  }

  forceNavigation = () => {
    window.location.reload(true);
  }

}

function mapStateToProps (state) {
  return {
    isDomReady: state.dom.isReady,
    noAccounts: !state.rpc.accounts.length
  };
}

export default connect(
  mapStateToProps
)(TopBar);
