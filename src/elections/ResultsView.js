/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import ResultsMap from './ResultsMap.js';
import ResultsTable from './ResultsTable.js';
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
      <div className="div-results-view">
        <ResultsTable
          resultsByChild={this.props.resultsByChild}
          childLabelField={this.props.childLabelField}
          label={this.props.label}
          height={this.props.height}
          top={this.props.top}
          left={this.props.left}
          onClickMap={this.props.onClickMap}
          onSelectLabel={onSelectLabel}
          activeLabel={this.state.activeLabel}
        />
        <ResultsMap
          resultsByChild={this.props.resultsByChild}
          childLabelField={this.props.childLabelField}
          mapDir={this.props.mapDir}
          height={this.props.height}
          top={this.props.top}
          left={this.props.left}
          onClickMap={this.props.onClickMap}
          onSelectLabel={onSelectLabel}
          activeLabel={this.state.activeLabel}
        />
      </div>
    );
  }
}
