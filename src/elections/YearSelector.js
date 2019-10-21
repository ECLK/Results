/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
/* eslint-enable no-unused-vars */

/**
 * Display a meny with the years of elections, which can be
 * selected by clicking.
 **/
export default class YearSelector extends Component {
  /**
   * @return {jsx}
   **/
  render() {
    const _yearList = this.props.yearList.map(
        function(year, i) {
          const key = 'year-selector-' + i;
          let className = 'year-selector-item ';
          let onClick = undefined;

          if (i === this.props.selectedYearIndex) {
            className += 'year-selector-item-selected';
          } else {
            className += 'year-selector-item-not-selected';
            onClick = function(e) {
              this.props.onUpdateSelectedYear(i);
            }.bind(this);
          }

          return (
            <span
              className={className}
              key={key}
              onClick={onClick}>
              {year}
            </span>
          );
        }.bind(this),
    );
    return (
      <div className="div-year-selector">
        {_yearList}
      </div>
    );
  }
}
