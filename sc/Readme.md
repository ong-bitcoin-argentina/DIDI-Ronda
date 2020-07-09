# Prerequisitos:

yarn add @openzeppelin/contracts

yarn add truffle-privatekey-provider

# Testnet deploy

Para deploy en testnet cambiar clave privada por la de una cuenta que tenga Test RBTC en truffle-config

Luego:

truffle console --network rsktestnet

una vez dentro de la consola, ejecutar el comando migrate