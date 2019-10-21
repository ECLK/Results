// eslint-disable-next-line no-unused-vars
import React, {Component} from 'react';

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
    const byChild = this.props.resultsByChild;
    const childLabelField = this.props.childLabelField;

    const winningPartyByChild = byChild.reduce(
        function(winningPartyByChild, forChild, i) {
          const childLabel = forChild[childLabelField];
          const byParty = forChild['by_party'];

          // eslint-disable-next-line
        const [winningParty, maxVotes] = byParty.reduce(
              function([winningParty, maxVotes], forParty, j) {
                const party = forParty['party'];
                const votes = forParty['votes'];

                if (maxVotes < votes) {
                  maxVotes = votes;
                  winningParty = party;
                }
                return [winningParty, maxVotes];
              },
              ['', 0],
          );

          winningPartyByChild[childLabel] = winningParty;
          return winningPartyByChild;
        },
        {},
    );

    // render
    const mapDir = this.props.mapDir;

    const allHeight = this.props.height;
    const allTop = this.props.top;
    const allLeft = this.props.left;

    const config = require(mapDir + '/config.json');


    const ALL_HEIGHT_DATA = 1000;
    const t = function(x, k=1.0) {
      return parseInt(x) * allHeight * k / ALL_HEIGHT_DATA;
    };
    const _imageList = config.map(
        function(info, i) {
          const key = 'image-' + i;
          const pngFileName= info['png_file_name'];
          const label = info['label'];

          const imgSrc = require('' + mapDir + '/' + pngFileName);

          const top = allTop + t(info['top']);
          const left = allLeft + t(info['left']);
          const height = t(info['height']);

          let filter = 'grayscale(100%) opacity(10%)';

          const winningParty = winningPartyByChild[label];
          const h = PARTY_TO_HUE[winningParty];
          filter = 'hue-rotate(' + h + 'deg)';

          const isActiveLabel = (label === this.props.activeLabel);
          if (!isActiveLabel) {
            filter += ' opacity(50%)';
          }

          const onClick = function(e) {
            this.props.onClickMap(label);
          }.bind(this);

          const onMouseOver = function(e) {
            this.props.onSelectLabel(label);
          }.bind(this);

          return (
            <img
              className="img-map"
              onMouseOver={onMouseOver}
              key={key}
              onClick={onClick}
              src={imgSrc}
              alt={label}
              style={{
                position: 'absolute',
                top: top,
                left: left,
                height: height,
                filter: filter,
              }}
            />
          );
        }.bind(this),
    );

    return (
      <div className="div-results-map">
        {_imageList}
      </div>
    );
  }
}
