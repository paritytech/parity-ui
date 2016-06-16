import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import styles from './UnAuthorized.css';

export default class UnAuthorized extends Component {

  static propTypes = {
    ws: PropTypes.shape({
      token: PropTypes.string.isRequired
    }).isRequired,
    actions: PropTypes.shape({
      updateToken: PropTypes.func.isRequired
    }).isRequired
  }

  state = {
    token: this.props.ws.token,
    tokenInvalid: null,
    processing: false
  };

  componentWillReceiveProps (nextProps) {
    const { token } = nextProps.ws;
    this.setState({ token });
  }

  componentWillUnmount () {
    clearTimeout(this.tokenInvalidTimeout);
  }

  render () {
    const { processing, token } = this.state;
    return (
      <div className={ styles.container }>
        <h1>Not Authorized</h1>
        <p>Connections used by Signer UI are secured. You need to authorize this app.</p>
        <p>Please run <code className={styles.code}>$ parity signer new-token</code> to generate authorization token and paste the token below.</p>
        <TextField
          name='token'
          type='text'
          value={ token }
          disabled={ processing }
          onChange={ this.onTokenChange }
          floatingLabelText='Authorization Token'
        />
        <br />
        <RaisedButton
          primary
          onClick={ this.onSubmit }
          disabled={ processing || !token }
         >
         Authorize
        </RaisedButton>
        { this.renderInvalidToken() }
        { this.renderProcessing() }
      </div>
    );
  }

  onTokenChange = evt => {
    this.setState({ token: evt.target.value, tokenInvalid: false });
  }

  onSubmit = () => {
    const token = this.state.token.replace(/\s*\-*/g, '');
    this.setState({
      processing: true,
      tokenInvalid: false
    });
    this.props.actions.updateToken(token);

    // todo [adgo] - listen to event instead of timeout
    this.tokenInvalidTimeout = setTimeout(this.onTokenInvalid, 4000); // if token is valid this component should unmount. after 4 sconds we assume it's invalid.
  }

  renderProcessing () {
    if (!this.state.processing) {
      return null;
    }

    return (
      <span> Processing ...</span>
    );
  }

  renderInvalidToken () {
    if (!this.state.tokenInvalid) {
      return null;
    }

    return <span> The token is invalid or your node is not running.</span>;
  }

  onTokenInvalid = () => {
    this.setState({
      processing: false,
      tokenInvalid: true
    });
  }

}
