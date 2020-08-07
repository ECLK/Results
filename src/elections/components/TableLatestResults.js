import React, {Component} from 'react';

import {getPartyColor} from '../utils/party.js';
import {renderDescription} from '../utils/render.js';

const MAX_LATEST_RESULTS = 5;

const FORMAT_TIME_OPTIONS = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};
function formatT(t) {
  // Case 1: t is unixtime
  const ts = new Date(t * 1000).toLocaleTimeString(
    'en-LK',
    FORMAT_TIME_OPTIONS,
  );
  if (ts !== 'Invalid Date') {
    return ts;
  }
  // Case 2: t is time string
  const t2 = Date.parse(t) / 1000.0;
  return formatT(t2);
}

export default class TableLatestResults extends Component {
  render() {
    const detailedResultList = this.props.detailedResultList;
    const displayResultList = detailedResultList.reverse().slice(
      0,
      MAX_LATEST_RESULTS,
    );

    return (
      <div>
        <h1>Latest Results</h1>
        <p>Click for details.</p>
        <div>
          {displayResultList.map(
            function(result, i) {
              const pdCode = result['pd_code'];
              const pdName = result['pd_name'];
              const edName = result['ed_name'];
              const resultTime = result['timestamp'];
              const href = '#' + pdCode;
              const winPartyCode = result['by_party'][0]['party_code'];
              const winPartyPStr = result['by_party'][0]['vote_percentage'];

              const renderedDescription = renderDescription(result);

              const backgroundColor = getPartyColor(
                  winPartyCode,
                  true,
                  winPartyPStr,
              );
              const style = {
                backgroundColor: backgroundColor,
              };
              return (
                <div
                  key={`LatestResults-${pdCode}`}
                  className="div-latest-results-item"
                  style={style}
                >
                  <div className="div-latest-results-item-time">
                    {formatT(resultTime)}
                  </div>
                  <div className="div-latest-results-item-body">
                    <a href={href}>
                      {`${pdName} (${edName} Electoral District)`}
                    </a>
                  </div>
                  {renderedDescription}
                </div>
              );
            },
          )}
        </div>
      </div>
    )

  }
}
