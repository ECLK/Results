/**
 * Computes various aggregate stats for election results
 * @param {array} resultsByChild
 * @param {string} childLabelField
 * @return {array}
 **/
export function getAggregateStats(resultsByChild, childLabelField) {
  return resultsByChild.reduce(
      function([
        votesByChildByParty,
        totalVotesByChild,
        votesByParty,
        totalVotes,
        rejectedVotes,
        totalPolled,
        registeredVoters,
      ], resultsForChild, i) {
        const childLabel = resultsForChild[childLabelField];
        const resultsByParty = resultsForChild['by_party'];
        const summaryStats = resultsForChild['summary_stats'];

        totalVotesByChild[childLabel] = 0;
        votesByChildByParty[childLabel] = {};

        [
          votesByChildByParty,
          totalVotesByChild,
          votesByParty,
          totalVotes,
        ] = resultsByParty.reduce(
            function([
              votesByChildByParty,
              totalVotesByChild,
              votesByParty,
              totalVotes,
            ], resultForParty, j) {
              const party = resultForParty['party'];
              const votes = resultForParty['votes'];

              if (!(party in votesByParty)) {
                votesByParty[party] = 0;
              }

              votesByChildByParty[childLabel][party] = votes;
              totalVotesByChild[childLabel] += votes;
              votesByParty[party] += votes;
              totalVotes += votes;

              return [
                votesByChildByParty,
                totalVotesByChild,
                votesByParty,
                totalVotes,
              ];
            },
            [
              votesByChildByParty,
              totalVotesByChild,
              votesByParty,
              totalVotes,
            ],
        );

        rejectedVotes += summaryStats['rejected_votes'];
        totalPolled += summaryStats['total_polled'];
        if (summaryStats['registered_voters']) {
          registeredVoters += summaryStats['registered_voters'];
        }
        return [
          votesByChildByParty,
          totalVotesByChild,
          votesByParty,
          totalVotes,
          rejectedVotes,
          totalPolled,
          registeredVoters,
        ];
      },
      [{}, {}, {}, 0, 0, 0, 0],
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
  const DISPLAY_PARTY_THRESHOLD = 0.009999;
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
