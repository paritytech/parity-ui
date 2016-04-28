
import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import ArrowUpwardIcon from 'material-ui/svg-icons/navigation/arrow-upward';

import {scrollTo} from './util';
import styles from './style.css';

export default class ScrollTopButton extends Component {

  constructor (...args) {
    super(...args);
    this.state = {};
  }

  componentDidMount () {
    window.addEventListener('scroll', ::this.handleScroll);
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', ::this.handleScroll);
  }

  render () {
    let hiddenClass = !this.state.showScrollButton ? styles.hidden : '';

    return (
      <IconButton
        className={`${styles.scrollButton} ${hiddenClass}`}
        onClick={() => scrollTo(document.body, 0, 300)}>
        <ArrowUpwardIcon />
      </IconButton>
    );
  }

  handleScroll (event) {
    let {scrollTop} = event.srcElement.body;

    if (!this.state.showScrollButton && scrollTop > 600) {
      this.setState({
        showScrollButton: true
      });
    }

    if (this.state.showScrollButton && scrollTop < 600) {
      this.setState({
        showScrollButton: false
      });
    }
  }

}
