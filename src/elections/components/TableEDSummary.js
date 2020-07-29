import React, {Component} from 'react';

import {getRegionListLK, sort} from '../utils/data.js';
import {getPartyList} from '../utils/party.js';
import {renderLoading} from '../utils/render.js';

import ChartMap from '../components/ChartMap.js';
import ChartPie from '../components/ChartPie.js';
import TableRowDetailedResults from '../components/TableRowDetailedResults.js';
import TableRowHeaderDetailedResults
  from '../components/TableRowHeaderDetailedResults.js';

export default class TableEDSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {regionList: undefined};
  }

  async componentDidMount() {
    const regionList = await getRegionListLK();
    this.setState({regionList: regionList});
  }

  render() {
    const regionList = this.state.regionList;
    if (!regionList) {
      return renderLoading();
    }
    const edSummary = this.props.edSummary;
    const lkSummaryIncrLast = this.props.lkSummaryIncrLast;
    if (!lkSummaryIncrLast) {
      return null;
    }
    const partyList = getPartyList(lkSummaryIncrLast);

    const headerRow = (
      <TableRowHeaderDetailedResults
        partyList={partyList}
        showSummary={false}
        showSeats={true}
        firstRowHeader="Electoral District"
      />
    );

    const rowList = sort(edSummary, 'ed_code').map(
      function(result, i) {
        return (
          <TableRowDetailedResults
            key={i}
            result={result}
            partyList={partyList}
            regionCodeField={'ed_code'}
          />
        );
      }
    )

    const footerRow = (
      <TableRowDetailedResults
        result={lkSummaryIncrLast}
        partyList={partyList}
        regionCodeField={null}
      />
    )

    const table = (
      <table>
        <thead>{headerRow}</thead>
        <tbody>{rowList}</tbody>
        <tfoot>{footerRow}</tfoot>
      </table>
    )

    const nReleased = edSummary.length;
    return (
      <div>
        <h1>Summary Results by Electoral District</h1>
        <p>{`${nReleased} of 22 Electoral Districts Complete.`}</p>
        <ChartMap
          parentRegionCode={'LK'}
          childRegionCodeType={'ed_code'}
          regionList={regionList}
          resultList={edSummary}
        />
        <ChartPie result={lkSummaryIncrLast}/>
        {table}
        <p>* Complete Electoral Districts Only</p>
      </div>
    );
  }
}
