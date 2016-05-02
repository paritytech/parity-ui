
import React, { Component, PropTypes } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { sortBy, find, extend } from 'lodash';

import IconButton from 'material-ui/IconButton';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import CallIcon from 'material-ui/svg-icons/communication/call';
import AssignmentIcon from 'material-ui/svg-icons/action/assignment';
import InputIcon from 'material-ui/svg-icons/action/input';

import { hasScrollbar } from '../../provider/dom-provider';
import styles from './style.css';
import rpcData from '../../data/rpc.json';
const rpcMethods = sortBy(rpcData.methods, 'name');

export default class CallsToolbar extends Component {

  render () {
    const {call, callEl, containerEl} = this.props;
    if (!call) {
      return null;
    }

    const wrapStyle = {top: callEl.offsetTop - 22 - containerEl.scrollTop};
    if (hasScrollbar(containerEl)) {
      wrapStyle.right = 13;
    }

    return (
      <div
        className={styles.callActionsWrap}
        style={wrapStyle}
        >
        <IconButton className={styles.callActionsButton}><MoreHorizIcon /></IconButton>
        <div className={styles.callActions}>
          <IconButton
            className={styles.callAction}
            onClick={() => ::this.setCall(call)}
            tooltip='Set'
            tooltipPosition='top-left'
            >
            <InputIcon className={styles.callActionIcon} />
          </IconButton>
          <IconButton
            className={styles.callAction}
            onClick={() => ::this.makeCall(call)}
            tooltip='Fire again'
            tooltipPosition='top-left'
            >
            <CallIcon className={styles.callActionIcon} />
          </IconButton>
          <CopyToClipboard
            text={JSON.stringify(call)}
            onCopy={() => this.props.actions.addToast('Method copied to clipboard!')}
            >
            <IconButton
              className={styles.callAction}
              tooltip='Copy to clipboard'
              tooltipPosition='top-left'
              >
              <AssignmentIcon className={styles.callActionIcon}/>
            </IconButton>
          </CopyToClipboard>
        </div>
      </div>
    );
  }

  setCall (call) {
    let method = find(rpcMethods, {name: call.name});
    this.props.actions.selectRpcMethod(extend({}, method, {paramsValues: call.params}));
  }

  makeCall (call) {
    this.setCall(call);
    let method = find(rpcMethods, {name: call.name});
    this.props.actions.fireRpc({
      method: method.name,
      outputFormatter: method.outputFormatter,
      inputFormatters: method.inputFormatters,
      params: call.params
    });
  }
}

CallsToolbar.propTypes = {
  call: PropTypes.object.isRequired,
  callEl: PropTypes.node.isRequired,
  containerEl: PropTypes.node.isRequired,
  actions: PropTypes.shape({
    fireRpc: PropTypes.func.isRequired,
    selectRpcMethod: PropTypes.func.isRequired,
    addToast: PropTypes.func.isRequired
  }).isRequired
};
