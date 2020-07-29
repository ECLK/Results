export async function cacheGet(cacheKey, fallback) {
  const tStart = Date.now()
  const dataJson = localStorage.getItem(cacheKey);
  if (dataJson) {
    return JSON.parse(dataJson);
  }

  const data = await fallback();
  if (data) {
    const dataJsonHot = JSON.stringify(data);
    localStorage.setItem(cacheKey, dataJsonHot);

    const tDelta = Date.now() - tStart;
    const dataSize = dataJsonHot.length / 1000;
    console.debug(`cacheGet*: ${cacheKey} ${dataSize}KB  in ${tDelta}s`);
  }
  return data;
}
