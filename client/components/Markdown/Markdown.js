
import marked from 'marked';
import React, {Component, PropTypes} from 'react';
import styles from './style.css';

export default class Marked extends Component {

  constructor (...args) {
    super(...args);
    this.state = {};
  }

  render () {
    let {parsed} = this.state;
    if (!parsed) {
      return null;
    }
    return <div className={styles.container} style={this.props.style} dangerouslySetInnerHTML={{__html: parsed}} />;
  }

  componentWillMount () {
    this.setState({parsed: this.parse(this.props.val)});
  }

  componentWillReceiveProps (newProps) {
    if (newProps.val === this.props.val) {
      return;
    }
    this.setState({parsed: this.parse(newProps.val)});
  }

  parse (val) {
    try {
      val = marked(val);
    } catch (err) {
      console.error(`Marked error when parsing ${val}: ${err}`);
    }
    return val;
  }

  static propTypes = {
    val: PropTypes.any,
    style: PropTypes.object
  }

}
