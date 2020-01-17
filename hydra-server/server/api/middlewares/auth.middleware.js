import ExpressJWT from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import env from '../../common/env';

const secret = jwksRsa.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `https://${env('AUTH0_DOMAIN')}/.well-known/jwks.json`,
});

const config = {
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.

  secret,

  // Validate the audience and the issuer.
  audience: env('API_IDENTIFIER'),
  issuer: `https://${env('AUTH0_DOMAIN')}/`,

  // Enforce the Signing Algorithm used by Auth0
  algorithms: ['RS256'],
};

/**
 * Setup our middleware in order to consume Auth0 issued Access Tokens
 *
 *
 * This code was originally found at For the latest version of this,
 * please refer to
 *
 * https://auth0.com/docs/quickstart/backend/nodejs/01-authorization#validate-access-tokens
 */
export const allowAnonymous = ExpressJWT({
  ...config,
  credentialsRequired: false,
});
export const ensureUser = ExpressJWT({ ...config });
