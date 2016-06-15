import React, { Component } from 'react';

import Toastr from '../../../Toastr';
import styles from './ToastrPage.css';

import ToastrPageData from './ToastrPage.data';

export default class ToastrPage extends Component {

  render () {
    return (
      <div>
        <h1>Toastr</h1>
        <Toastr toasts={ ToastrPageData } />
      </div>
    );
  }

}
