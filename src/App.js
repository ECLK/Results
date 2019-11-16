import React from 'react';
import HomePage from './elections/HomePage.js';
import './App.css';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-152722495-1');
ReactGA.pageview(window.location.pathname + window.location.search);


function App() {
  return <HomePage />;
}
 
export default App;
