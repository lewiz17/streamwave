import { Component } from 'preact';
import { connect } from 'react-redux';
import Transition from 'react-transition-group/Transition';
import styled from 'styled-components';
import ProgressBar from '../components/progress-bar';
import Player from '../player';
import Constants from '../constants';

import {
  getCoverURL,
  getArtist,
  getTrack,
  isMusicPlaying,
  isMusicChromecasting,
  switchPlayingStatus
} from '../store/player';

const progressBarHeight = 5;

const Container = styled.div`
  position: fixed;
  bottom: ${props => props.theme.navbar.height};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: ${props => props.theme.miniPlayer.height};
  width: 100%;
  max-width: 500px;
  background: ${props => props.theme.miniPlayer.background};
  transition: opacity 0.3s cubic-bezier(0, 0, 0.3, 1);
  will-change: opacity;
`;

const ProgressContainer = styled.div`
  position: absolute;
  top: ${-progressBarHeight}px;
  width: 100%;
  left: 0;
  height: ${progressBarHeight}px;
`;

const MiniCoverContainer = styled.div`
  height: 100%;
  margin-right: 10px;
`;

const MiniCoverArtwork = styled.img`
  height: 100%;
  max-width: 100%;
`;

const MusicInfosContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  flex-grow: 1;
`;

const Artist = styled.div`
  font-size: 12px;
`;

const Title = styled.div`
  font-size: 14px;
`;

const ControlsContainer = styled.div`
  height: 100%;
  min-width: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  border: none;
  background: none;
`;

const mapStateToProps = state => ({
  coverURL: getCoverURL(state),
  artist: getArtist(state),
  track: getTrack(state),
  playing: isMusicPlaying(state),
  chromecasting: isMusicChromecasting(state)
});

const mapDispatchToProps = dispatch => ({
  switchPlayingStatus: _ => dispatch(switchPlayingStatus())
});

class MiniPlayer extends Component {
  constructor () {
    super();
    this.onPlayClick = this.onPlayClick.bind(this);
  }

  componentDidMount () {
    this.player = new Player();
  }

  onPrevClick () {

  }

  onPlayClick () {
    // get last status
    const playing = this.props.playing;
    // switch status in store
    this.props.switchPlayingStatus();
    // update audio
    playing ? this.player.pause() : this.player.play();
  }

  render ({
    coverURL, artist, track,
    playing, chromecasting,
    onPrevClick, onNextClick, onPlayClick,
    onChromecastClick, switchPlayingStatus
  }) {
    //const {title, duration} = track;
    return (
        <Container>
          <ProgressContainer>
            <ProgressBar />
          </ProgressContainer>

          <MiniCoverContainer>
            <MiniCoverArtwork src={coverURL && `${Constants.CDN_URL}/${coverURL}`}/>
          </MiniCoverContainer>

          <MusicInfosContainer>
            <Artist>{artist}</Artist>
            <Title>{track && track.title}</Title>
          </MusicInfosContainer>

          <ControlsContainer>
            <Button onClick={onPrevClick}>
              <svg width="37px" height="22px" viewBox="0 0 37 22" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="Icons-Pattern-One" transform="translate(-709.000000, -286.000000)" fill="#FFF">
                    <g id="Previous" transform="translate(709.000000, 279.000000)">
                      <path
                        d="M31.5350008,15.0036284 L17.8240107,7.18215392 C17.6148869,7.06285864
                        17.3771339,7 17.135042,7 C16.3797696,7 15.7675004,7.59886165
                        15.7675004,8.33759493 L15.7675004,15.0036284 L2.05651029,7.18215392
                        C1.8473865,7.06285864 1.60963353,7 1.36754162,7 C0.612269239,7 0,7.59886165 0,8.33759493
                        L0,27.0609378 C0,27.2977283 0.0642659496,27.5302749 0.186232067,27.7348193 C0.566738954,28.3729517
                        1.40409104,28.5885533 2.05651029,28.2163788 L15.7675004,20.3949043 L15.7675004,27.0609378
                        C15.7675004,27.2977283 15.8317664,27.5302749 15.9537325,27.7348193 C16.3342394,28.3729517
                        17.1715914,28.5885533 17.8240107,28.2163788 L31.5350008,20.3949043 L31.5350008,26.1462505
                        C31.5350008,27.3902719 32.5434794,28.3987505 33.7875009,28.3987505 C35.0315223,28.3987505
                        36.0400009,27.3902719 36.0400009,26.1462505 L36.0400009,9.25250006 C36.0400009,8.00847863
                        35.0315223,7 33.7875009,7 C32.5434794,7 31.5350008,8.00847863 31.5350008,9.25250006
                        L31.5350008,15.0036284 L31.5350008,15.0036284 Z"
                        transform="translate(18.020000, 17.699375) scale(-1, 1) translate(-18.020000, -17.699375) "
                      />
                    </g>
                  </g>
                </g>
              </svg>
            </Button>
            <Button onClick={this.onPlayClick}>
              {
                playing ?
                <svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path
                    d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2
                      12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z"
                  />
                </svg>
                :
                <svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path
                    d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48
                      10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                  />
                </svg>
              }
            </Button>
            <Button onClick={onNextClick}>
              <svg width="36px" height="22px" viewBox="0 0 36 22" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none">
                  <g id="Icons-Pattern-One" transform="translate(-558.000000, -286.000000)" fill="#FFF">
                    <g id="Next" transform="translate(558.000000, 279.000000)">
                      <path
                        d="M17.8042278,7.18195175 C17.5953361,7.06278887 17.357847,7 17.1160238,7
                        C16.3615897,7 15.75,7.59819697 15.75,8.33611033 L15.75,14.9947452
                        L2.05422776,7.18195175 C1.84533608,7.06278887 1.607847,7 1.36602378,7
                        C0.61158968,7 0,7.59819697 0,8.33611033 L0,27.0386721 C0,27.2751998
                        0.0641946206,27.5074883 0.186025367,27.7118056 C0.566109929,28.3492298
                        1.40253263,28.564592 2.05422776,28.1928307 L15.75,20.3800372 L15.75,27.0386721
                        C15.75,27.2751998 15.8141946,27.5074883 15.9360254,27.7118056 C16.3161099,28.3492298
                        17.1525326,28.564592 17.8042278,28.1928307 L31.5,20.3800372 L31.5,26.125 C31.5,27.3676407
                        32.5073593,28.375 33.75,28.375 C34.9926407,28.375 36,27.3676407 36,26.125 L36,9.25 C36,8.00735931
                        34.9926407,7 33.75,7 C32.5073593,7 31.5,8.00735931 31.5,9.25 L31.5,14.9947452 L17.8042278,7.18195175 Z"
                      />
                    </g>
                  </g>
                </g>
              </svg>
            </Button>
            <Button onClick={onChromecastClick}>
            {
              chromecasting ?
              <svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none" opacity=".1"/>
                <path d="M0 0h24v24H0z" fill="none"/>
                <path
                  d="M1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24
                    5 5h2c0-3.87-3.13-7-7-7zm18-7H5v1.63c3.96 1.28 7.09
                    4.41 8.37 8.37H19V7zM1 10v2c4.97 0 9 4.03 9
                    9h2c0-6.08-4div class='mini-player'.93-11-11-11zm20-7H3c-1.1 0-2 .9-2
                    2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                />
              </svg>
              :
              <svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none" opacity=".1"/>
                <path d="M0 0h24v24H0z" fill="none"/>
                <path
                  d="M21 3H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1
                  0 2-.9 2-2V5c0-1.1-.9-2-2-2zM1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24
                  5 5h2c0-3.87-3.13-7-7-7zm0-4v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11z"
                />
              </svg>
            }
            </Button>
          </ControlsContainer>
        </Container>
    );
  }
}

MiniPlayer.defaultProps = {
  playing: false,
  chromecasting: false
}

export default connect(mapStateToProps, mapDispatchToProps)(MiniPlayer);