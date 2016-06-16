import React, { Component } from 'react';

import Toast from '../../../Toast';
import styles from './ToastPage.css';

import ToastPageData from './ToastPage.data';

export default class ToastPage extends Component {

  render () {
    return (
      <div>
        <h1>Toast</h1>
        { this.renderToasts() }
      </div>
    );
  }

  renderToasts () {
    return ToastPageData.map(t => (
      <Toast { ...t } key={ t.id } onRemoveToast={ this.onRemoveToast } />
    ));
  }

  onRemoveToast = (id) => {
    alert('remove toast ' + id);
  }

}
