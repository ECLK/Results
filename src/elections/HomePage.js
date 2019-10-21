// eslint-disable-next-line no-unused-vars
import React, {Component} from 'react';
// eslint-disable-next-line no-unused-vars
import ResultsByYear from './ResultsByYear.js';
// eslint-disable-next-line no-unused-vars
import YearSelector from './YearSelector.js';

import ELECTION_DATA from './data/presidential_election_results.json';

/**
 * Represents the main page for displaying election results
 */
export default class HomePage extends Component {
  /**
   * Inherited
   * @param {object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      selectedYearIndex: 0,
    };
  }

  /**
   * Inherited
   * @return {jsx} return
   */
  render() {
    const onUpdateSelectedYear = function(i) {
      this.setState({selectedYearIndex: i});
    }.bind(this);

    const sourceHRef = 'https://elections.gov.lk' +
      '/web/en/elections/elections-results/presidential-elections-results/';
    const year = ELECTION_DATA[this.state.selectedYearIndex]['year'];
    const yearList = ELECTION_DATA.map(
        function(resultsByYear, i) {
          return resultsByYear['year'];
        },
    );

    const selectedYearIndex = this.state.selectedYearIndex;
    return (
      <div className='div-home-page'>
        <div className='div-fixed-header'>
          <YearSelector
            onUpdateSelectedYear={onUpdateSelectedYear}
            selectedYearIndex={selectedYearIndex}
            yearList={yearList}
          />
          <h1>{year + ' '}Sri Lanka Presidential Election Results</h1>
          (Data Source:{' '}
          <a href={sourceHRef} target="_blank" rel="noopener noreferrer">
            Election Commission of Sri Lanka
          </a>
          )
        </div>
        <div className='div-moving-body'>
          <ResultsByYear
            dataForYear={ELECTION_DATA[selectedYearIndex]}
          />
        </div>
      </div>
    );
  }
}
