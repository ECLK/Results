// eslint-disable-next-line no-unused-vars
import React, {Component, JSX} from 'react';
/**
 * Simple table header cell
 */
export class CellHeader extends Component {
  /**
   * @return {jsx}
   */
  render() {
    return <th>{this.props.text}</th>;
  }
}

/**
 * Simple table header cell for party name
 * Image for party symbol is also rendered
 */
export class CellHeaderParty extends Component {
  /**
   * @return {jsx}
   */
  render() {
    const party = this.props.party;
    const PARTY_LOGO_DIR = './images/party_logos';
    let img = null;
    try {
      const imgSrc = require(PARTY_LOGO_DIR + '/logo_' + party + '.png');
      img = (
        <img
          className="img-logo"
          src={imgSrc}
          alt={party}
        />
      );
    } catch (e) {}

    return (
      <th>
        <div>{img}</div>
        <div>{party}</div>
      </th>
    );
  }
}
