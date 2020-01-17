/**
 * @class Auth
 * @member {Auth0Client} client
 */
export class Auth0Wrapper {
  /**
   * @param {Auth0Client} client - Instance of client conforming to the interface
   */
  constructor(client) {
    this.client = client;
  }

  /**
   *
   * @param {*} audience
   * @param {*} scope
   */
  authenticate(audience, scope) {
    return this.client.loginWithRedirect({ audience, scope });
  }

  /**
   * Get Token wrapper
   *
   * @param {String} audience
   * @param {String} scope
   */
  getToken(audience, scope) {
    return this.client.getTokenSilently({ audience, scope });
  }

  /**
   * Get audience wrapper
   * @param {*} audience
   * @param {*} scope
   */
  getUserProfile(audience, scope) {
    return this.client.getUser({ audience, scope });
  }

  isAuthenticated() {
    return this.client.isAuthenticated();
  }
 
  logout() {
    return this.client.logout();
  }

  handleCallback() {
    return this.client.handleRedirectCallback();
  }
}
