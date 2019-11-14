import {
  DISPLAY_PARTY_THRESHOLD,
  RESULT,
  DISPLAY_MOST_RECENT_COUNT,
} from './Constants.js';

/**
 * @param {object} x
 * @return {object} - Creates and returns a deep copy of an object
 **/
export function copy(x) {
  return JSON.parse(JSON.stringify(x));
}

/**
 * @param {array} numberList - array of numbers
 * @return {int/float} Given a array of numbers, returns its sum
 **/
export function sum(numberList) {
  return numberList.reduce(
      function(s, number) {
        return s + number;
      },
      0,
  );
}

/**
 * @param {array} results
 * @param {string} mapFieldPrefix
 * @return {array} - Computers various aggregate stats for election results
 **/
export function getAggregateStats(results, mapFieldPrefix) {
  const [
    votesByParty,
    votesByChildByParty,
  ] = results.reduce(
      function([
        votesByParty,
        votesByChildByParty,
      ], result) {
        const mapValue = (mapFieldPrefix) ?
          result[mapFieldPrefix + '_code'] :
          'Sri Lanka';

        if (!votesByChildByParty[mapValue]) {
          votesByChildByParty[mapValue] = {};
        }
        return result['by_party'].reduce(
            function([
              votesByParty,
              votesByChildByParty,
            ], forParty) {
              const party = forParty['party_code'];
              const votes = forParty['votes'];
              if (!votesByParty[party]) {
                votesByParty[party] = 0;
              }
              votesByParty[party] += votes;
              votesByChildByParty[mapValue][party] = votes;
              return [
                votesByParty,
                votesByChildByParty,
              ];
            },
            [
              votesByParty,
              votesByChildByParty,
            ],
        );
      },
      [
        {},
        {},
      ],
  );

  const [
    // reduce fields
    totalValid,
    totalRejected,
    totalPolled,
    totalElectors,
  ] = results.reduce(
      function([
      // reduce fields
        totalValid,
        totalRejected,
        totalPolled,
        totalElectors,
      ], result) {
        const pdName = result['pd_name']
        const summary = result['summary'];
        const valid = summary['valid'];

        totalValid += valid;
        totalRejected += summary['rejected'];
        totalPolled += summary['polled'];

        if (pdName !== 'Postal Votes')  {
          totalElectors += summary['electors'];
        }

        return [
        // reduce fields
          totalValid,
          totalRejected,
          totalPolled,
          totalElectors,
        ];
      },
      // reduce fields
      [0, 0, 0, 0],
  );

  return [
    votesByParty,
    votesByChildByParty,

    totalValid,
    totalRejected,
    totalPolled,
    totalElectors,

  ];
}

/**
 * @param {float} x
 * @return {int} Formats x as percentage
 * @example 0.54321 -> 54.3%
 */
export function formatPercent(x) {
  return x.toLocaleString('en-us', {
    style: 'percent',
    minimumFractionDigits: 2,
  });
}

/**
 * @param {int} year
  * @param {function} callback - callback function
 * Given an year, async returns the election results, for that
 *  year.
 **/
export function getDataForYear(year, callback) {
  // TODO only for testing
  // const getDataForYearStatic = function(year) {
  //   const fileName = './data/elections.lk.presidential.' +
  //     year + '.json';
  //   const resultList = require('' + fileName);
  //   return resultList;
  // };
  // callback(getDataForYearStatic(year));

  const url = '/data/elections.lk.presidential.' +    year + '.json';
  fetch(url).then(
    function(response) {
      return response.json();
    },
  ).then(
    function(resultList) {
      callback(resultList);
    },
  );
}

/**
 * Sorts results by party
 * @param {object} votesByParty
 * @return {array}
 **/
export function getSortedPartyAndVotes(votesByParty) {
  return Object.entries(votesByParty).sort(
      function(a, b) {
        return b[1] - a[1];
      },
  );
}

/**
 * Selects which parties to display in the ResultsTable
 * Picks parties where the proportion of votes > DISPLAY_PARTY_THRESHOLD.
 * @param {object} votesByParty
 * @param {int} totalVotes
 * @return {array}
 **/
export function getDisplayPartyList(votesByParty, totalVotes) {
  const sortedPartyAndVotes = getSortedPartyAndVotes(votesByParty);
  return sortedPartyAndVotes.filter(
      function([party, votes]) {
        return votes > totalVotes * DISPLAY_PARTY_THRESHOLD;
      }
  ).map(
      function([party, votes]) {
        return party;
      }
  );
}


/**
 * Given a set of election results (by polling division), aggregates
 * results by electoral district
 * @param {array} resultList
 * @return {array}
 **/
export function aggregateByED(resultList) {
  return mapResultsByED(resultList).map(
      function([edCode, edResultList]) {
        const first = edResultList[0];

        const [
          maxTimestamp,
          maxSequenceNumber,
          aggrByParty,
          aggrSummary,
        ] = edResultList.reduce(
            function([
              maxTimestamp,
              maxSequenceNumber,
              aggrByParty,
              aggrSummary,
            ], result) {
              if (!maxTimestamp) {
                maxTimestamp = result['timestamp'];
              } else {
                maxTimestamp = Math.max(result['timestamp'], maxTimestamp);
              }

              if (!maxSequenceNumber) {
                maxSequenceNumber = result['timestamp'];
              } else {
                maxSequenceNumber =
              Math.max(result['sequence_number'], maxSequenceNumber);
              }

              if (!aggrByParty) {
                aggrByParty = copy(result['by_party']);
              } else {
                const votesToParty = result['by_party'].reduce(
                    function(votesToParty, forParty) {
                      const partyCode = forParty['party_code'];
                      const votes = forParty['votes'];
                      votesToParty[partyCode] = votes;
                      return votesToParty;
                    },
                    {},
                );
                aggrByParty = aggrByParty.map(
                    function(forParty) {
                      const partyCode = forParty['party_code'];
                      forParty['votes'] += votesToParty[partyCode];
                      return forParty;
                    },
                );
              }

              if (!aggrSummary) {
                aggrSummary = copy(result['summary']);
              } else {
                aggrSummary = Object.entries(result['summary']).reduce(
                    function(aggrSummary, [key, value]) {
                      const pdName = result['pd_name'];
                      if (pdName !== 'Postal Votes' || key !== 'electors') {
                        aggrSummary[key] += value;
                      }
                      return aggrSummary;
                    },
                    aggrSummary,
                );
              }

              return [
                maxTimestamp,
                maxSequenceNumber,
                aggrByParty,
                aggrSummary,
              ];
            },
            [undefined, undefined, undefined, undefined],
        );

        return {
          'type': RESULT.TYPE.PRESIDENTIAL_FIRST,
          'level': RESULT.LEVEL.ED,
          'timestamp': maxTimestamp,
          'sequence_number': maxSequenceNumber,

          'ed_name': first['ed_name'],
          'ed_code': first['ed_code'],

          'by_party': aggrByParty,
          'summary': aggrSummary,
        };
      },
  );
}
/**
 * Given a set of election results (by polling division),
 * groups them by electoral district
 * @param {array} resultList
 * @return {array}
 **/
export function mapResultsByED(resultList) {
  const dataMap = resultList.reduce(
      function(dataMap, data, i) {
        const edCode = data['ed_code'];
        if (!dataMap[edCode]) {
          dataMap[edCode] = [];
        }
        dataMap[edCode].push(data);
        return dataMap;
      },
      {},
  );
  return Object.entries(dataMap).sort(
      function(a, b) {
        return a[0].localeCompare(b[0]);
      },
  );
}

/**
 * @return {int} - current unix timestamp
 **/
export function getTimestampNow() {
  return Math.round((new Date()).getTime() / 1000);
}

/**
 * @param {int} timestamp  unix timestamp
 * @return {string} - formats a given unix timestamp
 **/
export function formatTimestamp(timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US') + ', ' +
    new Date(timestamp * 1000).toLocaleDateString('en-US');
}

/**
 * Given a set of election results (by polling division),
 * filters results before a given timestamp
 * @param {array} resultList
 * @param {int} timestamp
 * @return {array}
 **/
export function filterByTimestamp(resultList, timestamp) {
  return resultList.filter(
      function(result) {
        return result['timestamp'] <= timestamp;
      },
  );
}

/**
 * Given a set of election results (by polling division),
 * returns the DISPLAY_MOST_RECENT_COUNT of the most recent results
 * @param {array} resultList
 * @return {array}
 **/
export function filterMostRecentResults(resultList) {
  return resultList.sort(
      function(a, b) {
        return b['timestamp'] - a['timestamp'];
      },
  ).slice(0, DISPLAY_MOST_RECENT_COUNT);
}
