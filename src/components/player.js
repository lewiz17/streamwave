import { h, Component } from 'preact';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ProgressBar from './progress-bar';
import { shuffle, formatDuration, getRGBCssFromObject } from '../utils';
import Range from './range';
import PlaylistModal from './playlist-modal';
import Constants from '../constants';

import closeIcon from '../assets/svg/close.svg';
import addIcon from '../assets/svg/add.svg';
import volumeMuteIcon from '../assets/svg/volume-mute.svg';
import volumeMaxIcon from '../assets/svg/volume-max.svg';

import {
  getShowPlayer,
  getCoverURL,
  getArtist,
  getTrack,
  getQueue,
  getPrimaryColor,
  isMusicPlaying,
  isShuffle,
  isRepeat,
  isMusicChromecasting,
  switchPlayingStatus,
  setCurrentIndex,
  setPrevTrack,
  setNextTrack,
  setQueue,
  getCurrentTime,
  getDuration,
  switchSuffleStatus,
  switchRepeatStatus,
  switchPlayerStatus
} from '../store/player';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.background};
  overflow: hidden;
  z-index: 10000;
  opacity: ${props => props.show ? 1 : 0};
  transform: translateY(${props => props.show ? 0 : '100%'});
  pointer-events: ${props => props.show ? 'auto' : 'none'};
  transition: opacity 0.3s cubic-bezier(0, 0, 0.3, 1), transform 0.5s cubic-bezier(0, 0, 0.3, 1);
  will-change: transform, opacity;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  border: none;
  background: none;
`;

const Close = styled(Button)`
  position: absolute;
  top: 15px;
  left: 15px;
  background: url(${closeIcon}) no-repeat no-repeat;
  background-size: 24px 24px;
  width: 24px;
  height: 24px;
`;

const CoverContainer = styled.section`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 60px;
`;

const Cover = styled.div``;

const Artwork = styled.img`
  max-width: 300px;
`;

const InfoContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
`;

const Infos = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Artist = styled.span`
  font-size: 12px;
  font-weight: 400;
`;

const Title = styled.span``;

const AddToPlaylist = styled.button`
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  border: none;
  background: none;
`;

const ProgressAndControlsContainer = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ProgressWrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5px;
  width: 100%;
  max-width: 800px;
  margin: 35px 0;
`;

const VolumeWrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin-top: 20px;
`;

const CurrentTime = styled.span`
  margin: 0 10px;
  font-weight: bold;
`;

const TotalTime = styled.div`
  margin: 0 10px;
  font-weight: bold;
`;

const Controls = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CenterControls = styled(Button)`
  margin: 0 5px;
`;

const OutsideControls = styled(Button)`
  margin: 0 10px;
`;

const Shuffle = styled(OutsideControls)``;
const Prev = styled(CenterControls)``;
const Play = styled(CenterControls)``;
const Next = styled(CenterControls)``;
const Repeat = styled(OutsideControls)``;

const SVG = styled.svg`
`;

const Chromecast = styled(Button)`
  position: absolute;
  top: 15px;
  right: 15px;
`;

const VolumeMute = styled.div`
  background: url(${volumeMuteIcon}) no-repeat no-repeat center;
  background-size: 18px 18px;
  width: 18px;
  height: 18px;
  margin: 0 5px;
`;

const VolumeMax = styled.div`
  background: url(${volumeMaxIcon}) no-repeat no-repeat center;
  background-size: 20px 20px;
  width: 20px;
  height: 20px;
  margin: 0 5px;
`;

const mapStateToProps = state => ({
  showPlayer: getShowPlayer(state),
  coverURL: getCoverURL(state),
  primaryColor: getPrimaryColor(state),
  artist: getArtist(state),
  track: getTrack(state),
  playing: isMusicPlaying(state),
  shuffle: isShuffle(state),
  repeat: isRepeat(state),
  queue: getQueue(state),
  chromecasting: isMusicChromecasting(state),
  currentTime: getCurrentTime(state),
  totalTime: getDuration(state)
});

const mapDispatchToProps = dispatch => ({
  switchPlayerStatus: payload => dispatch(switchPlayerStatus(payload)),
  switchSuffleStatus: _ => dispatch(switchSuffleStatus()),
  switchRepeatStatus: _ => dispatch(switchRepeatStatus()),
  setQueue: queue => dispatch(setQueue(queue)),
  setCurrentIndex: ({index}) => dispatch(setCurrentIndex({index}))
});

class Player extends Component {
  constructor () {
    super();

    this.closePlayer = this.closePlayer.bind(this);
    this.onPrevClick = this.onPrevClick.bind(this);
    this.onNextClick = this.onNextClick.bind(this);
    this.onPlayClick = this.onPlayClick.bind(this);
    this.onShuffleClick = this.onShuffleClick.bind(this);
    this.onRepeatClick = this.onRepeatClick.bind(this);
    this.onChromecastClick = this.onChromecastClick.bind(this);
    this.addToPlaylist = this.addToPlaylist.bind(this);
    this.removePlaylistModal = this.removePlaylistModal.bind(this);

    this.state = {
      showPlaylistModal: false
    }
  }

  shouldComponentUpdate (prevProps, prevState) {
    // do not rerender if track list changed
    if (this.props.tracks !== prevProps.tracks) {
      return false;
    }

    return true;
  }

  closePlayer () {
    this.props.switchPlayerStatus({show: false});
  }

  onPrevClick () {
    this.props.prev();
  }

  onNextClick () {
    this.props.next({continuous: false});
  }

  onPlayClick () {
    // get last status
    const playing = this.props.playing;
    // switch status in store
    this.props.onPlayClick({playing});
  }

  onChromecastClick () {
    const {chromecasting} = this.props;
    const data = {
      type: 'song',
      artist: this.props.artist,
      title: this.props.title,
      coverURL: this.props.coverURL,
      track: this.props.track,
      currentTime: this.props.currentTime,
      duration: this.props.duration,
      playing: this.props.playing,
      primaryColor: this.props.primaryColor,
      manifestURL: this.props.manifestURL
    };

    this.props.chromecast({chromecasting, data});
  }

  onShuffleClick (evt) {
    const isShuffle = !this.props.shuffle;
    // maybe should ensure that component
    // does not rerender when track list change
    let queue = this.props.queue;
    if (isShuffle) {
      // shuffle
      queue = shuffle(queue);
    } else {
      // unshuffle, sort by track number
      queue = queue.sort((trackA, trackB) => trackA.number - trackB.number);
      // get number of the track (currentIndex will be number - 1)
      const {number} = this.props.track;
      // set current index, so queue begins at current track
      // e.g. track is #1 but in last position of shuffled queue.
      this.props.setCurrentIndex({index: number - 1});
    }

    this.props.setQueue(queue);
    this.props.switchSuffleStatus();
  }

  onRepeatClick (evt) {
    // if repeat status, store is gonna take care
    // of looping the queue
    this.props.switchRepeatStatus();
  }

  addToPlaylist (evt) {
    this.setState({
      showPlaylistModal: true
    });
  }

  removePlaylistModal () {
    this.setState({
      showPlaylistModal: false
    });
  }

  render ({
    showPlayer, coverURL, artist, title, duration,
    playing, chromecasting, shuffle, repeat,
    track, currentTime, totalTime, primaryColor,
    seek, onVolumeChange
  }, {
    showPlaylistModal
  }) {
    // no track loaded
    if (track === null) {
      return null;
    }

    return (
      <Container show={showPlayer}>
        <Close onClick={this.closePlayer} aria-label="close player"/>
        <Chromecast onClick={this.onChromecastClick} aria-label="chromecast music">
          {
            chromecasting ?
            <svg fill="#FFFFFF" height="27" width="27" viewBox="0 0 27 27" xmlns="http://www.w3.org/2000/svg">
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
            <svg fill="#FFFFFF" height="27" width="27" viewBox="0 0 27 27" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0h24v24H0z" fill="none" opacity=".1"/>
              <path d="M0 0h24v24H0z" fill="none"/>
              <path
                d="M21 3H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1
                0 2-.9 2-2V5c0-1.1-.9-2-2-2zM1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24
                5 5h2c0-3.87-3.13-7-7-7zm0-4v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11z"
              />
            </svg>
          }
        </Chromecast>
        <CoverContainer background={primaryColor}>
          <Cover>
            <Artwork src={coverURL && `${Constants.CDN_URL}/${coverURL}`} alt="cover artwork" />
            <InfoContainer>
              <Infos>
                <Title>{track && track.title}</Title>
                <Artist>{artist && artist}</Artist>
              </Infos>
              <AddToPlaylist onClick={this.addToPlaylist} aria-label="add to playlist">
                <img src={addIcon} alt="add to playlist" />
              </AddToPlaylist>
            </InfoContainer>
          </Cover>
        </CoverContainer>
        <ProgressAndControlsContainer>
          <ProgressWrapper>
            <CurrentTime>{formatDuration(currentTime)}</CurrentTime>
            <ProgressBar seek={seek} borderRadius={true} />
            <TotalTime>{formatDuration(totalTime)}</TotalTime>
          </ProgressWrapper>
          <Controls>
            <Shuffle onClick={this.onShuffleClick} aria-label="shuffle tracklist">
              <SVG width="27px" height="22px" viewBox="0 0 36 22" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="Icons-Pattern-One" transform="translate(-105.000000, -284.000000)" fill-rule="nonzero" fill={shuffle ? "#4A90E2" : "#FFF"}>
                    <g id="Shuffle" transform="translate(105.000000, 279.000000)">
                      <path
                        d="M27.8181818,7.90769231 L27.8181818,5 L36,9.84615385 L27.8181818,14.6923077
                        L27.8181818,11.7846154 L26.2780749,11.7846154 C21.6856675,11.7846154 17.935299,14.2004511
                        14.8973507,19.1680257 C11.7909897,24.5402942 7.30550339,27.2923077 1.63636364,27.2923077
                        L0,27.2923077 L0,23.4153846 L1.63636364,23.4153846 C6.23460357,23.4153846 9.70633647,21.2853468
                        12.2222628,16.9351596 C15.8828829,10.9482669 20.6031026,7.90769231 26.2780749,7.90769231
                        L27.8181818,7.90769231 Z M27.8181818,23.4153846 L27.8181818,20.5076923 L36,25.3538462
                        L27.8181818,30.2 L27.8181818,27.2923077 L26.2780749,27.2923077 C21.7699714,27.2923077
                        17.8643596,25.3735686 14.6137986,21.5833404 C14.7095559,21.4267543 14.8040751,21.267802
                        14.8973507,21.1064873 C15.4697994,20.1704339 16.0675439,19.3249849 16.6914514,18.5692308
                        C19.378581,21.8242149 22.551027,23.4153846 26.2780749,23.4153846 L27.8181818,23.4153846
                        L27.8181818,23.4153846 Z M13.191276,13.5159019 C12.8604615,13.9876198 12.5374349,14.4812386
                        12.2222628,14.996698 C11.884085,15.5814277 11.5286383,16.1260451 11.1555082,16.6307692
                        C8.75267872,13.38052 5.61653194,11.7846154 1.63636364,11.7846154 L0,11.7846154
                        L9.30165036e-14,7.90769231 L1.63636364,7.90769231 C6.34004476,7.90769231 10.2288978,9.80218079
                        13.191276,13.5159019 L13.191276,13.5159019 Z"
                      />
                    </g>
                  </g>
                </g>
              </SVG>
            </Shuffle>
            <Prev onClick={this.onPrevClick} aria-label="prev track">
              <svg width="27px" height="22px" viewBox="0 0 37 22" version="1.1" xmlns="http://www.w3.org/2000/svg">
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
            </Prev>
            <Play onClick={this.onPlayClick} aria-label="play or pause track">
            {
              playing ?
              <svg fill="#FFFFFF" height="45" width="45" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path
                  d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2
                    12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z"
                />
              </svg>
              :
              <svg fill="#FFFFFF" height="45" width="45" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path
                  d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48
                    10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                />
              </svg>
            }
            </Play>
            <Next onClick={this.onNextClick} aria-label="next track">
              <svg width="27px" height="22px" viewBox="0 0 36 22" version="1.1" xmlns="http://www.w3.org/2000/svg">
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
            </Next>
            <Repeat onClick={this.onRepeatClick} aria-label="repeat tracklist">
              <SVG width="28px" height="22px" viewBox="0 0 36 30" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="Icons-Pattern-One" transform="translate(-256.000000, -282.000000)" fill-rule="nonzero" fill={repeat ? "#4A90E2" : "#FFF"}>
                    <g id="Repeat" transform="translate(256.000000, 279.000000)">
                      <path
                        d="M8.64,25.9710983 L19.2030566,25.9710983 C28.1531421,25.9710983 32.16,22.7468816
                        32.16,16 L36,16 C36,25.2145828 30.0888956,29.9710983 19.2030566,29.9710983
                        L8.64,29.9710983 L8.64,33 L5.68434189e-14,28 L8.64,23 L8.64,25.9710983
                        Z M27.36,10.0289017 L16.7969434,10.0289017 C7.84685788,10.0289017
                        3.84,13.2531184 3.84,20 L0,20 C0,10.7854172 5.91110441,6.02890173
                        16.7969434,6.02890173 L27.36,6.02890173 L27.36,3 L36,8 L27.36,13 L27.36,10.0289017 Z"
                      >
                      </path>
                    </g>
                  </g>
                </g>
              </SVG>
            </Repeat>
          </Controls>
          <VolumeWrapper>
            <VolumeMute />
            <Range min={0} max={100} showToolTip={false} onChange={onVolumeChange} />
            <VolumeMax />
          </VolumeWrapper>
        </ProgressAndControlsContainer>
        <PlaylistModal show={showPlaylistModal} removePlaylistModal={this.removePlaylistModal} trackId={track._id} />
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
