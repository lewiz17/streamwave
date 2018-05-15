import { h, Component } from 'preact';
import { connect } from 'react-redux';
import { set } from 'idb-keyval';
import debounce from 'debounce';
import TopBarHamburger from '../components/topbar-hamburger';
import DownloadQuality from '../components/settings/download-quality';
import DownloadWithMobileNetwork from '../components/settings/download-mobile-network';
import StorageQuota from '../components/settings/storage-quota';
import DataVolume from '../components/settings/data-volume';
import { getDataVolumeDownloaded } from '../utils/download';
import styled from 'styled-components';
import Constants from '../constants';

import {
  getFade,
  getDownloadWithMobileNetwork,
  getQuality,
  getLimitDataStatus,
  getDataMax,
  setFade,
  setDownloadWithMobileNetwork,
  setDownloadQuality,
  setLimitDataStatus,
  setMaxDataVolume,
  setMaxDataVolumeInStore,
  clear
} from '../store/settings';

import {
  getUserId
} from '../store/user';

import {
  toasting
} from '../store/toast';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 20px;
  width: 100%;
`;

const ButtonsContainer = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${props => props.theme.mobile}) {
    flex-direction: column;
  }
`;

const SettingsButton = styled.button`
  display: flex;
  align-self: center;
  margin: 10px;
  padding: 10px 25px;
  border-radius: 5px;
  background: #696969;
  color: #FFF;

  @media (max-width: ${props => props.theme.mobile}) {
    justify-content: center;
    width: 100%;
  }
`;

const mapStateToProps = state => ({
  fade: getFade(state),
  downloadWithMobileNetwork: getDownloadWithMobileNetwork(state),
  quality: getQuality(state),
  limitData: getLimitDataStatus(state),
  dataMax: getDataMax(state),
  userId: getUserId(state)
});

const mapDispatchToProps = dispatch => ({
  setFade: value => dispatch(setFade(value)),
  setDownloadWithMobileNetwork: value => dispatch(setDownloadWithMobileNetwork(value)),
  setDownloadQuality: quality => dispatch(setDownloadQuality(quality)),
  setLimitDataStatus: status => dispatch(setLimitDataStatus(status)),
  setMaxDataVolume: value => dispatch(setMaxDataVolume(value)),
  clear: _ => dispatch(clear()),
  toasting: (message, duration) => dispatch(toasting(message, duration))
});

class Settings extends Component {
  constructor () {
    super();

    this.logout = this.logout.bind(this);
    this.onFadeChange = this.onFadeChange.bind(this);
    this.onQualityChange = this.onQualityChange.bind(this);
    this.onLimitDataStatusChange = this.onLimitDataStatusChange.bind(this);
    this.onMaxDataVolumeChange = this.onMaxDataVolumeChange.bind(this);
    this.resetDataVolume = this.resetDataVolume.bind(this);
    this.clearCache = this.clearCache.bind(this);
    this.restore = this.restore.bind(this);

    this.state = {
      volume: 0
    }
  }

  componentWillMount () {
    if (!this.props.dataMax) {
      return;
    }

    getDataVolumeDownloaded({
      userId: this.props.userId
    }).then(({volume}) => {
      this.setState({
        volume
      });
    });
  }

  onFadeChange (value) {
    // avoid unnecessary update
    if (value === this.props.fade) {
      return;
    }

    this.props.setFade(value);
  }

  onDownloadWithMobileNetworkChange (evt) {
    const {value} = evt.target;
    this.props.setDownloadWithMobileNetwork(value);
  }

  onQualityChange (evt) {
    const {value} = evt.target;
    this.props.setDownloadQuality(value)
  }

  onLimitDataStatusChange (evt) {
    const status = evt.target.checked;
    this.props.setLimitDataStatus(status);
  }

  onMaxDataVolumeChange (value) {
    this.props.setMaxDataVolume(value);
    // debounce to avoid too much access to idb
    const debounced = debounce(setMaxDataVolumeInStore, 300);
    debounced(value);
  }

  resetDataVolume () {
    set(`data-volume_${this.props.userId}`, 0);
  }

  // clear settings idb cache
  restore () {
    this.props.clear().then(() => {
      this.props.toasting(['Paramètres restaurés !']);
    });
  }

  // clear service-worker cache
  clearCache (evt) {
    caches.delete('streamwave-music-cache')
      .then(() => this.props.toasting(['Cache vidé !']))
      .catch(err => console.error(err));
  }

  logout (evt) {
    if (Constants.SUPPORT_CREDENTIALS_MANAGEMENT_API) {
      // disable auto signin next visite
      // until user signin again
      navigator.credentials.preventSilentAccess().then(_ => {
        localStorage.removeItem('streamwave-token');
        this.props.history.push('/auth');
      });
    }
  }

  render ({fade, downloadWithMobileNetwork, quality, limitData, dataMax}, {volume}) {
    return (
      <Container>
        <TopBarHamburger />
        <SettingsContainer>
          {
            Constants.SUPPORT_NETWORK_INFORMATION_API &&
            <DownloadWithMobileNetwork
              value={downloadWithMobileNetwork}
              onChange={this.downloadWithMobileNetwork}
            />
          }
          <DownloadQuality
            quality={quality.toString()}
            onChange={this.onQualityChange}
          />
          { Constants.SUPPORT_STORAGE_API &&
            <StorageQuota />
          }
          <DataVolume
            limitData={limitData}
            dataMax={dataMax}
            volume={volume}
            onLimitDataStatusChange={this.onLimitDataStatusChange}
            onMaxDataVolumeChange={this.onMaxDataVolumeChange}
          />
          <ButtonsContainer>
            { Constants.SUPPORT_CACHE_API &&
              <SettingsButton onClick={this.clearCache} aria-label="clear cache">Vider le cache</SettingsButton>
            }
            <SettingsButton onClick={this.restore} aria-label="restore settings">Restaurer</SettingsButton>
            <SettingsButton onClick={this.logout} aria-label="logout">Déconnexion</SettingsButton>
          </ButtonsContainer>
        </SettingsContainer>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
