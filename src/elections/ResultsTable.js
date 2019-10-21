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
  getAggregateStats,
  getDisplayPartyList,
  getSortedPartyAndVotes,
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

    return (
      <tr>{
        [
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
            text="Other Parties"
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
          />,
          <CellHeader
            key={keyPrefix + 'header-registed-votes'}
            text="Registered Votes"
          />,
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

   * @param {array} displayPartyList
   * @param {object} votesByParty

   * @param {int} totalVotes
   * @param {int} rejectedVotes
   * @param {int} totalPolled
   * @param {int} registeredVoters

   * @return {jsx}
   **/
  renderRow(
      className,
      key,
      onMouseOver,
      onClick,
      label,

      displayPartyList,
      votesByParty,

      totalVotes,
      rejectedVotes,
      totalPolled,
      registeredVoters,
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
          valuePercent={votes / totalVotes}
          party={party}
          isWinningParty={party === winningParty}
        />
      );
    });
    const otherPartyVotes = totalVotes - displayPartyVotes;

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
            text={label}
          />,
        ].concat(_displayPartyList).concat([
          <CellNumberPercent
            key={key + '-other-party-votes'}
            value={otherPartyVotes}
            valuePercent={otherPartyVotes / totalVotes}
          />,
          <CellNumber
            key={key + '-total-votes'}
            value={totalVotes}
          />,
          <CellNumberPercent
            key={key + '-rejected-votes'}
            value={rejectedVotes}
            valuePercent={rejectedVotes / totalPolled}
          />,
          <CellNumberPercent
            key={key + '-total-polled-votes'}
            value={totalPolled}
            valuePercent={totalPolled / registeredVoters}
          />,
          <CellNumber
            key={key + '-total-registered-voters'}
            value={registeredVoters}
          />,
        ])}
      </tr>
    );
  }

  /**
   * @return {jsx}
   **/
  render() {
    // data
    const label = this.props.label;
    const keyPrefix = label + '-';
    const resultsByChild = this.props.resultsByChild;
    const childLabelField = this.props.childLabelField;

    const [
      votesByChildByParty,
      totalVotesByChild,
      votesByParty,
      totalVotes,
      rejectedVotes,
      totalPolled,
      registeredVoters,
    ] = getAggregateStats(resultsByChild, childLabelField);

    const displayPartyList = getDisplayPartyList(
        votesByParty,
        totalVotes,
    );

    const _tableRowList = resultsByChild.map(
        function(resultsForChild, i) {
          const key = 'table-row-' + i;
          const childLabel = resultsForChild[childLabelField];
          const summaryStats = resultsForChild['summary_stats'];

          const childTotalPolled = summaryStats['total_polled'];
          let childRegisteredVoters = summaryStats['registered_voters'];
          if (!childRegisteredVoters) {
            childRegisteredVoters = childTotalPolled;
          }

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
              displayPartyList,
              votesByChildByParty[childLabel],
              totalVotesByChild[childLabel],
              summaryStats['rejected_votes'],
              childTotalPolled,
              childRegisteredVoters,
          );
        }.bind(this),
    );

    const _totalsRow = this.renderRow(
        'tr-totals',
        keyPrefix + 'tr-totals',
        undefined,
        undefined,
        'Total Results',
        displayPartyList,
        votesByParty,
        totalVotes,
        rejectedVotes,
        totalPolled,
        registeredVoters,
    );

    // render
    return (
      <div className="div-results-table">
        <h2 className='h2-label'>{label}</h2>
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
