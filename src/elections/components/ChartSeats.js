import React, {Component} from 'react';

import {getPartyColor} from '../utils/party.js';

const BOX_DIM = 12;
const BOXES_PER_COLUMN = 10;

export default class ChartSeats extends Component {
  render() {
    const result = this.props.result;
    let x = 0;
    let y = 0;
    let cumSeatCount = 0;

    const renderedBoxList = result['by_party'].map(
      function(forParty, i) {
        const partyCode = forParty['party_code'];
        const color = getPartyColor(partyCode, true, '100.00%');
        const seatCount = forParty['seat_count']
          + forParty['national_list_seat_count'];

        if (seatCount === 0) {
          return [];
        }

        return (Array.from(Array(seatCount).keys())).map(
          function(i) {
            const renderedBox = (
              <circle
                key={partyCode + i}
                cx={x + BOX_DIM * 0.5}
                cy={y + BOX_DIM * 2}
                r={0.8 * BOX_DIM * 0.4}
                fill={color}
                stroke='gray'
              />
            );
            cumSeatCount += 1;
            y += BOX_DIM;
            if (y >= BOX_DIM * BOXES_PER_COLUMN) {
              x += BOX_DIM;
              y = 0;
            }

            if (cumSeatCount === 113) {
              x += BOX_DIM * 1.5;
            }

            if (cumSeatCount === 150) {
              x += BOX_DIM * 0.5;
            }

            if (cumSeatCount % 50 === 0) {
              x += BOX_DIM * 0.2;
            }

            if (cumSeatCount % 10 === 5) {
              y += BOX_DIM * 0.5;
            }

            return renderedBox;
          },
        )
      }
    );

    const width = BOX_DIM * (225 / BOXES_PER_COLUMN + 4) ;
    const height = BOX_DIM * (BOXES_PER_COLUMN + 3);
    const x12 = BOX_DIM * 12.6;
    const x23 = BOX_DIM * 17.3;
    return (
      <svg width={width} height={height} key={'ChartSeats'}>
        {renderedBoxList}
        <line
          x1={x12}
          x2={x12}
          y1={BOX_DIM * 1.5}
          y2={height}
          stroke={'gray'}
          strokeDasharray={'2,2'}
        />
        <text
          x={x12}
          y={BOX_DIM * 1.2}
          fill={'gray'}
          textAnchor={'middle'}
          fontSize={BOX_DIM * 0.6}
        >
          Majority
        </text>
        <line
          x1={x23}
          x2={x23}
          y1={BOX_DIM * 1.5}
          y2={height}
          stroke={'black'}
          strokeDasharray={'2,2'}
        />
        <text
          x={x23}
          y={BOX_DIM * 1.2}
          fill={'black'}
          textAnchor={'middle'}
          fontSize={BOX_DIM * 0.6}
        >
          Two-Thirds
        </text>
      </svg>
    )
  }
}
