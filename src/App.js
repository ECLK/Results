import React, {Component} from 'react';
import './App.css';

import HomePage from './elections/components/HomePage.js';

export default class App extends Component {
  render() {
    return (
      <div className="App" key="App">
        <HomePage />
      </div>
    );
  }
}
