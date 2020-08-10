import React, {Component} from 'react';

import RESULT_TYPE from '../constants/RESULT_TYPE.js';

import {mapReduce} from '../utils/data.js';
import {getPartyColor, getWinningParty} from '../utils/party.js';
import {renderEmptyCell, renderPercent, renderRegion} from '../utils/render.js';

export default class TableRowDetailedResults extends Component {
  render() {
    const result = this.props.result;
    const partyList = this.props.partyList;
    const regionCodeField = this.props.regionCodeField;

    const summary = result['summary'];
    const regionCode = result[regionCodeField];
    const winPartyCode = getWinningParty(result);
    const partyToResult = mapReduce(
      result['by_party'],
      x => x['party_code'],
      x => x[0],
    );
    const isDisplaySeats = (result['type'] === RESULT_TYPE.RE_S)
      || (result['type'] === RESULT_TYPE.RN_SI);

    return (
      <tr
        id={regionCode}
        key={'DetailedResults-' + regionCode}
        className={regionCode ? '' : 'tr-total'}
      >
        <td key={'region-name'} className="td-region">
          {isDisplaySeats ? regionCode ? (renderRegion(regionCode)) : 'Islandwide' : regionCode ? (renderRegion(regionCode)) : 'Districtwide' }
        </td>
        {partyList.map(
          function(partyCode, j) {
            const partyResult = partyToResult[partyCode];
            const keyPrefix = partyCode + '-' + j;
            if (!partyResult) {
              return [
                (
                  <td key={keyPrefix + '-votes'} className='td-number'>
                    {renderEmptyCell()}
                  </td>
                ),
                (isDisplaySeats) ? (
                  <td key={keyPrefix + '-seats'} className='td-seats'>
                    {renderEmptyCell()}
                  </td>
                ) : null,
              ];
            }
            const voteCount = partyResult['vote_count'];
            const votePercentage = partyResult['vote_percentage'];
            const seatCount = partyResult['seat_count'];
            const isWin = (winPartyCode === partyCode);
            const style = {
              backgroundColor: getPartyColor(partyCode, isWin, votePercentage),
            }

            return [
              (
                <td key={keyPrefix + '-votes'} style={style}>
                  {renderPercent(voteCount, votePercentage)}
                </td>
              ),
              (isDisplaySeats) ? (
                <td
                  key={keyPrefix + '-seats'}
                  className='td-seats'
                  style={style}
                >
                  {seatCount}
                </td>
              ) : null,
            ];
          },
        )}
        {summary ? [
          ['electors', null],
          ['polled', 'percent_polled'],
          ['valid', 'percent_valid'],
          ['rejected', 'percent_rejected'],
        ].map(
          function([numeratorField, percentField], j) {
            return (
              <td key={numeratorField} className="td-number">
                {renderPercent(summary[numeratorField], summary[percentField])}
              </td>
            );
          },
        ) : null}
      </tr>
    );
  }
}
