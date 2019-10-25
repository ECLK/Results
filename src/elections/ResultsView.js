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

    return (
      <div className="div-results-view-outer">
        <h2 className='h2-label'>{this.props.label}</h2>
        <div className="div-results-view">
          <ResultsTable
            partyResults={this.props.partyResults}
            summaryResults={this.props.summaryResults}
            childLabelField={this.props.childLabelField}
            label={this.props.label}

            height={this.props.height}
            top={this.props.top}
            left={this.props.left}

            onClickMap={this.props.onClickMap}
            onSelectLabel={onSelectLabel}
            activeLabel={this.state.activeLabel}
          />
          <ResultsPieChart
            partyResults={this.props.partyResults}
            summaryResults={this.props.summaryResults}
            childLabelField={this.props.childLabelField}
          />
          <ResultsMap
            partyResults={this.props.partyResults}
            summaryResults={this.props.summaryResults}
            childLabelField={this.props.childLabelField}

            mapDir={this.props.mapDir}
            onClickMap={this.props.onClickMap}
            onSelectLabel={onSelectLabel}
            activeLabel={this.state.activeLabel}
          />

        </div>
      </div>
    );
  }
}
