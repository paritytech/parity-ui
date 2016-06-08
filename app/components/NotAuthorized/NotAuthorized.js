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
		processing: false
	};

	componentwillReceiveProps (nextProps) {
		const { token } = nextProps;
		this.setState({ token })
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
	}

	renderProcessing () {
		if (!this.state.processing) {
			return null;
		}

		return (
			<span>Processing ...</span>
		);
	}

}
