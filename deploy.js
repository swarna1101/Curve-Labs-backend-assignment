const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
const contract = require('truffle-contract');

// Replace these values with your own
const mnemonic = 'your mnemonic phrase';
const infuraKey = 'your infura key';

// Set up the provider
const provider = new HDWalletProvider(
  mnemonic,
  `https://rinkeby.infura.io/v3/${infuraKey}`
);
const web3 = new Web3(provider);

// Set up the contract instance
const badgeStaking = contract(interface);
badgeStaking.setProvider(provider);

// Deploy the contract to the Rinkeby test network
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(`Deploying contract from account: ${accounts[0]}`);

  // Replace these values with your own
  const badgeContractAddress = 'your badge contract address';
  const timePeriod = 60 * 60 * 24 * 7; // 1 week
  const minStakedTokens = 100;
  const timePeriodFactor = 1000;

  const result = await badgeStaking.new(
    badgeContractAddress,
    timePeriod,
    minStakedTokens,
    timePeriodFactor,
    { from: accounts[0], gas: '1000000' }
  );

  console.log(`Contract deployed at address: ${result.options.address}`);
};
deploy();
