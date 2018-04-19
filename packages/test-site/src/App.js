import React, { Component } from 'react';
import SpotifyPlayBar from 'spotify-play-bar';
/* var SpotifyPlayBar = require('spotify-play-bar');*/

class App extends Component {
  componentWillMount() {
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    return (
      <div className="App">
        <h1>Here's a demo app!</h1>
        <SpotifyPlayBar getOAuthToken={
          (cb) => {
            cb("BQC0yaJATybHkP_NGeuytNH8s92PNQTmimoZGBv6ZWBRCh9MxILPsFn798163OGMuHDUwhiC_pyX8mYcGdalhkKMbUKduD8SG9oe3LesONoou1Ca_Uu6rn2GvTvYPMQDAGzixLlVYs85ZiR5nUzprnEZnBMin_ckdvMNbjWK");
          }}/>
      </div>
    );
  }
}

export default App;
