// eslint-disable-next-line no-unused-vars
import React, {Component} from 'react';
// eslint-disable-next-line no-unused-vars
import ResultsView from './ResultsView.js';

import {
  aggregateByED,
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
    const nResults = resultList.length;
    const aggrResultList = aggregateByED(resultList);

    const label = (aggrResultList) ?
      'Electoral District Results (' +
      nResults + ' Polling Divisions / District Postal Results Reporting)' :
       'No Results';

    return (
      <div className="div-results-summary">
        <ResultsView
          results={aggrResultList}
          childLabelPrefix="ed"
          label={label}
          mapDir={this.props.mapDir}
          onClickMap={this.props.onClickMap}
        />
      </div>
    );
  }
}
