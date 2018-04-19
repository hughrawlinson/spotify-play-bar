import React, { Component, Fragment } from 'react';
import './style.scss';

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
    this.setActiveDevice(ready.device_id);
  }


  loadInitialPlayerState() {
    this.makeWebAPIRequest("/v1/me/player");
  }

  setActiveDevice(deviceId) {
    this.makeWebAPIRequest("/v1/me/player", {
      method: "PUT",
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false
      })
    });
  }

  makeWebAPIRequest(endpoint, options) {
    return fetch(`https://api.spotify.com${endpoint}`, {
      headers: {
        "Authorization": `Bearer ${this.state.token}`
      },
      method: options?.method || "GET",
      body: options?.body,
    }).then(r => {
      console.log(r);
      if (!r.bodyUsed) {
        return r.json();
      }
    }).then(data => {
      console.log(data);
    }).catch(message => {
      console.error(message);
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
    this.state.player = player;
  }

  componentDidMount() {
    const script = document.createElement("script");

    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.type = "text/javascript";

    document.body.appendChild(script);
  }

  getErrorMessage(message) {
    return {
      "Authentication failed": {
        type: 'danger',
        message: 'Uh oh! Couldn\'t log you in to Spotify. Try signing in again!'
      }
    }[message];
  }

  getMetadataDOM(track) {
    const trackAndArtists = `${track.name} - ${track.artists.map(artist => artist.name).join(', ')}`;

    console.log(track.artists);
    return (
      <Fragment>
        <img src={track.album.images[0].url} alt={`Album cover for ${trackAndArtists}`} />
        <p className="trackName">{track.name}</p>
        <p className="artistNames">{track.artists.map(artist => artist.name).join(', ')}</p>
      </Fragment>
    );
  }

  getSpotifyBarDOM() {
    if (this.state.errors.length > 0) {
      return (message =>
        (<p className={message.type}>{message.message}</p>)
      )(this.getErrorMessage(this.state.errors[0].message));
    }
    if (!this.state.ready) {
      return (<p>Connecting to Spotify</p>);
    }
    return (
      <Fragment>
        {this.state.player_state?.track_window?.current_track &&
          this.getMetadataDOM(this.state.player_state.track_window.current_track)
         }
      <button>Toggle Shuffle</button>
      <button onClick={() => this.state.player.previousTrack()}>Skip Previous</button>
      <button onClick={() => this.state.player.togglePlay()}>Toggle Play/Pause</button>
      <button onClick={() => this.state.player.nextTrack()}>Skip Next</button>
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

  render() {
    return (<div className="SpotifyPlayBar">{this.getSpotifyBarDOM()}</div>)
  }
}

export default SpotifyPlayBar;
