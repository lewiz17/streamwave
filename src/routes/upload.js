import { h, Component } from 'preact';
import Uploader from '../utils/upload';
import Constants from '../constants';

class Upload extends Component {
  constructor () {
    super();
    this.input = null;
    this.progressValue = null;
    this.progress = null;
    this.uploader = null;

    this.onClickImportButton = this.onClickImportButton.bind(this);
    this.importMedias = this.importMedias.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  onClickImportButton () {
    this.input.click();
  }

  importMedias (evt) {
    const files = this.input.files;
    if (!files) {
      return;
    }

    this.uploadMedias(files).catch(err => {
      console.error(err);
    });
  }

  async uploadMedias (files) {
    //const total = Array.from(files).reduce((total, file) => total += file.size, 0);
    const url = `${Constants.API_URL}/album/upload`;
    const body = new FormData();
    Array.from(files).forEach(file => {
      body.append('musics', file);
    });

    this.uploader = new Uploader(url, body);

    this.uploader.on('upload-started', _ => {
      console.log('started 2');
      this.progressBar.classList.add('upload__progress-bar--active');
    });

    this.uploader.on('upload-progress', evt => {
      const {uploaded, total} = evt;
      this.progressValue.innerText = `${Math.round((uploaded / total) * 100)}%`;
      this.progress.style.transform = `scaleX(${uploaded / total})`;
    });

    this.uploader.on('upload-finished', _ => {
      this.progressBar.classList.remove('upload__progress-bar--active');
    });
  }

  abort () {
    this.uploader.abort();
  }

  preventOpenFile (evt) {
    evt.preventDefault();
  }

  onDragEnter (evt) {
    console.log('dragenter');
    this.dropper.classList.add('upload__drag-drop--active');
  }

  onDragEnd (evt) {
    console.log('dragexit');
    this.dropper.classList.remove('upload__drag-drop--active');
  }

  onDrop (evt) {
    evt.preventDefault();
    const files = evt.dataTransfer.files;
    if (!files) {
      return;
    }

    this.uploadMedias(files).catch(err => {
      console.error(err);
    });
  }

  render () {
    return (
      <div class="upload">
        <div
          class="upload__drag-drop"
          ref={dropper => this.dropper = dropper}
          onDragOver={this.preventOpenFile}
          onDrop={this.onDrop}
          onDragEnter={this.onDragEnter}
          onDragEnd={this.onDragEnd}
          onDragExit={this.onDragEnd}
        >
          <div class="upload__icon"></div>
          <p class="upload__description">
            Faites glisser les titres de votre albums
            afin de les ajouter à votre catalogue musical.
          </p>
          <div>
            <p class="upload__alternative">ou bien</p>
            <div class="upload__button-container">
              <button
                class="upload__button"
                onClick={this.onClickImportButton}
              >
                Importer les fichiers
              </button>
              <input
                class="upload__input"
                type="file"
                ref={input => this.input = input}
                onChange={this.importMedias}
                multiple
              />
            </div>
          </div>
          <div class="upload__progress-bar" ref={container => this.progressBar = container}>
            <div class="upload__progression-value" ref={value => this.progressValue = value}></div>
            <div class="upload__progression-track" ref={progress => this.progress = progress}></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Upload;