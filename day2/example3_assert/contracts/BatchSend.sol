pragma solidity 0.8.13;

contract BatchSend {
  function batchSend(
    address payable[] memory receivers,
    uint[] memory amounts) public payable {
      for (uint i = 0; i < receivers.length; i++) {
        receivers[i].send(amounts[i]);
      }
    }
}
