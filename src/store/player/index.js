import { createSelector } from 'reselect';

// types
const SET_ARTIST = 'SET_ARTIST';
const SET_COVER_URL = 'SET_COVER_URL';
const SET_TRACK = 'SET_TRACK';
const SET_PREV_TRACK = 'SET_PREV_TRACK';
const SET_NEXT_TRACK = 'SET_NEXT_TRACK';
const SET_TRACKS = 'SET_TRACKS';
const SET_QUEUE = 'SET_QUEUE';
const SWITCH_PLAYING_STATUS = 'SWITCH_PLAYING_STATUS';
const SWITCH_SHUFFLE_STATUS = 'SWITCH_SHUFFLE_STATUS';
const SWITCH_REPEAT_STATUS = 'SWITCH_REPEAT_STATUS';
const SET_CHROMECAST_STATUS = 'SET_CHROMECAST_STATUS';
const SET_CURRENT_TIME = 'SET_CURRENT_TIME';

// actions
export function setArtist (artist) {
  return {
    type: SET_ARTIST,
    artist
  }
}

export function setCoverURL (cover) {
  return {
    type: SET_COVER_URL,
    cover
  }
}

export function setTrack ({artist, album, coverURL, track, index}) {
  return {
    type: SET_TRACK,
    artist,
    album,
    coverURL,
    track,
    index
  }
}

export function setPrevTrack () {
  return (dispatch, getState) => {
    const {player: {queue, artist, album, coverURL, currentIndex}} = getState();
    const index = Math.max(0, currentIndex - 1);
    const track = queue[index];
    dispatch({
      type: SET_TRACK,
      index,
      artist,
      album,
      coverURL,
      track
    });
  }
}

export function setNextTrack ({continuous}) {
  return (dispatch, getState) => {
    const {player: {queue, artist, album, coverURL, currentIndex}} = getState();
    const index = ((currentIndex + 1) > (queue.length - 1)) ? 0 : currentIndex + 1;
    const track = queue[index];
    dispatch({
      type: SET_TRACK,
      index,
      artist,
      album,
      coverURL,
      track: (continuous && index === 0) ? null : track
    });
  }
}

export function setTracks (tracks) {
  return {
    type: SET_TRACKS,
    tracks
  }
}

export function setQueue (queue) {
  return {
    type: SET_QUEUE,
    queue
  }
}

export function switchPlayingStatus () {
  return {
    type: SWITCH_PLAYING_STATUS
  }
}

export function switchRepeatStatus () {
  return {
    type: SWITCH_REPEAT_STATUS
  }
}

export function switchSuffleStatus () {
  return {
    type: SWITCH_SHUFFLE_STATUS
  }
}

export function setChromecastStatus (status) {
  return {
    type: SET_CHROMECAST_STATUS,
    status
  }
}

export function setCurrentTime (time) {
  return {
    type: SET_CURRENT_TIME,
    time
  }
}

// selectors
export const getTrack = state => state.player.track;
export const getArtist = state => state.player.artist;
export const getAlbum = state => state.player.album;
export const getTrackName = state => getTrack(state) && getTrack(state).title;
export const getCoverURL = state => state.player.coverURL;
export const isMusicPlaying = state => state.player.playing;
export const isMusicChromecasting = state => state.player.chromecasting;
export const getDuration = state => getTrack(state) && getTrack(state).duration;
export const getCurrentTime = state => state.player.currentTime;

export const getTrackInfos = createSelector(
  getArtist,
  getAlbum,
  getTrackName,
  getCoverURL,
  (artist, album, title, coverURL) => ({artist, album, title, coverURL})
);


// reducers
export default (state = {}, action) => {
  const { type } = action;
  switch (type) {
    case SET_ARTIST:
      return {
        ...state,
        artist: action.artist
      }

    case SET_COVER_URL:
      return {
        ...state,
        coverURL: action.cover
      }

    case SET_TRACK:
      return {
        ...state,
        playing: true,
        artist: action.artist,
        album: action.album,
        coverURL: action.coverURL,
        track: action.track,
        currentIndex: action.index
      }

    // case SET_PREV_TRACK:
    //   return {
    //     ...state,
    //     currentIndex: currentIndex - 1
    //   }

    // case SET_NEXT_TRACK:
    //   return {
    //     ...state,
    //     artist: action.artist,
    //     coverURL: action.coverURL,
    //     track: action.track,
    //     currentIndex: action.index
    //   }

    case SET_TRACKS:
      return {
        ...state,
        tracks: action.tracks
      }

    case SET_QUEUE:
      return {
        ...state,
        queue: action.queue
      }

    case SWITCH_PLAYING_STATUS:
      return {
        ...state,
        playing: !state.playing
      }

    case SWITCH_REPEAT_STATUS:
      return {
        ...state,
        repeat: !state.repeat
      }

    case SWITCH_SHUFFLE_STATUS:
      return {
        ...state,
        shuffle: !state.shuffle
      }

    case SET_CHROMECAST_STATUS:
      return {
        ...state,
        chromecasting: action.status
      }

    case SET_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.time
      }

    default:
      return state;
  }
}
