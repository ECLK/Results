import React from 'react'

import REGION_CODE_TO_NAME from '../constants/REGION_CODE_TO_NAME.js';

import {getPartyName} from '../utils/party.js';

export function renderEmptyCell() {
  return (
    <span className="span-empty-cell">
      -
    </span>
  )
}

export function renderParty(partyCode) {
  const imageFileName = `party_logos/logo_${partyCode}.png`;
  partyCode = partyCode.split('_')[0].replace('IND', 'IG');
  return (
    <div className="div-party" title={getPartyName(partyCode)}>
      <div>{partyCode}</div>
      <img className="img-party-logo" src={imageFileName} alt="" />
    </div>
  );
}

export function renderPercent(numerator, percent) {
  if (!percent) {
    return numerator.toLocaleString();
  }
  let className = 'div-percent';

  const p = parseFloat(percent.substring(0, percent.length - 1)) / 100.0;
  if (p < 0.01) {
    className += ' div-percent-zero';
  } else if (p < 0.05) {
    className += ' div-percent-seat-limit';
  }

  return (
    <div className={className + ' td-number'}>
      <div className="div-percent-numerator">
        {numerator.toLocaleString()}
      </div>
      <div className="div-percent-percent">
        {percent}
      </div>
    </div>
  )
}

export function renderLoading() {
  return <p>...</p>;
}

export function renderRegion(regionCode) {
  let regionCodeCleaned = regionCode;
  regionCodeCleaned = regionCodeCleaned.replace('DV', '_D');
  regionCodeCleaned = regionCodeCleaned.replace('PV', 'P');
  const regionName = REGION_CODE_TO_NAME[regionCodeCleaned];
  const regionType = (regionCode.length > 2)
    ? 'Polling Division'
    : 'Electoral District';

  let href = `#${regionCode}-details`;
  let target = '';
  if (regionType === 'Polling Division') {
    href = 'https://en.wikipedia.org/wiki/'
      + regionName + '_'
      + regionType.replace(' ', '_')
    target = "_blank"
  }
  return (
    <a
      href={href}
      rel="noopener noreferrer"
      target={target}
    >
      <div className="div-subtext">{regionType + ' ' + regionCode}</div>
      <div>{regionName}</div>
    </a>
  );
}

export function renderDescription(result) {
  return (<div className="div-latest-results-item-description">
    {result['by_party'].map(
      function(byParty, i) {
        const partyCode = byParty['party_code'];
        const votesPercentage = byParty['vote_percentage'];
        const p = parseFloat(votesPercentage.substring(0, votesPercentage.length - 1)) / 100.0;

        let description = '';
        if (p >= 0.05) {
          description = `${partyCode} ${votesPercentage}. `;
        }

        const style = (i !== 0) ? {color: '#808080'} : {};
        return (
          <span key={i} style={style}>
            {description}
          </span>
        );

      },
      '',
    )
  }</div>);
}
