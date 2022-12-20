const assert = require('chai').assert;
const contract = require('truffle-contract');
const Web3 = require('web3');
const ganache = require('ganache-cli');

// Set up the provider and contract instance
const provider = ganache.provider();
const web3 = new Web3(provider);
const badgeStaking = contract(interface);
badgeStaking.setProvider(provider);

// Replace these values with your own
const badgeContractAddress = 'your badge contract address';
const timePeriod = 60 * 60 * 24 * 7; // 1 week
const minStakedTokens = 100;
const timePeriodFactor = 1000;

// Test the staking and badge-claiming process
describe('BadgeStaking', () => {
  let badgeStakingInstance;
  let testAccount1;
  let testAccount2;
  let stakedTokens1;
  let stakedTokens2;

  beforeEach(async () => {
    // Deploy a new instance of the contract
    badgeStakingInstance = await badgeStaking.new(
      badgeContractAddress,
      timePeriod,
      minStakedTokens,
      timePeriodFactor
    );

    // Get the test accounts
    const accounts = await web3.eth.getAccounts();
    testAccount1 = accounts[0];
    testAccount2 = accounts[1];

    // Set up the test variables
    stakedTokens1 = 200;
    stakedTokens2 = 300;
  });

  it('should allow tokens to be staked', async () => {
    // Stake tokens
    await badgeStakingInstance.stakeTokens(stakedTokens1, { from: testAccount1 });

    // Check that the staked tokens are recorded correctly
    const stakedTokens = await badgeStakingInstance.stakedTokens(testAccount1);
    assert.equal(stakedTokens, stakedTokens1, 'Staked tokens not correct');
  });

  it('should return staked tokens when claiming a badge', async () => {
    // Stake tokens
    await badgeStakingInstance.stakeTokens(stakedTokens1, { from: testAccount1 });

    // Wait for the required time period
    const requiredTimePeriod = timePeriod * stakedTokens1 / timePeriodFactor;
    await new Promise((resolve) => setTimeout(resolve, requiredTimePeriod * 1000));

    // Claim a badge
    const initialBalance = await web3.eth.getBalance(testAccount1);
    await badgeStakingInstance.claimBadge({ from: testAccount1 });

    // Check that the staked tokens were returned
    const finalBalance = await web3.eth.getBalance(testAccount1);
    assert.isAtLeast(finalBalance, initialBalance.add(stakedTokens1), 'Staked tokens not returned');

    // Check that the staked tokens are reset to zero
    const stakedTokens = await badgeStakingInstance.stakedTokens(testAccount1);
	assert.equal(stakedTokens, 0, 'Staked tokens not reset to zero');
	  });
	});

	it('should not allow tokens to be staked if the staked tokens are less than the minimum', async () => {
	  // Stake tokens
	  await badgeStakingInstance.stakeTokens(minStakedTokens - 1, { from: testAccount1 });

	  // Check that the staked tokens are recorded correctly
	  const stakedTokens = await badgeStakingInstance.stakedTokens(testAccount1);
	  assert.equal(stakedTokens, 0, 'Staked tokens not correct');
	});

	it('should not allow tokens to be staked if the staked tokens are greater than the maximum', async () => {
	  // Stake tokens
	  await badgeStakingInstance.stakeTokens(2 ** 256 - 1, { from: testAccount1 });

	  // Check that the staked tokens are recorded correctly
	  const stakedTokens = await badgeStakingInstance.stakedTokens(testAccount1);
	  assert.equal(stakedTokens, 0, 'Staked tokens not correct');
	});

	
	
});
