# Getting Started with GoExpert Backend

## Avaliable Scripts

In the project directory, you can run:

### `npm install`

Install dependences.

### `npm run dev`

Runs the app in the development mode.
Open http://localhost:5000 to view it in the browser.

### `npm run build`

Builds the app for production to the dist folder.

### `npm start`

Runs the app in the production mode.
Open http://localhost:5000 to view it in the browser.

### `.env`

Please create a `.env` file to the root directory. It should only include environment-specific values such as database string or API keys.
It should include the following values

- CONNECTION_STRING: connection string for mongodb connection
- PORT: port listening
- JWT_SECRET: secret used to sign the Json Web Token
- JWT_EXPIRES_IN: time jwt expires in, e.g. 12h, 2d

#### example

```
CONNECTION_STRING=mongodb://localhost:27017/goexpert
PORT=5000
JWT_SECRET=HMDKDORXPXVMGNQOINFJEZVKJQSHNIBS
JWT_EXPIRES_IN=1d
```
