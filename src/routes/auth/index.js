import { Component } from 'preact';
import Constant from '../../constants';
import '../../third_party/gapi';

class Auth extends Component {
  constructor () {
    super();
  }

  componentDidMount () {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: '518872171102-tpqle4q49rihv2atopm4c0uvnumochtd.apps.googleusercontent.com'
      }).then(() => {
        console.log('gapi init.');
        this.autoSignOnConnect()
          .catch(err => console.error(err));
      });
    });
  }

  async autoSignOnConnect () {
    if (Constant.SUPPORT_CREDENTIALS_MANAGEMENT_API) {
      const credentials = await navigator.credentials.get({
        password: true,
        federated: {
          providers: ['https://accounts.google.com']
        },
        //mediation: 'silent' // prevent browser to show account choser
      });

      if (!credentials) return;
      if (credentials.type === 'password') {
        const response = await fetch(`${Constant.AUTH_URL}/local/login`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            email: credentials.id,
            password: credentials.password
          })
        });
        return;
      }

      if (credentials.type === 'federated') {
        const response = await fetch(`${Constant.AUTH_URL}/google/login`, {
          method: 'POST'
        });
        return;
      }
    }
  }

  googleLogin (evt) {
    let gid = '';
    auth = gapi.auth2.getAuthInstance();
    console.log(auth);
    auth.signIn({
      login_hint: gid || ''
    }).then(profile => {
      const token = profile.getAuthResponse().id_token;
      console.log(token);
      return fetch(`${Constant.AUTH_URL}/google/login`, {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${token}`
        }
      })
    }).then(({token}) => {
      console.log(token);
    }).catch(err => console.error(err));
  }

  render () {
    return (
      <div class="auth">
        <section class="auth-wrapper">
          <section class="welcome-title">
            <h1 class="welcome-title__main">Streamwave</h1>
            <span class="welcome-title__subtitle">streaming music pwa</span>
          </section>
          <section class="auth-buttons">
            <button class="auth-buttons__login">
              {/* https://github.com/developit/preact-router#default-link-behavior */}
              <a href="/auth/login" native class="auth-buttons__login__link">
                Se connecter
              </a>
            </button>
            <button class="auth-buttons__register">
              <a href="/auth/register" native class="auth-buttons__register__link">
                Créer un compte
              </a>
            </button>
            <button class="auth-buttons__google" onClick={this.googleLogin}>
              Continuer avec google
            </button>
            <a href="/auth/forgot" native class="auth__password-reset__link">
              Mot de passe oublié ?
            </a>
          </section>
        </section>
      </div>
    )
  }
}

export default Auth;
