// eslint-disable-next-line no-unused-vars
import React, {Component} from 'react';

import {
  COLOR,
  DISPLAY_PARTY_THRESHOLD,
} from './Constants.js';

import {
  formatPercent,
  getAggregateStats,
} from './DataUtils.js';

import PARTY_TO_HUE from './data/party_to_hue.json';

const LIGHT_GRAY = '#f0f0f0';
const DARK_GRAY = '#808080';

const STYLE_CIRCLE_BORDER = {
  fill: LIGHT_GRAY,
  stroke: 'none',
};

const STYLE_LINE_MIDLINE = {
  stroke: 'black',
  strokeWidth: 2,
  strokeDasharray: '2,2',
};

const STYLE_TEXT = {
  fontSize: '12px',
  textAnchor: 'middle',
  alignmentBaseline: 'center',
};

const STYLE_TEXT_P = {
  fontSize: '18px',
  textAnchor: 'middle',
  alignmentBaseline: 'center',
};

const STYLE_TEXT_TOTAL = {
  fontSize: '10px',
  textAnchor: 'middle',
  alignmentBaseline: 'center',
};

/**
 * Displays a pie chart
 **/
export default class ResultsPieChart extends Component {
  /**
   * @return {jsx}
  **/
  render() {
    const r = 120;
    const cx = r;
    const cy = r;

    const childLabelField = this.props.childLabelField;
    const partyResults = this.props.partyResults;
    const summaryResults = this.props.summaryResults;

    const [
      // eslint-disable-next-line no-unused-vars
      votesByParty,
      // eslint-disable-next-line no-unused-vars
      votesByChildByParty,

      totalValid,
      // eslint-disable-next-line no-unused-vars
      totalRejected,
      // eslint-disable-next-line no-unused-vars
      totalPolled,
      // eslint-disable-next-line no-unused-vars
      totalElectors,
      // eslint-disable-next-line no-unused-vars
      combinedResults,

    ] = getAggregateStats(
        partyResults,
        summaryResults,
        childLabelField,
    );

    // eslint-disable-next-line no-unused-vars
    const [arcList, textList, theta2] = Object.entries(votesByParty).sort(
        function([party, votes], [party2, votes2]) {
          return votes2 - votes;
        }
    ).reduce(
        function([arcList, textList, theta2], [party, votes], i) {
          let backgroundColor = DARK_GRAY;
          if (party in PARTY_TO_HUE) {
            const h = PARTY_TO_HUE[party];
            backgroundColor = 'hsla(' +
              h + ',' +
              COLOR.PARTY_HSLA.S + ',' +
              COLOR.PARTY_HSLA.L + ',' +
              COLOR.PARTY_HSLA.A + ')';
          }

          const theta1 = theta2;
          const pProjection = votes / totalValid;
          theta2 = theta1 + pProjection;

          const r2 = r * 0.5;
          const thetaToCoords = function(theta) {
            const thetaRad = theta * Math.PI * 2;
            return [
              (cx - r2 * Math.sin(thetaRad)),
              (cy - r2 * Math.cos(thetaRad)),
            ];
          };
          const [x, y] = thetaToCoords((theta1 + theta2) / 2);

          let label = '';
          let labelP = '';
          let labelTotal = '';
          if (pProjection > DISPLAY_PARTY_THRESHOLD) {
            label = party;
            labelP = formatPercent(pProjection);
            labelTotal = votes.toLocaleString();
          }

          const arcProjection = (
            <Arc
              cx={cx}
              cy={cy}
              r={r}
              theta1={theta1}
              theta2={theta2}
              backgroundColor={backgroundColor}
              opacity={0.5}
            />
          );
          arcList.push(arcProjection);
          const text = (
            <svg>
              <text
                x={x}
                y={y - 18}
                style={STYLE_TEXT}
              >
                {label}
              </text>
              <text
                x={x}
                y={y}
                style={STYLE_TEXT_P}
              >
                {labelP}
              </text>
              <text
                x={x}
                y={y + 18}
                style={STYLE_TEXT_TOTAL}
              >
                {labelTotal}
              </text>
            </svg>
          );
          textList.push(text);

          return [arcList, textList, theta2];
        },
        [[], [], 0],
    );

    return (
      <div className="svg-results-pie-chart div-results-view-item">
        <svg height={r * 2} width={r * 2}>
          <circle
            cx={cx}
            cy={cy}
            r={r}
            style={STYLE_CIRCLE_BORDER}
          />

          {arcList}
          <line
            x1={cx}
            y1={cy - r}
            x2={cx}
            y2={cy + r}
            style={STYLE_LINE_MIDLINE}
          />
          {textList}
        </svg>
      </div>
    );
  }
}

/**
 * Displays circle segment
 **/
// eslint-disable-next-line no-unused-vars, require-jsdoc
class Arc extends Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    const cx = this.props.cx;
    const cy = this.props.cy;
    const r = this.props.r;

    const thetaToCoords = function(theta) {
      const thetaRad = theta * Math.PI * 2;
      return [
        (cx - r * Math.sin(thetaRad)),
        (cy - r * Math.cos(thetaRad)).toFixed(2),
      ];
    };

    const theta1 = this.props.theta1;
    const theta2 = this.props.theta2;

    const [x1, y1] = thetaToCoords(theta1);
    const [x2, y2] = thetaToCoords(theta2);
    const largeArc = (Math.abs(theta2 - theta1) > 0.5) ? 1 : 0;
    const sweep = (theta2 < 0) ? 1: 0;

    const d = 'M' + cx + ',' + cy +
      ' L' + x1 + ',' + y1 +
      ' A' + r + ',' + r + ',0,' +
        largeArc + ',' + sweep +
        x2 + ',' + y2 +
      ' Z';
    const style = {
      fill: this.props.backgroundColor,
      opacity: this.props.opacity,
    };
    return <path d={d} style={style} />;
  }
}
