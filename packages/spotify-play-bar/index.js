import React, { Component, Fragment } from 'react';

class SpotifyPlayBar extends Component {
  constructor(props) {
    super(props);

    window['onSpotifyWebPlaybackSDKReady'] = this.onSpotifyWebPlaybackSDKReady.bind(this);

    this.state = {
      errors: [],
      device_id: undefined,
      player_state: undefined
    }

    this.onSpotifyWebPlaybackSDKError = this.onSpotifyWebPlaybackSDKError.bind(this);
    this.onSpotifyWebPlaybackSDKStateChange = this.onSpotifyWebPlaybackSDKStateChange.bind(this);
    this.onSpotifyWebPlaybackSDKPlayerReady = this.onSpotifyWebPlaybackSDKPlayerReady.bind(this);
    this.onSpotifyWebPlaybackSDKReady = this.onSpotifyWebPlaybackSDKReady.bind(this);

    this.loadInitialPlayerState = this.loadInitialPlayerState.bind(this);
  }

  onSpotifyWebPlaybackSDKError(error) {
    this.setState((oldState) => ({
      ...oldState,
      errors: [error, ...oldState.errors]
    }));
  }

  onSpotifyWebPlaybackSDKStateChange(player_state) {
    this.setState((oldState) => ({
      ...oldState,
      player_state
    }));
  }

  onSpotifyWebPlaybackSDKPlayerReady(ready) {
    this.setState((oldState) => ({
      ...oldState,
      ready: ready
    }));

    this.loadInitialPlayerState()
  }

  loadInitialPlayerState() {
    console.log("Loading initial player state");
    fetch("https://api.spotify.com/v1/me/player", {
      headers: {
        "Authorization": `Bearer ${this.state.token}`
      }
    }).then(r => {
      console.log(r);
      if (!r.bodyUsed) {
        return r.json();
      }
    }).then(data => {
      console.log(data);
    });
  }

  onSpotifyWebPlaybackSDKReady() {
    const player = new Spotify.Player({
      name: this.props.name || `Spotify Play Bar | ${window.location.host}`,
      getOAuthToken: cb => {
        this.props.getOAuthToken((token) => {
          this.setState((oldState) => ({
            ...oldState,
            token
          }));
          cb(token);
        })
      }
    });

    player.addListener('initialization_error', this.onSpotifyWebPlaybackSDKError);
    player.addListener('authentication_error', this.onSpotifyWebPlaybackSDKError);
    player.addListener('account_error', this.onSpotifyWebPlaybackSDKError);
    player.addListener('playback_error', this.onSpotifyWebPlaybackSDKError);
    player.addListener('player_state_changed', this.onSpotifyWebPlaybackSDKStateChange);
    player.addListener('ready', this.onSpotifyWebPlaybackSDKPlayerReady);

    player.connect();
  }

  componentDidMount() {
    const script = document.createElement("script");

    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.type = "text/javascript";

    document.body.appendChild(script);
  }

  render() {
    if (!this.state.ready) {
      return (<p>Connecting to Spotify</p>);
    }
    return (
      <Fragment>
        {this.state.player_state &&
         this.state.player_state.track_window &&
         this.state.player_state.track_window.current_track &&
          ((track) => {
            const trackAndArtists = `${track.name} - ${track.artists.map(artist => artist.name).join(', ')}`;
            return (
              <Fragment>
                <img src={track.album.images[0].url} alt={`Album cover for ${trackAndArtists}`} />
                <p className="trackName">{track.name}</p>
                <p className="artistNames">{track.artists.map(artist => artist.name).join(', ')}</p>
              </Fragment>)
          }
          )(this.state.player_state.track_window.current_track)
         }
      <button>Toggle Shuffle</button>
      <button>Skip Previous</button>
      <button>Toggle Play/Pause</button>
      <button>Skip Next</button>
      <button>Toggle Shuffle</button>
      <p>
        Transport goes here
      </p>
      <p>
        Speaker Select
      </p>
      <p>
        Volume Control
      </p>
      </Fragment>
    )
  }
}

export default SpotifyPlayBar;
