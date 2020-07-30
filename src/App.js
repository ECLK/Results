import React, {Component} from 'react';
import './App.css';
import ReactGA from 'react-ga';
import HomePage from './elections/components/HomePage.js';

ReactGA.initialize('UA-152857980-2');
ReactGA.pageview('/');
export default class App extends Component {
  render() {
    return (
      <div className="App" key="App">
        <HomePage />
      </div>
    );
  }
}
