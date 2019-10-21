import React, {Component} from 'react';
// eslint-disable-next-line no-unused-vars
import ResultsView from './ResultsView.js';

const MAPS_DIR = './images/maps';
const COUNTRY_MAP_DIR = MAPS_DIR + '/map.by_ed_name';

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
    const data = this.props.dataForYear;
    const byED = data['by_ed'];

    const forCountry = byED.reduce(
        function(forCountry, forED, i) {
          const edName = forED['ed_name'];
          const byPD = forED['by_pd'];
          const [summaryStats, partyToVotes] = byPD.reduce(
              function([summaryStats, partyToVotes], forPD, j) {
                const childSummaryStats= forPD['summary_stats'];
                const childByParty = forPD['by_party'];

                summaryStats['rejected_votes'] +=
                  childSummaryStats['rejected_votes'];
                summaryStats['total_polled'] +=
                  childSummaryStats['total_polled'];
                if (childSummaryStats['registered_voters']) {
                  summaryStats['registered_voters'] +=
                    childSummaryStats['registered_voters'];
                } else {
                  summaryStats['registered_voters'] +=
                    childSummaryStats['total_polled'];
                }

                partyToVotes = childByParty.reduce(
                    function(partyToVotes, forParty, k) {
                      const party = forParty['party'];
                      if (!(party in partyToVotes)) {
                        partyToVotes[party] = 0;
                      }
                      partyToVotes[party] += forParty['votes'];
                      return partyToVotes;
                    },
                    partyToVotes,
                );

                return [summaryStats, partyToVotes];
              },
              [{
                'rejected_votes': 0,
                'total_polled': 0,
                'registered_voters': 0,
              }, []],
          );

          const byParty = Object.entries(partyToVotes).map(
              function([party, votes], i) {
                return {
                  party: party,
                  votes: votes,
                };
              },
          );

          forCountry.push({
            'ed_name': edName,
            'summary_stats': summaryStats,
            'by_party': byParty,
          });
          return forCountry;
        },
        [],
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
        function(forED, i) {
          const key = 'results-for-ed-' + i;
          // map.for_kandy.by_polling_division
          const edName = forED['ed_name'];
          this.myRef[edName] = React.createRef();

          const mapDir = MAPS_DIR + '/map.for_' +
          edName + '.by_pd';
          return (
            <div ref={this.myRef[edName]} key={key}>
              <ResultsView
                resultsByChild={forED['by_pd']}
                childLabelField="pd_name"
                label={edName + ' Electoral District'}
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

    const _forCountry = (
      <ResultsView
        resultsByChild={forCountry}
        childLabelField="ed_name"
        label="Sri Lanka (Final Results)"
        mapDir={COUNTRY_MAP_DIR}
        height={HEIGHT}
        width={WIDTH}
        top={TOP}
        left={LEFT}
        onClickMap={onClickMap}
      />
    );

    return (
      <div className="div-results-by-year">
        {_forCountry}
        {_byEDList}
      </div>
    );
  }
}
