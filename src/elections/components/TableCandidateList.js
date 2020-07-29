import React, {Component} from 'react';

import {mapReduce} from '../utils/data.js';

import {renderParty} from '../utils/render.js';

export default class TableCandidateList extends Component {
  render() {
    const edCode = this.props.edCode;
    const candidateResult = this.props.candidateResultList[0];
    const partyToCandidateList = mapReduce(
        candidateResult['by_candidate'],
        x => x['party_code'],
        x => x.map(x => x['candidate_name']),
    )
    const renderedByParty = Object.keys(partyToCandidateList).map(
      function(partyCode, i) {
        const candidateList = partyToCandidateList[partyCode];
        return (
          <div key={partyCode}>
            <h4>{renderParty(partyCode)}</h4>
            <ol>{
              candidateList.map(
                function(candidate, j) {
                  return <li key={j}>{candidate}</li>;
                }
              )
            }</ol>
          </div>
        )
      },
    );

    return (
      <div key={edCode}>
        <h4>Elected Candidates</h4>
        {renderedByParty}
      </div>
    )
  }
}
