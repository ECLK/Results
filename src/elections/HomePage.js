// eslint-disable-next-line no-unused-vars
import React, {Component} from 'react';
// eslint-disable-next-line no-unused-vars
import DownloadLink from 'react-download-link';

// eslint-disable-next-line no-unused-vars
import ResultsForYear from './ResultsForYear.js';
// eslint-disable-next-line no-unused-vars
import Slider from './Slider.js';
// eslint-disable-next-line no-unused-vars
import YearSelector from './YearSelector.js';

import {
  getDataForYear,
  getTimestampNow,
  filterByTimestamp,
} from './DataUtils.js';

import {
  PLAYBACK,
  DEFAULT_YEAR,
} from './Constants.js';

const STYLE_DOWNLOAD_LINK = {
  textDecoration: 'none',
  color: '#ff5b00',
  cursor: 'pointer',
};

/**
 * Represents the main page for displaying election results
 */
export default class HomePage extends Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.interval = undefined;
    this.state = {
      resultList: undefined,
    };
  }

  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    this.getAndSetData(DEFAULT_YEAR);
  }

  /**
   * @param {int} year
   * Given an year, gets data and updates state
   **/
  getAndSetData(year) {
    getDataForYear(year, function(resultList) {
      const [
        minTimestamp,
        maxTimestamp,
      ] = resultList.reduce(
          function([
            minTimestamp,
            maxTimestamp,
          ], result) {
            return [
              Math.min(result['timestamp'], minTimestamp),
              Math.max(result['timestamp'], maxTimestamp),
            ];
          },
          [
            getTimestampNow(),
            0,
          ],
      );

      const timeSpan = maxTimestamp - minTimestamp;

      this.interval = setInterval(
          function() {
            const newCurrentTimestamp = this.state.currentTimestamp +
            timeSpan / PLAYBACK.STEPS;
            if (newCurrentTimestamp < maxTimestamp) {
              this.setState({currentTimestamp: newCurrentTimestamp});
            } else {
              this.setState({currentTimestamp: maxTimestamp});
              clearInterval(this.interval);
            }
          }.bind(this),
          PLAYBACK.DURATION / PLAYBACK.STEPS,
      );

      this.setState({
        selectedYear: year,
        resultList: resultList,

        minTimestamp: minTimestamp,
        maxTimestamp: maxTimestamp,
        currentTimestamp: minTimestamp,
      });
    }.bind(this));
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    if (!this.state.resultList) {
      return 'Data loading...';
    }
    const resultList = filterByTimestamp(
        this.state.resultList,
        this.state.currentTimestamp,
    );
    const resultsCount = resultList.length;

    const onUpdateSelectedYear = function(year) {
      this.getAndSetData(year);
    }.bind(this);

    const sourceHRef = 'https://elections.gov.lk' +
      '/web/en/elections/elections-results/presidential-elections-results/';
    const selectedYear = this.state.selectedYear;

    const onChange = function(currentTimestamp) {
      this.setState({currentTimestamp: currentTimestamp});
    }.bind(this);

    const exportData = function() {
      return JSON.stringify(resultList);
    };

    return (
      <div className='div-home-page'>
        <div className='div-fixed-header'>
          <YearSelector
            onUpdateSelectedYear={onUpdateSelectedYear}
            selectedYear={selectedYear}
          />
          <h1>{selectedYear + ' '}Sri Lanka Presidential Election Results</h1>
          (Data Source:{' '}
          <a href={sourceHRef} target="_blank" rel="noopener noreferrer">
            Election Commission of Sri Lanka
          </a>
          {', '}
          <DownloadLink
            className="download-link"
            filename={'elections_lk.presidential.' + selectedYear + '.json'}
            exportFile={exportData}
            label="Export Data"
            style={STYLE_DOWNLOAD_LINK}
          />
          )
          <Slider
            onChange={onChange}
            resultsCount={resultsCount}
            minTimestamp={this.state.minTimestamp}
            maxTimestamp={this.state.maxTimestamp}
            currentTimestamp={this.state.currentTimestamp}
          />
        </div>
        <div className='div-moving-body'>
          <ResultsForYear
            resultList={resultList}
            currentTimestamp={this.state.currentTimestamp}
          />
        </div>
      </div>
    );
  }
}
