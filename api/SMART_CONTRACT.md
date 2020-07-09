# Step 0 - Geth and local account

If you already have an account in your local machine and geth, skip this step

1. Install geth to your local machine (https://geth.ethereum.org/docs/install-and-build/installing-geth)
2. Run geth account new
3. Write a secure password (or not) for your account keystore
4. Write down the public address in a accesible place

# Step 1 - Local Blockchain

The idea of developing over a local blockchain is that we can deploy and test the behaviour much faster.

We also need to ensure that the SC and its feature behave accordingly in the RSK blockchain.

That is why it is recommended to use a RSK blockchain in regtest.

1. Follow the instructions in https://developers.rsk.co/rsk/node/contribute/cli/ there are steps to follow before trying to run the node, so be careful and read an follow the steps
   - I advise to use the chain in a CLI since using Idea will consume more system resources
2. Run the blockchain and ensure that you are in regtest (follow the insturction at the end of the page of the first link provided)

# Step 2 - Adding funds to your account

When a local regtest blockchain is run, our accounts do not have RBTC.
So we have to give them some, in regtest there are some accounts that have RBTC pre-charged.
For doing this we are going to install some rsk utilites that are helpful.

1. Clone https://github.com/rsksmart/utilities
2. Enter the _console_ directory
3. `npm install`
4. Execute `node console.js -server localhost:4444` (this will work with the default regtest port/host
   - If no errors happened, you should see an `rsk` symbol in the console
5. Run `web3.eth.sendTransaction({from: web3.eth.accounts[0], to: "YourAccountPublicAddress", value: web3.toWei(10, "ether")})`
   - This will send 10 RBTC to your account (more than enough for development)
   - If a transaction hashed is showed, then the TX was successful
   - It is advised checking the balance with `web3.eth.getBalance("YourAddress")` it should return a number bigger than 0

# Step 3 - Deploying RNS

In order to work with domains and subdomains in our local blockchain, RNS must be deployed on it.
Here I will explain how to quickly deploy it and create a domain

WARNING: I advise using Node v10 (nvm can be helpful) as v12 may be sometimes unsuitable

1. Clone https://github.com/rnsdomains/rns-suite
2. `npm install`
3. Edit the file `truffle-config.js`
   - Add the following inside the {} : `networks: { development: { host: "127.0.0.1", port: 4444, network_id: "*", }, },`
   - This line will create the default development network in truffle
4. Run truffle with `npx truffle console`
   - If every step was performed correctly, you should see the truffle console symbol
5. Run `migrate`
   - This will deploy the contracts to the blockchain.
6. After the contracts have been deployed, copy to a secure place the contract addresses
7. Now we need to charge some tokens in the account that will be used for the domain.
   - Run the next `const accounts = await web3.eth.getAccounts()` to store the default accounts in that variable
   - Run `const token = new web3.eth.Contract(ERC677.abi, "ERC677ContractAddress")` this will instatiate the RIF token contract in a web3 contract instance
   - Run `token.methods.transfer("YourAdress",’50000000000000000000’).send({from: accounts[0]})` this will add 5 RIF token to your account, needed to buy a domain

With all of this all of the way, RNS is deployed, the account has tokens to buy a domain, now we have to do it

# Step 4 - Buying a domaing

Now we will take advantage of the RNS Manager UI, since it is always updated and very easy to use.

NOTE: In order to perform these operations, you must have Metamask or Nifty Wallet installed in your browser and connected to the regtest Blockchain (connected to a custom network).

Also you must import your keystore file into them (this step is outside the scope of the readme, but google will help), the Keystores are usually located in the Ethereum directory (seek google for help as well).

The guide will continue assuming that your account is in one of the extensions and connected to the proper network.

1. Clone https://github.com/rnsdomains/rns-manager-react
2. `npm install`
3. In the project, edit the file in `src/config/contracts.local.json`
   - The idea is edit the addresses to match the ones from the contracts deployed in step 3
   - If there are some names that do not match, just place another contract addres on them, only like 8 of them are needed for our use case
4. `npm run start`
5. In the local page, if Metamask/Nifty asks for the connection accept
   - Make sure to accept and always use the kesytore account from your machine
6. Buy a domain that you like! We will not explain the process as it is explained in the page, but always remember to check the Metemask/Nifty prompts and wait the specified time.

If all of this is a success and the domain is bought, we can proceed to deploy the Smart Contracts of La Ronda

# Step 5 - Deploy the Ronda SCs

In any case you will need to follow the insteructions provided in the individual repo, making sure that the final owner of the contract is you, this is outside the scope of this readme.

# Step 6 - Configure the ENV

An example is provided with no sensitive data ,but create a `.env` file in the root file of the project, and fill out with the example, make sure that all of the data is correct and you have at hand the addresses of the RNS contracts.
