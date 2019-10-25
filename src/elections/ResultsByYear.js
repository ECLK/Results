import React, {Component} from 'react';
// eslint-disable-next-line no-unused-vars
import ResultsSummary from './ResultsSummary.js';
// eslint-disable-next-line no-unused-vars
import ResultsView from './ResultsView.js';

import {
  RESULT,
} from './Constants.js';

import {
  decleanName,
  filterMapAndFilter,
  formatPercent,
} from './DataUtils.js';

const MAPS_DIR = './images/maps';

/**
 * Displays election results for a particular year
 **/
export default class ResultsByYear extends Component {
  /**
   * @param {object} props - props.dataForYear: Year for which
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
    const resultList = this.props.dataForYear;
    const byED = filterMapAndFilter(
        resultList,
        RESULT.LEVEL.PD,
        'ed_name',
        this.props.maxTimestamp,
    );

    const HEIGHT = 250;
    const WIDTH = 500;
    const TOP = 100;
    const LEFT = 10;

    const onClickMap = function(edName) {
      if (edName in this.myRef) {
        window.scrollTo(0, this.myRef[edName].current.offsetTop - 140);
      }
    }.bind(this);

    const _byEDList = byED.map(
        function([
          edName,
          partyResults,
          summaryResults,
          totalElectors,
          totalElectorsOriginal,
        ], i) {
          const key = 'results-for-ed-' + i;
          this.myRef[edName] = React.createRef();
          const mapDir = MAPS_DIR + '/map.for_' +
            decleanName(edName) + '.by_pd';

          if (totalElectors === 0) {
            return null;
          }

          const label = edName + ' (' +
            formatPercent(totalElectors / totalElectorsOriginal) +
            ' Reporting)';

          return (
            <div ref={this.myRef[edName]} key={key}>
              <ResultsView
                partyResults={partyResults}
                summaryResults={summaryResults}

                childLabelField="pd_name"
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
        }.bind(this),
    );


    const mapDir = MAPS_DIR + '/map.by_ed_name';
    return (
      <div className="div-results-by-year">
        <ResultsSummary
          resultList={resultList}
          maxTimestamp={this.props.maxTimestamp}
          onClickMap={onClickMap}
          mapDir={mapDir}
        />
        {_byEDList}
      </div>
    );
  }
}
