
import PARTY_TO_H from '../constants/PARTY_TO_H.js';
import PARTY_CODE_TO_INFO from '../constants/PARTY_CODE_TO_INFO.js';

import {hsla} from '../utils/color.js';
import {parsePctStr} from '../utils/data.js';

const DEFAULT_BACK_COLOR = 'white';

export function getPartyList(result) {
  return result['by_party'].map(
    function(x) {
      return x['party_code'];
    },
  );
}

export function getWinningParty(result) {
  return result['by_party'][0]['party_code'];
}

export function getPartyName(partyCode) {
  return (PARTY_CODE_TO_INFO[partyCode])
    ? PARTY_CODE_TO_INFO[partyCode]['party_name']
    : '';
}

export function getPartyColor(partyCode, isWin, pctStr) {
  let p = parsePctStr(pctStr);

  if (!isWin) {
    return DEFAULT_BACK_COLOR;
  }

  let h = 0, s = 0;
  if (PARTY_TO_H[partyCode] !== undefined) {
    h = PARTY_TO_H[partyCode];
    s = 100;
  }

  let a;
  if (p < 0.5) {
    a = 0.2;
  } else if (p > 0.67) {
    a = 0.6;
  } else {
    a = 0.4;
  }
  return hsla(h, s, 50, a);
}
