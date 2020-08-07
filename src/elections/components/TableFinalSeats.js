import React, {Component} from 'react';

import {getPartyColor, getPartyList} from '../utils/party.js';
import {renderParty} from '../utils/render.js';

import ChartSeats from '../components/ChartSeats.js';

export default class TableFinalSeats extends Component {
  render() {
    let finalSeats = this.props.finalSeats;
    if (!finalSeats) {
      return null;
    }
    const partyList = getPartyList(finalSeats);

    const bySeatType = finalSeats['by_party'].reduce(
      function(bySeatType, x) {
        const partyCode = x['party_code'];
        bySeatType['Electoral District Seats'][partyCode] = x['seat_count'];
        bySeatType['National List Seats'][partyCode] =
          x['national_list_seat_count'];
        bySeatType['Total Seats'][partyCode] =
          x['seat_count'] + x['national_list_seat_count'];
        return bySeatType;
      },
      {
        'Electoral District Seats': {},
        'National List Seats': {},
        'Total Seats': {},
      },
    );

    const headerRow = (
      <tr>
        <th></th>
        {
          partyList.map(
            function(partyCode) {
              return (
                <td key={partyCode} className="td-header">
                  {renderParty(partyCode)}
                </td>
              );
            },
          )
        }
      </tr>
    );

    const rowList = Object.keys(bySeatType).map(
      function(seatType, i) {
        const className = (seatType === 'Total Seats') ? 'tr-total' : '';
        return (
          <tr key={seatType} className={className}>
            <td>{seatType}</td>
            {
              partyList.map(
                function(partyCode) {
                  const seatCount = bySeatType[seatType][partyCode];
                  const className = (seatCount === 0) ? 'div-percent-zero' : '';

                  let style = {}
                  if (seatType === 'Total Seats') {
                    style = {
                        backgroundColor: getPartyColor(partyCode, true, "50.0%"),
                    };
                  }


                  return (
                      <td
                        key={partyCode}
                        className={'td-seats ' + className}
                        style={style}
                      >
                        {seatCount}
                      </td>
                  );
                },
              )
            }
          </tr>
        );
      }
    )

    const table = (
      <table>
        <thead>{headerRow}</thead>
        <tbody>{rowList}</tbody>
      </table>
    )

    return (
      <div>
        <h1>Final Islandwide Results</h1>
        <ChartSeats result={finalSeats} />
        {table}
      </div>
    );
  }
}
