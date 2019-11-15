import React, {Component} from 'react';
// eslint-disable-next-line no-unused-vars
import ResultsSummary from './ResultsSummary.js';
// eslint-disable-next-line no-unused-vars
import ResultsView from './ResultsView.js';

import {
  mapResultsByED,
  filterMostRecentResults,
} from './DataUtils.js';

const MAPS_DIR = './images/maps';

/**
 * Displays election results for a particular year
 **/
export default class ResultsByYear extends Component {
  /**
   * @param {object} props - props.dataggrResultListForYear: Year for which
   *   results must ne displayed
   **/
  constructor(props) {
    super(props);
    this.myRef = {};
  }
  /**
   * @return {jsx}
   */
  render() {
    const resultList = this.props.resultList;
    const byED = mapResultsByED(
        resultList,
    );

    const HEIGHT = 250;
    const WIDTH = 500;
    const TOP = 100;
    const LEFT = 10;

    const onClickMap = function(edCode) {
      if (edCode in this.myRef) {
        window.scrollTo(0, this.myRef[edCode].current.offsetTop - 140);
      }
    }.bind(this);

    const _byEDList = byED.map(
        function([
          edCode,
          results,
        ], i) {
          const key = 'results-for-ed-' + i;
          this.myRef[edCode] = React.createRef();
          const mapDir = MAPS_DIR + '/map.ed.' + edCode;

          const nResults = results.length;
          if (nResults === 0) {
            return null;
          }
          const edName = results[0]['ed_name'];
          
          const label = edName + ' (' + nResults +
            ' Polling Divisions Reporting)';

            if(edName){
              return (
                <div ref={this.myRef[edName]} key={key}>
                  <ResultsView
                    results={results}
                    childLabelPrefix="pd"
                    label={label}
                    mapDir={mapDir}
                    height={HEIGHT}
                    width={WIDTH}
                    top={TOP}
                    left={LEFT}
                    onClickMap={onClickMap}
                  />
                </div>
              );
            }
          
        }.bind(this),
    );

    const mostRecentResults = filterMostRecentResults(resultList);
    let recentResultComponent;
    
    if(sessionStorage.getItem('maxTimestamp') >= this.props.currentTimestamp && (sessionStorage.getItem('maxTimestamp')!=0)){
     recentResultComponent = <ResultsView
                                results={mostRecentResults}
                                childLabelPrefix="pd"
                                label={'Most Recent Results'}
                                mapDir={undefined}
                                height={HEIGHT}
                                width={WIDTH}
                                top={TOP}
                                left={LEFT}
                                onClickMap={onClickMap}
                              />
                              }

    return (
      <div className="div-results-by-year">
        {recentResultComponent}
        <ResultsSummary
          resultList={resultList}
          maxTimestamp={this.props.maxTimestamp}
          onClickMap={onClickMap}
          mapDir={MAPS_DIR + '/map.country'}
        />
        {_byEDList}
      </div>
    );
  }
}
