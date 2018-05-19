import Constants from './constants';

import {
  setDownloadPercentage,
  removeDownloadPercentage
} from './store/player';

import {
  toasting
} from './store/toast';

import {
  updateDataVolume
} from './utils/download';

export default (store) => {
  if (Constants.PRODUCTION && Constants.SUPPORT_SERVICE_WORKER) {
    navigator.serviceWorker.register('/sw.js', {scope: '/'}).then(registration => {
      // if an update is found
      // we should have a service-worker installing
      registration.onupdatefound = event => {
        console.log('A new service worker has been found, installing...');

        registration.installing.onstatechange = event => {
          // first time service-worker installed.
          if (event.target.state === 'activated' && !navigator.serviceWorker.controller) {
            store.dispatch(toasting(['Streamwave cached.', 'Ready to work offline.']));
          }

          // new update
          if (event.target.state === 'activated' && navigator.serviceWorker.controller) {
            store.dispatch(toasting(['Streamwave updated.', 'Refresh to get the new version.']));
          }

          // service worker updated and installed
          if (event.target.state === 'installed') {
            store.dispatch(toasting(['Streamwave updated.']));
          }

          console.log(`Service Worker ${event.target.state}`);
        }
      }

      let isReloading = false;
      navigator.serviceWorker.oncontrollerchange = evt => {
        if (isReloading) {
          return;
        }

        // refresh the page
        window.location.reload();
        isReloading = true;
      }

      navigator.serviceWorker.onmessage = event => {
        if (event.data.type === 'downloading') {
          // value is the bit that's been downloaded for a chunk
          // with that I am consistant with shaka-player streaming track
          const {tracklistId, downloaded, totalDownload, value} = event.data;
          store.dispatch(setDownloadPercentage({id: tracklistId, percentage: (downloaded / totalDownload)}));
          updateDataVolume({userId: store.getState().user.id, value})
          return;
        }

        if (event.data.type === 'downloaded') {
          const {tracklistId} = event.data;
          store.dispatch(removeDownloadPercentage({id: tracklistId}));
        }
      }
    }).catch(err => console.error(err));
  }
}
