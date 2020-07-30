import React, {Component} from 'react';
import './App.css';
import ReactGA from 'react-ga';
import HomePage from './elections/components/HomePage.js';

export default class App extends Component {

  componentDidMount(){
    ReactGA.initialize('UA-152857980-2');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
  render() {
    return (
      <div className="App" key="App">
        <HomePage />
      </div>
    );
  }
}
