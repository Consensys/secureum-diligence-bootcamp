pragma solidity 0.8.13;

/// #invariant forall (address a in isAdmin) a != address(0);
/// #invariant forall (uint i in admins) isAdmin[admins[i]];
contract Administrable {
  address[] admins;
  mapping (address => bool) public isAdmin;

  constructor() public {
    isAdmin[msg.sender] = true;
    admins.push(msg.sender);
  }

  modifier adminOnly {
    require(isAdmin[msg.sender]);
    _;
  }

  function addAdmin(address newAdmin) public adminOnly {
    // If newAdmin is already an admin don't add duplicates in the array
    if (!isAdmin[newAdmin]) {
      admins.push(newAdmin);
    }

    isAdmin[newAdmin] = true;
  }

  function addAdmins(address[] memory newAdmins) public adminOnly {
    for (uint i = 0; i < newAdmins.length; i++) {
        addAdmin(newAdmins[i]);
    }
  }

  function currentAdmins() public returns (address[] memory) {
    return admins;
  }
}
