import { Component } from 'preact';
import { Link } from 'react-router-dom';
import Constants from '../constants';

class Cover extends Component {
  render ({artist, title, coverURL, _id}) {
    return (
      <div class="cover">
        <Link to={`/album/${_id}`} class="cover__link">
          <img class="cover__artwork" data-src={`${Constants.CDN_URL}/${coverURL}`}/>
          <span class="cover__artist">{artist}</span>
          <span class="cover__album-title">{title}</span>
        </Link>
      </div>
    );
  }
}

export default Cover;