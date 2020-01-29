import React from "react";
import "./App.css";
import { ErrorProvider } from "./Error/hook";
import Routes from "./Routes";
import { AuthProvider } from "./Auth/hook";
import { domain, clientId, redirectUri, audience, scope } from "./env";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <ErrorProvider>
        <AuthProvider
          config={{
            domain,
            client_id: clientId,
            redirect_uri: redirectUri,
            audience,
            scope
          }}
        >
          <div className="app">
            <Routes />
          </div>
        </AuthProvider>
      </ErrorProvider>
    </Router>
  );
}

export default App;
