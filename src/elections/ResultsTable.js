/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {
  Cell,
  CellNumber,
  CellNumberPercent,
  CellPartyVotes,
} from './Cell.js';

import {
  CellHeader,
  CellHeaderParty,
} from './CellHeader.js';

import {
  DISPLAY_PARTY_THRESHOLD,
} from './Constants.js';

import {
  formatPercent,
  getAggregateStats,
  getDisplayPartyList,
  getSortedPartyAndVotes,
  formatTimestamp,
} from './DataUtils.js';

/* eslint-enable no-unused-vars */

/**
 * Displays a table of regions, with corresponding election
 * results.
 **/
export default class ResultsTable extends Component {
  /**
   * @param {object} props
   **/
  constructor(props) {
    super(props);
    this.state = {selectedRowIndex: -1};
  }

  /**
   * @param {array} displayPartyList
   * @return {jsx}
   **/
  renderHeaderRow(displayPartyList) {
    const label = this.props.label;
    const keyPrefix = label + '-';
    const otherPartyLabel = 'Other Parties (< ' +
      (DISPLAY_PARTY_THRESHOLD * 100).toFixed(0) + '%)';

    return (
      <tr>{
        [
          <CellHeader
            key={keyPrefix + 'header-result-code'}
            text=""
          />,
          <CellHeader
            key={keyPrefix + 'header-polling-division'}
            text="Polling Division"
          />,
        ].concat(
            displayPartyList.map(function(party, i) {
              const key = keyPrefix + 'header-party-' + i;
              return <CellHeaderParty key={key} party={party}/>;
            }),
        ).concat([
          <CellHeader
            key={keyPrefix + 'header-other-parties'}
            text={otherPartyLabel}
          />,
          <CellHeader
            key={keyPrefix + 'header-total-votes'}
            text="Total Votes"
          />,
          <CellHeader
            key={keyPrefix + 'header-rejected-votes'}
            text="Rejected Votes"
          />,
          <CellHeader
            key={keyPrefix + 'header-total-polled'}
            text="Total Polled"
          />
          // <CellHeader
          //   key={keyPrefix + 'header-registed-votes'}
          //   text="Registered Votes"
          // />,
        ])
      }</tr>
    );
  }

  /**
   * @param {string} className
   * @param {string} key
   * @param {function} onMouseOver
   * @param {function} onClick
   * @param {string} label
   * @param {string} resultCode

   * @param {array} displayPartyList
   * @param {object} votesByParty

   * @param {int} totalValid
   * @param {int} totalRejected
   * @param {int} totalPolled
   * @param {int} totalElectors

   * @return {jsx}
   **/
  renderRow(
      className,
      key,
      onMouseOver,
      onClick,
      label,
      resultCode,

      displayPartyList,
      votesByParty,

      totalValid,
      totalRejected,
      totalPolled,
      totalElectors
  ) {
    const sortedPartyAndVotes = getSortedPartyAndVotes(votesByParty);
    const winningParty = sortedPartyAndVotes[0][0];

    let displayPartyVotes = 0;
    const _displayPartyList = displayPartyList.map(function(party, i) {
      const key = 'display-parties-' + i;
      const votes = votesByParty[party];
      displayPartyVotes += votes;
      return (
        <CellPartyVotes
          key={key}
          value={votes}
          valuePercent={votes / totalValid}
          party={party}
          isWinningParty={party === winningParty}
        />
      );
    });
    const otherPartyVotes = totalValid - displayPartyVotes;
    
    if (label === 'Final Results') {
      className += ' tr-totals';
    }
    if (label === 'Postal Votes') {
      label = '✉ Postal Votes';
    }

    return (
      <tr
        className={className}
        key={key}
        onMouseOver={onMouseOver}
        onClick={onClick}
      >
        {[
          <Cell
            key={key + '-label'}
            text={resultCode}
          />,
          <Cell
            key={key + '-label'}
            text={label}
          />,
        ].concat(_displayPartyList).concat([
          <CellNumberPercent
            key={key + '-other-party-votes'}
            value={otherPartyVotes}
            valuePercent={otherPartyVotes / totalValid}
          />,
          <CellNumber
            key={key + '-total-votes'}
            value={totalValid}
          />,
          <CellNumberPercent
            key={key + '-rejected-votes'}
            value={totalRejected}
            valuePercent={totalRejected / totalPolled}
          />,
          <CellNumberPercent
            key={key + '-total-polled-votes'}
            value={totalPolled}
            valuePercent={totalPolled / totalElectors}
          />
          // <CellNumber
          //   key={key + '-total-registered-voters'}
          //   value={totalElectors}
          // />,
        ])}
      </tr>
    );
  }

  /**
   * @return {jsx}
   **/
  render() {
    // eslint-disable-next-line no-unused-vars
    const label = this.props.label;
    const childLabelPrefix = this.props.childLabelPrefix;
    const childCodeField = childLabelPrefix + '_code';
    const childLabelField = childLabelPrefix + '_name';

    const results = this.props.results;

    const [
      votesByParty,
      votesByChildByParty,

      totalValid,
      totalRejected,
      totalPolled,
      totalElectors

    ] = getAggregateStats(
        results,
        childLabelPrefix,
    );

    if (totalValid === 0) {
      return null;
    }

    const displayPartyList = getDisplayPartyList(
        votesByParty,
        totalValid,
    );
    
    const _tableRowList = results.map(
        function(result, i) {
          const key = 'table-row-' + i;
          const childLabel = result[childLabelField];
          const childResultCode = result[childCodeField];

          const summary = result['summary'];
          const electors = summary['electors'];
          if (electors === 0) {
            return null;
          }

          const rejected = summary['rejected'];
          const valid = summary['valid'];
          const polled = summary['polled'];

          const onClick = function(e) {
            this.props.onClickMap(childLabel);
          }.bind(this);

          const onMouseOver = function(e) {
            this.props.onSelectLabel(childLabel);
          }.bind(this);

          let className = '';
          if (childLabel === this.props.activeLabel) {
            className += ' tr-selected';
          }

          return this.renderRow(
              className,
              key,
              onMouseOver,
              onClick,
              childLabel,
              childResultCode,

              displayPartyList,
              votesByChildByParty[childResultCode],

              valid,
              rejected,
              polled,
              electors,
          );
        }.bind(this),
    );
    var postalVotes = 0;

      results.map(
        function(result, i) {
          if (result.pd_name === "Postal Votes") {
            return postalVotes = result.summary.electors;
          }
        }.bind(this)
    );
    
    const totalElectorsWithPostal = totalElectors;
    // const totalElectorsWithPostal = totalElectors + postalVotes;

    const _totalsRow = (this.props.showTotals) ?
      this.renderRow(
          'tr-totals',
          'table-row-totals',
          null,
          null,
          'Total',
          '',
          displayPartyList,
          votesByParty,

          totalValid,
          totalRejected,
          totalPolled,
          totalElectorsWithPostal
      ) : null;


    return (
      <div className="div-results-table div-results-view-item">
        <table>
          <tbody>
            {this.renderHeaderRow(displayPartyList)}
            {_tableRowList}
            {_totalsRow}
          </tbody>
        </table>
      </div>
    );
  }
}
