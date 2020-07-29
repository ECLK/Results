import React, {Component} from 'react';

import {getPartyColor} from '../utils/party.js';
import {parsePctStr} from '../utils/data.js';

function degToRad(deg) {
  return deg * Math.PI / 180.0;
}

export default class ChartPie extends Component {
  render() {
    const result = this.props.result;
    const r = 120;
    const cx = r;
    const cy = r;

    let theta = 0;
    const renderedArcs = result['by_party'].map(
      function(forParty, i) {
        const partyCode = forParty['party_code'];
        const votePercentage = forParty['vote_percentage'];
        const p = parsePctStr(votePercentage);
        const prevTheta = theta;
        const deltaTheta = p * 360;
        theta += deltaTheta;

        const thetaRad = degToRad(theta);
        const prevThetaRad = degToRad(prevTheta);

        const x0 = cx + r * Math.sin(prevThetaRad);
        const y0 = cy - r * Math.cos(prevThetaRad);

        const x1 = cx + r * Math.sin(thetaRad);
        const y1 = cy - r * Math.cos(thetaRad);

        const thetaMid = (prevThetaRad + thetaRad) / 2;

        const D_TEXT = 0.5;
        const x01 = cx + r * Math.sin(thetaMid) * D_TEXT;
        const y01 = cy - r * Math.cos(thetaMid) * D_TEXT;

        const xAxisRotation = 0;
        const largeArcFlag = (Math.abs(thetaRad - prevThetaRad) > Math.PI)
          ? 1
          : 0;
        const sweepFlag = (thetaRad > 0) ? 1: 0;

        const d = [
            `M ${cx}, ${cy}`,
            `L ${x0}, ${y0}`,
            `A ${r}, ${r}`,
            `${xAxisRotation}, ${largeArcFlag}, ${sweepFlag}, ${x1}, ${y1}`,
            `Z`,
        ].join(' ')

        const color = getPartyColor(partyCode, true, '50.00%');
        let label = '';
        let labelP = '';
        if (p >= 0.05) {
          label = partyCode;
          labelP = votePercentage;
        }

        const fontSize = Math.sqrt(p) * 24;

        return (
          <svg key={partyCode}>
            <path d={d} fill={color} stroke={'gray'} strokeWidth={0.5} />
            <text
              x={x01}
              y={y01 - fontSize / 2}
              fontSize={fontSize * 0.6}
              textAnchor={'middle'}
            >
              {label}
            </text>
            <text
              x={x01}
              y={y01 + fontSize / 2}
              fontSize={fontSize}
              textAnchor={'middle'}
            >
              {labelP}
            </text>
          </svg>
        );
      },
    )

    return (
      <svg height={r * 2} width={r * 2}>
        {renderedArcs}
      </svg>
    )
  }
}
