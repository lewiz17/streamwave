import { h, Component } from 'preact';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Overlay, Button } from './ui';
import Constants from '../constants';

import backIcon from '../assets/svg/arrow-black.svg';

import {
  toasting
} from '../store/toast';

import {
  getPlaylists,
  createPlaylist,
  fetchPlaylists,
  addTrackToPlaylist
} from '../store/playlists';

const Container = styled.div`
  position: fixed;
  top: 25px;
  left: 50%;
  bottom: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  border-radius: 5px;
  background: #000;
  opacity: ${props => props.show ? 1 : 0};
  transform: translateX(-50%);
  transition: opacity .3s cubic-bezier(0, 0, 0.3, 1);
  will-change: opacity;
`;

const CreateContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 70px;
`;

const CreateButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #FFF;
  color: #000;
  flex-grow: 1;
  margin: 10px;
`;

const CreateInputContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  width: 100%;
  background: #FFF;
  border-radius: 5px;
  padding: 0 10px;
  margin: 10px 0;
  opacity: ${props => props.show ? 1 : 0};
  pointer-events: ${props => props.show ? 'all' : 'none'};
  transition: opacity 0.1s cubic-bezier(0, 0, 0.3, 1);
  will-change: opacity;
`;

const CreateInput = styled.input`
  font-size: 100%;
  padding-left: 5px;
  border: none;
  flex-grow: 1;
  outline: none;
`;

const Back = styled.button`
  background: url(${backIcon}) no-repeat no-repeat;
  background-size: 24px 24px;
  width: 24px;
  height: 24px;
`;

const Playlists = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  overflow: auto;
`;

const Playlist = styled(Button)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: inherit;
  color: #FFF;

  &:hover, &:focus {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Title = styled.span`
  font-size: 18px;
`;

const TracksCounter = styled.span`
  font-size: 12px;
`;

const Cancel = styled.button`
  width: 100%;
  min-height: 50px;
  background: #296BB7;
  color: #FFF;
  border: none;
  border-radius: 3px;
  margin: 5px 10px;
  padding: 15px;
`;

const mapStateToProps = state => ({
  playlists: getPlaylists(state)
})

const mapDispatchToProps = dispatch => ({
  toasting: (messages, duration) => dispatch(toasting(messages, duration)),
  fetchPlaylists: _ => dispatch(fetchPlaylists()),
  createPlaylist: payload => dispatch(createPlaylist(payload)),
  addTrackToPlaylist: payload => dispatch(addTrackToPlaylist(payload))
});

class PlaylistModal extends Component {
  constructor () {
    super();

    this.blockClick = this.blockClick.bind(this);
    this.showPlaylistInput = this.showPlaylistInput.bind(this);
    this.removePlaylistInput = this.removePlaylistInput.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
    this.addTrackToPlaylist = this.addTrackToPlaylist.bind(this);

    this.state = {
      showPlaylistInput: false
    }
  }

  shouldComponentUpdate (nextProps) {
    //return this.props.show !== nextProps.show;
    console.log(this.props.show, nextProps.show);
  }

  componentDidUpdate () {
    //this.props.fetchPlaylists();
  }

  componentDidMount () {
    //this.props.fetchPlaylists();
  }

  blockClick (evt) {
    // prevent playlist modal to disappear when we click on it
    // because of event bubbling
    evt.stopPropagation();
  }

  showPlaylistInput () {
    this.setState({showPlaylistInput: true});
  }

  removePlaylistInput () {
    this.setState({showPlaylistInput: false});
  }

  createPlaylist (evt) {
    if (!(evt.type === 'keydown' && evt.keyCode === 13)) {
      return;
    }

    if (this.input.value === '') {
      return;
    }

    this.props.createPlaylist({title: this.input.value})
      .then(playlist => {
        console.log(playlist);
      })
      .catch(msg => this.props.toasting(msg));
  }

  addTrackToPlaylist (playlistId) {
    this.props.addTrackToPlaylist({playlistId, track: this.props.track})
      .then(() => toasting(['Titre ajouté à la playlist']))
      .then(() => this.props.removePlaylistModal())
      .catch(err => console.error(err));
  }

  render ({show, removePlaylistModal, trackId, playlists}, {showPlaylistInput}) {
    const pluralize = (string, len) => len > 1 ? string + 's' : string;
    return (
      <Overlay show={show} onClick={removePlaylistModal}>
        <Container show={show} onClick={this.blockClick}>
          <CreateContainer>
            <CreateButton onClick={this.showPlaylistInput} aria-label="create playlist">Créer une nouvelle playlist</CreateButton>
            <CreateInputContainer show={showPlaylistInput}>
              <Back onClick={this.removePlaylistInput} aria-label="cancel playlist creation"/>
              <CreateInput
                innerRef={input => this.input = input}
                type="text"
                placeholder="Nom de la playlist..."
                onKeyDown={this.createPlaylist} />
            </CreateInputContainer>
          </CreateContainer>
          <Playlists>
            {
              playlists.map(playlist =>
                <Playlist key={playlist._id} onClick={evt => this.addTrackToPlaylist(playlist._id)} aria-label="add to this playlist">
                  <Title>{playlist.title}</Title>
                  <TracksCounter>{playlist.tracks.length} {pluralize('titre', playlist.tracks.length)}</TracksCounter>
                </Playlist>
              )
            }
          </Playlists>
          <Cancel onClick={removePlaylistModal}>Annuler</Cancel>
        </Container>
      </Overlay>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistModal);
