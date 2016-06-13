import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import styles from './Options.css';

export default class UnAuthorized extends Component {

  static propTypes = {
    proxy: PropTypes.string.isRequired,
    ws: PropTypes.shape({
      token: PropTypes.string.isRequired,
      port: PropTypes.number.isRequired
    }).isRequired,
    actions: PropTypes.shape({
      updateToken: PropTypes.func.isRequired,
      updatePort: PropTypes.func.isRequired,
      updateProxy: PropTypes.func.isRequired
    }).isRequired
  }

  state = {
    token: this.props.ws.token,
    port: this.props.ws.port,
    proxy: this.props.proxy,
    showToken: false,
    tokenInvalid: null,
    processingToken: false,
    processingPort: false,
    processingProxy: false
  };

  componentWillReceiveProps (nextProps) {
    const { token, port } = nextProps.ws;
    const { proxy } = nextProps;
    this.setState({ token, port, proxy });
  }

  componentWillUnmount () {
    clearTimeout(this.tokenInvalidTimeout);
  }

  render () {
    return (
      <div className={ styles.container }>
        { this.renderPortSection() }
        <hr />
        { this.renderProxySection() }
        <hr />
        { this.renderTokenSection() }
      </div>
    );
  }

  renderPortSection () {
    const { port } = this.state;
    return (
      <div>
        <h2>Port</h2>
        <TextField
          name='port'
          type='number'
          value={ port }
          onChange={ this.onPortChange }
          floatingLabelText='Port'
        />
        <br />
        <RaisedButton
          primary
          onClick={ this.onSubmitPort }
         >
         Submit Port
        </RaisedButton>
      </div>
    );
  }

  renderProxySection () {
    const { proxy } = this.state;
    return (
      <div>
        <h2>Proxy</h2>
        <TextField
          name='proxy'
          value={ proxy }
          onChange={ this.onProxyChange }
          floatingLabelText='Proxy'
        />
        <br />
        <RaisedButton
          primary
          onClick={ this.onSubmitProxy }
         >
         Submit proxy file url
        </RaisedButton>
      </div>
    );
  }

  renderTokenSection () {
    const { processingToken, showToken, token } = this.state;
    return (
      <div>
        <h2>Token</h2>
        <p>Generate a token by runing parity signer new-token</p>
        <TextField
          name='token'
          type={ showToken ? 'text' : 'password' }
          value={ token }
          disabled={ processingToken }
          onChange={ this.onTokenChange }
          floatingLabelText='Token'
        />
        <br />
        <div className={ styles.toggleToken }>
          <a onClick={ this.onToggleTokenVisibility }>
            { showToken ? 'Hide' : 'Show' } token
          </a>
        </div>
        <RaisedButton
          primary
          onClick={ this.onSubmitToken }
          disabled={ processingToken }
         >
         Submit Token
        </RaisedButton>
        { this.renderProcessingToken() }
        { this.renderInvalidToken() }
      </div>
    );
  }

  onSubmitPort = () => {
    const { port } = this.state;
    this.props.actions.updatePort(port);
  }

  onSubmitProxy = () => {
    const { proxy } = this.state;
    this.props.actions.updateProxy(proxy);
  }

  onTokenChange = evt => {
    this.setState({ token: evt.target.value });
  }

  onPortChange = evt => {
    this.setState({ port: evt.target.value });
  }

  onProxyChange = evt => {
    this.setState({ proxy: evt.target.value });
  }

  onToggleTokenVisibility = () => {
    const { showToken } = this.state;
    this.setState({ showToken: !showToken });
  }

  onSubmitToken = () => {
    const token = this.state.token.replace(/\s*\-*/g, '');
    this.setState({ processingToken: true });
    this.props.actions.updateToken(token);

    // todo [adgo] - listen to event instead of timeout
    this.tokenInvalidTimeout = setTimeout(this.onTokenInvalid, 4000); // if token is valid this component should unmount. after 4 sconds we assume it's invalid.
  }

  renderProcessingToken () {
    if (!this.state.processingToken) {
      return null;
    }

    return (
      <p>Processing ...</p>
    );
  }

  renderInvalidToken () {
    if (!this.state.tokenInvalid) {
      return null;
    }

    return <p>This token is invalid</p>;
  }

  onTokenInvalid = () => {
    this.setState({
      processing: false,
      tokenInvalid: true
    });
  }

}
