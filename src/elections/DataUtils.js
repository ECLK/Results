import {
  DISPLAY_PARTY_THRESHOLD,
  RESULT,
} from './Constants.js';

const CLEAN_NAME_MAP = {
  'Monaragala': 'Moneragala',
  'Kandy': 'Mahanuwara',
  'Nuwara Eliya': 'Nuwara-Eliya',
};

/**
 * @param {dict} m
 * @return {dict} Given a map, returns a map with the keys and values
 *   inverted
 */
function reverseMap(m) {
  return Object.entries(m).reduce(
      function(rm, [k, v]) {
        rm[v] = k;
        return rm;
      },
      {},
  );
}

const REV_CLEAN_NAME_MAP = reverseMap(CLEAN_NAME_MAP);

/**
 * @param {string} name
 * @return {string} Given a name, returns its cannonical form
 */
export function cleanName(name) {
  if (CLEAN_NAME_MAP[name]) {
    return CLEAN_NAME_MAP[name];
  }
  return name;
}

/**
 * @param {string} name
 * @return {string} Given a cannonical name,
 *   returns its un-cannonical form
 */
export function decleanName(name) {
  if (REV_CLEAN_NAME_MAP[name]) {
    return REV_CLEAN_NAME_MAP[name];
  }
  return name;
}

/**
 * @param {list} numberList - list of numbers
 * @return {int/float} Given a list of numbers, returns its sum
 */
export function sum(numberList) {
  return numberList.reduce(
      function(s, number) {
        return s + number;
      },
      0,
  );
}

/**
 * @param {list} partyResults
 * @param {list} summaryResults
 * @param {list} mapField
 * @return {list} Given election results, returns various aggregate stats
 */
export function getAggregateStats(partyResults, summaryResults, mapField) {
  const [
    votesByParty,
    votesByChildByParty,
  ] = partyResults.reduce(
      function([
        votesByParty,
        votesByChildByParty,
      ], result) {
        const mapValue = (mapField) ? result[mapField] : 'Sri Lanka';
        if (!votesByChildByParty[mapValue]) {
          votesByChildByParty[mapValue] = {};
        }
        return result['by_party'].reduce(
            function([
              votesByParty,
              votesByChildByParty,
            ], forParty) {
              const party = forParty['party'];
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
  ] = summaryResults.reduce(
      function([
      // reduce fields
        totalValid,
        totalRejected,
        totalPolled,
        totalElectors,
      ], result) {
        const valid = result['valid'];
        totalValid += valid;
        totalRejected += result['rejected'];
        totalPolled += result['polled'];
        totalElectors += result['electors'];

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

  const combinedResults = Object.values(
      (partyResults.concat(summaryResults)).reduce(
          function(combinedResultsMap, result) {
            const mapValue = result[mapField];
            if (!combinedResultsMap[mapValue]) {
              combinedResultsMap[mapValue] = {};
            }

            combinedResultsMap[mapValue] = {
              ...combinedResultsMap[mapValue],
              ...result,
            };
            delete combinedResultsMap[mapValue]['type'];
            return combinedResultsMap;
          },
          {},
      ));

  return [
    votesByParty,
    votesByChildByParty,

    totalValid,
    totalRejected,
    totalPolled,
    totalElectors,

    combinedResults,
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
 * @return {array} Given an year, returns the election results, for that
 *  year.
 **/
export function getDataForYear(year) {
  const fileName = './data/elections.lk.presidential.' + year + '.json';
  return require('' + fileName);
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
 * @param {list} resultList
 * @param {string} filterLevel
 * @param {string} mapField
 * @param {int} maxTimestamp
 * @return {array} Given a list of election results, filters results
 *  by a specified level, maps results by a given map fields, and finally
 *  filters results by timestamp.
 **/
export function filterMapAndFilter(
    resultList,
    filterLevel,
    mapField,
    maxTimestamp,
) {
  const filteredResultList = resultList.filter(
      function(result) {
        return result['level'] === filterLevel;
      },
  );

  const dataMap = filteredResultList.reduce(
      function(dataMap, data, i) {
        const mapValue = data[mapField];

        if (!dataMap[mapValue]) {
          dataMap[mapValue] = [];
        }
        dataMap[mapValue].push(data);
        return dataMap;
      },
      {},
  );

  return Object.entries(dataMap).map(
      function([mapValue, childDataListOriginal]) {
        const summaryResultsOriginal = childDataListOriginal.filter(
            function(data) {
              return data['type'] === RESULT.TYPE.SUMMARY;
            },
        );
        const totalElectorsOriginal = sum(summaryResultsOriginal.map(
            function(data) {
              return data['electors'];
            },
        ));

        const childDataList = childDataListOriginal.filter(
            function(data) {
              return data['timestamp'] <= maxTimestamp;
            },
        );

        const summaryResults = childDataList.filter(
            function(data) {
              return data['type'] === RESULT.TYPE.SUMMARY;
            },
        );
        const totalElectors = sum(summaryResults.map(
            function(data) {
              return data['electors'];
            },
        ));

        const partyResults = childDataList.filter(
            function(data) {
              return data['type'] === RESULT.TYPE.PARTY;
            },
        );

        return [
          mapValue,
          partyResults,
          summaryResults,
          totalElectors,
          totalElectorsOriginal,
        ];
      },
  );
}
