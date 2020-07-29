import React, {Component} from 'react';
import TableDetailedResultsForED
  from '../components/TableDetailedResultsForED.js'

export default class TableDetailedResults extends Component {
  render() {
    const detailedResultList = this.props.detailedResultList;
    const edRSL = this.props.edResultSummaryList;
    const candidateResultList = this.props.candidateResultList;

    const edToCRList = candidateResultList ? candidateResultList.reduce(
      function(edToCRList, result) {
        const edCode = result['ed_code'];
        if (!edToCRList[edCode]) {
          edToCRList[edCode] = [];
        }
        edToCRList[edCode].push(result);
        return edToCRList;
      },
      {},
    ) : {};

    const edToDRList = detailedResultList.reduce(
      function(edToDRList, result) {
        const edCode = result['ed_code'];
        if (!edToDRList[edCode]) {
          edToDRList[edCode] = [];
        }
        edToDRList[edCode].push(result);
        return edToDRList;
      },
      {},
    )

    const edToLatestRS = edRSL.reduce(
      function(edToLatestRS, resultSummary) {
        edToLatestRS[resultSummary['ed_code']] = resultSummary;
        return edToLatestRS;
      },
      {},
    );

    return (
      <div>
        <h2>Results by Polling Division</h2>
        {Object.keys(edToDRList).sort().map(
          function(edCode, key) {
            return (
              <TableDetailedResultsForED
                key={'TableDetailedResultsForED-' + key}
                edCode={edCode}
                edDRList={edToDRList[edCode]}
                edLatestRS={edToLatestRS[edCode]}
                candidateResultList={edToCRList[edCode]}
              />
            );
          },
        )}
      </div>
    );
  }
}
