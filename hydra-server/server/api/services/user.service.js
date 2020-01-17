import l from '../../common/logger';
import { ManagementClient } from 'auth0';
import env from '../../common/env';

const auth0 = new ManagementClient({
  domain: env('AUTH0_DOMAIN'),
  clientId: env('CLIENT_ID'),
  clientSecret: env('CLIENT_SECRET'),
});

/**
 * This is a simple service that implements user data model,
 * this itself is backed by Auth0's Offstream service.
 *
 * The service, in question uses OAuth 2.0 Client Credentials Grant
 * as mentioned in <chapter> to accquire a token to call the Auth0 Management API. 
 *
 * Auth0's node SDK abstracts this by caching the token in memory
 */
class UserService {
  /**
   * Update a user profile
   *
   * @param {string} userId UserID of user being updated
   * @param {string} updatedData patched data
   */
  update(userId, updatedData) {
    l.info(
      `${this.constructor.name}.update(${userId}, ${JSON.stringify(
        updatedData
      )})`
    );
    return auth0.updateUser({ id: userId }, updatedData);
  }

  /**
   * Get full userId
   * @param {string} userId UserId fo the user to fetch
   */
  get(userId) {
    l.info(`${this.constructor.name}.get(${userId})`);
    return auth0.getUser({ id: userId });
  }
}

export default new UserService();
