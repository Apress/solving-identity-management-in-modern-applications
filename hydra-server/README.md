# hydra-server

Sample Resource Server for Modern Identity book, this application is inteded for demonstration purposes for the concepts shared in the book as such does not follow all the best practices, for the sake of brevity.

This project was bootstrapped using [Express No Stress Generator](https://github.com/cdimascio/generator-express-no-stress)

## Notes

Please note that in order to keep the scope simple, there is no persistence for 
articles and grant data. They are stored purely in memory and thus resetting the 
container or the runtime will clean any originally stored data. 


## Get Started

Get started developing...

```shell
# install deps
npm install

# run in development mode
npm run dev

# run tests
npm run test
```

## Install Dependencies

Install all package dependencies (one time operation)

```shell
npm install
```

## Run It
#### Run in *development* mode:
Runs the application is development mode. Should not be used in production

```shell
npm run dev
```

or debug it

```shell
npm run dev:debug
```

#### Run in *production* mode:

Compiles the application and starts it in production production mode.

```shell
npm run compile
npm start
```

## Test It

Run the Mocha unit tests

```shell
npm test
```

or debug them

```shell
npm run test:debug
```

## Debug It

#### Debug the server:

```
npm run dev:debug
```

#### Debug Tests

```
npm run test:debug
```

#### Debug with VSCode

Add these [contents](https://github.com/cdimascio/generator-express-no-stress/blob/next/assets/.vscode/launch.json) to your `.vscode/launch.json` file
## Lint It

View prettier linter output

```bash
npm run lint
```

Fix all prettier linter errors

```bash
npm run lint
```