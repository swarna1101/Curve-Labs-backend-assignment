const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'contracts', 'BadgeStaking.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const compiledContract = solc.compile(source, 1).contracts[':BadgeStaking'];

module.exports = {
	interface: compiledContract.interface,
	bytecode: compiledContract.bytecode
};
