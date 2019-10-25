// eslint-disable-next-line no-unused-vars
import React, {Component} from 'react';
// eslint-disable-next-line no-unused-vars
import ResultsView from './ResultsView.js';

import {
  RESULT,
} from './Constants.js';

import {
  filterMapAndFilter,
} from './DataUtils.js';

/**
 * Displays election results for a particular year
 **/
export default class ResultsSummary extends Component {
  /**
   * @return {jsx}
   */
  render() {
    const resultList = this.props.resultList;
    const [
      // eslint-disable-next-line no-unused-vars
      mapValue,
      partyResults,
      summaryResults,
      // eslint-disable-next-line no-unused-vars
      totalElectors,
      totalElectorsOriginal,
    ] = filterMapAndFilter(
        resultList,
        RESULT.LEVEL.ED,
        undefined,
        this.props.maxTimestamp,
    )[0];

    const label = (totalElectorsOriginal) ?
      ('Complete Electoral District Results (' +
        summaryResults.length +
        ' Reporting)'
      ) : 'No Results';

    return (
      <div className="div-results-summary">
        <ResultsView
          partyResults={partyResults}
          summaryResults={summaryResults}
          childLabelField="ed_name"
          label={label}
          mapDir={this.props.mapDir}
          onClickMap={this.props.onClickMap}
        />
      </div>
    );
  }
}
