import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import {isUsingSubdomains} from '../appLink';

import styles from './styles.css';

export default class SubdomainDialog extends React.Component {

  state = {
    isOpen: false
  };

  open = () => {
    this.setState({
      isOpen: true
    });
  };

  close = () => {
    this.setState({
      isOpen: false
    });
  }

  render () {
    if (isUsingSubdomains()) {
      return (<span></span>);
    }

    const {isOpen} = this.state;
    return (
      <div>
        <a
          href='javascript:void(0)'
          onClick={this.open}
          title='Learn how to configure subdomain-based routing.'
          >
          {this.props.children}
        </a>
        <Dialog
          title='Proxy configuration'
          actions={this.renderDialogActions()}
          onRequestClose={this.close}
          open={isOpen}
          autoScrollBodyContent
          >
          {this.renderDialogContent()}
        </Dialog>
      </div>
    );
  }

  renderDialogContent () {
    const proxyPacLocation = this.getProxyPacLocation();

    return (
      <div className={styles.dialog}>
        <h3>For the best experience it is recommended to use subdomains-based routing.</h3>
        <p>
          Instead of: <code>{window.location.toString()}</code>
          <br />
          in your address bar you would see: <code>http://home.parity/</code>
        </p>
        <h3>To configure the routing use this <code>proxy.pac</code> file:</h3>
        <a target='proxy.pac' href={proxyPacLocation}><pre>{proxyPacLocation}</pre></a>
        <h3>Follow those links to learn how to configure your proxy settings:</h3>
        <ul>
          <li><a target='_blank' href='https://support.apple.com/kb/PH18553'>
            Mac OS X
          </a></li>
          <li><a target='_blank' href='http://xmodulo.com/how-to-set-up-proxy-auto-config-on-ubuntu-desktop.html'>
            Ubuntu
          </a></li>
          <li><a target='_blank' href='https://blogs.msdn.microsoft.com/ieinternals/2013/10/11/understanding-web-proxy-configuration/'>
            Windows
          </a></li>
        </ul>
      </div>
    );
  }

  getProxyPacLocation () {
    const loc = window.location;
    const host = loc.host;
    const protocol = loc.protocol;
    return `${protocol}//${host}/proxy/proxy.pac`;
  }

  renderDialogActions () {
    return [
      <FlatButton
        label='OK'
        primary
        onClick={this.close}
      />
    ];
  }

  static propTypes = {
    children: React.PropTypes.element.isRequired
  };

}
