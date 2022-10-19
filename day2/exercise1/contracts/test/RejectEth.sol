contract RejectEth {
	fallback() external payable {
		revert();
	}

	receive() external payable {
		revert();
	}
}
