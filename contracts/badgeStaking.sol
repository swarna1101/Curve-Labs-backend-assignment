pragma solidity ^0.6.0;

import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC721/SafeERC721.sol";

// Contract that represents a badge
contract Badge {
    string public name;
    uint public level;
    bytes32 public imageHash; // Hash of the badge image

    constructor(string memory _name, uint _level, bytes32 _imageHash) public {
        name = _name;
        level = _level;
        imageHash = _imageHash;
    }
}

// Contract that implements the staking and badge-awarding logic
contract BadgeStaking is SafeERC721 {
    // Mapping from liquidity provider address to the number of tokens they have staked
    mapping(address => uint) public stakedTokens;
    // Mapping from liquidity provider address to the timestamp at which they staked their tokens
    mapping(address => uint) public stakedTimestamps;
    // Mapping from liquidity provider address to their current badge level
    mapping(address => uint) public badgeLevels;

    // Time period required to claim a badge (in seconds)
    uint public timePeriod;
    // Minimum number of tokens required to stake in order to claim a badge
    uint public minStakedTokens;
    // Factor that determines how the time period required to claim a badge increases with the number of staked tokens
    uint public timePeriodFactor;

    // Contract that holds the badge NFTs
    Badge public badgeContract;

    constructor(Badge _badgeContract, uint _timePeriod, uint _minStakedTokens, uint _timePeriodFactor) public {
        badgeContract = _badgeContract;
        timePeriod = _timePeriod;
        minStakedTokens = _minStakedTokens;
        timePeriodFactor = _timePeriodFactor;
    }

    // Function that allows liquidity providers to stake their tokens
    function stakeTokens(uint _tokens) public {
        require(_tokens >= minStakedTokens, "Number of tokens is too low");
        require(stakedTokens[msg.sender] + _tokens <= balanceOf(msg.sender), "Not enough tokens to stake");

        stakedTokens[msg.sender] += _tokens;
        stakedTimestamps[msg.sender] = now;

        // Transfer the staked tokens to the contract
        _safeTransferFrom(msg.sender, address(this), idOf(msg.sender));
    }

    // Function that allows liquidity providers to claim their badge
    function claimBadge() public {
    require(stakedTokens[msg.sender] >= minStakedTokens, "Not enough tokens staked");

    uint requiredTimePeriod = timePeriod * stakedTokens[msg.sender] / timePeriodFactor;
    require(now >= stakedTimestamps[msg.sender] + requiredTimePeriod, "Time period has not yet passed");

    // Create a new badge NFT and assign it to the liquidity provider
    uint nextBadgeId = totalSupply() + 1;
    badgeContract.createBadge("Badge", badgeLevels[msg.sender] + 1, 0, msg.sender);
    _mint(msg.sender, nextBadgeId);

    // Increment the liquidity provider's badge level and reset their staked tokens and timestamp
    badgeLevels[msg.sender]++;
    stakedTokens[msg.sender] = 0;
    stakedTimestamps[msg.sender] = 0;

	// Transfer the staked tokens back to the liquidity provider
	_safeTransferFrom(address(this), msg.sender, idOf(msg.sender));

	
  }
}
