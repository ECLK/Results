import React, {Component} from 'react';

import {getRegionListLK, sort} from '../utils/data.js';
import {getPartyList} from '../utils/party.js';
import {renderLoading} from '../utils/render.js';
import {formatPercent} from '../utils/data.js';

import ChartMap from '../components/ChartMap.js';
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
    const edVoteSummary = this.props.edVoteSummary;
    const edSeatSummary = this.props.edSeatSummary;

    let lkSeatSummaryIncrLast = this.props.lkSeatSummaryIncrLast;
    if (!lkSeatSummaryIncrLast) {
      return null;
    }

    const partyToVoteCount = edVoteSummary.reduce(
      function(partyToVoteCount, resultVote, i) {
        return resultVote['by_party'].reduce(
          function(partyToVoteCount, forParty, j) {
            const party = forParty['party_code'];

            let voteCount = forParty['vote_count'];
            if (isNaN(voteCount)) {
              voteCount = 0;
            }

            if (partyToVoteCount[party] === undefined) {
              partyToVoteCount[party] = 0;
            }
            partyToVoteCount[party] += voteCount;
            return partyToVoteCount;
          },
          partyToVoteCount
        );
      },
      {},
    );
    const totalVotes = Object.values(partyToVoteCount).reduce(
      function(totalVotes, voteCount, i) {
        return totalVotes + voteCount;
      },
      0,
    );

    lkSeatSummaryIncrLast['by_party'] = lkSeatSummaryIncrLast['by_party'].map(
      function(forParty, i) {
        const party = forParty['party_code'];
        const voteCount = partyToVoteCount[party];
        forParty['vote_count'] = voteCount;
        forParty['vote_percentage'] = formatPercent(voteCount, totalVotes);
        return forParty;
      },
    );

    const partyList = getPartyList(lkSeatSummaryIncrLast);

    const edVoteSummaryByEdCode = edVoteSummary.reduce(
      function(edVoteSummaryByEdCode, resultVote, i) {
        const edCode = resultVote['ed_code'];
        edVoteSummaryByEdCode[edCode] = resultVote;
        return edVoteSummaryByEdCode;
      },
      {},
    );

    const headerRow = (
      <TableRowHeaderDetailedResults
        partyList={partyList}
        showSummary={false}
        showSeats={true}
        firstRowHeader="Electoral District"
      />
    );

    const rowList = sort(edSeatSummary, 'ed_code').map(
      function(result, i) {
        const resultVote = edVoteSummaryByEdCode[result['ed_code']];
        const resultVoteByParty = resultVote['by_party'].reduce(
          function(resultVoteByParty, forParty, j) {
            const party = forParty['party_code'];
            resultVoteByParty[party] = forParty;
            return resultVoteByParty;
          },
          {},
        )
        result['by_party'] = result['by_party'].map(
          function(forParty, j) {
            const party = forParty['party_code'];
            forParty['vote_count'] = resultVoteByParty[party]['vote_count'];
            forParty['vote_percentage'] =
              resultVoteByParty[party]['vote_percentage'];
            return forParty;
          }
        )

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
        result={lkSeatSummaryIncrLast}
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

    return (
      <div>
        <h1>Summary Results by Electoral District</h1>
        <ChartMap
          parentRegionCode={'LK'}
          childRegionCodeType={'ed_code'}
          regionList={regionList}
          resultList={edVoteSummary}
        />
        {table}
        <p>* Complete Electoral Districts Only</p>
      </div>
    );
  }
}
