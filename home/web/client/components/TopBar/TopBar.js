import React, { Component, PropTypes } from 'react';

import AppsIcon from './logo.svg';
import ReportProblem from 'material-ui/svg-icons/action/report-problem';
import SettingsIcon from 'material-ui/svg-icons/action/settings';

import { signerUrl } from '../../utils/signer';
import AccountChooser from '../AccountsChooser';
import AccountsDetails from '../AccountsDetails';
import SubdomainDialog from '../SubdomainDialog';
import CreateAccount from '../CreateAccount';
import StatusLine from '../StatusLine';
import DappNav from '../DappNav';
import ExtensionLink from '../ExtensionLink';
import { appLink } from '../../utils/appLink';

import styles from './TopBar.css';

export default class TopBar extends Component {

  static propTypes = {
    isDomReady: PropTypes.bool.isRequired,
    isLoadingExtensionInstalled: PropTypes.bool.isRequired,
    isExtenstionInstalled: PropTypes.bool.isRequired,
    accounts: PropTypes.arrayOf(PropTypes.string).isRequired,
    allAccounts: PropTypes.arrayOf(PropTypes.string).isRequired,
    accountsNames: PropTypes.object.isRequired,
    signerPort: PropTypes.number.isRequired,
    unsignedTransactionsCount: PropTypes.number.isRequired,
    onAccountsDetailsClose: PropTypes.func.isRequired,
    onChangeAccount: PropTypes.func.isRequired
  };

  state = {
    createAccountOpen: false,
    accountsDetailsOpen: false
  };

  render () {
    const { isDomReady, allAccounts, accountsNames, isLoadingExtensionInstalled, isExtenstionInstalled } = this.props;
    const { accountsDetailsOpen, createAccountOpen } = this.state;

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
            <DappNav onSearchActive={ this.onSearchActive }/>
            <div className={ this.state.searchActive ? styles.statusHidden : styles.statusVisible }>
              <StatusLine />
            </div>
            <div className={ styles.separator } />
            <div className={ styles.extension }>
              <ExtensionLink
                isLoading={ isLoadingExtensionInstalled }
                isInstalled={ isExtenstionInstalled }
              />
            </div>
          </div>
          { this.renderManageAccounts() }
        </div>
        <AccountsDetails
          open={ accountsDetailsOpen }
          accounts={ allAccounts }
          onOpenCreateAccount={ this.onOpenCreateAccount }
          accountsNames={ accountsNames }
          onClose={ this.onAccountsDetailsClose }
          />
        <CreateAccount
          open={ createAccountOpen }
          accounts={ allAccounts }
          onClose={ this.closeCreateAccount }
        />
      </div>
    );
  }

  renderUnconfirmedTransactions () {
    const { signerPort, unsignedTransactionsCount } = this.props;

    if (!signerPort) {
      return;
    }
    if (!unsignedTransactionsCount) {
      return (
        <div className={ styles.signerCount }></div>
      );
    }

    const port = signerPort;
    return (
      <div className={ styles.signerCount }>
        <a
          target={ '_signer' }
          href={ signerUrl(port) }
          title={ `There are ${unsignedTransactionsCount} transactions awaiting your confirmation.` }
        >
          <span>
            { unsignedTransactionsCount }
          </span>
        </a>
      </div>
    );
  }

  renderManageAccounts () {
    const { allAccounts, accountsNames, onChangeAccount } = this.props;

    if (!allAccounts.length) {
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
        <AccountChooser
          accounts={ allAccounts }
          accountsNames={ accountsNames }
          onChange={ onChangeAccount }
        />
        <a
          className={ styles.settings }
          href='javascript:void(0)'
          onClick={ this.onOpenAccountDetails }
          >
          <SettingsIcon />
        </a>
        { this.renderUnconfirmedTransactions() }
      </div>
    );
  }

  onSearchActive = active => {
    this.setState({
      searchActive: active
    });
  }

  onOpenAccountDetails = () => {
    this.setState({
      accountsDetailsOpen: true
    });
  }

  onAccountsDetailsClose = names => {
    this.setState({
      accountsDetailsOpen: false
    });
    this.props.onAccountsDetailsClose(names);
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
