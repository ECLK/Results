import React, {Component} from 'react';
import './App.css';
import ReactGA from 'react-ga';
import HomePage from './elections/components/HomePage.js';

export default class App extends Component {

   initializeReactGA() {
    ReactGA.initialize('UA-152857980-2');
    ReactGA.pageview('/#App');
  }

  componentDidMount() {
    this.initializeReactGA();
  }

  render() {
    return (
      <div className="App" key="App">
        <HomePage />
      </div>
    );
  }
}
