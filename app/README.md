# La Ronda APP

## Requisites

1. [NPM](https://www.npmjs.com/) (Using 6.9.0)
2. An API instance of La Ronda
3. A machine that have followed the official guidelines to develop React Native apps
   (https://reactnative.dev/docs/getting-started) React Native CLI Quickstart - Your system - Android

## Init

1. Configure the `.env` file following the example in `.env.example`. This file will be ignored in order to protect the information on it.
2. Run `npm i` on the project folder to install the dependencies.

## Android

1. run `npm run android` which is a shortcut for `react-native run-android`

## Android Production APK

1. run `npm run apk-dev` it will take a .env with the .env.dev prefix
   - `npm run apk-staging` will do the same thing with a .env.staging file
2. The apk will be generated in production mode

## Code Format

A shortcut in the command `npm run prettier` is included to format all the codebase with prettier.
