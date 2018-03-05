import { Component } from 'preact';
import { connect } from 'react-redux';
import Constants from '../constants';

class Player extends Component {
  render ({coverURL, artist, title, duration}) {
    if (!coverURL) {
      return;
    }

    return (
      <div class="player">
        <div class="cover">
          <img class="cover__artwork" src={`${Constants.CDN_URL}/${coverURL}`}/>
          <div class="cover__infos-block">
            <div class="cover__infos">
              <span class="cover__artist">Samuel Medas</span>
              <span class="cover__album-title">Not My Will</span>
            </div>
            <div class="track--add-to-playlist"></div>
          </div>
        </div>
        <div class="progress-container">
          <div class="progress__current-time">2:41</div>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div class="progress-track"></div>
              <div class="progress-round-container">
                <div class="progress-round"></div>
              </div>
            </div>
          </div>
          <div class="progress__total-time">3:12</div>
        </div>
        <div className="player__controls">
          <div className="player__controls-main">
            <button className="player__controls-shuffle">
              <svg width="36px" height="26px" viewBox="0 0 36 26" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="Icons-Pattern-One" transform="translate(-105.000000, -284.000000)" fill-rule="nonzero" fill="#FFF">
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
              </svg>
            </button>
            <button className="player__controls-prev">
            </button>
            <button className="player__controls-play" onClick={evt => this.play(evt)}>
            </button>
            <button className="player__controls-next">
            </button>
            <button className="player__controls-repeat">
            </button>
          </div>
          <button className="player__controls-chromecast">
          </button>
        </div>
      </div>
    );
  }
}

export default Player;