import React, { createContext, useContext, useState, useEffect } from "react";
import { Auth0Wrapper } from "./Auth0Wrapper";
import createAuth0Client from "@auth0/auth0-spa-js";
import { useErrors } from "../Error/hook";
import { Spinner } from "reactstrap";

// Used on Crodova
// 
import Auth0Cordova from '@auth0/cordova';
import { Auth0CordovaWrapper } from "./Auth0CordovaWrapper";
import { PromisingSecureStorage } from "./PromisingSecureStorage";

const Auth0Context = createContext();

/**
 * AuthContext creates a Context for All Auth Operations.
 * @param {any} config
 */
export function AuthProvider({ config, children }) {
  const [auth, updateAuth] = useState(null);
  useEffect(() => {
    (async () => {
      if (!window.cordova) {
        const auth0SpaClient = await createAuth0Client(config);
        updateAuth(new Auth0Wrapper(auth0SpaClient));  
      } else {
        document.addEventListener('deviceready', async () => {
          window.handleOpenURL = Auth0Cordova.onRedirectUri
          const auth0Cordova = new Auth0Cordova({
            domain: config.domain,
            clientId: config.clientIdCordovaApp,
            packageIdentifier: 'com.apress.mi.app'
          });
          const store = await PromisingSecureStorage.create();
          updateAuth(new Auth0CordovaWrapper(auth0Cordova, store));
        });
      }
    })();
  }, [config]);

  if (!auth) {
    return <Spinner />
  }

  return (
    <Auth0Context.Provider value={auth}>
      {children}
    </Auth0Context.Provider>
  );
}

/**
 * @returns {Auth0Wrapper}
 */
export function useAuth() {
  return useContext(Auth0Context);
}

/**
 * Helper method for getting user in React
 */
export function useToken(audience, scope) {
  const auth = useAuth();
  const [token, updateToken] = useState(null);

  useEffect(() => {
    (async () => {
      const token = await auth.getToken(audience, scope);
      updateToken(token);
    })();
  }, [auth, audience, scope]);

  return [!token, token];
}

/**
 * Helper method for getting user in React
 */
export function useUser(audience, scope) {

  const auth = useAuth();
  const [user, updateUser] = useState(null);
  const [isUserLoading, updateUserLoading] = useState(true);
  const [, publishError] = useErrors();

  useEffect(() => {
    (async () => {
      updateUserLoading(true);
      try {
        const user = await auth.getUserProfile(audience, scope);
        updateUser(user);
      } catch (e) {
        publishError(e);
      } finally {
        updateUserLoading(false);
      }
    })();
  }, [auth, audience, scope, publishError]);

  return [isUserLoading, user];
}
