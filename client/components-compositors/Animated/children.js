
import React, { Component, PropTypes } from 'react';
import { isReactComponent } from '../../util/react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './style.css';

export default class AnimateChildren extends Component {
  render () {
    const className = this.props.absolute ? 'absoluteAnimationContainer' : '';
    return (
      <ReactCSSTransitionGroup
        component='div'
        className={className}
        transitionName='transition'
        transitionAppear
        transitionAppearTimeout={0}
        transitionLeaveTimeout={0}
        transitionEnterTimeout={0}
        >
        {this.renderChildren()}
      </ReactCSSTransitionGroup>
    );
  }

  renderChildren () {
    const { children } = this.props;
    // cloning element and passing props to non components will throw invariant error
    return !isReactComponent(children) ? children
      : React.cloneElement(this.props.children, { ...this.props });
  }
}

AnimateChildren.propTypes = {
  children: PropTypes.any.isRequired,
  absolute: PropTypes.bool
};
