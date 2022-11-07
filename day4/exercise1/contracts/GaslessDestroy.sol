pragma solidity 0.8.17;

contract GaslessDestroy {
  bool isDestroyable;
  address owner;
  constructor (address o) {
    owner = o;
  }
  function destroy() external {
    require(isDestroyable);
    selfdestruct(payable(msg.sender));
  }
  function permitDestroy(uint8 v, bytes32 r, bytes32 s) external payable {
    require(!isDestroyable);
    bytes32 hash = keccak256(abi.encode("permit-destroy", address(this), block.chainid));
    address signer = ecrecover(hash, v, r, s);
    require(signer != address(0x0));
    require(signer == owner);
    isDestroyable = true;
  }
}
