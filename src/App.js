import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            基于WebIDE的快速物联网开发平台<br />powered by&nbsp;
              <a 
                className="App-link" 
                href="https://reactjs.org" 
                target="_blank" 
                rel="noopener noreferrer">
                React
              </a>
          </p>
        </header>
      </div>
    )
  }
}

export default App;
