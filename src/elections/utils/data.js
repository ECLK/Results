import fileDownload from 'js-file-download';

import ED_TO_PD_LIST from '../constants/ED_TO_PD_LIST.js';
import {cacheGet} from '../utils/cache.js';

async function getJson(jsonFileName, isCached=false) {
  async function fallback() {
    const response = await fetch(jsonFileName);
    return await response.json();
  }
  if (isCached) {
    const cacheKey = jsonFileName;
    return await cacheGet(cacheKey, fallback);
  } else {
    return fallback();
  }
}

export async function getResults(year) {
  const dataFileName = `data/elections/gen_elec_sl.ec.results.${year}.json`;
  return await getJson(dataFileName)
}

export async function getResultGroups(year) {
  const resultList = await getResults(year)
  return mapReduce(resultList.slice(0, 1000), x => x.type, x => x);
}

export async function getRegionList(edCode) {
  const pdList = ED_TO_PD_LIST[edCode];
  return Promise.all(pdList.map(
    async function(pdCode) {
      const polygonFileName = `data/maps/EC-${pdCode}.json`;
      return {
          childRegionCode: pdCode,
          polygonList: await getJson(polygonFileName, false),
      }
    },
  ));
}

export async function getRegionListLK() {
  const edList = Object.keys(ED_TO_PD_LIST);
  return Promise.all(edList.map(
    async function(edCode) {
      const polygonFileName = `data/maps/EC-${edCode}.json`;
      return {
          childRegionCode: edCode,
          polygonList: await getJson(polygonFileName, true),
      }
    },
  ));
}

export function parsePctStr(pctStr) {
  if (!pctStr) {
    return 1.0;
  }
  return parseFloat(pctStr.substring(0, pctStr.length - 1)) / 100.0;
}

export function mapReduce(dataList, funcMapKey, funcReduceList) {
  const dataMap = dataList.reduce(
    function(dataMap, data) {
      const key = funcMapKey(data);
      if (!dataMap[key]) {
        dataMap[key] = [];
      }
      dataMap[key].push(data);
      return dataMap;
    },
    {},
  );

  return Object.keys(dataMap).reduce(
    function(dataReduced, key) {
      dataReduced[key] = funcReduceList(dataMap[key]);
      return dataReduced;
    },
    {},
  );
}

export function sort(dataList, sortField) {
  return dataList.sort(
    function(a, b) {
      return a[sortField].localeCompare(b[sortField]);
    },
  );
}

export async function downloadResults(year) {
  const resultList = await getResults(year);
  fileDownload(
    JSON.stringify(resultList),
    `gen_elec_sl.ec.results.${year}.json`,
  );
}
