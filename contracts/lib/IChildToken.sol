pragma solidity 0.6.12;

interface IChildToken {
    function deposit(address user, bytes calldata depositData) external;
}

// File: contracts/lib/Initializable.sol

pragma solidity 0.6.12;

contract Initializable {
    bool private _initialized = false;

    modifier initializer() {
        // solhint-disable-next-line reason-string
        require(!_initialized);
        _;
        _initialized = true;
    }

    function initialized() external view returns (bool) {
        return _initialized;
    }
}
