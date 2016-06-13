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
    showToken: false,
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
    const { processing, token, showToken } = this.state;
    return (
      <div className={ styles.container }>
        <h1>Not Authorized</h1>
        <p>Generate a token by runing parity signer new-token</p>
        <TextField
          name='token'
          type={ showToken ? 'text' : 'password' }
          value={ token }
          disabled={ processing }
          onChange={ this.onTokenChange }
          floatingLabelText='Token'
        />
        <br />
        <div className={ styles.toggleToken }>
          { this.renderToggleTokenVisibility() }
        </div>
        <RaisedButton
          primary
          onClick={ this.onSubmit }
          disabled={ processing }
         >
         Submit
        </RaisedButton>
        { this.renderProcessing() }
        { this.renderInvalidToken() }
      </div>
    );
  }

  renderToggleTokenVisibility () {
    if (!this.state.token || !this.state.token.length) {
      return;
    }
    const { showToken } = this.state;
    return (
      <a onClick={ this.onToggleToken }>
        { showToken ? 'Hide' : 'Show' } token
      </a>
    );
  }

  onTokenChange = evt => {
    this.setState({ token: evt.target.value });
  }

  onToggleToken = () => {
    const { showToken } = this.state;
    this.setState({ showToken: !showToken });
  }

  onSubmit = () => {
    const token = this.state.token.replace(/\s*\-*/g, '');
    this.setState({ processing: true });
    this.props.actions.updateToken(token);

    // todo [adgo] - listen to event instead of timeout
    this.tokenInvalidTimeout = setTimeout(this.onTokenInvalid, 4000); // if token is valid this component should unmount. after 4 sconds we assume it's invalid.
  }

  renderProcessing () {
    if (!this.state.processing) {
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
