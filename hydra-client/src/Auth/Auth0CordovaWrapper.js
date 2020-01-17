import { audience, scope } from "../env";

/**
 * @class Auth
 * @member {Auth0Client} client
 * @member {PromisingSecureStorage} store
 */
export class Auth0CordovaWrapper {
    /**
     * @param {Auth0Cordova} client - Instance of client conforming to the interface
     */
    constructor(client, store) {
      this.client = client;
      this.store = store;
      this.cache = {};
    }
  
    /**
     *
     * @param {*} audience
     * @param {*} scope
     */
    async authenticate(audience, scope) {
      const credentials = await new Promise((resolve, reject) => {
        this.client.authorize({
          audience,
          scope
        }, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        })
      });
      const key = `${audience}:${scope}`;
      credentials.expiresAt = Date.now() + credentials.expiresIn * 1000; 
      this.cache[key] = credentials;
      // Store RT so that we can make calls later 
      await this.store.set(audience, credentials.refreshToken);
    }
  
    /**
     * Get Token wrapper
     *
     * @param {String} audience
     * @param {String} scope
     */
    async getToken(audience, scope) {
      const key = `${audience}:${scope}`;
      let cached = this.cache[key];
      if (cached && cached.expiresAt < Date.now()) {
        return cached.accessToken;
      }

      const refreshToken = this.store.get(key, audience);
      // Update tokens
      const credentials = await new Promise((resolve, reject) => {
        this.client.client.oauthToken({
          grantType: 'refresh_token',
          refreshToken
        })
      });

      this.cache[key] = credentials;
      credentials.expiresAt = credentials.expiresIn * 1000 + Date.now();
      return credentials.accessToken;
    }
  
    /**
     * Get audience wrapper
     * @param {*} audience
     * @param {*} scope
     */
    async getUserProfile(audience, scope) {
      const key = `${audience}:${scope}`;
      let cached = this.cache[key];
      if (cached && cached.expireAt < Date.now()) {
        return cached.idTokenPayload;
      }

      const refreshToken = this.store.get(key, audience);
      // Update tokens
      const credentials = await new Promise((resolve, reject) => {
        this.client.client.oauthToken({
          grantType: 'refresh_token',
          refreshToken
        })
      });

      this.cache[key] = credentials;
      credentials.expiresAt = credentials.expiresIn * 1000 + Date.now();
      return credentials.idTokenPayload;
    }
  
    async isAuthenticated() {
      try {
        return !!await this.getUserProfile(audience, scope);
      } catch (e) {
      }
      return false;
    }

    /**
     * 
     */
    logout() {
      return this.store.removeAll();
    }
    
    // Noop on Cordova
    handleCallback() {
    }
  }
  