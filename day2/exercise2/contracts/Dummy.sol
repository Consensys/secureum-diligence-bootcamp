pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Dummy is ERC20("Dummy", "DMMY") {
	constructor() {
		_mint(msg.sender, 1000);
	}
}
