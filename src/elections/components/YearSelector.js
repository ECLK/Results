import React, {Component} from 'react';

import GEN_ELEC_YEAR_LIST from '../constants/GEN_ELEC_YEAR_LIST.js';

export default class YearSelector extends Component {
  render() {
    return GEN_ELEC_YEAR_LIST.map(
      function(year) {
        const onClick = function() {
          this.props.onChangeYear(year);
        }.bind(this);

        const className = (this.props.selectedYear === year)
          ? ' a-select-year-selected'
          : '';

        return (
          <a
            key={`Year-${year}`}
            href="#App"
            onClick={onClick}
            className={'a-select-year' + className}>
            {year}
          </a>
        );
      }.bind(this),
    );
  }
}
