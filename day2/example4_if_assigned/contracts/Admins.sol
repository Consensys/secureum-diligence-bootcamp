pragma solidity 0.8.13;

contract Admins {
    /// #if_assigned[i] admins[i] != address(0);
    address[] admins;

    function setAdmin(uint idx, address newAdmin) public {
        admins[idx] = newAdmin;
    }

    function pushAdmin(address newAdmin) public {
        admins.push(newAdmin);
    }
}