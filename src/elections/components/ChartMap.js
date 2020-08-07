import React, {Component} from 'react';

import REGION_CODE_TO_NAME from '../constants/REGION_CODE_TO_NAME.js';
import {getPartyColor, getWinningParty} from '../utils/party.js';
import {getBBox, getT} from '../utils/polygon.js';

function renderPolygon(iRegion, iPolygon, t, polygon, color) {
  const d = polygon.map(
    function([lat, lng], i) {
      const c = (i === 0) ? 'M' : 'L';
      const [x, y] = t([lat, lng]);
      return `${c}${x} ${y}`;
    }
  ).concat(['Z']).join(' ');

  return (
    <path
      key={`polygon-${iRegion}-${iPolygon}`}
      d={d}
      fill={color}
      stroke="gray"
      strokeWidth={1}
    />
  );
}

export default class ChartMap extends Component {
  render() {
    const regionList = this.props.regionList;
    const resultList = this.props.resultList;
    const childRegionCodeType = this.props.childRegionCodeType;

    const [WIDTH, HEIGHT] = [400, 400];
    const [t, actualWidth, actualHeight] = getT(regionList, WIDTH, HEIGHT);

    const childRegionToColor = resultList.reduce(
      function(pdToColor, result) {
        const childRegionCode = result[childRegionCodeType];
        const winPartyCode = getWinningParty(result);
        const winPartyPStr = result['by_party'][0]['vote_percentage'];
        const color = getPartyColor(winPartyCode, true, winPartyPStr);
        pdToColor[childRegionCode] = color;
        return pdToColor;
      },
      {},
    )

    const renderedRegionList = regionList.map(
      function(region, i) {
        const childRegionCode = region.childRegionCode;
        let color = childRegionToColor[childRegionCode];
        if (!color) {
          color = 'white';
        }
        const polygonList = region.polygonList;
        const renderedPolygonList = polygonList.map(
          function(polygon, j) {
            return renderPolygon(i, j, t, polygon, color);
          },
        );

        const [minLat, maxLat, minLng, maxLng] = getBBox([{
          polygonList: polygonList,
        }]);
        const [xMid, yMid] = t([
            (minLat + maxLat) / 2,
            (minLng + maxLng) / 2,
        ]);
        // eslint-disable-next-line
        const [x0, y0] = t([
            minLat,
            minLng,
        ]);
        // eslint-disable-next-line
        const [x1, y1] = t([
            maxLat,
            maxLng,
        ]);
        const regionName = REGION_CODE_TO_NAME[childRegionCode];
        const fontWidth = x1 - x0;
        const charCount = regionName.length;
        const fontSize = Math.min(12, 0.8 * fontWidth / charCount);

        const href = '#' + childRegionCode;
        return (
          <svg
            key={`polygonList-${i}`}
            className="svg-polygon-list"
          >
            <title>{`${regionName} (${childRegionCode})`}</title>
            <a href={href}>
              {renderedPolygonList}
            </a>
            <text
              x={xMid}
              y={yMid - fontSize / 2}
              fill={'black'}
              textAnchor={'middle'}
              fontSize={fontSize * 1.5}
            >
              {childRegionCode}
            </text>
            <text
              x={xMid}
              y={yMid + fontSize / 2}
              fill={'black'}
              textAnchor={'middle'}
              fontSize={fontSize}
            >
              {regionName}
            </text>
          </svg>
        );
      }
    );

    const SVG_XMLNS = 'http://www.w3.org/2000/svg';
    return (
      <svg
        key={'Map-' + this.props.parentRegionCode}
        xmlns={SVG_XMLNS}
        width={actualWidth}
        height={actualHeight}
      >
        {renderedRegionList}
      </svg>
    );

  }
}
