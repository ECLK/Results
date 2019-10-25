// eslint-disable-next-line no-unused-vars
import React, {Component, JSX} from 'react';

import {COLOR} from './Constants.js';

import {formatPercent} from './DataUtils.js';

import PARTY_TO_HUE from './data/party_to_hue.json';


/**
 * Simple table cell
 */
export class Cell extends Component {
  /**
   * @return {jsx}
   */
  render() {
    return (
      <td
        className='td-simple'
        onClick={this.props.onClick}
      >
        {this.props.text}
      </td>
    );
  }
}

/**
 * Simple table cell for number. Aligns right.
 */
export class CellNumber extends Component {
  /**
   * @return {jsx}
   */
  render() {
    const text = this.props.value.toLocaleString();
    return <td className='td-number'>{text}</td>;
  }
}

/**
 * Simple table cell for number, and percentage.
 * Percentage is displayed below the number in a smaller font.
 */
export class CellNumberPercent extends Component {
  /**
   * @return {jsx}
   */
  render() {
    const textValue = this.props.value.toLocaleString();
    const textPercent = formatPercent(this.props.valuePercent);
    return (<td className='td-number'>
      <div>
        {textValue}
      </div>
      <div className='td-number-percent'>
        {textPercent}
      </div>
    </td>);
  }
}

/**
 * Simple table cell for number of votes by party, and percentage.
 * Percentage is displayed below the number in a smaller font.
 * If the party is the winning party, cell background is changed
 * to the color of the party.
 */
export class CellPartyVotes extends Component {
  /**
   * @return {jsx}
   */
  render() {
    let value = this.props.value;
    let percent = this.props.valuePercent;
    if (!value) {
      value = 0;
      percent = 0;
    }

    const textValue = value.toLocaleString();
    const textPercent = formatPercent(percent);
    const isWinningParty = this.props.isWinningParty;
    const party = this.props.party;

    const className = 'td-number';
    let color = 'white';
    if (isWinningParty) {
      const h = PARTY_TO_HUE[party];
      color = 'hsla(' +
        h + ',' +
        COLOR.PARTY_HSLA.S + ',' +
        COLOR.PARTY_HSLA.L + ',' +
        COLOR.PARTY_HSLA.A + ')';
    }

    return (<td className={className} style={{backgroundColor: color}}>
      <div>
        {textValue}
      </div>
      <div className='td-number-percent'>
        {textPercent}
      </div>
    </td>);
  }
}
