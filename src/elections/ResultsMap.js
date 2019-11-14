// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import PARTY_TO_HUE from './data/party_to_hue.json';

/**
 * Displays a map of regions, and colors them according to
 * election results
 **/
export default class ResultsMap extends Component {
  /**
   * @return {jsx}
   */
  render() {
    const childLabelPrefix = this.props.childLabelPrefix;
    const childCodeField = childLabelPrefix + '_code';
    const results = this.props.results;

    const winningPartyByChild = results.reduce(
      function (winningPartyByChild, forChild, i) {
        const childCode = forChild[childCodeField];
        const byParty = forChild['by_party'];

        // eslint-disable-next-line
        const [winningParty, maxVotes] = byParty.reduce(
          function ([winningParty, maxVotes], forParty, j) {
            const party = forParty['party_code'];
            const votes = forParty['votes'];

            if (maxVotes < votes) {
              maxVotes = votes;
              winningParty = party;
            }
            return [winningParty, maxVotes];
          },
          ['', 0],
        );

        winningPartyByChild[childCode] = winningParty;
        return winningPartyByChild;
      },
      {},
    );

    // render
    const mapDir = this.props.mapDir;
    if (mapDir.indexOf('Cumulative') !== -1) {
      return null;
    }

    const allHeight = 300;
    const allTop = 0;
    const allLeft = 0;
    let config = [];

    try {
      config = require(mapDir + '/config.json');
    } catch (e) {
      config = [];
      console.log(mapDir + '/config.json  not found')
    }

    const t = function (x, k = 1.0) {
      const ALL_HEIGHT_DATA = 1000;
      return parseInt(x) * allHeight * k / ALL_HEIGHT_DATA;
    };
    const _imageList = config.map(
      function (info, i) {
        const key = 'image-' + i;
        const pngFileName = info['png_file_name'];

        const code = pngFileName.replace(
          'img.' + childLabelPrefix + '.', ''
        ).replace('.png', '');
        const imgSrc = require('' + mapDir + '/' + pngFileName);

        const top = allTop + t(info['top']);
        const left = allLeft + t(info['left']);
        const height = t(info['height']);

        let filter = 'grayscale(100%) opacity(10%)';

        const winningParty = winningPartyByChild[code];
        if (winningParty) {
          const h = PARTY_TO_HUE[winningParty];
          filter = 'hue-rotate(' + h + 'deg)';
        }

        const isActiveCode = (code === this.props.activeCode);
        if (!isActiveCode) {
          filter += ' opacity(50%)';
        }

        const onClick = function (e) {
          this.props.onClickMap(code);
        }.bind(this);

        const onMouseOver = function (e) {
          this.props.onSelectLabel(code);
        }.bind(this);

        return (
          <span>
            <img
              className="img-map"
              onMouseOver={onMouseOver}
              key={key}
              onClick={onClick}
              src={imgSrc}
              alt={code}
              style={{
                position: 'absolute',
                top: top,
                left: left,
                height: height,
                filter: filter,
              }}
            />
          </span>
        );
      }.bind(this),
    );

    return (
      <div className="div-results-map div-results-view-item">
        {_imageList}
      </div>
    );
  }
}
