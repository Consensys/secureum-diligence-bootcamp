pragma solidity 0.8.13;

/**
 * This contract holds a certin number of ETH for a given amount of time.  After
 * that time, it releases this eth to be disperesed to a set of recepients.  The
 * amount of ETH owed to each recepient is set as a fixed fractional number
 * multiplied by 10**9 (DECIMALS).
 */
contract TimedSafe {
  // The recepients for the ETH
  address[] recepients;

  // Fractional allocation of the total amount (using DECIMALS number of decimals) to each user
  mapping(address => uint256) fractions;

  // Amount paid out to each user
  mapping(address => uint256) disperesed;
  // The amount by which fixed fractional values in fractions are multiplied
  uint constant DECIMALS = 10**9;
  // Duration for which the funds are locked
  uint duration;
  // Time after which the funds can be released
  uint releaseTime;
  // Total amount of ETH sent to the contract at the start
  uint public totalEth;

  constructor(address[] memory _recepients, uint256[] memory _fractions, uint _duration) payable {
    recepients = _recepients;
    totalEth = msg.value;

    for (uint i = 0; i < _recepients.length; i++) {
      fractions[recepients[i]] = _fractions[i];
    }

    duration = _duration;
    releaseTime = block.timestamp + duration;
  }

  /**
   * Allow a single recepient (msg.sender) to withdraw their own funds
   */
  function withdrawFunds() public {
    require(block.timestamp >= releaseTime);

    address recepient = msg.sender;
    uint totalOwed = fractions[recepient] * totalEth / DECIMALS;
    uint remainingOwed = totalOwed - disperesed[recepient];

    payable(recepient).send(remainingOwed);

    disperesed[recepient] += remainingOwed;
  }

  /**
   * Disperse the funds all at once, to all recepients.
   */
  function disperseFunds() public {
    require(block.timestamp >= releaseTime, "Too early");

    for(uint i = 0; i < recepients.length; i++) {
      address recepient = recepients[i];
      uint totalOwed = fractions[recepient] * totalEth / DECIMALS;
      uint remainingOwed = totalOwed - disperesed[recepient];

      payable(recepient).send(remainingOwed);

      disperesed[recepient] += remainingOwed;
    }
  }
}
