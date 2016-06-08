import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import styles from './NotAuthorized.css';

export default class NotAuthorized extends Component {

	static propTypes = {
		token: PropTypes.string.isRequired
	}

	state = {
		token: this.props.token,
		tokenInvalid: null,
		processing: false
	};

	componentwillReceiveProps (nextProps) {
		const { token } = nextProps;
		this.setState({ token })
	}

	componentWillUnmount () {
		clearTimeout(this.tokenInvalidTimeout)
	}

	render () {
		const { processing, token } = this.state;
		return (
			<div className={ styles.container }>
				<h1>Not NotAuthorized</h1>
				<p>Generate a token by runing parity signer new-token</p>
				<TextField
					name='token'
					type='password'
					value={ token }
					disabled={ processing }
					onChange={ this.onTokenChange }
					floatingLabelText='Token'
				/>
				<br />
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

	onTokenChange = evt => {
		this.setState({ token: evt.target.value });
	}

	onSubmit = () => {
		const token = this.state.token.replace(/\s*\-*/g, '');
		this.props.submit(token);
		this.setState({ processing: true });
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
