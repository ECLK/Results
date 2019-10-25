// eslint-disable-next-line no-unused-vars
import React, {Component} from 'react';
// eslint-disable-next-line no-unused-vars
import DownloadLink from 'react-download-link';

// eslint-disable-next-line no-unused-vars
import ResultsByYear from './ResultsByYear.js';
// eslint-disable-next-line no-unused-vars
import Slider from './Slider.js';
// eslint-disable-next-line no-unused-vars
import YearSelector from './YearSelector.js';

import {
  getDataForYear,
} from './DataUtils.js';

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
    const DEFAULT_YEAR = 2015;
    this.state = this.getData(DEFAULT_YEAR);
  }

  /**
   * @param {int} year
   * @return {dict} Given an year, returns the corresponding state
   */
  getData(year) {
    const resultsList = getDataForYear(year);
    const maxTimestampAll = resultsList.reduce(
        function(maxTimestampAll, result) {
          return Math.max(result['timestamp'], maxTimestampAll);
        },
        0,
    );
    console.debug('maxTimestampAll', maxTimestampAll);

    return {
      selectedYear: year,
      maxTimestampAll: maxTimestampAll,
      maxTimestamp: maxTimestampAll,
    };
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const onUpdateSelectedYear = function(year) {
      this.setState(this.getData(year));
    }.bind(this);

    const sourceHRef = 'https://elections.gov.lk' +
      '/web/en/elections/elections-results/presidential-elections-results/';
    const selectedYear = this.state.selectedYear;
    const selectedYearData = getDataForYear(selectedYear);

    const onChange = function(maxTimestamp) {
      this.setState({maxTimestamp: maxTimestamp});
    }.bind(this);

    const exportData = function() {
      return JSON.stringify(selectedYearData);
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
            value={this.state.maxTimestamp}
            max={this.state.maxTimestampAll}
          />
        </div>
        <div className='div-moving-body'>
          <ResultsByYear
            dataForYear={selectedYearData}
            maxTimestamp={this.state.maxTimestamp}
          />
        </div>
      </div>
    );
  }
}
