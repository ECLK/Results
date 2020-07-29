export function getBBox(regionList) {
  const [MIN_LAT, MAX_LAT] = [-90, 90];
  const [MIN_LNG, MAX_LNG] = [-180, 180];

  const [minLat, maxLat, minLng, maxLng] = regionList.reduce(
    function([minLat, maxLat, minLng, maxLng], region) {
      const polygonList = region.polygonList;
      return polygonList.reduce(
        function([minLat, maxLat, minLng, maxLng], polygon) {
          return polygon.reduce(
            function([minLat, maxLat, minLng, maxLng], [lat, lng]) {
              minLat = Math.min(minLat, lat);
              maxLat = Math.max(maxLat, lat);
              minLng = Math.min(minLng, lng);
              maxLng = Math.max(maxLng, lng);
              return [minLat, maxLat, minLng, maxLng];
            },
            [minLat, maxLat, minLng, maxLng],
          );
        },
        [minLat, maxLat, minLng, maxLng],
      );
    },
    [MAX_LAT, MIN_LAT, MAX_LNG, MIN_LNG],
  );
  return [minLat, maxLat, minLng, maxLng];
}

export function getMid(polygonList) {
  const [minLat, maxLat, minLng, maxLng] = getBBox([{
      polygonList: polygonList,
  }])
  return [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
}

export function getT(regionList, width, height) {

  const [minLat, maxLat, minLng, maxLng] = getBBox(regionList)

  const latSpan = maxLat - minLat;
  const lngSpan = maxLng - minLng;

  const r = (latSpan / lngSpan) / (height / width);
  let [actualWidth, actualHeight] = [width, height];
  if (r > 1) {
    actualWidth /= r;
  } else {
    actualHeight *= r;
  }

  function t([lat, lng]) {
    const px = (lng - minLng) / lngSpan;
    const py = (lat - minLat) / latSpan;
    const x = actualWidth * px;
    const y = actualHeight * (1 - py);
    return [x, y];
  }
  return [t, actualWidth, actualHeight];
}
