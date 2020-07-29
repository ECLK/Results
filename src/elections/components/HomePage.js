import React, {Component} from 'react';

import GEN_ELEC_YEAR_LIST from '../constants/GEN_ELEC_YEAR_LIST.js';
import RESULT_TYPE from '../constants/RESULT_TYPE.js';

import {downloadResults, getResultGroups} from '../utils/data.js';
import {renderLoading} from '../utils/render.js';

import TableDetailedResults from '../components/TableDetailedResults.js';
import TableEDSummary from '../components/TableEDSummary.js';
import TableFinalSeats from '../components/TableFinalSeats.js';
import TableLatestResults from '../components/TableLatestResults.js';
import YearSelector from '../components/YearSelector.js';

const DEFAULT_YEAR = GEN_ELEC_YEAR_LIST.slice(-1)[0];

export default class HomePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
        resultGroups: null,
        year: DEFAULT_YEAR,
    }
  }

  async componentDidMount() {
    await this.updateYear(this.state.year);
  }

  async updateYear(year) {
    this.setState({resultGroups: null})
    const resultGroups = await getResultGroups(year);
    this.setState({
      resultGroups: resultGroups,
      year: year,
    })
  }

  render() {
    const resultGroups = this.state.resultGroups;
    if (!resultGroups) {
      return renderLoading();
    }
    const year = this.state.year;
    const detailedResultList = resultGroups[RESULT_TYPE.R_V];
    const edResultSummaryList = resultGroups[RESULT_TYPE.R_VI];

    const edSummary = resultGroups[RESULT_TYPE.R_S];
    const lkSummaryIncr = resultGroups[RESULT_TYPE.R_SI];
    const lkSummaryIncrLast = (lkSummaryIncr)
      ? lkSummaryIncr.slice(-1)[0]
      : null;

    const candidateResultList = resultGroups[RESULT_TYPE.R_SC];

    const finalSeatsGroup = resultGroups[RESULT_TYPE.R_VSN];
    const finalSeats = (finalSeatsGroup) ? finalSeatsGroup[0] : null;

    const onChangeYear = async function(year) {
      await this.updateYear(year);
    }.bind(this);

    const onDownloadResults = async function() {
      await downloadResults(year);
    }

    return (
      <div id="HomePage" key="HomePage">
        <div id="home-page-header">
          <YearSelector onChangeYear={onChangeYear} selectedYear={year}/>
          <h1>{`${year} Sri Lankan Parlimentary Elections`}</h1>
          <p className="p-download" onClick={onDownloadResults}>
            Download Results as JSON
          </p>
        </div>
        <div id="home-page-body">
          <TableLatestResults detailedResultList={detailedResultList} />
          <TableFinalSeats finalSeats={finalSeats} />
          <TableEDSummary
            edSummary={edSummary}
            lkSummaryIncrLast={lkSummaryIncrLast}
          />
          <TableDetailedResults
            detailedResultList={detailedResultList}
            edResultSummaryList={edResultSummaryList}
            candidateResultList={candidateResultList}
          />
        </div>
      </div>
    );
  }
}
