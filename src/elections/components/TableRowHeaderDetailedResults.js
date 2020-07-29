import React, {Component} from 'react';

import {renderParty} from '../utils/render.js';

export default class TableRowHeaderDetailedResults extends Component {
  render() {
    const partyList = this.props.partyList;
    const showSummary = this.props.showSummary;
    const showSeats = this.props.showSeats;
    const firstRowHeader = this.props.firstRowHeader;
    return [
      <tr key={'header-row-1'}>
        <th rowSpan={2}>{firstRowHeader}</th>
        {partyList.map(
          function(partyCode, i) {
            return (
              <td
                key={partyCode}
                className="td-header"
                colSpan={showSeats ? 2 : 1}
              >
                {renderParty(partyCode)}
              </td>
            );
          }
        )}
        {showSummary ?  ([
            'Electors',
            'Polled (Turnout)',
            'Valid',
            'Rejected',
        ].map(
          function(summaryField, i) {
            return (
              <th
                key={summaryField}
                className="td-header"
                rowSpan={2}
              >
                  {summaryField}
              </th>
            );
          },
        )) : null}
      </tr>,
      <tr key={'header-row-2'}>
        {partyList.map(
          function(partyCode, i) {
            const keyPrefix = partyCode;
            return [
              <th key={keyPrefix + '-votes'}>Votes</th>,
              showSeats ? (<th key={keyPrefix + '-seats'}>Seats</th>) : null,
            ];
          }
        )}
      </tr>
    ];
  }
}
