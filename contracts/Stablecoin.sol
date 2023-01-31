pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Stablecoin is ERC20Capped, Ownable {
    using SafeMath for uint256;

    // Create a new role identifier for the minter role
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint8 DECIMALS = 6;
    uint256 constant CAP = 1410000000;
    uint256 TOTALSUPPLY = CAP.mul(uint256(10)**DECIMALS);

    address[] private accounts = new address[](0);
    mapping(address => bool) private tokenHolders;

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * The default value of {decimals} is 18. To select a different value for
     * {decimals} you should overload it.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    )
        public
        ERC20(name_, symbol_)
        ERC20Capped(CAP.mul(uint256(10)**decimals_))
        Ownable()
    {
        ERC20._mint(msg.sender, 10000 * 10**decimals_);
        DECIMALS = decimals_;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount * 10**DECIMALS);
    }

    function decimals() public view virtual override returns (uint8) {
        return DECIMALS;
    }

    /**
     * @dev fallback function
     *      this is a default fallback function in which receives
     *      the collected ether.
     */
    fallback() external payable {
        revert("Invalid ether transfer");
    }

    /**
     * @dev receive function
     *      this is a default receive function in which receives
     *      the collected ether.
     */
    receive() external payable {
        revert("Invalid ether transfer");
    }
}
