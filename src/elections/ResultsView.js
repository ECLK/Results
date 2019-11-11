/* eslint-disable no-unused-vars */
import React, {Component} from 'react';

import ResultsMap from './ResultsMap.js';
import ResultsTable from './ResultsTable.js';
import ResultsPieChart from './ResultsPieChart.js';
/* eslint-enable no-unused-vars */

/**
 * Displays election results for a region (e.g. Country, Electoral
 * District).
 **/
export default class ResultsView extends Component {
  /**
   * @param {object} props
   **/
  constructor(props) {
    super(props);
    this.state = {activeLabel: undefined};
  }


  /**
   * @return {jsx}
   **/
  render() {
    const onSelectLabel = function(label) {
      this.setState({activeLabel: label});
    }.bind(this);

    let renderedResultsMap = null;
    let renderedPieChart = null;
    let showTotals = false;
    if (this.props.mapDir) {
      renderedResultsMap = (
        <ResultsMap
          results={this.props.results}
          childLabelPrefix={this.props.childLabelPrefix}

          mapDir={this.props.mapDir}
          onClickMap={this.props.onClickMap}
          onSelectLabel={onSelectLabel}
          activeLabel={this.state.activeLabel}
        />
      );
      renderedPieChart = (
        <ResultsPieChart
          results={this.props.results}
          childLabelPrefix={this.props.childLabelPrefix}
        />
      );
      showTotals = true;
    }

    return (
      <div className="div-results-view-outer">
        <h2 className='h2-label'>{this.props.label}</h2>
        <div className="div-results-view">
          <ResultsTable
            results={this.props.results}
            childLabelPrefix={this.props.childLabelPrefix}
            label={this.props.label}

            height={this.props.height}
            top={this.props.top}
            left={this.props.left}

            onClickMap={this.props.onClickMap}
            onSelectLabel={onSelectLabel}
            activeLabel={this.state.activeLabel}

            showTotals={showTotals}
          />
          {renderedPieChart}
          {renderedResultsMap}
        </div>
      </div>
    );
  }
}
