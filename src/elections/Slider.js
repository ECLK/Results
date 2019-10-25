// eslint-disable-next-line no-unused-vars
import React, {Component} from 'react';

/**
 * Displays a Slider
 **/
export default class Slider extends Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {value: props.value};
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const max = this.props.max;
    const onChange = function(e) {
      const value = e.target.value;
      this.setState({value: value}, function() {
        this.props.onChange(value);
      }.bind(this));
    }.bind(this);

    const label = 'After ' + this.state.value + '/' + max + ' Results';

    return (
      <div className='div-slider'>
        <p className='p-slider'>
          {label}
        </p>
        <input
          className='input-slider'
          type="range"
          min={1}
          max={max}
          value={this.state.value}
          onChange={onChange}
        />

      </div>
    );
  }
}
