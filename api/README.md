# La Ronda API

## Requisites

1. [NPM](https://www.npmjs.com/) (Using 6.9.0)
2. [MongoDB](https://www.mongodb.com/) (Using MongoDB shell version v4.0.4)
3. [NodeJS](https://nodejs.org) (Using v12.4.0)

## Init

1. Configure `.env` file following example in `.env.example`
2. Run `npm i` on the project folder
3. Run with `node app.js` or `nodemon app.js`

## .env configuration

- ENVIROMENT: `dev` or `prod`
- PORT: Api port to run server. Example: `3200`
- API_KEY: Create api key authorization to make request. Example: `123456`

- JWT_SECRET: Secret string to generate JWT tokens. Example: `thisisastring`
- JWT_LIFETIME: Tokens lifetime. Example: `7d`

- MONGO_SERVER: Mongo server URL. Example: `mongodb://localhost`
- MONGO_DATABASE: Mongo database name. Example: `laronda`

- GMAIL_USER: GMail user for send emails notifications. Example: `larondainfuy@gmail.com`
- GMAIL_PASSWORD: GMail password

- GOOGLE_APPLICATION_CREDENTIALS: Path to .json file credentials for firebase push notifications

- TWILIO_ACCOUNT_SID: Twilio account SID
- TWILIO_AUTHTOKEN: Twilio auth token
- TWILIO_PHONE_NUMBER: Twilio phone number

The other parameters in the .env.example are exemplified in there, in the case of addresses or keys, checksumed addresses must be used

# Interaction with the Smart Contract

If The smart contract interactions have been enabled and the user is developing on it outside testnet.

See [how to install the enviroment locally](SMART_CONTRACT.md)
