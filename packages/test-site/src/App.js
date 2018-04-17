import React, { Component } from 'react';
/* import SpotifyPlayBar from 'spotify-play-bar';*/
var SpotifyPlayBar = require('spotify-play-bar');

class App extends Component {
  componentWillMount() {
    console.log(SpotifyPlayBar);
  }
  render() {
    return (
      <div className="App">
        <h1>Here's a demo app!</h1>
        <SpotifyPlayBar />
      </div>
    );
  }
}

export default App;
