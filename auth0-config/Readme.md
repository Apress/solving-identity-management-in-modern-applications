# Auth0 Config

Since our applications use Auth0 for the Demo you'll need to set-up an auth0 tenant at https://auth0.com/ 

## Use this CLI to setup the demo

* Run `npm install` to install dependencies for this app
* Copy `config.example.json` to `config.json` and replace the variables with the values reflecting your auth0 deployment, for more information please refer to [the snippet at Auth0 website](https://auth0.com/docs/extensions/deploy-cli/guides/install-deploy-cli#configure-the-deploy-cli-tool)
* Run `npm run deploy` to deploy the auth0 config