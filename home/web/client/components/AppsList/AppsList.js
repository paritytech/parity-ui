import React from 'react';

import { GridList, GridTile } from 'material-ui/GridList';

import { appLink } from '../../utils/appLink';

import styles from './AppsList.css';

export default class AppsList extends React.Component {

  render () {
    return (
      <div className={ styles.container }>
        <GridList cellHeight={ 200 } cols={ 2 }>
          { this.props.apps.map(app => this.renderApp(app)) }
        </GridList>
      </div>
    );
  }

  renderApp (app) {
    return (
      <a href={ appLink(app.id) } key={ app.id }>
        <GridTile
          key={ app.id }
          title={ this.renderName(app) }
          subtitle={ this.renderDescription(app) }
          >
          <div
            className={ styles.image }
            style={ { backgroundImage: `url(${appLink(app.id)}${app.iconUrl})` } }
            />
        </GridTile>
      </a>
    );
  }

  renderName (app) {
    return (
      <span>
        { app.name }
        <span
          className={ styles.author }
          title={ app.author }
          > by { app.author }</span>
      </span>
    );
  }

  renderDescription (app) {
    return (
      <span>
        { app.description }
        <span className={ styles.version }> { app.version }</span>
      </span>
    );
  }

  static propTypes = {
    apps: React.PropTypes.array.isRequired
  };

}
