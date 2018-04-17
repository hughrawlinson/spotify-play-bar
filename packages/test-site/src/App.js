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
            cb("BQBco9Xt65FvJ3B2WAbQymhJkIobBTHl6umjScCMBmETBB4LpCWpkH5-IuvZkIw_Mf3SniJPpvMTdkgN9_lnsMOZCQy0yjYbAuGAnh1yYLZNJbtNpt-hO4XQtoW42xQV7GussRUiO8zYMT7cBKopLWvHpTvo-gHXLaBZUIvd");
          }}/>
      </div>
    );
  }
}

export default App;
