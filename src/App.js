import React from 'react';
import HomePage from './elections/HomePage.js';
import './App.css';
import ReactGA from 'react-ga';

function App() {
  return <HomePage />;
}

function initializeReactGA() {
  ReactGA.initialize('UA-152722495-1');
  ReactGA.pageview('/homepage');
}
export default App;
